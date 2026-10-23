import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatView } from './components/ChatView';
import { JurusanQuiz } from './components/JurusanQuiz';
import { DevOpsStudio } from './components/DevOpsStudio';
import { DocumentationView } from './components/DocumentationView';
import { ChatMessage, DevOpsMetrics, StyleOption, DomainOption } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'devops' | 'docs'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => 'sess-' + Math.random().toString(36).substring(2, 9));

  // Creative parameters state
  const [style, setStyle] = useState<StyleOption>('formal');
  const [domain, setDomain] = useState<DomainOption>('all');
  const [useSearch, setUseSearch] = useState<boolean>(true);
  const [useMemory, setUseMemory] = useState<boolean>(true);

  // DevOps Telemetry State
  const [metrics, setMetrics] = useState<DevOpsMetrics>({
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalLatencyMs: 0,
    queriesGroundingCount: 0,
    activeConnections: 1,
    dbRowsCount: 0,
    avgLatencyMs: 0,
    cacheHitRate: '0%',
    redisKeysCount: 0,
    uptimeSeconds: 0,
    systemStatus: {
      geminiEngine: 'Connected (gemini-3.8-flash)',
      redisCache: 'Active (In-Memory Key-Value)',
      postgresDb: 'Encrypted Tables (AES-256-GCM)',
      apiGateway: 'Express + Go Bridge Ready',
    },
  });

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.error('Failed to fetch metrics:', e);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Prepare conversational history payload if memory is active
      const historyPayload = useMemory
        ? messages.slice(-6).map((m) => ({
            role: m.role,
            text: m.content,
          }))
        : [];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId,
          style,
          domain,
          useSearch,
          useMemory,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Gagal memproses pesan');
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: 'msg-bot-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        latencyMs: data.latencyMs,
        fromCache: data.fromCache,
        cacheStatus: data.cacheStatus,
        encryptedPayload: data.encryptedPayload,
        suggestions: data.suggestions || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      fetchMetrics();
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `⚠️ Mohon maaf, terjadi kendala teknis saat memproses tanggapan: ${error.message || 'Koneksi terganggu'}. Silakan coba kirim ulang pertanyaan Anda.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleAskAboutJurusan = (jurusanQuery: string) => {
    setActiveTab('chat');
    handleSendMessage(jurusanQuery);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation & Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={{
          cacheHitRate: metrics.cacheHitRate,
          avgLatencyMs: metrics.avgLatencyMs,
        }}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-2">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            loading={loading}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            style={style}
            setStyle={setStyle}
            domain={domain}
            setDomain={setDomain}
            useSearch={useSearch}
            setUseSearch={setUseSearch}
            useMemory={useMemory}
            setUseMemory={setUseMemory}
            onOpenQuiz={() => setActiveTab('quiz')}
          />
        )}

        {activeTab === 'quiz' && (
          <JurusanQuiz onAskAboutJurusan={handleAskAboutJurusan} />
        )}

        {activeTab === 'devops' && (
          <DevOpsStudio metrics={metrics} onRefreshMetrics={fetchMetrics} />
        )}

        {activeTab === 'docs' && <DocumentationView />}
      </main>
    </div>
  );
}
