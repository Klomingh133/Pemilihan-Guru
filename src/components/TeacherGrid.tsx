import React, { useState, useMemo } from 'react';
import { Teacher } from '../types';
import { TeacherCard } from './TeacherCard';
import { ArrowLeft, ArrowRight, UserCheck, HelpCircle, Search, Sparkles, Lock, CheckCircle2, UserPlus } from 'lucide-react';
import { formatPhotoUrl } from '../utils/formatPhotoUrl';

interface TeacherGridProps {
  teachers: Teacher[];
  selectedTeacher: Teacher | null;
  onSelectTeacher: (teacher: Teacher) => void;
  onProceed: () => void;
  onCancel: () => void;
  onOpenAdmin?: () => void;
  sessionTurn?: number;
  showNextStudentAlert?: boolean;
  onDismissNextAlert?: () => void;
}

export const TeacherGrid: React.FC<TeacherGridProps> = ({
  teachers,
  selectedTeacher,
  onSelectTeacher,
  onProceed,
  onCancel,
  onOpenAdmin,
  sessionTurn = 1,
  showNextStudentAlert = false,
  onDismissNextAlert,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter pencarian lokal opsional (seluruh 21 guru tampil secara default)
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return teachers;
    const query = searchQuery.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.displayOrder.toString() === query
    );
  }, [teachers, searchQuery]);

  return (
    <div className="min-h-screen pb-32 sm:pb-36 pt-4 sm:pt-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Banner Animasi Transisi: Giliran Siswa Berikutnya */}
      {showNextStudentAlert && (
        <div className="mb-4 sm:mb-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-4 sm:p-5 text-white shadow-xl shadow-emerald-900/20 border-2 border-emerald-300 animate-scale-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md shrink-0 animate-bounce-subtle">
                <CheckCircle2 className="h-7 w-7 stroke-[2.5]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-200">
                  <span>✓ Suara Sebelumnya Sukses Tersimpan</span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight">
                  Giliran Siswa Berikutnya: Silakan Pilih Guru Favorit Anda!
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black bg-white/20 px-3.5 py-1.5 rounded-xl border border-white/30 text-white backdrop-blur-xs">
                <UserPlus className="h-3.5 w-3.5 text-yellow-300" />
                <span>Sesi Siswa Baru Siap</span>
              </span>
              {onDismissNextAlert && (
                <button
                  type="button"
                  onClick={onDismissNextAlert}
                  className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xs font-black cursor-pointer transition-colors"
                  title="Tutup Notifikasi"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header Halaman Pemilihan */}
      <div className="mb-4 sm:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 border-b border-slate-200/90 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 sm:px-3 py-1 rounded-full border border-blue-200 shadow-xs">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span>Pemilihan Langsung</span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Total {teachers.length} Calon Guru
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Pilih Satu Guru Favorit Anda
          </h1>
          <p className="text-xs sm:text-base text-slate-600 mt-0.5 sm:mt-1">
            Klik foto atau nama guru pilihan Anda, lalu tekan tombol <strong className="text-blue-700 font-bold">"Pilih"</strong> di bawah.
          </p>
        </div>

        {/* Tombol Bantuan & Admin */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
            <span>Petunjuk</span>
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-700 bg-white border border-slate-300 hover:border-rose-300 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            title="Kembali ke Layar Awal"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Ke Beranda</span>
          </button>

          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
              title="Buka Panel Panitia / Admin"
            >
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Box Bantuan jika ditekan */}
      {showHelp && (
        <div className="mb-4 sm:mb-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-4 sm:p-5 text-sm text-amber-950 animate-scale-in shadow-md">
          <h4 className="font-black text-sm sm:text-base flex items-center gap-2 mb-1.5 text-amber-950">
            <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Panduan Pemilihan Siswa:</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-amber-900 font-medium">
            <li>Setiap siswa memilih <strong>satu guru favorit</strong> secara bergantian.</li>
            <li>Guru yang Anda pilih akan ditandai dengan garis biru tebal dan tanda centang.</li>
            <li>Tekan tombol <strong>"Lanjutkan"</strong> untuk memunculkan pop-up konfirmasi.</li>
            <li>Setelah dikirim, sistem akan langsung siap untuk siswa berikutnya!</li>
          </ul>
        </div>
      )}

      {/* Bilah Pencarian Cepat Opsional */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama guru..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all shadow-xs"
          />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer shrink-0"
          >
            Tampilkan Semua
          </button>
        )}
      </div>

      {/* Grid 21 Calon Guru Responsif: Desktop tepat 5 container per baris (maksimal 5 kolom, bukan 7) */}
      <div
        key={sessionTurn}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5"
      >
        {filteredTeachers.map((teacher, index) => (
          <div
            key={teacher.id}
            className="animate-scale-in"
            style={{
              animationDelay: `${Math.min(index * 20, 420)}ms`,
              animationFillMode: 'backwards',
            }}
          >
            <TeacherCard
              teacher={teacher}
              isSelected={selectedTeacher?.id === teacher.id}
              onSelect={onSelectTeacher}
            />
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="py-12 sm:py-16 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-500">
            Tidak ditemukan guru dengan kata kunci "{searchQuery}".
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Tampilkan Seluruh 21 Guru
          </button>
        </div>
      )}

      {/* Sticky Bottom Bar Navigasi (Responsif untuk HP, Tablet, dan Desktop) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t-2 border-slate-200/90 shadow-2xl py-2.5 sm:py-3.5 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Status Guru Terpilih */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {selectedTeacher ? (
              <div className="flex items-center gap-2.5 sm:gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl w-full sm:w-auto shadow-xs">
                <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl overflow-hidden bg-slate-200 shrink-0 border-2 border-blue-400 shadow-xs">
                  {selectedTeacher.photoUrl ? (
                    <img
                      src={formatPhotoUrl(selectedTeacher.photoUrl)!}
                      alt={selectedTeacher.name}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-200 text-slate-500 text-xs font-black">
                      #{selectedTeacher.displayOrder}
                    </div>
                  )}
                </div>
                <div className="truncate min-w-0 flex-1 sm:flex-initial">
                  <div className="text-[10px] sm:text-[11px] font-black uppercase text-blue-700 tracking-wider">
                    Pilihan Anda:
                  </div>
                  <div className="text-xs sm:text-base font-black text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                    {selectedTeacher.name}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-semibold px-1 py-1">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 shrink-0">
                  <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <span className="truncate">Klik salah satu kartu guru di atas untuk memilih.</span>
              </div>
            )}
          </div>

          {/* Tombol Aksi: Batal & Lanjutkan (Ukuran Besar & Nyaman di HP / Laptop) */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {selectedTeacher && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl border-2 border-slate-300 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 shrink-0"
              >
                Batal
              </button>
            )}
            <button
              type="button"
              onClick={onProceed}
              disabled={!selectedTeacher}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-sm sm:text-lg font-black transition-all shadow-lg ${
                selectedTeacher
                  ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-blue-500/35 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300/60'
              }`}
            >
              <span>Pilih</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
