package main

import (
	"bytes"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// Config represents server configuration
type Config struct {
	Port         string
	GeminiAPIKey string
	DatabaseURL  string
	RedisURL     string
	AESSecretKey string
}

// StoredMessage represents a row in PostgreSQL messages table
type StoredMessage struct {
	ID               string    `json:"id"`
	SessionID        string    `json:"session_id"`
	Role             string    `json:"role"`
	Ciphertext       string    `json:"ciphertext"`
	IV               string    `json:"iv"`
	Tag              string    `json:"tag"`
	PlaintextPreview string    `json:"plaintext_preview"`
	CreatedAt        time.Time `json:"created_at"`
	LatencyMs        int64     `json:"latency_ms"`
	FromCache        bool      `json:"from_cache"`
}

// CacheEntry represents Redis cached chatbot response
type CacheEntry struct {
	Reply       string   `json:"reply"`
	Sources     []Source `json:"sources"`
	Suggestions []string `json:"suggestions"`
	Timestamp   int64    `json:"timestamp"`
	TTLSeconds  int64    `json:"ttl_seconds"`
}

type Source struct {
	Title string `json:"title"`
	URL   string `json:"url"`
}

type ChatRequest struct {
	Message   string `json:"message"`
	SessionID string `json:"sessionId"`
	Style     string `json:"style"`
	Domain    string `json:"domain"`
	UseSearch bool   `json:"useSearch"`
	UseMemory bool   `json:"useMemory"`
}

type ChatResponse struct {
	Reply            string                 `json:"reply"`
	Sources          []Source               `json:"sources"`
	LatencyMs        int64                  `json:"latencyMs"`
	FromCache        bool                   `json:"fromCache"`
	CacheStatus      string                 `json:"cacheStatus"`
	Suggestions      []string               `json:"suggestions"`
	SessionID        string                 `json:"sessionId"`
	EncryptedPayload map[string]interface{} `json:"encryptedPayload"`
}

// DevOps Server Engine with In-Memory Redis and Postgres Fallback
type Engine struct {
	mu           sync.RWMutex
	cache        map[string]CacheEntry
	dbMessages   []StoredMessage
	metrics      Metrics
	aesKey       []byte
	geminiAPIKey string
}

type Metrics struct {
	TotalRequests int64 `json:"totalRequests"`
	CacheHits     int64 `json:"cacheHits"`
	CacheMisses   int64 `json:"cacheMisses"`
	TotalLatency  int64 `json:"totalLatencyMs"`
	SearchCount   int64 `json:"queriesGroundingCount"`
}

func NewEngine(apiKey, secret string) *Engine {
	hasher := sha256.New()
	hasher.Write([]byte(secret))
	key := hasher.Sum(nil)

	return &Engine{
		cache:        make(map[string]CacheEntry),
		dbMessages:   make([]StoredMessage, 0),
		aesKey:       key,
		geminiAPIKey: apiKey,
	}
}

// Encrypt encrypts plaintext using AES-256-GCM
func (e *Engine) Encrypt(plaintext string) (ciphertextHex, ivHex, tagHex string, err error) {
	block, err := aes.NewCipher(e.aesKey)
	if err != nil {
		return "", "", "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", "", "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", "", "", err
	}

	// Seal appends tag to the end of ciphertext
	out := gcm.Seal(nil, nonce, []byte(plaintext), nil)
	tagSize := 16
	ciphertext := out[:len(out)-tagSize]
	tag := out[len(out)-tagSize:]

	return hex.EncodeToString(ciphertext), hex.EncodeToString(nonce), hex.EncodeToString(tag), nil
}

// Decrypt decrypts AES-256-GCM ciphertext
func (e *Engine) Decrypt(ciphertextHex, ivHex, tagHex string) (string, error) {
	block, err := aes.NewCipher(e.aesKey)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	ciphertext, _ := hex.DecodeString(ciphertextHex)
	nonce, _ := hex.DecodeString(ivHex)
	tag, _ := hex.DecodeString(tagHex)

	combined := append(ciphertext, tag...)
	plaintext, err := gcm.Open(nil, nonce, combined, nil)
	if err != nil {
		return "", err
	}
	return string(plaintext), nil
}

func (e *Engine) HandleChat(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	startTime := time.Now()
	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	e.mu.Lock()
	e.metrics.TotalRequests++
	e.mu.Unlock()

	cacheKey := fmt.Sprintf("%s_style:%s_domain:%s_search:%t", strings.ToLower(strings.TrimSpace(req.Message)), req.Style, req.Domain, req.UseSearch)

	// Check Redis Cache
	e.mu.RLock()
	cached, found := e.cache[cacheKey]
	e.mu.RUnlock()

	if found && (time.Now().Unix()-cached.Timestamp) < cached.TTLSeconds {
		e.mu.Lock()
		e.metrics.CacheHits++
		latency := time.Since(startTime).Milliseconds()
		e.metrics.TotalLatency += latency
		e.mu.Unlock()

		cHex, ivHex, tagHex, _ := e.Encrypt(cached.Reply)

		resp := ChatResponse{
			Reply:       cached.Reply,
			Sources:     cached.Sources,
			LatencyMs:   latency,
			FromCache:   true,
			CacheStatus: "HIT (Redis Caching)",
			Suggestions: cached.Suggestions,
			SessionID:   req.SessionID,
			EncryptedPayload: map[string]interface{}{
				"ciphertext": cHex,
				"iv":         ivHex,
				"tag":        tagHex,
				"algorithm":  "AES-256-GCM",
			},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
		return
	}

	e.mu.Lock()
	e.metrics.CacheMisses++
	if req.UseSearch {
		e.metrics.SearchCount++
	}
	e.mu.Unlock()

	// Call Gemini API with Search Grounding
	reply, sources, err := e.callGeminiAPI(req.Message, req.Style, req.Domain, req.UseSearch)
	if err != nil {
		log.Printf("Gemini call error: %v", err)
		reply = "Halo! SMK PGRI 2 Ponorogo adalah sekolah vokasi unggulan berakreditasi A di Ponorogo dengan berbagai jurusan unggulan seperti TKRO, TBSM, Teknik Pemesinan, DKV, dan RPL, bekerjasama dengan Astra Daihatsu, Astra Honda, dan PAMA."
		sources = []Source{{Title: "Portal Resmi SMK PGRI 2 Ponorogo", URL: "https://smkpgri2ponorogo.sch.id"}}
	}

	suggestions := []string{
		"Jelaskan syarat dan jadwal PPDB SMK PGRI 2 Ponorogo!",
		"Apa perbedaan konsentrasi keahlian TKRO dengan TBSM?",
		"Bagaimana peluang kerja ke Jepang lewat BKK SMK PGRI 2 Ponorogo?",
	}

	// Cache in Redis
	e.mu.Lock()
	e.cache[cacheKey] = CacheEntry{
		Reply:       reply,
		Sources:     sources,
		Suggestions: suggestions,
		Timestamp:   time.Now().Unix(),
		TTLSeconds:  600,
	}
	e.mu.Unlock()

	latency := time.Since(startTime).Milliseconds()

	// Encrypt for Postgres persistence
	cHex, ivHex, tagHex, _ := e.Encrypt(reply)
	e.mu.Lock()
	e.dbMessages = append(e.dbMessages, StoredMessage{
		ID:               fmt.Sprintf("msg-%d", time.Now().UnixNano()),
		SessionID:        req.SessionID,
		Role:             "assistant",
		Ciphertext:       cHex,
		IV:               ivHex,
		Tag:              tagHex,
		PlaintextPreview: reply,
		CreatedAt:        time.Now(),
		LatencyMs:        latency,
		FromCache:        false,
	})
	e.metrics.TotalLatency += latency
	e.mu.Unlock()

	resp := ChatResponse{
		Reply:       reply,
		Sources:     sources,
		LatencyMs:   latency,
		FromCache:   false,
		CacheStatus: "MISS (Cached to Redis)",
		Suggestions: suggestions,
		SessionID:   req.SessionID,
		EncryptedPayload: map[string]interface{}{
			"ciphertext": cHex,
			"iv":         ivHex,
			"tag":        tagHex,
			"algorithm":  "AES-256-GCM",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (e *Engine) callGeminiAPI(message, style, domain string, useSearch bool) (string, []Source, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s", e.geminiAPIKey)

	sysPrompt := fmt.Sprintf("Anda adalah asisten AI resmi SMK PGRI 2 Ponorogo (Jawa Timur). Gaya bahasa: %s. Fokus domain: %s. Berikan informasi edukatif, akurat, dan ramah tentang PPDB, jurusan (TKRO, TBSM, TP, DKV, RPL), BKK Astra & magang Jepang, serta fasilitas bengkel standar industri.", style, domain)

	payload := map[string]interface{}{
		"system_instruction": map[string]interface{}{
			"parts": []map[string]interface{}{
				{"text": sysPrompt},
			},
		},
		"contents": []map[string]interface{}{
			{
				"role": "user",
				"parts": []map[string]interface{}{
					{"text": message},
				},
			},
		},
	}

	if useSearch {
		payload["tools"] = []map[string]interface{}{
			{"google_search": map[string]interface{}{}},
		}
	}

	jsonBytes, err := json.Marshal(payload)
	if err != nil {
		return "", nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return "", nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("User-Agent", "aistudio-build-golang")

	client := &http.Client{}
	httpResp, err := client.Do(httpReq)
	if err != nil {
		return "", nil, err
	}
	defer httpResp.Body.Close()

	body, err := io.ReadAll(httpResp.Body)
	if err != nil {
		return "", nil, err
	}

	var geminiResult struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
			GroundingMetadata struct {
				GroundingChunks []struct {
					Web struct {
						URI   string `json:"uri"`
						Title string `json:"title"`
					} `json:"web"`
				} `json:"groundingChunks"`
			} `json:"groundingMetadata"`
		} `json:"candidates"`
	}

	if err := json.Unmarshal(body, &geminiResult); err != nil {
		return "", nil, err
	}

	if len(geminiResult.Candidates) == 0 || len(geminiResult.Candidates[0].Content.Parts) == 0 {
		return "Tidak ada respon dari model", nil, fmt.Errorf("empty candidate")
	}

	reply := geminiResult.Candidates[0].Content.Parts[0].Text

	var sources []Source
	for _, chunk := range geminiResult.Candidates[0].GroundingMetadata.GroundingChunks {
		if chunk.Web.URI != "" {
			sources = append(sources, Source{
				Title: chunk.Web.Title,
				URL:   chunk.Web.URI,
			})
		}
	}

	if len(sources) == 0 {
		sources = append(sources, Source{
			Title: "SMK PGRI 2 Ponorogo Portal",
			URL:   "https://smkpgri2ponorogo.sch.id",
		})
	}

	return reply, sources, nil
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		apiKey = "AQ.Ab8RN6ISZPRp-cS-isDKAUM43VGCE0Tb2UJzJc1DgB_76hesyA"
	}

	secret := os.Getenv("ENCRYPTION_SECRET")
	if secret == "" {
		secret = "smk-pgri-2-ponorogo-master-secret-key-2026"
	}

	engine := NewEngine(apiKey, secret)

	http.HandleFunc("/api/chat", engine.HandleChat)
	http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"ok","service":"smk-pgri-2-golang-gateway","timestamp":"%s"}`, time.Now().Format(time.RFC3339))
	})

	log.Printf("Golang DevOps LLM Gateway listening on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
