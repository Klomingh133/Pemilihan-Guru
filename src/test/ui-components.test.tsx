import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TeacherGrid } from '../components/TeacherGrid';
import { StudentConfirmation } from '../components/StudentConfirmation';
import { AdminDashboard } from '../components/AdminDashboard';
import { KahootResults } from '../components/KahootResults';
import { Podium } from '../components/Podium';
import { Teacher } from '../types';
import { dbService } from '../services/db';

const mockTeachers: Teacher[] = [
  { id: 't-1', name: 'Guru 1', photoUrl: '/photos/teacher-01.png', displayOrder: 1, subject: 'Matematika' },
  { id: 't-2', name: 'Guru 2', photoUrl: null, displayOrder: 2, subject: 'Bahasa Indonesia' },
];

describe('Komponen UI & Alur Pemilihan Siswa', () => {
  beforeEach(async () => {
    dbService.close();
    await new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase('teacher-favorite-voting');
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
    await dbService.init();
  });

  afterEach(() => {
    dbService.close();
  });

  it('tombol Pilih tidak aktif sebelum siswa memilih guru', () => {
    const handleProceed = vi.fn();
    render(
      <TeacherGrid
        teachers={mockTeachers}
        selectedTeacher={null}
        onSelectTeacher={vi.fn()}
        onProceed={handleProceed}
        onCancel={vi.fn()}
      />
    );

    const proceedBtn = screen.getByRole('button', { name: /^pilih$/i });
    expect(proceedBtn).toBeDisabled();

    fireEvent.click(proceedBtn);
    expect(handleProceed).not.toHaveBeenCalled();
  });

  it('siswa dapat memilih satu guru dan tombol Pilih menjadi aktif', () => {
    let selected: Teacher | null = null;
    const handleSelect = vi.fn((t) => { selected = t; });

    const { rerender } = render(
      <TeacherGrid
        teachers={mockTeachers}
        selectedTeacher={selected}
        onSelectTeacher={handleSelect}
        onProceed={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    // Klik kartu guru ke-1
    const teacherCard = screen.getByRole('button', { name: /Guru 1/i });
    fireEvent.click(teacherCard);
    expect(handleSelect).toHaveBeenCalledWith(mockTeachers[0]);

    // Rerender dengan state terpilih
    rerender(
      <TeacherGrid
        teachers={mockTeachers}
        selectedTeacher={mockTeachers[0]}
        onSelectTeacher={handleSelect}
        onProceed={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const proceedBtn = screen.getByRole('button', { name: /^pilih$/i });
    expect(proceedBtn).not.toBeDisabled();
  });

  it('guru tanpa foto tetap tampil dengan placeholder profesional "Foto belum tersedia"', () => {
    render(
      <TeacherGrid
        teachers={mockTeachers}
        selectedTeacher={null}
        onSelectTeacher={vi.fn()}
        onProceed={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText('Foto belum tersedia')).toBeInTheDocument();
    expect(screen.getByText('Guru 2')).toBeInTheDocument();
  });

  it('siswa dapat kembali dari halaman konfirmasi untuk mengganti pilihan', () => {
    const handleBack = vi.fn();
    render(
      <StudentConfirmation
        teacher={mockTeachers[0]}
        onBack={handleBack}
        onSubmit={vi.fn()}
        isSubmitted={false}
      />
    );

    const backBtn = screen.getByRole('button', { name: /ganti pilihan/i });
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('mencegah double-click saat kirim pilihan (hanya satu suara disimpan)', async () => {
    let callCount = 0;
    const slowSubmit = vi.fn().mockImplementation(() => {
      callCount++;
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    render(
      <StudentConfirmation
        teacher={mockTeachers[0]}
        onBack={vi.fn()}
        onSubmit={slowSubmit}
        isSubmitted={false}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /kirimkan/i });
    
    // Double click cepat
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    expect(slowSubmit).toHaveBeenCalledTimes(1);
    expect(callCount).toBe(1);
  });

  it('saat submit berjalan, kontainer simpel loading dengan tulisan Tunggu ditampilkan', () => {
    // Render dengan fungsi submit yang belum selesai (pending)
    render(
      <StudentConfirmation
        teacher={mockTeachers[0]}
        onBack={vi.fn()}
        onSubmit={() => new Promise(() => {})}
        isSubmitted={false}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /kirimkan/i });
    fireEvent.click(submitBtn);

    // Harus menampilkan teks Tunggu...
    expect(screen.getByText(/tunggu\.\.\./i)).toBeInTheDocument();
  });

  it('setelah submit sukses, pesan Terkirim ditampilkan secara simpel dan bersih', () => {
    render(
      <StudentConfirmation
        teacher={mockTeachers[0]}
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitted={true}
      />
    );

    expect(screen.getByText(/^terkirim$/i)).toBeInTheDocument();
  });

  it('tombol reset di Admin menampilkan modal konfirmasi dan menghapus suara tanpa perlu mengetik kata RESET', async () => {
    // Tambahkan 1 suara dulu agar ada yang direset
    await dbService.submitVote(mockTeachers[0].id);
    const handleBackToStudent = vi.fn();

    render(
      <AdminDashboard
        onBackToStudent={handleBackToStudent}
        onViewResults={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/panel panitia & pengaturan voting/i)).toBeInTheDocument();
    });

    // 1. Klik Ulangi Voting (Mulai Voting Baru)
    const resetBtn = screen.getByRole('button', { name: /ulangi voting/i });
    fireEvent.click(resetBtn);

    // Muncul Modal Konfirmasi Ulangi Voting
    expect(screen.getByText(/konfirmasi ulangi voting/i)).toBeInTheDocument();
    expect(screen.getByText(/ulangi voting & mulai baru\?/i)).toBeInTheDocument();

    // 2. Klik Ya, Hapus & Mulai Baru langsung tanpa perlu ketik RESET
    const confirmBtn = screen.getByRole('button', { name: /ya, hapus & mulai baru/i });
    expect(confirmBtn).not.toBeDisabled();
    
    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(handleBackToStudent).toHaveBeenCalled();
    });
    alertSpy.mockRestore();
  });

  it('animasi hasil Kahoot dapat dilewati langsung dengan tombol Lewati Animasi', async () => {
    // Tambah satu suara dulu
    await dbService.submitVote(mockTeachers[0].id);

    render(
      <KahootResults
        onBackToAdmin={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/siapakah guru favorit tahun ini/i)).toBeInTheDocument();
    });

    const skipBtn = screen.getByRole('button', { name: /lewati animasi/i });
    fireEvent.click(skipBtn);

    // Langsung muncul klasemen lengkap
    await waitFor(() => {
      expect(screen.getByText(/klasemen lengkap seluruh guru/i)).toBeInTheDocument();
    });
  });

  it('podium juara 1, 2, dan 3 masing-masing hanya menampilkan 1 guru (tidak bertumpuk)', () => {
    render(
      <Podium
        rank1={mockTeachers[0] ? { ...mockTeachers[0], votes: 5, percentage: 50, rank: 1 } : null}
        rank2={mockTeachers[1] ? { ...mockTeachers[1], votes: 3, percentage: 30, rank: 2 } : null}
        rank3={null}
        totalVotes={8}
      />
    );

    expect(screen.getByText('JUARA EMAS')).toBeInTheDocument();
    expect(screen.getByText('JUARA PERAK')).toBeInTheDocument();
    expect(screen.getByText('JUARA PERUNGGU')).toBeInTheDocument();
    expect(screen.getByText('Guru 1')).toBeInTheDocument();
    expect(screen.getByText('Guru 2')).toBeInTheDocument();
  });
});
