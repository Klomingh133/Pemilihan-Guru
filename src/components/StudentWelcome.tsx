import React from 'react';
import { EVENT_CONFIG } from '../config/event';
import { VotingStatus } from '../types';
import { Award, ArrowRight, Lock } from 'lucide-react';

interface StudentWelcomeProps {
  onStartVoting: () => void;
  onOpenAdmin: () => void;
  votingStatus: VotingStatus;
  totalVotesCount?: number;
}

export const StudentWelcome: React.FC<StudentWelcomeProps> = ({
  onStartVoting,
  onOpenAdmin,
  votingStatus,
}) => {
  const isLocked = votingStatus === 'LOCKED';

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-8 sm:py-12 text-center overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/15 via-indigo-400/15 to-amber-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Card Container */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white/95 p-6 sm:p-12 shadow-2xl shadow-blue-900/15 border border-slate-200/90 backdrop-blur-md">
        
        {/* Emblem Hari Guru */}
        <div className="mx-auto mb-6 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-800 text-white shadow-xl shadow-blue-600/30 transform transition-transform hover:scale-105 duration-300 ring-4 ring-blue-100">
          <Award className="h-12 w-12 sm:h-14 sm:w-14 text-amber-300" />
        </div>

        {/* Badge Acara (Bersih tanpa emoji) */}
        <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-xs sm:text-sm font-black text-blue-800 border border-blue-200/80 mb-4 tracking-wider uppercase">
          HARI GURU NASIONAL
        </div>

        {/* Judul & Subjudul */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-2.5 leading-tight">
          {EVENT_CONFIG.title}
        </h1>
        <p className="text-base sm:text-xl font-bold text-slate-600 mb-6">
          {EVENT_CONFIG.subtitle}
        </p>

        {/* Kotak Instruksi (Bersih tanpa emoji) */}
        <div className="mx-auto mb-8 max-w-lg rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/40 border border-blue-100 p-5 text-sm sm:text-base text-slate-700 leading-relaxed shadow-xs">
          <div className="font-black text-blue-900 mb-1.5 text-xs uppercase tracking-wider">
            Petunjuk Siswa
          </div>
          {isLocked ? (
            <p className="text-amber-900 font-bold">
              Sesi pemilihan guru favorit telah ditutup oleh panitia. Terima kasih atas partisipasi seluruh siswa.
            </p>
          ) : (
            <p className="font-bold text-slate-800 text-base sm:text-lg">
              "{EVENT_CONFIG.instructions}"
            </p>
          )}
        </div>

        {/* Tombol Aksi Utama */}
        {isLocked ? (
          <div className="inline-flex items-center gap-3 rounded-2xl bg-amber-100/90 px-8 py-4 sm:py-5 text-base sm:text-lg font-black text-amber-950 border-2 border-amber-300 shadow-sm">
            <Lock className="h-6 w-6 text-amber-700" />
            <span>Pemilihan Telah Selesai (Terkunci)</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onStartVoting}
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-10 sm:px-14 py-4 sm:py-5 text-lg sm:text-2xl font-black text-white shadow-xl shadow-blue-600/35 transition-all duration-300 hover:from-blue-700 hover:to-indigo-800 hover:shadow-2xl hover:shadow-blue-600/40 hover:scale-102 active:scale-98 cursor-pointer"
          >
            <span>Mulai Memilih</span>
            <ArrowRight className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:translate-x-2" />
          </button>
        )}

        {/* Tiga Pilar Informasi (Bersih tanpa emoji) */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-extrabold text-slate-600">
          <span className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
            1 Siswa = 1 Suara
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
            Langsung & Rahasia
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
            Aman & Local-First
          </span>
        </div>
      </div>

      {/* Akses Panitia / Admin di Sudut Bawah */}
      <div className="mt-8 flex items-center justify-center">
        <button
          type="button"
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 hover:underline transition-colors px-3 py-2 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs"
          title="Panel Panitia & Pengaturan"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Panel Panitia / Admin</span>
        </button>
      </div>
    </div>
  );
};
