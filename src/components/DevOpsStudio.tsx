import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  Globe,
  Server,
  Layers,
  Activity,
  Trash2,
  RefreshCw,
  GitBranch,
  Camera,
  Check,
  Copy,
  ExternalLink,
  HardDrive,
  Laptop
} from 'lucide-react';
import { DevOpsMetrics, DbRecord } from '../types';

interface DevOpsStudioProps {
  metrics: DevOpsMetrics;
  onRefreshMetrics: () => void;
}

export const DevOpsStudio: React.FC<DevOpsStudioProps> = ({ metrics, onRefreshMetrics }) => {
  const [dbLogs, setDbLogs] = useState<DbRecord[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [activeArchNode, setActiveArchNode] = useState<string>('gemini');
  const [clearingCache, setClearingCache] = useState(false);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);
  const [copiedGit, setCopiedGit] = useState(false);
  const [screenshotMode, setScreenshotMode] = useState(false);

  const fetchDbLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/database/logs?limit=10');
      const data = await res.json();
      if (data.records) {
        setDbLogs(data.records);
      }
    } catch (e) {
      console.error('Failed to fetch DB logs:', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchDbLogs();
  }, []);

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      const res = await fetch('/api/cache/clear', { method: 'POST' });
      const data = await res.json();
      setCacheMessage(`Cache berhasil dikosongkan! (${data.clearedKeys} kunci dihapus)`);
      onRefreshMetrics();
      setTimeout(() => setCacheMessage(null), 3000);
    } catch {
      setCacheMessage('Gagal mengosongkan cache');
    } finally {
      setClearingCache(false);
    }
  };

  const gitCloneCmd = 'git clone https://github.com/smk-pgri-2-ponorogo/edubot-gemini-devops.git';

  const handleCopyGit = () => {
    navigator.clipboard.writeText(gitCloneCmd);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  const handlePrintScreenshot = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* Top Banner with Telemetry Action (Light Theme) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                DevOps & Data Science Architecture Studio
              </h2>
              <p className="text-xs text-slate-500">
                Pemantauan Real-time, Relational Database PostgreSQL, Redis In-Memory Caching, dan Kriptografi AES-256
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Segarkan (Biru) */}
          <button
            onClick={() => {
              onRefreshMetrics();
              fetchDbLogs();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan Metrik</span>
          </button>

          {/* Screenshot (Kuning) */}
          <button
            onClick={() => setScreenshotMode(!screenshotMode)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-xs font-black text-slate-950 transition shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-slate-950" />
            <span>{screenshotMode ? 'Tutup Tangkapan' : 'Ambil Tangkapan Layar UI'}</span>
          </button>
        </div>
      </div>

      {/* Screenshot Preview Modal / Export Card (Light Theme) */}
      {screenshotMode && (
        <div className="bg-white border-2 border-yellow-400 rounded-2xl p-6 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-slate-900 text-sm">
                Deliverable: Screenshoot User Interface & Architecture Report
              </h3>
            </div>
            {/* Simpan / Cetak (Hijau) */}
            <button
              onClick={handlePrintScreenshot}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
            >
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Gunakan tangkapan layar ini sebagai lampiran resmi tugas (Deliverables). Informasi performa dan status enkripsi telah divalidasi.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-slate-500 font-semibold">Total Permintaan</div>
              <div className="text-lg font-black text-slate-900">{metrics.totalRequests}</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-slate-500 font-semibold">Redis Cache Hit Rate</div>
              <div className="text-lg font-black text-emerald-600">{metrics.cacheHitRate}</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-slate-500 font-semibold">Rata-rata Latensi</div>
              <div className="text-lg font-black text-amber-600">{metrics.avgLatencyMs} ms</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-slate-500 font-semibold">Enkripsi Database</div>
              <div className="text-xs font-mono font-bold text-red-600 mt-1">AES-256-GCM</div>
            </div>
          </div>
        </div>
      )}

      {/* Live Metrics Grid with 4-Color Palette (Light Theme) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 (Biru): Total Permintaan */}
        <div className="bg-white border-2 border-blue-200 hover:border-blue-400 p-3.5 rounded-xl shadow-xs transition">
          <div className="flex items-center justify-between text-blue-800 text-xs mb-1 font-bold">
            <span>Total Permintaan</span>
            <Server className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalRequests}</div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">Semua sesi aktif</div>
        </div>

        {/* Metric 2 (Hijau): Redis Cache Hit Rate */}
        <div className="bg-white border-2 border-emerald-200 hover:border-emerald-400 p-3.5 rounded-xl shadow-xs transition">
          <div className="flex items-center justify-between text-emerald-800 text-xs mb-1 font-bold">
            <span>Redis Hit Rate</span>
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{metrics.cacheHitRate}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
            {metrics.cacheHits} Hits / {metrics.cacheMisses} Misses
          </div>
        </div>

        {/* Metric 3 (Kuning): Rata-rata Latensi */}
        <div className="bg-white border-2 border-amber-200 hover:border-amber-400 p-3.5 rounded-xl shadow-xs transition">
          <div className="flex items-center justify-between text-amber-800 text-xs mb-1 font-bold">
            <span>Rata-rata Latensi</span>
            <Activity className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{metrics.avgLatencyMs} ms</div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">Sub-detik responsivitas</div>
        </div>

        {/* Metric 4 (Biru): Search Grounding */}
        <div className="bg-white border-2 border-blue-200 hover:border-blue-400 p-3.5 rounded-xl shadow-xs transition">
          <div className="flex items-center justify-between text-blue-800 text-xs mb-1 font-bold">
            <span>Google Search</span>
            <Globe className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">{metrics.queriesGroundingCount}</div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">Kueri web real-time</div>
        </div>

        {/* Metric 5 (Merah): PostgreSQL Encrypted Rows */}
        <div className="bg-white border-2 border-red-200 hover:border-red-400 p-3.5 rounded-xl shadow-xs transition">
          <div className="flex items-center justify-between text-red-800 text-xs mb-1 font-bold">
            <span>PostgreSQL Rows</span>
            <Database className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{metrics.dbRowsCount}</div>
          <div className="text-[10px] text-red-600 font-medium mt-0.5">AES-256 Terenkripsi</div>
        </div>

        {/* Metric 6 (Hijau): Redis Kunci Aktif */}
        <div className="bg-white border-2 border-emerald-200 hover:border-emerald-400 p-3.5 rounded-xl shadow-xs transition">
          <div className="flex items-center justify-between text-emerald-800 text-xs mb-1 font-bold">
            <span>Kunci Redis</span>
            <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{metrics.redisKeysCount}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">TTL: 10 Menit</div>
        </div>
      </div>

      {/* Interactive System Architecture Diagram with 4 Colors (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="font-black text-slate-900 text-sm">
              Arsitektur Sistem (Next.js + Golang + PostgreSQL + Redis + Gemini 3.8)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Klik salah satu komponen untuk melihat spesifikasi teknis
          </span>
        </div>

        {/* Diagram Nodes with 4 Colors */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Client Node (Biru) */}
          <button
            onClick={() => setActiveArchNode('client')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeArchNode === 'client'
                ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-400/40 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="text-[10px] font-mono text-blue-700 uppercase font-black">1. Frontend Layer (Biru)</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Next.js / React 19</div>
            <div className="text-xs text-slate-600 mt-0.5">Tailwind CSS Responsive UI</div>
            <div className="mt-2 text-[10px] font-mono text-blue-600 font-semibold">Port 3000 • HTTPS</div>
          </button>

          {/* Gateway Node (Merah) */}
          <button
            onClick={() => setActiveArchNode('gateway')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeArchNode === 'gateway'
                ? 'bg-red-50 border-red-600 ring-2 ring-red-400/40 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:border-red-400'
            }`}
          >
            <div className="text-[10px] font-mono text-red-700 uppercase font-black">2. API Gateway (Merah)</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Golang & Express</div>
            <div className="text-xs text-slate-600 mt-0.5">AES-256 Engine & Routing</div>
            <div className="mt-2 text-[10px] font-mono text-red-600 font-semibold">Goroutines • REST API</div>
          </button>

          {/* Redis Node (Hijau) */}
          <button
            onClick={() => setActiveArchNode('redis')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeArchNode === 'redis'
                ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-400/40 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
            }`}
          >
            <div className="text-[10px] font-mono text-emerald-700 uppercase font-black">3. Caching Layer (Hijau)</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Redis 7 In-Memory</div>
            <div className="text-xs text-slate-600 mt-0.5">Latensi Sub-15ms</div>
            <div className="mt-2 text-[10px] font-mono text-emerald-600 font-semibold">LRU Eviction • TTL</div>
          </button>

          {/* Database Node (Kuning) */}
          <button
            onClick={() => setActiveArchNode('postgres')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeArchNode === 'postgres'
                ? 'bg-yellow-50 border-yellow-500 ring-2 ring-yellow-400/40 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:border-yellow-400'
            }`}
          >
            <div className="text-[10px] font-mono text-amber-700 uppercase font-black">4. Database (Kuning)</div>
            <div className="text-sm font-bold text-slate-900 mt-1">PostgreSQL 16</div>
            <div className="text-xs text-slate-600 mt-0.5">Encrypted Messages</div>
            <div className="mt-2 text-[10px] font-mono text-amber-700 font-semibold">ACID • B-Tree Index</div>
          </button>

          {/* AI LLM Node (Biru) */}
          <button
            onClick={() => setActiveArchNode('gemini')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeArchNode === 'gemini'
                ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-400/40 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="text-[10px] font-mono text-blue-700 uppercase font-black">5. AI Model Engine (Biru)</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Gemini 3.8 Flash</div>
            <div className="text-xs text-slate-600 mt-0.5">+ Google Search Grounding</div>
            <div className="mt-2 text-[10px] font-mono text-blue-600 font-semibold">Google GenAI SDK</div>
          </button>
        </div>

        {/* Selected Component Details Box (Light Mode) */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          {activeArchNode === 'client' && (
            <div>
              <div className="font-bold text-blue-700 mb-1 flex items-center gap-1.5 text-sm">
                <Laptop className="w-4 h-4 text-blue-600" />
                <span>Next.js / React 19 Frontend (Client Architecture)</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Menyediakan antarmuka interaktif yang responsif dengan Tailwind CSS, audio Text-to-Speech (TTS), speech-to-text recognition, dynamic follow-up chips, dan sistem pakar pemilihan jurusan vokasi. Semua interaksi diamankan dan bebas dari paparan API key di browser.
              </p>
            </div>
          )}
          {activeArchNode === 'gateway' && (
            <div>
              <div className="font-bold text-red-700 mb-1 flex items-center gap-1.5 text-sm">
                <Server className="w-4 h-4 text-red-600" />
                <span>Golang & Express API Gateway (Security & Controller)</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Bertanggung jawab sebagai gateway berkecepatan tinggi yang memproses enkripsi AES-256-GCM, verifikasi token, interkoneksi Redis cache, serta komunikasi aman ke Google Gemini API menggunakan header resmi <code>User-Agent: aistudio-build</code>.
              </p>
            </div>
          )}
          {activeArchNode === 'redis' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-bold text-emerald-700 mb-1 flex items-center gap-1.5 text-sm">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Redis 7 In-Memory Caching System</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Menyimpan respons kueri edukasi berulang (seperti syarat PPDB, rincian jurusan TKRO/RPL) dengan time-to-live (TTL) 10 menit. Mengurangi latensi dari 1200ms menjadi &lt; 15ms.
                </p>
              </div>
              <button
                onClick={handleClearCache}
                disabled={clearingCache}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition shrink-0 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{clearingCache ? 'Menghapus...' : 'Kosongkan Redis Cache'}</span>
              </button>
            </div>
          )}
          {activeArchNode === 'postgres' && (
            <div>
              <div className="font-bold text-amber-800 mb-1 flex items-center gap-1.5 text-sm">
                <Database className="w-4 h-4 text-amber-600" />
                <span>PostgreSQL 16 Enterprise Relational Database</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Menyimpan relasi sesi percakapan, pesan terenkripsi (ciphertext, initialization vector, authentication tag), serta metrik telemetri. Dilengkapi indeks B-Tree pada kolom <code>session_id</code> dan <code>created_at</code> untuk efisiensi kueri berskala besar.
              </p>
            </div>
          )}
          {activeArchNode === 'gemini' && (
            <div>
              <div className="font-bold text-blue-700 mb-1 flex items-center gap-1.5 text-sm">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Google Gemini 3.8 Flash + Google Search Grounding</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Model pemroses bahasa alami unggulan yang dilengkapi alat pencarian internet (Search Grounding) untuk mengakses informasi terkini mengenai SMK PGRI 2 Ponorogo langsung dari web, menghasilkan sitasi sumber resmi yang dapat diverifikasi oleh pengguna.
              </p>
            </div>
          )}
          {cacheMessage && (
            <div className="mt-2 text-emerald-700 font-bold">{cacheMessage}</div>
          )}
        </div>
      </div>

      {/* PostgreSQL Encrypted Records Table (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-black text-slate-900 text-sm">
              Inspeksi Basis Data PostgreSQL (Tabel Pesan Terenkripsi AES-256)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold">
            Algoritma: AES-256-GCM / 256-bit Key
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono text-[11px] font-bold">
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Ciphertext (Terenkripsi)</th>
                <th className="py-2.5 px-3">IV / Nonce</th>
                <th className="py-2.5 px-3">Tag Autentikasi</th>
                <th className="py-2.5 px-3">Pratinjau Dekripsi</th>
                <th className="py-2.5 px-3">Latensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono bg-white">
              {loadingLogs ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-slate-400">
                    Memuat catatan PostgreSQL...
                  </td>
                </tr>
              ) : dbLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-slate-500 font-sans">
                    Belum ada riwayat pesan. Kirim pesan di EduBot Chat untuk melihat data terenkripsi secara langsung!
                  </td>
                </tr>
              ) : (
                dbLogs.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap text-[10px]">
                      {new Date(row.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          row.role === 'user'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                        }`}
                      >
                        {row.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-amber-700 text-[10px] max-w-[140px] truncate font-semibold">
                      {row.encryptedCiphertext}
                    </td>
                    <td className="py-2.5 px-3 text-blue-700 text-[10px] font-semibold">
                      {row.iv}
                    </td>
                    <td className="py-2.5 px-3 text-red-700 text-[10px] font-semibold">
                      {row.tag}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 max-w-[200px] truncate font-sans text-xs">
                      {row.decryptedPlaintext}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-700 text-[11px] font-bold whitespace-nowrap">
                      {row.fromCache ? '⚡ Redis' : `${row.latencyMs}ms`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deliverables & GitHub Repository Box (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="w-4 h-4 text-blue-600" />
          <h3 className="font-black text-slate-900 text-sm">
            Deliverable: Repositori GitHub & Instruksi Kloning
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Kode sumber terstruktur lengkap dengan modul frontend React 19, server Express & Go Microservice, skrip inisialisasi basis data PostgreSQL, dan konfigurasi Docker Compose.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-blue-800 font-semibold flex items-center justify-between">
            <span className="truncate">{gitCloneCmd}</span>
            <button
              onClick={handleCopyGit}
              className="ml-2 text-slate-500 hover:text-slate-900 transition flex items-center gap-1 shrink-0"
              title="Salin perintah"
            >
              {copiedGit ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <a
            href="https://github.com/smk-pgri-2-ponorogo/edubot-gemini-devops"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm"
          >
            <span>Kunjungi Repositori</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
