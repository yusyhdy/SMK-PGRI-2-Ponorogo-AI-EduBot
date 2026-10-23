# 🎓 SMK PGRI 2 Ponorogo AI EduBot

> **LLM-Based Intelligent Educational Chatbot & DevOps Architecture with Google Gemini 3.8 Flash, Google Search Grounding, AES-256 Encryption, Redis In-Memory Caching, and PostgreSQL Database Management.**

---

## 📌 Ringkasan Proyek & Deliverables

Aplikasi ini dikembangkan untuk memenuhi kebutuhan edukasi interaktif bagi **SMK PGRI 2 Ponorogo** (dikenal sebagai *STERIDA*), sekolah menengah kejuruan rujukan berprestasi nasional di Kabupaten Ponorogo, Jawa Timur.

### 📋 Checklist Deliverables:
- **Use Case**: Education Bot Resmi SMK PGRI 2 Ponorogo (Penerimaan Peserta Didik Baru / PPDB, Program Keahlian TKRO, TBSM, TP, DKV, RPL, Bursa Kerja Khusus BKK, Rekrutmen Astra & Magang Jepang, Fasilitas Bengkel TEFA).
- **Model AI**: Google Gemini 3.8 Flash dengan **Google Search Grounding** (`tools: [{ googleSearch: {} }]`) untuk pencarian informasi internet waktu nyata (real-time).
- **Parameter Kreatif**:
  - Pilihan Gaya Bahasa (Formal & Santun Edukatif, Santai & Komunikatif, Informatif Ringkas, Konselor BK & Karir).
  - Domain Edukasi Terfokus (PPDB, Program Jurusan, BKK Kerja Industri, Sarana Bengkel).
  - Sliding Window Conversational Memory.
  - Rekomendasi Pertanyaan Cerdas & Kuis Interaktif Penjurusan Siswa.
