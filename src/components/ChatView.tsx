import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Globe,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Compass,
  Briefcase,
  Wrench,
  GraduationCap,
  Clock,
  Mic,
  MicOff
} from 'lucide-react';
import { ChatMessage, StyleOption, DomainOption } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  style: StyleOption;
  setStyle: (style: StyleOption) => void;
  domain: DomainOption;
  setDomain: (domain: DomainOption) => void;
  useSearch: boolean;
  setUseSearch: (val: boolean) => void;
  useMemory: boolean;
  setUseMemory: (val: boolean) => void;
  onOpenQuiz: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  loading,
  onSendMessage,
  onClearChat,
  style,
  setStyle,
  domain,
  setDomain,
  useSearch,
  setUseSearch,
  useMemory,
  setUseMemory,
  onOpenQuiz,
}) => {
  const [input, setInput] = useState('');
  const [showParameters, setShowParameters] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [expandedSecurityId, setExpandedSecurityId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Perangkat Anda belum mendukung Web Speech Synthesis.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[*#_`~>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung Web Speech Recognition. Silakan gunakan Chrome atau Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    onSendMessage(msg);
  };

  const quickPrompts = [
    {
      label: '🔵 Syarat & Jalur PPDB 2026/2027',
      text: 'Apa saja syarat, alur pendaftaran, dan jalur seleksi PPDB di SMK PGRI 2 Ponorogo?',
      icon: GraduationCap,
      colorClass: 'border-blue-200 bg-blue-50/70 hover:bg-blue-100 hover:border-blue-400 text-blue-950',
      iconClass: 'bg-blue-600 text-white',
    },
    {
      label: '🔴 Kelas Industri TKRO & TBSM Astra',
      text: 'Jelaskan keunggulan kelas industri Daihatsu (TKRO) dan Honda AHASS (TBSM) di SMK PGRI 2 Ponorogo!',
      icon: Wrench,
      colorClass: 'border-red-200 bg-red-50/70 hover:bg-red-100 hover:border-red-400 text-red-950',
      iconClass: 'bg-red-600 text-white',
    },
    {
      label: '🟡 BKK & Kerja ke Jepang (Sterida)',
      text: 'Bagaimana program magang/kerja ke Jepang dan rekrutmen PT Astra melalui BKK SMK PGRI 2 Ponorogo?',
      icon: Briefcase,
      colorClass: 'border-amber-200 bg-amber-50/70 hover:bg-amber-100 hover:border-amber-400 text-amber-950',
      iconClass: 'bg-yellow-500 text-slate-950',
    },
    {
      label: '🟢 Jurusan RPL, DKV & TEFA',
      text: 'Apa saja keahlian dan fasilitas Teaching Factory (TEFA) jurusan RPL dan DKV di SMK PGRI 2 Ponorogo?',
      icon: Compass,
      colorClass: 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 hover:border-emerald-400 text-emerald-950',
      iconClass: 'bg-emerald-600 text-white',
    },
  ];

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-amber-700 mt-3 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-blue-800 mt-4 mb-2 pb-1 border-b border-slate-200">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-lg font-black text-slate-900 mt-4 mb-2">
            {line.replace('# ', '')}
          </h2>
        );
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-slate-800 pl-2">
            <span className="text-blue-600 font-bold">•</span>
            <span className="flex-1">{renderInlineFormat(itemText)}</span>
          </div>
        );
      }

      const numMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-slate-800 pl-2">
            <span className="font-bold text-blue-700 font-mono text-xs mt-0.5">
              {numMatch[1]}.
            </span>
            <span className="flex-1">{renderInlineFormat(numMatch[2])}</span>
          </div>
        );
      }

      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-amber-400 bg-amber-50/80 px-3 py-1.5 rounded-r my-2 text-amber-900 italic text-xs">
            {renderInlineFormat(line.replace('> ', ''))}
          </blockquote>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1.5 leading-relaxed text-slate-800">
          {renderInlineFormat(line)}
        </p>
      );
    });
  };

  const renderInlineFormat = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-6xl mx-auto px-4 py-2">
      {/* Parameter Control Bar (Light Theme) */}
      <div className="mb-3 bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Style Badge (Kuning) */}
            <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-300 px-2.5 py-1 rounded-lg text-xs">
              <span className="text-yellow-800 font-medium">Gaya:</span>
              <span className="font-bold text-yellow-900 capitalize">
                {style === 'formal' ? 'Formal Santun' : style === 'santai' ? 'Santai Ramah' : style === 'informatif' ? 'Informatif' : 'Konselor BK'}
              </span>
            </div>

            {/* Domain Badge (Biru) */}
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-300 px-2.5 py-1 rounded-lg text-xs">
              <span className="text-blue-800 font-medium">Domain:</span>
              <span className="font-bold text-blue-900 uppercase">
                {domain === 'all' ? 'Semua Topik' : domain}
              </span>
            </div>

            {/* Live Search Grounding status (Hijau) */}
            <button
              onClick={() => setUseSearch(!useSearch)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                useSearch
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                  : 'bg-slate-100 border-slate-300 text-slate-400 line-through'
              }`}
              title="Aktifkan atau matikan Google Search Grounding untuk pencarian web real-time"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Search {useSearch ? 'Aktif' : 'Off'}</span>
            </button>

            {/* Memory toggle (Biru) */}
            <button
              onClick={() => setUseMemory(!useMemory)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                useMemory
                  ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs'
                  : 'bg-slate-100 border-slate-300 text-slate-400 line-through'
              }`}
              title="Konteks riwayat memori percakapan sebelumnya"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Memori {useMemory ? 'Aktif (6 Turn)' : 'Off'}</span>
            </button>

            {/* Security Badge (Merah) */}
            <div className="hidden sm:flex items-center gap-1 bg-red-50 border border-red-200 text-red-800 px-2 py-1 rounded-lg text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>AES-256</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowParameters(!showParameters)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-300"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Parameter</span>
              {showParameters ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </button>

            {/* Reset button (Merah) */}
            <button
              onClick={onClearChat}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-600 text-red-700 hover:text-white text-xs font-bold transition border border-red-300 hover:border-red-600"
              title="Kosongkan percakapan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Collapsible Parameter Details (Light Mode) */}
        {showParameters && (
          <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Gaya Bahasa (Tone):</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as StyleOption)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="formal">Formal & Santun Edukatif</option>
                <option value="santai">Santai & Ramah Siswa</option>
                <option value="informatif">Informatif & Ringkas (To the point)</option>
                <option value="konselor">Konselor BK & Karir Vokasi</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Domain Fokus:</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as DomainOption)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="all">Semua Domain Edukasi</option>
                <option value="ppdb">PPDB & Penerimaan Siswa Baru</option>
                <option value="jurusan">Program Keahlian & Jurusan</option>
                <option value="bkk">BKK & Kerjasama Industri / Jepang</option>
                <option value="fasilitas">Fasilitas & Bengkel Industri</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Search Grounding:</label>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5">
                <span className="text-slate-800 font-medium">Google Search Live</span>
                <input
                  type="checkbox"
                  checked={useSearch}
                  onChange={(e) => setUseSearch(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Keamanan Pesan:</label>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AES-256-GCM Encrypted</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Feed (Light Theme) */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 border-2 border-blue-400">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
              Selamat Datang di AI EduBot SMK PGRI 2 Ponorogo
            </h3>
            <p className="text-slate-600 text-sm max-w-lg mb-6 leading-relaxed">
              Asisten digital cerdas berbasis <span className="text-blue-700 font-bold">Gemini 3.8 Flash</span> dengan integrasi pencarian internet real-time seputar PPDB, konsentrasi keahlian (TKRO, TBSM, TP, DKV, RPL), BKK Astra, dan fasilitas bengkel berstandar industri internasional.
            </p>

            <div className="w-full max-w-2xl text-left">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pertanyaan Cepat Rekomendasi:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {quickPrompts.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(item.text)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left shadow-xs hover:shadow-md ${item.colorClass}`}
                    >
                      <div className={`p-2 rounded-lg transition shrink-0 ${item.iconClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold transition">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {item.text}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <span className="text-xs text-slate-600">Bingung memilih jurusan yang tepat?</span>
              <button
                onClick={onOpenQuiz}
                className="text-xs font-black text-blue-700 hover:text-blue-800 underline underline-offset-4 flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3 py-1.5 rounded-lg shadow-xs font-sans"
              >
                <Compass className="w-3.5 h-3.5 text-slate-950" />
                <span>Ikuti Kuis Rekomendasi Jurusan →</span>
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 border border-blue-400 shadow-md">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/20'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-slate-200/50'
                  }`}
                >
                  {/* Message Sender Header */}
                  <div className="flex items-center justify-between gap-3 mb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {isUser ? 'Anda' : 'EduBot SMK PGRI 2 Ponorogo'}
                      </span>
                      {!isUser && (
                        <span className="text-[10px] px-2 py-0.5 bg-yellow-400 text-slate-950 font-black rounded shadow-xs">
                          Resmi
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 text-[11px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.latencyMs !== undefined && (
                        <span
                          className={`flex items-center gap-1 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                            msg.fromCache
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {msg.fromCache ? (
                            <>
                              <Zap className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{msg.latencyMs}ms (Redis Cache)</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-2.5 h-2.5 text-blue-600" />
                              <span>{msg.latencyMs}ms</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="text-sm">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}
                  </div>

                  {/* Grounding Web Sources Citations (Hijau & Biru) */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sumber Internet Terverifikasi (Search Grounding):</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-300 transition group font-medium"
                          >
                            <span className="truncate max-w-[200px]">{src.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover:opacity-100" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons (Copy, TTS, Security View) */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition py-0.5 px-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 text-[11px] font-bold">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-[11px] font-medium">Salin</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSpeak(msg.id, msg.content)}
                          className={`flex items-center gap-1 py-0.5 px-2 rounded transition border font-medium ${
                            speakingId === msg.id
                              ? 'text-yellow-900 bg-yellow-100 border-yellow-400'
                              : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
                          }`}
                        >
                          {speakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                              <span className="text-[11px] font-bold">Berhenti</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                              <span className="text-[11px]">Dengarkan</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Encryption payload inspector button (Merah) */}
                      {msg.encryptedPayload && (
                        <button
                          onClick={() =>
                            setExpandedSecurityId(
                              expandedSecurityId === msg.id ? null : msg.id
                            )
                          }
                          className="flex items-center gap-1 text-[11px] text-red-700 hover:text-red-900 font-mono py-0.5 px-2 rounded bg-red-50 hover:bg-red-100 border border-red-200 font-semibold"
                        >
                          <KeyRound className="w-3 h-3 text-red-600" />
                          <span>
                            {expandedSecurityId === msg.id
                              ? 'Tutup Kriptografi'
                              : 'Payload AES-256'}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expanded Security Payload View (Light Theme) */}
                  {expandedSecurityId === msg.id && msg.encryptedPayload && (
                    <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-red-200 font-mono text-[11px] text-slate-700 shadow-inner">
                      <div className="flex items-center justify-between text-red-700 font-bold mb-1.5 pb-1 border-b border-slate-200">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersimpan di PostgreSQL (AES-256-GCM)</span>
                        </span>
                        <span className="text-[10px] text-amber-700 font-bold">Database Layer</span>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-slate-500 font-medium">Ciphertext (Hex): </span>
                          <span className="text-amber-800 break-all font-semibold">
                            {msg.encryptedPayload.ciphertext.slice(0, 48)}...
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">IV (Nonce): </span>
                          <span className="text-emerald-700 font-semibold">{msg.encryptedPayload.iv}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">Auth Tag: </span>
                          <span className="text-red-700 font-semibold">{msg.encryptedPayload.tag}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Follow-up Suggestions Chips (Kuning) */}
                  {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Rekomendasi Pertanyaan Lanjutan:</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => onSendMessage(sug)}
                            className="text-left text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-900 px-2.5 py-1 rounded-lg border border-yellow-300 transition font-semibold shadow-2xs"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar (Biru & Kuning) */}
                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-blue-600 border-2 border-yellow-400 flex items-center justify-center shrink-0 shadow-md">
                    <span className="text-white font-black text-sm">U</span>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Shimmering Loading State (Light Mode) */}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 border border-blue-400 animate-pulse">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-[75%] rounded-2xl rounded-tl-none p-4 bg-white border border-slate-200 text-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-900">EduBot SMK PGRI 2 Ponorogo</span>
                <span className="text-[10px] text-blue-600 animate-pulse font-mono font-bold">
                  {useSearch ? 'Menghubungi Gemini 3.8 & Google Search...' : 'Memproses jawaban...'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-slate-200 rounded animate-pulse w-5/6" />
                <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Formulation Bar (Light Theme) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-slate-300 rounded-2xl p-2 shadow-lg focus-within:border-blue-600 transition-all flex items-center gap-2"
      >
        <button
          type="button"
          onClick={handleToggleMic}
          className={`p-2.5 rounded-xl transition ${
            isListening
              ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-500/30'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title={isListening ? 'Mendengarkan ucapan Anda...' : 'Bicara dengan suara'}
        >
          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan tentang PPDB, jurusan TKRO, TBSM, TP, DKV, RPL, BKK, atau fasilitas SMK PGRI 2 Ponorogo..."
          disabled={loading}
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none px-2 font-medium"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            input.trim() && !loading
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/30 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Kirim</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
