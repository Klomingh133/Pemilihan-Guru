import React from 'react';
import { TeacherResult } from '../types';
import { Trophy, Medal, User, Award } from 'lucide-react';

interface LeaderboardProps {
  results: TeacherResult[];
  totalVotes: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  results,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-slate-900/95 backdrop-blur-xl p-5 sm:p-8 border-2 border-slate-800 shadow-2xl text-white">
      {/* Header Klasemen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-800 pb-5 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Trophy className="h-6 w-6 text-amber-400 shrink-0" />
            <span>Klasemen Lengkap Seluruh Guru (21 Slot)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Diurutkan berdasarkan perolehan suara terbanyak. Guru dengan 0 suara tetap ditampilkan secara utuh.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-black bg-slate-800 text-amber-300 px-3.5 py-1.5 rounded-xl border border-slate-700 self-start sm:self-center">
          <Award className="h-4 w-4 text-amber-400" />
          <span>Hasil Sah & Terkunci</span>
        </div>
      </div>

      {/* List 21 Guru (Kontras Tinggi & Ramah Layar Proyektor) */}
      <div className="space-y-3">
        {results.map((teacher) => {
          const isTop3 = teacher.rank <= 3 && teacher.votes > 0;
          const isRank1 = teacher.rank === 1 && teacher.votes > 0;
          const isRank2 = teacher.rank === 2 && teacher.votes > 0;
          const isRank3 = teacher.rank === 3 && teacher.votes > 0;

          return (
            <div
              key={teacher.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                isRank1
                  ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-amber-400/80 shadow-lg shadow-amber-500/10'
                  : isRank2
                  ? 'bg-gradient-to-r from-slate-400/15 to-transparent border-slate-300/60'
                  : isRank3
                  ? 'bg-gradient-to-r from-amber-900/25 to-transparent border-amber-700/60'
                  : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              {/* Kolom Kiri: Peringkat, Foto/Placeholder, Nama Guru */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Badge Rank */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black text-sm shadow-md ${
                    isRank1
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                      : isRank2
                      ? 'bg-slate-300 text-slate-900 ring-2 ring-slate-200'
                      : isRank3
                      ? 'bg-amber-700 text-white ring-2 ring-amber-600'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isRank1 ? <Trophy className="h-5 w-5 fill-slate-950" /> : `#${teacher.rank}`}
                </div>

                {/* Foto / Placeholder Konsisten (Dimensi Terkunci agar tidak meluap) */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 aspect-square shrink-0 overflow-hidden rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-sm">
                  {teacher.photoUrl ? (
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
                      <User className="h-6 w-6 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Informasi Guru */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-white text-base sm:text-lg truncate">
                      {teacher.name}
                    </h4>
                    {isTop3 && (
                      <span className="shrink-0">
                        <Medal
                          className={`h-4 w-4 ${
                            isRank1
                              ? 'text-amber-400 fill-amber-400'
                              : isRank2
                              ? 'text-slate-300 fill-slate-300'
                              : 'text-amber-500 fill-amber-500'
                          }`}
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-0.5">
                    <span>No. Slot: {teacher.displayOrder}</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Progress Bar, Suara, dan Persentase (Sangat Terbaca di Proyektor) */}
              <div className="flex items-center gap-4 sm:w-80 md:w-96 shrink-0 mt-2 sm:mt-0">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 font-bold">
                    <span className="text-white text-sm sm:text-base font-black">
                      {teacher.votes} <span className="font-medium text-xs text-slate-400">suara</span>
                    </span>
                    <span
                      className={`text-sm sm:text-base font-black ${
                        isRank1 ? 'text-amber-400' : isRank2 ? 'text-slate-200' : isRank3 ? 'text-amber-300' : 'text-blue-400'
                      }`}
                    >
                      {teacher.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar Animasi */}
                  <div className="h-3 w-full bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/80 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isRank1
                          ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-sm shadow-amber-400'
                          : isRank2
                          ? 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-100'
                          : isRank3
                          ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-400'
                          : 'bg-gradient-to-r from-blue-600 to-blue-400'
                      }`}
                      style={{ width: `${Math.max(teacher.percentage, teacher.votes > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
