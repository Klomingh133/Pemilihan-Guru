import React, { useState } from 'react';
import { Teacher } from '../types';
import { Check, Loader2, User, AlertCircle } from 'lucide-react';
import { formatPhotoUrl } from '../utils/formatPhotoUrl';

interface StudentConfirmationProps {
  teacher: Teacher;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  isSubmitted: boolean;
  onCompleteNow?: () => void;
}

export const StudentConfirmation: React.FC<StudentConfirmationProps> = ({
  teacher,
  onBack,
  onSubmit,
  isSubmitted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return; // Prevent double submission
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan suara. Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      
      {/* 1. TAMPILAN SUKSES: LOGO CENTANG & TULISAN TERKIRIM */}
      {isSubmitted ? (
        <div
          key="success-card"
          className="w-full max-w-xs rounded-3xl bg-white p-8 text-center shadow-2xl border-2 border-emerald-300 animate-pop-in-success my-auto flex flex-col items-center justify-center select-none"
        >
          {/* Logo Tanda Centang dengan Animasi Pulse */}
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/30 ring-8 ring-emerald-100 animate-check-pulse">
            <Check className="h-14 w-14 stroke-[3.5]" />
          </div>

          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
            Terkirim
          </h3>

          {/* Bar Progress Halus Sebelum Auto-Transisi */}
          <div className="h-1.5 w-36 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
            <div className="h-full bg-emerald-500 rounded-full animate-[progress_1.4s_linear]" />
          </div>
        </div>
      ) : isSubmitting ? (
        /* 2. TAMPILAN LOADING: CONTAINER SIMPEL BERISI BAR LOADING & TULISAN TUNGGU */
        <div
          key="loading-card"
          className="w-full max-w-xs rounded-3xl bg-white p-8 text-center shadow-2xl border-2 border-slate-200 animate-scale-in my-auto flex flex-col items-center justify-center select-none"
        >
          <div className="mb-4 flex h-18 w-18 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
            Tunggu...
          </h3>

          <div className="h-2 w-36 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
            <div className="h-full bg-blue-600 rounded-full animate-[progress_1s_ease-in-out_infinite]" />
          </div>
        </div>
      ) : (
        /* 3. TAMPILAN KONFIRMASI BERSIH, RINGKAS & INTERAKTIF */
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 animate-scale-in my-auto flex flex-col items-center text-center">
          
          {/* Foto Profil Guru */}
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-md border-2 border-slate-200 mb-4">
            {teacher.photoUrl ? (
              <img
                src={formatPhotoUrl(teacher.photoUrl)!}
                alt={teacher.name}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-2 text-slate-400">
                <User className="h-10 w-10 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Foto belum tersedia
                </span>
              </div>
            )}
            <span className="absolute bottom-1.5 left-1.5 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-black text-white">
              No. {teacher.displayOrder}
            </span>
          </div>

          {/* Info Guru */}
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            Konfirmasi Pilihan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
            {teacher.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-xs">
            Pastikan pilihan sudah benar sebelum mengirimkan suara.
          </p>

          {/* Pesan Error jika ada */}
          {errorMessage && (
            <div className="w-full mb-4 flex items-start gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 text-left">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tombol Aksi: Ganti Pilihan & Kirimkan */}
          <div className="w-full flex flex-col-reverse sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              Ganti Pilihan
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
            >
              Kirimkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
