import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Cpu,
  Compass,
  FileCode2,
  ShieldCheck,
  Globe,
  Database
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'chat' | 'quiz' | 'devops' | 'docs';
  setActiveTab: (tab: 'chat' | 'quiz' | 'devops' | 'docs') => void;
  metrics: {
    cacheHitRate?: string;
    avgLatencyMs?: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, metrics }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm">
      {/* 4-Color Vibrant Accent Stripe (Biru, Merah, Kuning, Hijau) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-red-500 via-yellow-400 to-emerald-500 shadow-sm" />

      {/* Top institution bar with Quad-Color indicators */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          {/* 4-Color Dots badge */}
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-xs" title="Biru (Akademik & Vokasi)" />
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-xs" title="Merah (Disiplin & Industri)" />
            <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-xs" title="Kuning (Prestasi Emas)" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="Hijau (Karakter & Lingkungan)" />
          </div>
          <span className="bg-yellow-400 text-slate-950 font-black px-2 py-0.5 rounded text-[11px] shadow-xs">
            STERIDA
          </span>
          <span className="text-slate-700 hidden sm:inline font-semibold">
            SMK PGRI 2 Ponorogo • Terakreditasi A • Pusat Keunggulan Vokasi
          </span>
          <span className="text-slate-700 sm:hidden font-semibold">
            SMK PGRI 2 Ponorogo
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Hijau status */}
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono">Gemini 3.8 Live</span>
          </span>
          {/* Merah status */}
          <span className="hidden md:flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 text-[11px] font-bold">
            <ShieldCheck className="w-3 h-3 text-red-500" />
            <span>AES-256</span>
          </span>
          {/* Biru & Kuning status */}
          <span className="hidden lg:flex items-center gap-1 text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 text-[11px] font-bold">
            <Database className="w-3 h-3 text-yellow-500" />
            <span>PostgreSQL & Redis</span>
          </span>
        </div>
      </div>

      {/* Main navigation header (Light Theme) */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* School Emblem Logo with Biru, Merah, Kuning, Hijau accents */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 border-2 border-blue-400">
            <GraduationCap className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-xs" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-950 shadow-xs">
              ★
            </div>
            <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>SMK PGRI 2 Ponorogo</span>
                <span className="text-blue-600 font-extrabold">AI</span>
              </h1>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white shadow-xs shadow-red-600/30">
                EduBot
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span className="text-blue-700 font-semibold">Asisten Cerdas Akademik & Vokasi</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 font-bold">Jl. Soekarno-Hatta 94</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation buttons (Light Theme with 4 Colors) */}
        <nav className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {/* Tab 1: EduBot Chat (Biru) */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>EduBot Chat</span>
          </button>

          {/* Tab 2: Rekomendasi Jurusan (Kuning) */}
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-400/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${activeTab === 'quiz' ? 'text-slate-950' : 'text-amber-600'}`} />
            <span>Konsultasi Jurusan</span>
          </button>

          {/* Tab 3: DevOps & DB Studio (Hijau) */}
          <button
            onClick={() => setActiveTab('devops')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'devops'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-100" />
            <span>DevOps & DB Studio</span>
            {metrics.cacheHitRate && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                activeTab === 'devops' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {metrics.cacheHitRate}
              </span>
            )}
          </button>

          {/* Tab 4: Deliverables & Docs (Merah) */}
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'docs'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-red-100" />
            <span>Dokumentasi</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
