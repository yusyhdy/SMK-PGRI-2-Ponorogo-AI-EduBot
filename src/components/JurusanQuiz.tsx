import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Building2,
  Briefcase,
  Wrench,
  Laptop,
  Palette,
  Cpu
} from 'lucide-react';

interface JurusanQuizProps {
  onAskAboutJurusan: (jurusanName: string) => void;
}

interface Question {
  id: number;
  question: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    jurusanTarget: string;
    icon: any;
  }[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: 'Bidang vokasi apa yang paling membangkitkan rasa ingin tahu Anda?',
    subtitle: 'Pilihlah minat dasar yang paling alami mencerminkan bakat Anda',
    options: [
      {
        label: 'Mekanikal Mobil & Otomotif Roda 4',
        description: 'Sistem mesin mobil, injeksi EFI, transmisi matic, kelistrikan kendaraan roda empat.',
        jurusanTarget: 'TKRO',
        icon: Wrench,
      },
      {
        label: 'Teknologi Motor Roda 2 & Bengkel AHASS',
        description: 'Mekanik sepeda motor modern, sistem PGM-FI, tune-up balap, dan manajemen bengkel.',
        jurusanTarget: 'TBSM',
        icon: Wrench,
      },
      {
        label: 'Rekayasa Software, Coding & Web/Mobile App',
        description: 'Menulis baris kode, membuat aplikasi mobile, database, web, dan algoritma kecerdasan buatan.',
        jurusanTarget: 'RPL',
        icon: Laptop,
      },
      {
        label: 'Desain Kreatif, Multimedia, Animasi & Video',
        description: 'Editing visual kreatif, fotografi profesional, animasi 2D/3D, dan branding periklanan.',
        jurusanTarget: 'DKV',
        icon: Palette,
      },
      {
        label: 'Manufaktur Logam Presisi & Pemrograman Mesin CNC',
        description: 'Membubut logam, mengoperasikan mesin milling, dan memprogram komputer CNC untuk industri berat.',
        jurusanTarget: 'TP',
        icon: Cpu,
      },
    ],
  },
  {
    id: 2,
    question: 'Saat dihadapkan pada tugas praktek, mana yang paling membuat Anda bersemangat?',
    subtitle: 'Karakteristik cara kerja yang paling Anda sukai',
    options: [
      {
        label: 'Mendiagnosis kerusakan mesin dengan scanner OBD-II',
        description: 'Mencari penyebab mobil mogok atau performa turun dengan alat scanner diagnostik digital.',
        jurusanTarget: 'TKRO',
        icon: Wrench,
      },
      {
        label: 'Membongkar karburator / throttle body sepeda motor',
        description: 'Memahami sirkulasi bensin, kompresi mesin, dan melakukan servis berkala standar AHASS.',
        jurusanTarget: 'TBSM',
        icon: Wrench,
      },
      {
        label: 'Memecahkan bug coding dan merilis aplikasi',
        description: 'Menghubungkan API server, mendesain tampilan antarmuka interaktif, dan testing logic.',
        jurusanTarget: 'RPL',
        icon: Laptop,
      },
      {
        label: 'Mengambil footage sinematik dan compositing video',
        description: 'Menata pencahayaan studio, color grading di Premiere/After Effects, dan ilustrasi digital.',
        jurusanTarget: 'DKV',
        icon: Palette,
      },
      {
        label: 'Membaca gambar teknik dan membubut benda kerja presisi',
        description: 'Mengukur ketelitian hingga seperseratus milimeter menggunakan mikrometer dan mesin bubut.',
        jurusanTarget: 'TP',
        icon: Cpu,
      },
    ],
  },
  {
    id: 3,
    question: 'Di lingkungan industri seperti apa Anda ingin berkarier setelah lulus SMK?',
    subtitle: 'Masa depan dan target keterserapan kerja di BKK Sterida',
    options: [
      {
        label: 'Perusahaan Astra Daihatsu / Toyota Motor',
        description: 'Teknisi profesional, Service Advisor, atau teknisi perakitan pabrik mobil ternama.',
        jurusanTarget: 'TKRO',
        icon: Building2,
      },
      {
        label: 'Jaringan Bengkel Resmi Astra Honda Motor (AHASS)',
        description: 'Kepala mekanik bersertifikasi resmi, teknisi balap motor, atau membuka bengkel mandiri.',
        jurusanTarget: 'TBSM',
        icon: Building2,
      },
      {
        label: 'Tech Company, Software House, atau Startup Digital',
        description: 'Full-stack Developer, Mobile App Engineer, Frontend Specialist, atau IT Consultant.',
        jurusanTarget: 'RPL',
        icon: Laptop,
      },
      {
        label: 'Creative Agency, Studio Animasi, atau Media Televisi',
        description: 'Content Creator, Visual Designer, Animator, Photographer komersial, atau Video Director.',
        jurusanTarget: 'DKV',
        icon: Palette,
      },
      {
        label: 'PT Pama Persada, Omron, atau Program Kerja ke Jepang',
        description: 'Operator CNC bersertifikat industri, teknisi manufaktur alat berat pertambangan, atau magang Jepang.',
        jurusanTarget: 'TP',
        icon: Briefcase,
      },
    ],
  },
];

