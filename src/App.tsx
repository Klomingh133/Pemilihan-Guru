import React, { useState, useEffect, useCallback, useRef } from 'react';
import { dbService } from './services/db';
import { Teacher, VotingStatus, AppView } from './types';
import { EVENT_CONFIG } from './config/event';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';

import { StudentWelcome } from './components/StudentWelcome';
import { TeacherGrid } from './components/TeacherGrid';
import { StudentConfirmation } from './components/StudentConfirmation';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { KahootResults } from './components/KahootResults';

import { AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [view, setView] = useState<AppView>('student-welcome');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>('OPEN');
  const [totalVotesCount, setTotalVotesCount] = useState<number>(0);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Status giliran sesi pemilihan & animasi transisi siswa baru
  const [sessionTurn, setSessionTurn] = useState<number>(1);
  const [showNextStudentAlert, setShowNextStudentAlert] = useState<boolean>(false);
  const nextAlertTimerRef = useRef<number | null>(null);

  // Guard pengiriman suara & pengatur waktu kembali
  const isSubmittingRef = useRef<boolean>(false);
  const redirectTimerRef = useRef<number | null>(null);

  // Inisialisasi Database dan Data Awal
  const loadApp = useCallback(async () => {
    try {
      setIsInitializing(true);
      await dbService.init();
      const teacherList = await dbService.getTeachers();
      const status = await dbService.getVotingStatus();
      const votesCount = await dbService.getTotalVotesCount();
      setTeachers(teacherList);
      setVotingStatus(status);
      setTotalVotesCount(votesCount);
      setDbError(null);
    } catch (err: any) {
      console.error('Inisialisasi aplikasi gagal:', err);
      setDbError(err.message || 'Gagal menginisialisasi penyimpanan lokal IndexedDB.');
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    loadApp();

    // Deteksi URL /admin atau #admin untuk akses panitia
    const checkAdminRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || path === '/admin' || path.endsWith('/admin')) {
        setView('admin-login');
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, [loadApp]);

  // Fungsi utilitas untuk membersihkan URL saat kembali ke halaman siswa
  const cleanUrlToRoot = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        if (window.location.hash || window.location.pathname !== '/') {
          window.history.replaceState(null, '', '/');
        }
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  // Reset total state siswa dan LANGSUNG KEMBALI KE HALAMAN PEMILIHAN GURU (tidak kembali ke start!)
  const handleResetForNextStudent = useCallback(() => {
    if (redirectTimerRef.current) {
      window.clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
    if (nextAlertTimerRef.current) {
      window.clearTimeout(nextAlertTimerRef.current);
      nextAlertTimerRef.current = null;
    }
    isSubmittingRef.current = false;
    setSelectedTeacher(null);
    setIsSubmitted(false);
    cleanUrlToRoot();
    
    // Tingkatkan turn sesi dan aktifkan banner transisi siswa berikutnya
    setSessionTurn((prev) => prev + 1);
    setShowNextStudentAlert(true);

    // Auto-dismiss banner setelah 6 detik jika siswa belum memilih
    nextAlertTimerRef.current = window.setTimeout(() => {
      setShowNextStudentAlert(false);
    }, 6000);

    // Kembali langsung ke halaman grid pemilihan guru untuk siswa berikutnya
    setView('student-voting');

    // Scroll mulus kembali ke posisi paling atas
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [cleanUrlToRoot]);

  // Timeout inaktivitas siswa: 3 menit
  // Jika siswa meninggalkan laptop di tengah pemilihan, reset dan tetap di halaman grid
  const isStudentActiveSession = view === 'student-voting' || view === 'student-confirm';
  const handleInactivityTimeout = useCallback(() => {
    if (isStudentActiveSession) {
      console.warn('Sesi siswa timeout (3 menit inaktivitas). Mengosongkan state.');
      handleResetForNextStudent();
    }
  }, [isStudentActiveSession, handleResetForNextStudent]);

  useInactivityTimeout(
    handleInactivityTimeout,
    isStudentActiveSession,
    EVENT_CONFIG.studentInactivityTimeoutMs
  );

  // Handler: Siswa Memulai Memilih dari Welcome Screen (pertama kali)
  const handleStartVoting = () => {
    if (votingStatus === 'LOCKED') {
      alert('Sesi pemilihan telah ditutup oleh panitia.');
      return;
    }
    // Pastikan state pemilihan sebelumnya bersih 100%
    setSelectedTeacher(null);
    setIsSubmitted(false);
    isSubmittingRef.current = false;
    setView('student-voting');
  };

  // Handler: Siswa Memilih Guru di Grid
  const handleSelectTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    // Sembunyikan banner siswa berikutnya saat guru mulai dipilih
    setShowNextStudentAlert(false);
  };

  // Handler: Lanjutkan ke Pop-up Konfirmasi
  const handleProceedToConfirm = () => {
    if (!selectedTeacher) return;
    setView('student-confirm');
  };

  // Handler: Kembali ke Grid dari Pop-up Konfirmasi (Ganti Pilihan)
  const handleBackToGrid = () => {
    setView('student-voting');
  };

  // Handler: Batal & Kembali ke Layar Awal Beranda (jika ditekan eksplisit oleh panitia)
  const handleCancelVoting = () => {
    setSelectedTeacher(null);
    setIsSubmitted(false);
    isSubmittingRef.current = false;
    cleanUrlToRoot();
    setView('student-welcome');
  };

  // Handler: Kirim Pilihan Suara
  const handleSubmitVote = async () => {
    // Cegah double submit pada level handler
    if (!selectedTeacher || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      // 1. Simpan satu suara ke IndexedDB via transaksi atomik
      // Ditambah jeda loading visual yang nyaman (550ms) agar animasi loading terlihat jelas
      await Promise.all([
        dbService.submitVote(selectedTeacher.id, EVENT_CONFIG.eventName),
        new Promise((resolve) => setTimeout(resolve, 550)),
      ]);

      // 2. Tandai sukses (pop-up berubah ke status centang SELESAI)
      setIsSubmitted(true);

      // 3. Perbarui total suara
      const newCount = await dbService.getTotalVotesCount();
      setTotalVotesCount(newCount);

      // 4. Timer otomatis menutup pop-up dan LANGSUNG KEMBALI ke halaman pemilihan guru
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = window.setTimeout(() => {
        handleResetForNextStudent();
      }, EVENT_CONFIG.successRedirectDelayMs);

    } catch (err) {
      isSubmittingRef.current = false;
      throw err;
    }
  };

  // Handler: Buka Modal Admin
  const handleOpenAdmin = () => {
    setView('admin-login');
  };

  // Handler: Admin Login Sukses
  const handleAdminLoginSuccess = () => {
    setView('admin-dashboard');
  };

  // Handler: Batal Admin Login
  const handleAdminLoginCancel = () => {
    handleResetForNextStudent();
  };

  // Handler: Kembali dari Admin Dashboard ke Siswa (langsung ke halaman pemilihan)
  const handleAdminBackToStudent = () => {
    handleResetForNextStudent();
  };

  // Handler: Admin ke Halaman Hasil
  const handleViewResults = () => {
    setView('results');
  };

  // Tampilan Loading Inisialisasi yang Menawan
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/50 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">🏆</span>
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Menyiapkan Aplikasi Pemilihan...
        </h2>
        <p className="text-sm font-semibold text-slate-500 mt-1 max-w-sm">
          Menginisialisasi basis data lokal IndexedDB & menyiapkan 21 slot guru
        </p>
      </div>
    );
  }

  // Tampilan Error jika IndexedDB Tidak Tersedia
  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 select-none">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border-2 border-rose-300 shadow-2xl text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center border-2 border-rose-200">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
            Penyimpanan Tidak Tersedia
          </h2>
          <p className="text-sm font-medium text-slate-600 mb-8 leading-relaxed">
            {dbError}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-base shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
          >
            Coba Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* 1. Halaman Siswa: Layar Awal / Start (hanya muncul saat pertama kali atau jika sengaja ditekan 'Ke Beranda') */}
      {view === 'student-welcome' && (
        <StudentWelcome
          onStartVoting={handleStartVoting}
          onOpenAdmin={handleOpenAdmin}
          votingStatus={votingStatus}
          totalVotesCount={totalVotesCount}
        />
      )}

      {/* 2. Halaman Siswa: Grid 21 Calon Guru & Pop-up Modal Konfirmasi */}
      {(view === 'student-voting' || view === 'student-confirm') && (
        <>
          <TeacherGrid
            teachers={teachers}
            selectedTeacher={selectedTeacher}
            onSelectTeacher={handleSelectTeacher}
            onProceed={handleProceedToConfirm}
            onCancel={handleCancelVoting}
            onOpenAdmin={handleOpenAdmin}
            sessionTurn={sessionTurn}
            showNextStudentAlert={showNextStudentAlert}
            onDismissNextAlert={() => setShowNextStudentAlert(false)}
          />

          {/* Pop-up Modal Konfirmasi & Feedback Sukses Langsung di Atas Grid */}
          {view === 'student-confirm' && selectedTeacher && (
            <StudentConfirmation
              teacher={selectedTeacher}
              onBack={handleBackToGrid}
              onSubmit={handleSubmitVote}
              isSubmitted={isSubmitted}
              onCompleteNow={handleResetForNextStudent}
            />
          )}
        </>
      )}

      {/* 4. Modal Login PIN Admin */}
      {view === 'admin-login' && (
        <AdminLoginModal
          onSuccess={handleAdminLoginSuccess}
          onCancel={handleAdminLoginCancel}
        />
      )}

      {/* 5. Dashboard Panel Admin */}
      {view === 'admin-dashboard' && (
        <AdminDashboard
          onBackToStudent={handleAdminBackToStudent}
          onViewResults={handleViewResults}
        />
      )}

      {/* 6. Halaman Hasil Pemenang (Gaya Kahoot untuk Proyektor) */}
      {view === 'results' && (
        <KahootResults
          onBackToAdmin={() => setView('admin-dashboard')}
        />
      )}
    </div>
  );
};
