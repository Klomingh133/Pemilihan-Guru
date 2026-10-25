import React, { useState } from 'react';
import { Teacher } from '../types';
import { Check, User } from 'lucide-react';

interface TeacherCardProps {
  teacher: Teacher;
  isSelected: boolean;
  onSelect: (teacher: Teacher) => void;
  disabled?: boolean;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const showPhoto = Boolean(teacher.photoUrl) && !imgError;

  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(teacher)}
      disabled={disabled}
      aria-pressed={isSelected}
      className={`group relative flex flex-col justify-between w-full rounded-3xl p-3 sm:p-4 text-left transition-all duration-300 outline-none select-none text-slate-800 ${
        isSelected
          ? 'bg-gradient-to-b from-blue-50/95 to-indigo-50/90 border-2 border-blue-600 ring-4 ring-blue-500/25 shadow-xl shadow-blue-500/20 -translate-y-1'
          : 'bg-white border-2 border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
    >
      {/* Indikator Centang Terpilih di Sudut Kanan Atas */}
      <div
        className={`absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
          isSelected
            ? 'bg-blue-600 text-white scale-100 shadow-md ring-4 ring-white'
            : 'bg-slate-100 text-transparent scale-90 border border-slate-300 group-hover:border-blue-400 group-hover:scale-95'
        }`}
      >
        <Check className={`h-4 w-4 stroke-[3.5] ${isSelected ? 'text-white' : 'opacity-0'}`} />
      </div>

      <div className="w-full">
        {/* Wadah Foto Guru */}
        <div className="relative mb-3.5 aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 shadow-inner border border-slate-200/60">
          {showPhoto ? (
            <img
              src={teacher.photoUrl!}
              alt={teacher.name}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Placeholder Konsisten & Profesional untuk Guru tanpa Foto */
            <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-slate-100 via-slate-200/80 to-slate-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm border border-slate-200 mb-2.5 transition-transform duration-300 group-hover:scale-110">
                <User className="h-8 w-8 text-slate-400" />
              </div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 shadow-xs border border-slate-300">
                Foto belum tersedia
              </span>
            </div>
          )}

          {/* Badge Nomor Slot (Kontras Tinggi & Mudah Dibaca) */}
          <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-xs font-black tracking-wide text-white shadow-sm border border-white/20">
            No. {teacher.displayOrder}
          </span>
        </div>

        {/* Informasi Calon Guru */}
        <div className="flex w-full flex-col items-center text-center px-1">
          <h3 className="line-clamp-2 text-sm sm:text-base font-extrabold text-slate-900 transition-colors group-hover:text-blue-700 min-h-[2.5rem] flex items-center justify-center leading-snug">
            {teacher.name}
          </h3>
        </div>
      </div>

      {/* Tombol Status Pemilihan di Bawah Kartu */}
      <div className="mt-3.5 w-full pt-1">
        <div
          className={`w-full py-2 px-3 rounded-xl text-center text-xs font-extrabold transition-all duration-200 ${
            isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-sm'
          }`}
        >
          {isSelected ? '✓ Terpilih' : 'Pilih Guru Ini'}
        </div>
      </div>
    </button>
  );
};