const jurusanData: Record<
  string,
  {
    nama: string;
    kode: string;
    tagline: string;
    akreditasi: string;
    mitraIndustri: string[];
    fasilitas: string[];
    prospek: string[];
    deskripsi: string;
  }
> = {
  TKRO: {
    nama: 'Teknik Kendaraan Ringan Otomotif (TKRO)',
    kode: 'TKRO',
    tagline: 'Kelas Industri Resmi PT Astra Daihatsu Motor & Toyota',
    akreditasi: 'Terakreditasi A (Unggul)',
    mitraIndustri: ['PT Astra Daihatsu Motor (Pintar Bersama Daihatsu)', 'PT Toyota Astra Motor', 'Auto 2000'],
    fasilitas: ['Bengkel Berstandar Daihatsu', 'Alat Scanner Diagnostik Engine', 'Unit Praktek Mobil Terbaru', 'Teaching Factory'],
    prospek: ['Teknisi Bengkel Resmi Astra', 'Service Advisor Bengkel Mobil', 'Teknisi Perakitan Pabrik Otomotif', 'Wirausaha Otomotif Mandiri'],
    deskripsi: 'Program keahlian yang mencetak teknisi kendaraan roda empat handal dengan kurikulum industri Daihatsu. Siswa dibekali kompetensi perawatan berkala, sistem kelistrikan bodi, EFI, AC mobil, dan manajemen bengkel modern.',
  },
  TBSM: {
    nama: 'Teknik Bisnis Sepeda Motor (TBSM)',
    kode: 'TBSM',
    tagline: 'Kelas Industri Resmi PT Astra Honda Motor (AHM)',
    akreditasi: 'Terakreditasi A (Unggul)',
    mitraIndustri: ['PT Astra Honda Motor (AHM)', 'MPM Motor Jawa Timur', 'Jaringan AHASS Resmi'],
    fasilitas: ['Lab Standard Bengkel AHASS', 'Peralatan Khusus Special Service Tools (SST)', 'Unit Motor Honda PGM-FI Injeksi'],
    prospek: ['Mekanik Resmi AHASS Honda', 'Teknisi Pabrik Sepeda Motor', 'Service Engineer', 'Pengusaha Modifikasi & Servis Motor'],
    deskripsi: 'Program keahlian dengan kurikulum resmi PT Astra Honda Motor yang melatih siswa hingga mengantongi sertifikasi teknisi AHASS. Memiliki peluang langsung rekrutmen kerja sebelum wisuda.',
  },
  RPL: {
    nama: 'Rekayasa Perangkat Lunak (RPL)',
    kode: 'RPL',
    tagline: 'Center of Excellence Software Engineering & AI Integration',
    akreditasi: 'Terakreditasi A (Unggul)',
    mitraIndustri: ['Industri Perangkat Lunak Nasional', 'Digital Creative Agencies', 'Startup Tech Hubs'],
    fasilitas: ['Laboratorium Komputer Spek Core i7 / RAM 32GB', 'Server Lokal & Internet Kecepatan Tinggi', 'Ruang Co-Working & Coding Space'],
    prospek: ['Software Developer', 'Web Programmer Full-Stack', 'Mobile App Developer (Flutter/React Native)', 'Database Administrator'],
    deskripsi: 'Mempersiapkan talenta digital masa depan yang menguasai logika pemrograman modern, database PostgreSQL, framework web Next.js/React, aplikasi mobile Android/iOS, dan integrasi Artificial Intelligence.',
  },
  DKV: {
    nama: 'Desain Komunikasi Visual (DKV)',
    kode: 'DKV',
    tagline: 'Kreativitas Visual, Animasi Digital & Sinematografi Modern',
    akreditasi: 'Terakreditasi A (Unggul)',
    mitraIndustri: ['Stasiun Televisi & Media Penyiaran', 'Percetakan Offset Modern', 'Production House Film'],
    fasilitas: ['Studio Fotografi Profesional & Lighting', 'Lab Grafis & Drawing Tablet', 'Studio Editing Video & Audio Podcast'],
    prospek: ['Graphic Designer', 'Video Editor Sinematik', 'Animator 2D/3D', 'UI/UX Designer', 'Social Media Specialist'],
    deskripsi: 'Fokus pada pengembangan daya cipta visual, estetika komunikasi media grafis, fotografi studio komersial, motion graphics, dan pembuatan konten kreatif berstandar penyiaran komersial.',
  },
  TP: {
    nama: 'Teknik Pemesinan (TP)',
    kode: 'TP',
    tagline: 'Presisi Manufaktur Logam, Bubut & Mesin Komputer CNC',
    akreditasi: 'Terakreditasi A (Unggul)',
    mitraIndustri: ['PT Pama Persada Nusantara', 'PT Omron Manufacturing Indonesia', 'Program Magang Kerja ke Jepang'],
    fasilitas: ['Mesin CNC Milling & Turning', 'Puluhan Mesin Bubut Konvensional Standar Industri', 'Mesin Gerinda Datar & Frais Presisi'],
    prospek: ['Programmer & Operator Mesin CNC', 'Teknisi Manufaktur Logam Industri', 'Quality Control Inspector', 'Teknisi Industri di Jepang'],
    deskripsi: 'Salah satu jurusan tertua dan paling prestisius di SMK PGRI 2 Ponorogo dengan rekor serapan kerja sangat tinggi ke industri manufaktur nasional, industri alat berat, dan program pemagangan resmi ke Jepang.',
  },
};