- **Teknologi Backend & Frontend**: Next.js / React 19 + Tailwind CSS + Golang microservice gateway + Express.
- **Basis Data**: PostgreSQL 16 (dengan DDL relational schema & indeks performa tinggi).
- **Caching Layer**: Redis In-Memory Cache (latensi < 10ms untuk pertanyaan berulang).
- **Keamanan & Kriptografi**: Enkripsi AES-256-GCM dengan *Initialization Vector (IV)* dan *Authentication Tag* untuk perlindungan data percakapan.
- **DevOps Studio**: Pemantauan real-time telemetri (latensi, cache hit-rate, visualisasi tabel terenkripsi, status model).
- **URL Repositori GitHub**: [https://github.com/yusyhdy/SMK-PGRI-2-Ponorogo-AI-EduBot](https://github.com/yusyhdy/SMK-PGRI-2-Ponorogo-AI-EduBot)
- **Screenshots UI**: Tersedia fitur ekspor & tangkapan layar langsung dalam aplikasi.

---

## 🏗️ Arsitektur Sistem (DevOps & Data Science)

```
       [ Pengguna / Calon Siswa / Wali Murid ]
                          │
                          ▼
   ┌──────────────────────────────────────────────────────────┐
   │         Next.js / React 19 + Tailwind CSS UI             │
   │      (Interactive Chat, Jurusan Quiz, DevOps Studio)     │
   └──────────────────────────┬───────────────────────────────┘
                              │ HTTPS / REST API
                              ▼
   ┌──────────────────────────────────────────────────────────┐
   │         Golang / Express API Gateway (Port 3000)         │
   │  - Request Validation & Token Counting                   │
   │  - AES-256-GCM Encryption / Decryption Engine            │
   │  - DevOps Telemetry & Prometheus Metric Collectors       │
   └───────────────┬──────────────────────────┬───────────────┘
                   │                          │
        Cache Check│                          │ Cache Miss
                   ▼                          ▼
   ┌────────────────────────┐      ┌─────────────────────────────┐
   │  Redis 7 (In-Memory)   │      │ Google Gemini 3.8 Flash API │
   │  TTL: 10 Menit         │      │ + Google Search Grounding   │
   │  Latensi: ~5 - 15ms    │      │ Latensi: ~800 - 1400ms      │
   └────────────────────────┘      └──────────────┬──────────────┘
                                                  │
                                                  ▼
                                   ┌─────────────────────────────┐
                                   │  PostgreSQL 16 (Encrypted)  │
                                   │  - Ciphertext + IV + Tag    │
                                   │  - Audit Logs & Sessions    │
                                   └─────────────────────────────┘
```

---

## 🔒 Spesifikasi Enkripsi Data (AES-256-GCM)

Untuk melindungi kerahasiaan identitas dan riwayat percakapan pengguna, sistem mengimplementasikan enkripsi *Authenticated Encryption with Associated Data (AEAD)*:
- **Algoritma**: AES-256-GCM (*Galois/Counter Mode*)
- **Ukuran Kunci**: 256-bit (32 bytes) diturunkan melalui SHA-256 master key
- **IV (Initialization Vector)**: 96-bit (12 bytes) acak unik per pesan (*CSPRNG*)
- **Integritas**: 128-bit Authentication Tag mencegah manipulasi ciphertext di level basis data.

---

## 🚀 Panduan Instalasi & Deployment

### 1. Prasyarat Sistem
- **Node.js**: v20+ atau **Bun**
- **Go**: v1.21+ (opsional untuk menjalankan microservice Go terpisah)
- **Docker & Docker Compose** (opsional untuk containerized deployment)
- **Gemini API Key**: Dapatkan dari Google AI Studio.

---

### 2. Menjalankan Secara Lokal (Quickstart)

```bash
# 1. Clone repositori
git clone https://github.com/yusyhdy/SMK-PGRI-2-Ponorogo-AI-EduBot.git
cd SMK-PGRI-2-Ponorogo-AI-EduBot

# 2. Salin environment variable
cp .env.example .env

# 3. Edit .env dan masukkan API Key:
# GEMINI_API_KEY="AQ.Ab8RN6ISZPRp-cS-isDKAUM43VGCE0Tb2UJzJc1DgB_76hesyA"

# 4. Install dependensi
npm install

# 5. Jalankan development server (Frontend + Backend terintegrasi)
npm run dev

# Buka browser di http://localhost:3000
```

---

### 3. Menjalankan dengan Docker Compose (Full-Stack + Postgres + Redis)

```bash
# Pindah ke direktori backend-go
cd backend-go

# Jalankan seluruh stack (Frontend, Golang Backend, PostgreSQL, Redis)
docker-compose up -d --build

# Verifikasi status kontainer
docker-compose ps

# Layanan akan aktif di:
# - Web UI: http://localhost:3000
# - Golang Microservice API: http://localhost:8080/api/chat
# - PostgreSQL: localhost:5432 (User: sterida_user, DB: smk_pgri_db)
# - Redis: localhost:6379
```

---

### 4. Panduan Deployment ke Cloud

#### A. Deployment ke Railway (PostgreSQL + Redis + Backend)
1. Buat proyek baru di [Railway.app](https://railway.app).
2. Tambahkan plugin **PostgreSQL** dan **Redis** via Railway Dashboard (Database akan diprovisi otomatis).
3. Buat service baru dari repositori GitHub Anda.
4. Set Environment Variables di Railway Dashboard:
   - `GEMINI_API_KEY`: Masukkan API Key Anda.
   - `DATABASE_URL`: Mengacu pada variabel `${{Postgres.DATABASE_URL}}`.
   - `REDIS_URL`: Mengacu pada variabel `${{Redis.REDIS_URL}}`.
   - `ENCRYPTION_SECRET`: Masukkan string acak 32 karakter untuk enkripsi.
5. Jalankan deploy. Railway akan otomatis build dan menjalankan aplikasi.

#### B. Deployment ke Vercel (Next.js / Frontend)
1. Impor repositori ke [Vercel](https://vercel.com).
2. Atur **Framework Preset**: *Vite* atau *Next.js*.
3. Masukkan Environment Variables di Vercel:
   - `GEMINI_API_KEY`: API Key Anda.
   - `VITE_API_URL`: URL Backend (Railway URL).
4. Klik **Deploy**. Web app siap diakses secara publik dengan HTTPS otomatis.

---

## 📊 Endpoints API

| Metode | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/chat` | Mengirim pesan ke AI, pencarian Google Search, enkripsi AES-256, & caching Redis |
| `GET` | `/api/metrics` | Mengambil data telemetri DevOps (latensi rata-rata, hit-rate, jumlah baris DB) |
| `GET` | `/api/database/logs` | Menginspeksi payload terenkripsi (ciphertext, IV, tag) & audit log |
| `POST` | `/api/cache/clear` | Mengosongkan cache Redis untuk pengujian devops |
| `POST` | `/api/recommend-jurusan` | Algoritma evaluasi minat bakat jurusan SMK PGRI 2 Ponorogo |
| `GET` | `/api/health` | Status health check seluruh komponen arsitektur |

---

## 🏫 Profil Program Keahlian SMK PGRI 2 Ponorogo

1. **Teknik Kendaraan Ringan Otomotif (TKRO)**: Kelas Industri PT Astra Daihatsu Motor & Toyota.
2. **Teknik Bisnis Sepeda Motor (TBSM)**: Kelas Industri PT Astra Honda Motor (AHASS).
3. **Teknik Pemesinan (TP)**: Pemesinan Bubut, Frais, & CNC presisi tinggi dengan mitra PT Pama Persada & PT Omron.
4. **Desain Komunikasi Visual (DKV)**: Studio multimedia, animasi digital, fotografi, dan audio-visual broadcasting.
5. **Rekayasa Perangkat Lunak (RPL)**: Pemrograman aplikasi web modern, mobile, cloud computing, dan integrasi kecerdasan buatan.

---

## 👨‍💻 Kontributor & Lisensi

- **Institusi**: SMK PGRI 2 Ponorogo (Jl. Soekarno-Hatta No. 94, Ponorogo, Jawa Timur)
- **Lisensi**: Apache-2.0 License
