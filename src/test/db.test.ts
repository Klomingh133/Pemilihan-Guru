import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IndexedDBService } from '../services/db';

describe('IndexedDB Service & Voting Logic', () => {
  let db: IndexedDBService;

  beforeEach(async () => {
    if (db) {
      db.close();
    }
    await new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase('teacher-favorite-voting');
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
    db = new IndexedDBService();
    await db.init();
  });

  afterEach(() => {
    if (db) {
      db.close();
    }
  });

  it('guru tanpa foto tetap tampil dan tepat berjumlah 21 guru', async () => {
    const teachers = await db.getTeachers();
    expect(teachers).toHaveLength(21);

    const withPhoto = teachers.filter(t => t.photoUrl !== null);
    const withoutPhoto = teachers.filter(t => t.photoUrl === null);

    expect(withPhoto).toHaveLength(12);
    expect(withoutPhoto).toHaveLength(9);
  });

  it('dapat menyimpan 350 hingga 500 suara dengan andal', async () => {
    const targetVotes = 350;
    const teachers = await db.getTeachers();

    // Buat daftar 350 suara dari para siswa
    const teacherIds: string[] = [];
    for (let i = 0; i < targetVotes; i++) {
      teacherIds.push(teachers[i % teachers.length].id);
    }

    // Simpan 350 suara ke IndexedDB dalam batch transaksi
    await db.submitVotesBatch(teacherIds);

    const totalVotes = await db.getTotalVotesCount();
    expect(totalVotes).toBe(350);

    const allVotes = await db.getAllVotes();
    expect(allVotes).toHaveLength(350);

    // Pastikan hasil perhitungan akurat
    const results = await db.getResults();
    expect(results.totalVotes).toBe(350);
  });

  it('refresh halaman / re-init tidak menghapus suara', async () => {
    const teachers = await db.getTeachers();
    await db.submitVote(teachers[0].id);
    await db.submitVote(teachers[1].id);

    // Tutup koneksi lama dan buat instance service baru seperti halnya browser direfresh
    db.close();
    const freshDbInstance = new IndexedDBService();
    await freshDbInstance.init();

    const count = await freshDbInstance.getTotalVotesCount();
    expect(count).toBe(2);
    freshDbInstance.close();
  });

  it('hasil pemenang dihitung dengan benar dari data IndexedDB', async () => {
    const teachers = await db.getTeachers();
    
    // Guru 1 dapat 3 suara, Guru 2 dapat 1 suara
    await db.submitVote(teachers[0].id);
    await db.submitVote(teachers[0].id);
    await db.submitVote(teachers[0].id);
    await db.submitVote(teachers[1].id);

    const results = await db.getResults();

    expect(results.totalVotes).toBe(4);
    expect(results.winners).toHaveLength(1);
    expect(results.winners[0].id).toBe(teachers[0].id);
    expect(results.winners[0].votes).toBe(3);
    expect(results.winners[0].percentage).toBe(75.0);
    expect(results.isTie).toBe(false);
  });

  it('hasil seri ditampilkan dengan benar (tidak memilih acak)', async () => {
    const teachers = await db.getTeachers();
    
    // Guru 1 dapat 2 suara, Guru 2 dapat 2 suara
    await db.submitVote(teachers[0].id);
    await db.submitVote(teachers[0].id);
    await db.submitVote(teachers[1].id);
    await db.submitVote(teachers[1].id);

    const results = await db.getResults();

    expect(results.totalVotes).toBe(4);
    expect(results.isTie).toBe(true);
    expect(results.winners).toHaveLength(2);
    expect(results.winners.map(w => w.id)).toContain(teachers[0].id);
    expect(results.winners.map(w => w.id)).toContain(teachers[1].id);
  });

  it('guru dengan 0 suara tetap tampil di leaderboard', async () => {
    const teachers = await db.getTeachers();
    // Hanya ada 1 suara untuk Guru 0
    await db.submitVote(teachers[0].id);

    const results = await db.getResults();
    expect(results.results).toHaveLength(21);

    const zeroVotesTeachers = results.results.filter(r => r.votes === 0);
    expect(zeroVotesTeachers).toHaveLength(20);
    expect(zeroVotesTeachers[0].percentage).toBe(0);
  });

  it('voting terkunci setelah tombol Selesai Voting dan suara baru ditolak', async () => {
    const teachers = await db.getTeachers();
    
    // Simpan satu suara awal
    await db.submitVote(teachers[0].id);

    // Panitia mengunci voting
    await db.setVotingStatus('LOCKED');
    const status = await db.getVotingStatus();
    expect(status).toBe('LOCKED');

    // Siswa berikutnya mencoba voting -> harus ditolak
    await expect(db.submitVote(teachers[1].id)).rejects.toThrow(
      'Voting telah ditutup/dikunci. Suara baru tidak dapat diterima.'
    );

    // Pastikan total suara tetap 1
    const total = await db.getTotalVotesCount();
    expect(total).toBe(1);
  });

  it('reset data menghapus seluruh suara dan mengembalikan status ke OPEN', async () => {
    const teachers = await db.getTeachers();
    await db.submitVote(teachers[0].id);
    await db.submitVote(teachers[1].id);
    await db.setVotingStatus('LOCKED');

    // Reset
    await db.resetAllVotes();

    const count = await db.getTotalVotesCount();
    const status = await db.getVotingStatus();

    expect(count).toBe(0);
    expect(status).toBe('OPEN');
  });
});