export const JurusanQuiz: React.FC<JurusanQuizProps> = ({ onAskAboutJurusan }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultJurusan, setResultJurusan] = useState<string | null>(null);

  const handleSelectOption = (target: string) => {
    const updated = [...answers, target];
    setAnswers(updated);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const counts: Record<string, number> = {};
      updated.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });

      let bestTarget = 'RPL';
      let maxCount = -1;
      Object.entries(counts).forEach(([t, count]) => {
        if (count > maxCount) {
          maxCount = count;
          bestTarget = t;
        }
      });

      setResultJurusan(bestTarget);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResultJurusan(null);
  };

  const q = quizQuestions[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Header Banner (Light Mode) */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3 shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Sistem Pakar Konsultasi Minat Bakat Vokasi</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Temukan Konsentrasi Keahlian Terbaik Anda
        </h2>
        <p className="text-slate-600 text-sm mt-1 max-w-xl mx-auto">
          Jawab 3 pertanyaan singkat di bawah ini. Algoritma kami akan mencocokkan profil minat Anda dengan program keahlian unggulan di SMK PGRI 2 Ponorogo.
        </p>
      </div>

      {!resultJurusan ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
          {/* Progress Bar with 4 Colors (Biru, Merah, Kuning, Hijau) */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-bold text-amber-700">Pertanyaan {currentStep + 1} dari {quizQuestions.length}</span>
              <span className="font-mono text-emerald-700 font-bold">{Math.round(((currentStep + 1) / quizQuestions.length) * 100)}% Selesai</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-red-500 via-yellow-400 to-emerald-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {q.question}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{q.subtitle}</p>
          </div>

          {/* Options with Quad-Color Coding (Light Mode) */}
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const Icon = opt.icon;
              const cardColor =
                opt.jurusanTarget === 'TKRO'
                  ? 'border-blue-200 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50'
                  : opt.jurusanTarget === 'TBSM'
                  ? 'border-red-200 hover:border-red-500 bg-red-50/50 hover:bg-red-50'
                  : opt.jurusanTarget === 'RPL'
                  ? 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50'
                  : opt.jurusanTarget === 'DKV'
                  ? 'border-amber-200 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50'
                  : 'border-blue-200 hover:border-blue-400 bg-slate-50';

              const iconColor =
                opt.jurusanTarget === 'TKRO'
                  ? 'bg-blue-600 text-white'
                  : opt.jurusanTarget === 'TBSM'
                  ? 'bg-red-600 text-white'
                  : opt.jurusanTarget === 'RPL'
                  ? 'bg-emerald-600 text-white'
                  : opt.jurusanTarget === 'DKV'
                  ? 'bg-yellow-500 text-slate-950'
                  : 'bg-blue-600 text-white';

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.jurusanTarget)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left group shadow-xs hover:shadow-md ${cardColor}`}
                >
                  <div className={`p-2.5 rounded-xl transition shrink-0 mt-0.5 shadow-xs ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900 transition flex items-center justify-between">
                      <span>{opt.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1 text-blue-600" />
                    </div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {opt.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Result Presentation with 4 Colors (Light Theme) */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl animate-fade-in">
          {(() => {
            const data = jurusanData[resultJurusan] || jurusanData.RPL;
            return (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Hasil Kecocokan: 96% Match! (Rekomendasi Utama)</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-xs text-red-700 hover:text-white transition bg-red-50 hover:bg-red-600 px-3 py-1.5 rounded-lg border border-red-200 font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Kuis</span>
                  </button>
                </div>

                <div className="border-b border-slate-200 pb-5 mb-5">
                  <span className="text-xs font-mono font-black text-amber-800 bg-yellow-100 px-2.5 py-1 rounded border border-yellow-300 shadow-2xs">
                    KONSENTRASI KEAHLIAN REKOMENDASI
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    {data.nama}
                  </h3>
                  <p className="text-sm text-blue-700 font-bold mt-1">
                    {data.tagline}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {data.deskripsi}
                  </p>
                </div>

                {/* Grid details with Biru, Merah, Kuning, Hijau (Light Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Mitra industri (Merah) */}
                  <div className="bg-red-50/70 p-4 rounded-xl border-2 border-red-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-700 mb-2">
                      <Building2 className="w-4 h-4 text-red-600" />
                      <span>Mitra Industri Binaan:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {data.mitraIndustri.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 font-medium">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fasilitas (Biru) */}
                  <div className="bg-blue-50/70 p-4 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-2">
                      <Wrench className="w-4 h-4 text-blue-600" />
                      <span>Fasilitas Bengkel & Lab:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {data.fasilitas.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 font-medium">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prospek karir (Hijau) */}
                  <div className="bg-emerald-50/70 p-4 rounded-xl border-2 border-emerald-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span>Prospek Karir & BKK:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {data.prospek.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 font-medium">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to action (Light Theme CTA) */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 rounded-xl text-white shadow-lg flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-white">
                      Ingin tahu rincian kurikulum dan syarat masuk {data.kode}?
                    </h4>
                    <p className="text-xs text-blue-100 mt-0.5">
                      Tanyakan langsung kepada AI EduBot untuk informasi pendaftaran PPDB dan beasiswa.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onAskAboutJurusan(
                        `Tolong jelaskan secara mendalam tentang jurusan ${data.nama} di SMK PGRI 2 Ponorogo, mencakup kurikulum, kelas industri, dan peluang kerjanya!`
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-md transition"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Tanyakan ke EduBot Sekarang →</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
