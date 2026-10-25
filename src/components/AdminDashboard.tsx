import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { ElectionResults, VotingStatus } from '../types';
import { 
  Users, 
  Vote, 
  Lock, 
  Unlock, 
  Clock, 
  Play, 
  RotateCcw, 
  Eye, 
  Download, 
  ArrowLeft, 
  TrendingUp, 
  RefreshCw, 
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToStudent: () => void;
  onViewResults: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStudent,
  onViewResults,
}) => {
  const [data, setData] = useState<ElectionResults | null>(null);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>('OPEN');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State: Selesai Voting
  const [showLockModal, setShowLockModal] = useState(false);

  // Modal State: Reset / Ulangi Voting
  const [showResetModal, setShowResetModal] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const status = await dbService.getVotingStatus();
      const results = await dbService.getResults();
      setVotingStatus(status);
      setData(results);
    } catch (err) {
      console.error('Gagal memuat data admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler: Kunci Voting (Selesai Voting)
  const handleLockVoting = async () => {
    try {
      await dbService.setVotingStatus('LOCKED');
      setVotingStatus('LOCKED');
      setShowLockModal(false);
      // Langsung arahkan ke tampilan hasil proyektor
      onViewResults();
    } catch (err) {
      alert('Gagal mengunci voting: ' + (err as Error).message);
    }
  };

  // Handler: Buka Kembali Voting jika dibutuhkan panitia
  const handleUnlockVoting = async () => {
    if (window.confirm('Buka kembali sesi voting untuk menerima suara baru?')) {
      await dbService.setVotingStatus('OPEN');
      setVotingStatus('OPEN');
      loadData();
    }
  };

  // Handler: Reset Voting (Hapus seluruh suara & ulangi voting)
  const handleResetExecute = async () => {
    try {
      await dbService.resetAllVotes();
      setShowResetModal(false);
      await loadData();
      alert('Seluruh data suara telah berhasil direset dan sesi voting dibuka kembali.');
      onBackToStudent();
    } catch (err) {
      alert('Gagal mereset data: ' + (err as Error).message);
    }
  };

  // Handler: Export CSV untuk arsip panitia
  const handleExportCSV = () => {
    if (!data) return;
    const rows = [
      ['No', 'ID Guru', 'Nama Guru', 'Jumlah Suara', 'Persentase (%)'],
      ...data.results.map((r, idx) => [
        idx + 1,
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        r.votes,
        `${r.percentage}%`
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap-pemilihan-guru-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLocked = votingStatus === 'LOCKED';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStudent}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-black transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Ke Halaman Siswa</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Panel Panitia & Pengaturan Voting
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Pusat kendali pemilihan guru favorit • Data tersimpan aman di IndexedDB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Muat Ulang</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Total Suara */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Vote className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Suara Masuk
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                {data ? data.totalVotes : 0}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
                Kapasitas: 350 - 500+ siswa
              </div>
            </div>
          </div>

          {/* Card: Jumlah Calon Guru */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Jumlah Calon Guru
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                {data ? data.results.length : 21}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
                Tepat 21 slot aktif
              </div>
            </div>
          </div>

          {/* Card: Status Voting */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isLocked ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isLocked ? <Lock className="h-7 w-7" /> : <Unlock className="h-7 w-7" />}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Status Pemilihan
              </div>
              <div className={`text-xl sm:text-2xl font-black ${isLocked ? 'text-amber-700' : 'text-emerald-700'}`}>
                {isLocked ? 'DIKUNCI' : 'DIBUKA'}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
                {isLocked ? 'Suara baru ditolak' : 'Siswa dapat memilih'}
              </div>
            </div>
          </div>

          {/* Card: Waktu Suara Terakhir */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Clock className="h-7 w-7" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Suara Terakhir
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                {data?.lastVoteAt 
                  ? new Date(data.lastVoteAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : 'Belum ada'}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 truncate">
                {data?.lastVoteAt ? new Date(data.lastVoteAt).toLocaleDateString('id-ID') : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tindakan Penyelenggaraan</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-2">
              Kontrol Status & Pengumuman Hasil
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-medium">
              Setelah seluruh siswa selesai memberikan suara, klik <strong>"Selesai Voting"</strong> untuk mengunci suara dan menampilkan layar pengumuman podium ala Kahoot.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {!isLocked ? (
              <button
                type="button"
                onClick={() => setShowLockModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base transition-all shadow-xl shadow-amber-500/25 hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Lock className="h-5 w-5" />
                <span>Selesai Voting (Kunci)</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onViewResults}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-base transition-all shadow-xl shadow-blue-500/30 hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Eye className="h-5 w-5" />
                  <span>Tampilkan Hasil (Proyektor)</span>
                </button>
                <button
                  type="button"
                  onClick={onViewResults}
                  className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer active:scale-95"
                >
                  <Play className="h-4 w-4" />
                  <span>Tampilkan Ulang</span>
                </button>
                <button
                  type="button"
                  onClick={handleUnlockVoting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer active:scale-95"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Buka Kunci</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Ulangi Voting (Mulai Voting Baru)</span>
            </button>
          </div>
        </div>

        {/* Real-time Tally Table for Admin */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-black text-slate-900">
                  Perolehan Suara Sementara (Privat Panitia)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Data diperbarui secara lokal dari IndexedDB. Siswa di halaman voting tidak dapat melihat data ini.
              </p>
            </div>
            <div className="text-xs sm:text-sm font-black bg-blue-50 text-blue-800 px-4 py-2 rounded-2xl border border-blue-200">
              Total {data?.totalVotes || 0} Suara Terkumpul
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs font-black uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Peringkat</th>
                  <th className="py-3.5 px-4">Calon Guru</th>
                  <th className="py-3.5 px-4 text-center">No. Slot</th>
                  <th className="py-3.5 px-4 text-center">Foto</th>
                  <th className="py-3.5 px-4 text-right">Jumlah Suara</th>
                  <th className="py-3.5 px-4 text-right">Persentase</th>
                  <th className="py-3.5 px-4 min-w-[150px]">Distribusi Suara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data?.results.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-800 text-base">
                      #{teacher.rank}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {teacher.name}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs font-bold text-slate-600">
                      {teacher.displayOrder}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {teacher.photoUrl ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                          Ada Foto
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">
                          Placeholder
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-lg">
                      {teacher.votes}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-blue-700 text-base">
                      {teacher.percentage}%
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${teacher.percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL 1: Konfirmasi Selesai Voting */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-slate-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Lock className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-900 mb-2 tracking-tight">
              Selesai & Kunci Voting?
            </h3>
            <p className="text-base text-center text-slate-700 mb-6 font-bold">
              “Apakah seluruh siswa sudah memberikan suara?”
            </p>
            <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-4 text-xs sm:text-sm text-amber-950 mb-6 space-y-1.5 font-medium">
              <p className="font-black text-amber-900">Perhatian Panitia:</p>
              <p>• Total suara tercatat saat ini: <strong className="font-black">{data?.totalVotes || 0} suara</strong>.</p>
              <p>• Setelah dikonfirmasi, sistem akan mengubah status menjadi <strong>LOCKED</strong> dan menolak suara baru.</p>
              <p>• Anda akan langsung diarahkan ke layar hasil pemenang ala Kahoot untuk proyektor.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLockModal(false)}
                className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-slate-300 font-extrabold text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer active:scale-95"
              >
                Batal (Voting Berlanjut)
              </button>
              <button
                type="button"
                onClick={handleLockVoting}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Ya, Selesai & Kunci
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Reset / Ulangi Voting - Konfirmasi Langsung */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-rose-300 animate-scale-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
              <RotateCcw className="h-8 w-8" />
            </div>
            <div className="text-center mb-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                Konfirmasi Ulangi Voting
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2.5 tracking-tight">
                Ulangi Voting & Mulai Baru?
              </h3>
            </div>
            <div className="rounded-2xl bg-rose-50 border-2 border-rose-200 p-4 text-xs sm:text-sm text-rose-950 mb-6 font-medium">
              <p className="font-black text-rose-900 mb-1">Perhatian Panitia:</p>
              <p>
                Tindakan ini akan <strong>menghapus {data?.totalVotes || 0} suara</strong> yang telah tercatat di dalam IndexedDB browser ini dan mengembalikan sesi voting ke awal.
              </p>
              <p className="mt-2 text-xs text-rose-700 font-semibold">
                Pastikan Anda telah mengekspor file CSV jika membutuhkan arsip hasil sebelumnya.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-slate-300 font-extrabold text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer active:scale-95"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetExecute}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                Ya, Hapus & Mulai Baru
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
