import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { dbService } from '../services/db';
import { ElectionResults } from '../types';
import { Podium } from './Podium';
import { Leaderboard } from './Leaderboard';
import { 
  Trophy, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  FastForward, 
  Maximize2, 
  Minimize2, 
  Award,
  User,
  PartyPopper
} from 'lucide-react';

interface KahootResultsProps {
  onBackToAdmin: () => void;
}

export const KahootResults: React.FC<KahootResultsProps> = ({
  onBackToAdmin,
}) => {
  const [data, setData] = useState<ElectionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /**
   * Kahoot Animation Stages:
   * 0: Intro / Hitung Mundur ("Siapakah Guru Favorit Pilihan Siswa?")
   * 1: Reveal Peringkat 3 (Perunggu)
   * 2: Reveal Peringkat 2 (Perak)
   * 3: Reveal Peringkat 1 (Emas)
   * 4: Reveal Pemenang Utama Spotlight & Confetti Selebrasi
   * 5: Full Presentation (Podium + Klasemen Lengkap 21 Guru)
   */
  const [stage, setStage] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await dbService.getResults();
      setData(results);
    } catch (err) {
      console.error('Gagal memuat hasil pemilihan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fire celebratory confetti (efek kembang api pesta visual)
  const triggerConfetti = () => {
    try {
      const duration = 4 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ['#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#fbbf24']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#fbbf24']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (e) {
      console.warn('Confetti trigger skipped', e);
    }
  };

  // Otomatisasi urutan Kahoot yang ringan
  useEffect(() => {
    if (!data || data.totalVotes === 0) return;

    if (stage === 0) {
      timerRef.current = window.setTimeout(() => setStage(1), 2200);
    } else if (stage === 1) {
      timerRef.current = window.setTimeout(() => setStage(2), 2800);
    } else if (stage === 2) {
      timerRef.current = window.setTimeout(() => setStage(3), 3000);
    } else if (stage === 3) {
      timerRef.current = window.setTimeout(() => {
        setStage(4);
        triggerConfetti();
      }, 3200);
    } else if (stage === 4) {
      timerRef.current = window.setTimeout(() => setStage(5), 4500);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [stage, data]);

  const handleSkipAnimation = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    setStage(5);
    triggerConfetti();
  };

  const handleReplayAnimation = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    setStage(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
        <h2 className="text-xl sm:text-2xl font-black text-amber-300">Menghitung Hasil Suara...</h2>
        <p className="text-slate-400 text-sm mt-1">Mengagregasi data langsung dari penyimpanan lokal IndexedDB</p>
      </div>
    );
  }

  // Jika belum ada suara yang masuk sama sekali
  if (!data || data.totalVotes === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-slate-900 border-2 border-slate-800 p-8 sm:p-10 shadow-2xl">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-800 text-slate-500 border border-slate-700">
            <Trophy className="h-12 w-12 text-slate-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-1 text-white">Guru Favorit Tahun Ini</h2>
          <p className="text-slate-400 text-sm font-bold mb-6">Hasil Pemilihan Hari Guru</p>

          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-300 font-black text-base sm:text-lg mb-6">
            “Belum ada suara yang tercatat.”
          </div>

          <button
            type="button"
            onClick={onBackToAdmin}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-lg cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Panel Admin</span>
          </button>
        </div>
      </div>
    );
  }

  // Ambil tepat 1 calon guru untuk masing-masing peringkat podium (Juara 1, 2, dan 3)
  const rank1Teacher = data.results[0]?.votes > 0 ? data.results[0] : null;
  const rank2Teacher = data.results[1]?.votes > 0 ? data.results[1] : null;
  const rank3Teacher = data.results[2]?.votes > 0 ? data.results[2] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-8 flex flex-col justify-between select-none relative overflow-x-hidden">
      
      {/* Dynamic Celebration Ambient Background Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar untuk Presentasi Proyektor */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto w-full mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToAdmin}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-black transition-all border border-slate-700 cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Panel Admin</span>
          </button>
          <button
            type="button"
            onClick={onBackToAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-bold transition-all border border-rose-800/60 cursor-pointer shadow-sm active:scale-95"
            title="Buka Panel Admin untuk Ulangi Voting"
          >
            <RotateCcw className="h-3.5 w-3.5 text-rose-400" />
            <span>Ulangi Voting</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-amber-400 flex items-center gap-2.5 tracking-tight">
              <Sparkles className="h-6 w-6 text-amber-400 fill-amber-400" />
              <span>Guru Favorit Tahun Ini</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold">Hasil Pemilihan Hari Guru • Total {data.totalVotes} Suara</p>
          </div>
        </div>

        {/* Kontrol Presenter: Lewati Animasi, Putar Ulang, Layar Penuh */}
        <div className="flex items-center gap-2.5">
          {stage < 5 && (
            <button
              type="button"
              onClick={handleSkipAnimation}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95"
            >
              <FastForward className="h-4 w-4" />
              <span>Lewati Animasi</span>
            </button>
          )}

          {stage === 5 && (
            <button
              type="button"
              onClick={handleReplayAnimation}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-extrabold transition-all border border-slate-700 cursor-pointer active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Putar Ulang Animasi</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700 cursor-pointer shadow-sm active:scale-95"
            title="Layar Penuh (Proyektor)"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Area Konten Utama Berdasarkan Tahap Animasi Kahoot */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full my-auto">
        
        {/* STAGE 0: Kahoot Style Intro */}
        {stage === 0 && (
          <div className="text-center py-16 animate-scale-in">
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 shadow-2xl shadow-amber-500/40 ring-8 ring-amber-400/20">
              <PartyPopper className="h-16 w-16" />
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-5 py-2 rounded-full border border-amber-400/30">
              Pengumuman Hasil Akhir
            </span>
            <h2 className="text-3xl sm:text-6xl font-black mt-6 mb-4 tracking-tight">
              Siapakah Guru Favorit Tahun Ini?
            </h2>
            <p className="text-lg sm:text-2xl text-slate-300 max-w-2xl mx-auto font-medium">
              Berdasarkan <strong className="text-amber-400 font-black">{data.totalVotes} suara sah</strong> siswa yang telah tercatat...
            </p>
          </div>
        )}

        {/* STAGE 1: Reveal Peringkat 3 (Perunggu) - TEPAT 1 GURU */}
        {stage === 1 && (
          <div className="text-center py-8 animate-podium-rise max-w-xl w-full">
            <span className="inline-block px-5 py-2 rounded-full bg-amber-900/60 border-2 border-amber-600 text-amber-300 font-black text-sm sm:text-base uppercase tracking-widest mb-4 shadow-lg">
              🥉 Peringkat 3 (Perunggu)
            </span>
            <div className="rounded-3xl bg-slate-900/95 border-4 border-amber-700 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
              {rank3Teacher ? (
                <div className="flex flex-col items-center">
                  <div className="h-36 w-36 sm:h-40 sm:w-40 rounded-3xl overflow-hidden border-4 border-amber-700 bg-slate-800 shadow-2xl mb-4 ring-4 ring-amber-700/30">
                    {rank3Teacher.photoUrl ? (
                      <img src={rank3Teacher.photoUrl} alt={rank3Teacher.name} className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 p-3">
                        <User className="h-12 w-12 mb-1 text-amber-600" />
                        <span className="text-[10px] font-black text-amber-300">Foto belum tersedia</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black text-white">{rank3Teacher.name}</h3>
                  <div className="mt-5 inline-flex items-center gap-3 bg-amber-950/80 border-2 border-amber-700 px-5 py-2 rounded-2xl">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">{rank3Teacher.votes} Suara</span>
                    <span className="text-sm sm:text-base font-black px-3 py-1 rounded-xl bg-amber-900 text-amber-100">
                      {rank3Teacher.percentage}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-slate-400 font-semibold text-lg">Belum ada peraih peringkat 3</div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 2: Reveal Peringkat 2 (Perak) - TEPAT 1 GURU */}
        {stage === 2 && (
          <div className="text-center py-8 animate-podium-rise max-w-xl w-full">
            <span className="inline-block px-5 py-2 rounded-full bg-slate-800/80 border-2 border-slate-400 text-slate-100 font-black text-sm sm:text-base uppercase tracking-widest mb-4 shadow-lg">
              🥈 Peringkat 2 (Perak)
            </span>
            <div className="rounded-3xl bg-slate-900/95 border-4 border-slate-300 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
              {rank2Teacher ? (
                <div className="flex flex-col items-center">
                  <div className="h-36 w-36 sm:h-40 sm:w-40 rounded-3xl overflow-hidden border-4 border-slate-300 bg-slate-800 shadow-2xl mb-4 ring-4 ring-slate-300/30">
                    {rank2Teacher.photoUrl ? (
                      <img src={rank2Teacher.photoUrl} alt={rank2Teacher.name} className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 p-3">
                        <User className="h-12 w-12 mb-1 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-300">Foto belum tersedia</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black text-white">{rank2Teacher.name}</h3>
                  <div className="mt-5 inline-flex items-center gap-3 bg-slate-800 border-2 border-slate-400 px-5 py-2 rounded-2xl">
                    <span className="text-2xl sm:text-3xl font-black text-slate-100">{rank2Teacher.votes} Suara</span>
                    <span className="text-sm sm:text-base font-black px-3 py-1 rounded-xl bg-slate-700 text-slate-100">
                      {rank2Teacher.percentage}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-slate-400 font-semibold text-lg">Belum ada peraih peringkat 2</div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 3 & 4: Reveal Peringkat 1 & Pemenang Utama (Spotlight & Confetti) */}
        {(stage === 3 || stage === 4) && (
          <div className="text-center py-6 animate-scale-in max-w-3xl w-full">
            
            {/* Status Seri jika ada */}
            {data.isTie ? (
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full bg-amber-400/20 border-2 border-amber-400 px-6 py-2.5 text-amber-300 font-black text-base sm:text-lg uppercase tracking-widest shadow-2xl">
                <Trophy className="h-6 w-6 text-amber-400 animate-bounce" />
                <span>Hasil Seri! Terpilih Juara Bersama Peringkat 1</span>
              </div>
            ) : (
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 px-8 py-2.5 font-black text-sm sm:text-base uppercase tracking-widest shadow-2xl shadow-amber-400/30">
                <Trophy className="h-5 w-5" />
                <span>🥇 JUARA 1 — GURU FAVORIT TAHUN INI</span>
              </div>
            )}

            {/* Kotak Pemenang Utama Terbesar & Paling Menyilaukan */}
            <div className={`grid gap-6 ${data.winners.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {data.winners.map((winner) => (
                <div
                  key={winner.id}
                  className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-4 border-amber-400 p-8 sm:p-12 shadow-2xl ring-8 ring-amber-400/25 relative overflow-hidden"
                >
                  <div className="relative mx-auto mb-6 h-52 w-52 sm:h-64 sm:w-64 rounded-3xl overflow-hidden border-4 border-yellow-300 shadow-2xl bg-slate-800 ring-4 ring-amber-400/50">
                    {winner.photoUrl ? (
                      <img
                        src={winner.photoUrl}
                        alt={winner.name}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-800 text-amber-200 p-4 text-center">
                        <User className="h-24 w-24 text-amber-400/80 mb-2" />
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                          Foto belum tersedia
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 p-2.5 rounded-full shadow-xl">
                      <Trophy className="h-7 w-7 fill-slate-950" />
                    </div>
                  </div>

                  <span className="inline-block px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-md mb-3">
                    GURU FAVORIT
                  </span>

                  <h3 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                    {winner.name}
                  </h3>

                  <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
                    <div className="rounded-2xl bg-amber-400/15 border-2 border-amber-400/40 px-6 py-3">
                      <div className="text-xs text-amber-300 font-black uppercase tracking-wider">Perolehan Suara</div>
                      <div className="text-3xl sm:text-4xl font-black text-amber-400">{winner.votes} Suara</div>
                    </div>
                    <div className="rounded-2xl bg-amber-400/15 border-2 border-amber-400/40 px-6 py-3">
                      <div className="text-xs text-amber-300 font-black uppercase tracking-wider">Persentase</div>
                      <div className="text-3xl sm:text-4xl font-black text-amber-400">{winner.percentage}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stage === 4 && (
              <p className="mt-6 text-sm text-slate-400 animate-pulse font-medium">
                Menyiapkan klasemen podium dan leaderboard lengkap...
              </p>
            )}
          </div>
        )}

        {/* STAGE 5: Full Presentation (Podium 3 Besar + Klasemen Lengkap 21 Guru) */}
        {stage === 5 && (
          <div className="w-full space-y-12 animate-fade-in py-4">
            
            {/* Banner Spotlight Pemenang Utama */}
            <div className="text-center max-w-4xl mx-auto">
              {data.isTie && (
                <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-amber-400/20 border-2 border-amber-400/50 px-6 py-2.5 text-amber-300 font-black text-sm sm:text-base uppercase tracking-widest shadow-xl">
                  <Trophy className="h-5 w-5 text-amber-400 animate-bounce" />
                  <span>Hasil Seri — Perolehan Suara Tertinggi Bersama</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-6">
                {data.winners.map(w => (
                  <div key={w.id} className="inline-flex items-center gap-4 sm:gap-5 bg-slate-900/90 border-2 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl ring-4 ring-amber-400/20">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-800 shrink-0">
                      {w.photoUrl ? (
                        <img src={w.photoUrl} alt={w.name} className="h-full w-full object-cover object-top" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-amber-400">
                          <User className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/30">
                        Guru Favorit Tahun Ini
                      </span>
                      <h3 className="text-xl sm:text-3xl font-black text-white mt-1">{w.name}</h3>
                      <div className="flex items-center gap-3 text-sm sm:text-base mt-1">
                        <span className="font-black text-amber-400">{w.votes} Suara</span>
                        <span className="text-slate-300 font-bold">({w.percentage}%)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Podium Peringkat 1, 2, 3 (Tepat 1 guru untuk Juara 1, 2, dan 3) */}
            <Podium
              rank1={rank1Teacher}
              rank2={rank2Teacher}
              rank3={rank3Teacher}
              totalVotes={data.totalVotes}
            />

            {/* Leaderboard Klasemen Lengkap 21 Guru */}
            <Leaderboard
              results={data.results}
              totalVotes={data.totalVotes}
            />

          </div>
        )}

      </div>

      {/* Footer Proyektor */}
      <div className="relative z-20 mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-400 font-medium gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          <span>Pemilihan Guru Favorit • Hari Guru Nasional</span>
        </div>
        <div>
          Total <strong className="text-white font-black">{data.totalVotes} suara</strong> siswa berhasil dihitung dari IndexedDB
        </div>
      </div>

    </div>
  );
};
