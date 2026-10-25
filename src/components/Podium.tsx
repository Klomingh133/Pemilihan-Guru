import React from 'react';
import { TeacherResult } from '../types';
import { Trophy, User, Sparkles } from 'lucide-react';
import { formatPhotoUrl } from '../utils/formatPhotoUrl';

interface PodiumProps {
  rank1: TeacherResult[] | TeacherResult | null;
  rank2: TeacherResult[] | TeacherResult | null;
  rank3: TeacherResult[] | TeacherResult | null;
  totalVotes: number;
}

export const Podium: React.FC<PodiumProps> = ({
  rank1,
  rank2,
  rank3,
}) => {
  // Pastikan tepat 1 calon guru untuk masing-masing podium Juara 1, Juara 2, dan Juara 3
  const teacher1 = Array.isArray(rank1) ? (rank1[0] || null) : rank1;
  const teacher2 = Array.isArray(rank2) ? (rank2[0] || null) : rank2;
  const teacher3 = Array.isArray(rank3) ? (rank3[0] || null) : rank3;

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      {/* Grid 3 Podium: Kolom 2 (Perak - Kiri), Kolom 1 (Emas - Tengah), Kolom 3 (Perunggu - Kanan) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-end justify-center">
        
        {/* PODIUM PERINGKAT 2 (PERAK) - TEPAT 1 GURU */}
        <div className="order-2 md:order-1 flex flex-col items-center">
          {teacher2 ? (
            <div className="w-full flex flex-col items-center mb-4 text-center animate-scale-in">
              <div className="relative mb-3.5 h-32 w-32 sm:h-36 sm:w-36 rounded-3xl overflow-hidden border-4 border-slate-300 bg-slate-900 shadow-2xl ring-4 ring-slate-400/30">
                {teacher2.photoUrl ? (
                  <img
                    src={formatPhotoUrl(teacher2.photoUrl)!}
                    alt={teacher2.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-3 text-center">
                    <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center mb-1">
                      <User className="h-8 w-8 text-slate-400" />
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase">
                      Foto belum tersedia
                    </span>
                  </div>
                )}
                <span className="absolute top-2.5 left-2.5 rounded-lg bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 text-xs font-black text-white border border-slate-700">
                  #2
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white line-clamp-1">{teacher2.name}</h4>
              <div className="mt-2 inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3.5 py-1 rounded-full">
                <span className="text-base font-black text-slate-200">{teacher2.votes} suara</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-700 text-slate-100">
                  {teacher2.percentage}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs text-center py-4">Belum ada peraih peringkat 2</div>
          )}

          {/* Tiang Podium 2 (Perak) */}
          <div className="w-full h-44 sm:h-52 bg-gradient-to-t from-slate-800 via-slate-600 to-slate-400 rounded-t-3xl border-t-4 border-slate-200 shadow-2xl flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white text-slate-900 font-black text-3xl shadow-xl border-2 border-slate-200">
              2
            </div>
            <span className="mt-2 text-sm font-black uppercase tracking-widest text-slate-100 drop-shadow-md">
              JUARA PERAK
            </span>
          </div>
        </div>

        {/* PODIUM PERINGKAT 1 (EMAS / GURU FAVORIT UTAMA) - TEPAT 1 GURU */}
        <div className="order-1 md:order-2 flex flex-col items-center z-10 w-full">
          {teacher1 ? (
            <div className="w-full flex flex-col items-center mb-4 text-center animate-scale-in">
              <div className="relative mb-3.5 h-40 w-40 sm:h-48 sm:w-48 rounded-3xl overflow-hidden border-4 border-amber-400 bg-slate-900 shadow-2xl ring-8 ring-amber-400/30 transform hover:scale-105 transition-transform duration-300">
                {teacher1.photoUrl ? (
                  <img
                    src={formatPhotoUrl(teacher1.photoUrl)!}
                    alt={teacher1.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-amber-200 p-4 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-1">
                      <User className="h-10 w-10 text-amber-400" />
                    </div>
                    <span className="text-xs font-black text-amber-300 uppercase">
                      Foto belum tersedia
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg">
                  <Trophy className="h-5 w-5 fill-slate-950 text-slate-950" />
                </div>
                <span className="absolute top-3 left-3 rounded-lg bg-amber-500 px-3 py-1 text-sm font-black text-slate-950 shadow-md">
                  #1
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg mb-2">
                <Sparkles className="h-3.5 w-3.5 fill-slate-950" />
                <span>GURU FAVORIT</span>
              </span>

              <h4 className="text-2xl sm:text-3xl font-black text-white line-clamp-1 drop-shadow-md">
                {teacher1.name}
              </h4>

              <div className="mt-2.5 inline-flex items-center gap-2.5 bg-amber-400/20 border-2 border-amber-400/80 px-4 py-1.5 rounded-full backdrop-blur-md">
                <span className="text-lg sm:text-xl font-black text-amber-300">{teacher1.votes} suara</span>
                <span className="text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {teacher1.percentage}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs text-center py-4">Belum ada peraih peringkat 1</div>
          )}

          {/* Tiang Podium 1 (Emas) - Paling Tinggi */}
          <div className="w-full h-60 sm:h-72 bg-gradient-to-t from-amber-700 via-amber-500 to-yellow-400 rounded-t-3xl border-t-4 border-yellow-200 shadow-2xl flex flex-col items-center justify-center text-slate-950 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
            <div className="flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-white text-amber-600 font-black text-4xl sm:text-5xl shadow-2xl border-4 border-amber-300">
              1
            </div>
            <span className="mt-3 text-base sm:text-lg font-black uppercase tracking-widest text-slate-950 drop-shadow-sm">
              JUARA EMAS
            </span>
          </div>
        </div>

        {/* PODIUM PERINGKAT 3 (PERUNGGU) - TEPAT 1 GURU */}
        <div className="order-3 flex flex-col items-center">
          {teacher3 ? (
            <div className="w-full flex flex-col items-center mb-4 text-center animate-scale-in">
              <div className="relative mb-3.5 h-32 w-32 sm:h-36 sm:w-36 rounded-3xl overflow-hidden border-4 border-amber-700 bg-slate-900 shadow-2xl ring-4 ring-amber-700/30">
                {teacher3.photoUrl ? (
                  <img
                    src={formatPhotoUrl(teacher3.photoUrl)!}
                    alt={teacher3.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-amber-300/80 p-3 text-center">
                    <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center mb-1">
                      <User className="h-8 w-8 text-amber-600" />
                    </div>
                    <span className="text-[10px] font-black text-amber-300 uppercase">
                      Foto belum tersedia
                    </span>
                  </div>
                )}
                <span className="absolute top-2.5 left-2.5 rounded-lg bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 text-xs font-black text-white border border-amber-800">
                  #3
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white line-clamp-1">{teacher3.name}</h4>
              <div className="mt-2 inline-flex items-center gap-2 bg-slate-800/90 border border-amber-800/60 px-3.5 py-1 rounded-full">
                <span className="text-base font-black text-amber-200">{teacher3.votes} suara</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-900 text-amber-200">
                  {teacher3.percentage}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs text-center py-4">Belum ada peraih peringkat 3</div>
          )}

          {/* Tiang Podium 3 (Perunggu) */}
          <div className="w-full h-36 sm:h-44 bg-gradient-to-t from-amber-950 via-amber-800 to-amber-600 rounded-t-3xl border-t-4 border-amber-500 shadow-2xl flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-amber-900 text-amber-200 font-black text-3xl shadow-xl border-2 border-amber-500">
              3
            </div>
            <span className="mt-2 text-sm font-black uppercase tracking-widest text-amber-200 drop-shadow-md">
              JUARA PERUNGGU
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
