import { Teacher, Vote, VotingStatus, ElectionResults, TeacherResult } from '../types';
import { INITIAL_TEACHERS } from '../config/teachers';
import { EVENT_CONFIG } from '../config/event';

const DB_NAME = EVENT_CONFIG.dbName;
const DB_VERSION = EVENT_CONFIG.dbVersion;

export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  /**
   * Cek ketersediaan IndexedDB di lingkungan browser
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  }

  /**
   * Inisialisasi koneksi database IndexedDB dan konfigurasi Object Stores
   */
  public async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    if (!this.isSupported()) {
      throw new Error(
        'Peramban (browser) ini tidak mendukung IndexedDB atau sedang dalam mode penyamaran ketat yang memblokir penyimpanan lokal. Mohon gunakan browser modern seperti Google Chrome, Microsoft Edge, atau Firefox.'
      );
    }

    this.initPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Store: teachers
        if (!db.objectStoreNames.contains('teachers')) {
          const teacherStore = db.createObjectStore('teachers', { keyPath: 'id' });
          teacherStore.createIndex('displayOrder', 'displayOrder', { unique: false });
        }

        // 2. Store: votes
        if (!db.objectStoreNames.contains('votes')) {
          const voteStore = db.createObjectStore('votes', { keyPath: 'id' });
          voteStore.createIndex('teacherId', 'teacherId', { unique: false });
          voteStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // 3. Store: settings
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // 4. Store: metadata
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };

      request.onsuccess = async () => {
        this.db = request.result;
        try {
          await this.seedDefaults();
          resolve(this.db);
        } catch (err) {
          reject(err);
        }
      };

      request.onerror = () => {
        reject(
          new Error(
            `Gagal membuka IndexedDB: ${request.error?.message || 'Akses ditolak atau penyimpanan penuh'}`
          )
        );
      };

      request.onblocked = () => {
        console.warn('Database IndexedDB diblokir oleh tab lain. Tutup tab lama.');
      };
    });

    return this.initPromise;
  }

  /**
   * Seed data guru awal dan konfigurasi default jika database masih baru
   */
  private async seedDefaults(): Promise<void> {
    const db = this.db!;

    // Selalu perbarui & sinkronkan data guru ke INITIAL_TEACHERS terbaru
    const tx = db.transaction(['teachers', 'settings', 'metadata'], 'readwrite');
    const teacherStore = tx.objectStore('teachers');
    for (const t of INITIAL_TEACHERS) {
      teacherStore.put(t);
    }

    // Seed status voting default: OPEN jika belum ada
    const settingsStore = tx.objectStore('settings');
    const statusReq = settingsStore.get('votingStatus');
    statusReq.onsuccess = () => {
      if (!statusReq.result) {
        settingsStore.put({
          key: 'votingStatus',
          value: 'OPEN',
          updatedAt: new Date().toISOString()
        });
      }
    };

    // Seed metadata jika belum ada
    const metadataStore = tx.objectStore('metadata');
    const metaReq = metadataStore.get('eventName');
    metaReq.onsuccess = () => {
      if (!metaReq.result) {
        metadataStore.put({
          key: 'eventName',
          value: EVENT_CONFIG.eventName,
          updatedAt: new Date().toISOString()
        });
        metadataStore.put({
          key: 'initializedAt',
          value: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    };

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Ambil seluruh data dari sebuah object store
   */
  private async getAllFromStore<T>(storeName: string): Promise<T[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Ambil satu item berdasarkan key
   */
  private async getFromStore<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Dapatkan daftar seluruh guru
   */
  public async getTeachers(): Promise<Teacher[]> {
    const teachers = await this.getAllFromStore<Teacher>('teachers');
    return teachers.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Perbarui data guru (untuk keperluan sinkronisasi atau edit admin)
   */
  public async syncTeachers(teachersList: Teacher[]): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('teachers', 'readwrite');
      const store = tx.objectStore('teachers');
      store.clear();
      for (const t of teachersList) {
        store.put(t);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Ambil status voting saat ini ('OPEN' | 'LOCKED')
   */
  public async getVotingStatus(): Promise<VotingStatus> {
    const record = await this.getFromStore<{ key: string; value: VotingStatus }>('settings', 'votingStatus');
    return record ? record.value : 'OPEN';
  }

  /**
   * Ubah status voting
   */
  public async setVotingStatus(status: VotingStatus): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      store.put({
        key: 'votingStatus',
        value: status,
        updatedAt: new Date().toISOString()
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Simpan satu suara ke IndexedDB dengan transaksi atomik.
   * Suara akan ditolak jika status voting adalah 'LOCKED'.
   */
  public async submitVote(teacherId: string, eventName = EVENT_CONFIG.eventName): Promise<Vote> {
    const db = await this.init();

    return new Promise<Vote>((resolve, reject) => {
      // Buka transaksi baca-tulis pada 'settings' dan 'votes'
      const tx = db.transaction(['settings', 'votes'], 'readwrite');
      const settingsStore = tx.objectStore('settings');
      const votesStore = tx.objectStore('votes');

      const statusReq = settingsStore.get('votingStatus');

      statusReq.onsuccess = () => {
        const statusRecord = statusReq.result;
        const currentStatus = statusRecord ? statusRecord.value : 'OPEN';

        if (currentStatus === 'LOCKED') {
          tx.abort();
          reject(new Error('Voting telah ditutup/dikunci. Suara baru tidak dapat diterima.'));
          return;
        }

        const newVote: Vote = {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) 
            ? crypto.randomUUID() 
            : `vote-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          teacherId,
          createdAt: new Date().toISOString(),
          eventName
        };

        const addReq = votesStore.add(newVote);
        addReq.onsuccess = () => {
          // Sukses ditambahkan ke buffer transaksi
        };
        addReq.onerror = () => {
          reject(new Error(`Gagal menyimpan suara: ${addReq.error?.message}`));
        };
      };

      statusReq.onerror = () => {
        reject(new Error(`Gagal memverifikasi status voting: ${statusReq.error?.message}`));
      };

      tx.oncomplete = () => {
        resolve({
          id: '',
          teacherId,
          createdAt: new Date().toISOString(),
          eventName
        });
      };

      tx.onerror = () => {
        reject(new Error(`Transaksi penyimpanan suara gagal: ${tx.error?.message}`));
      };
    });
  }

  /**
   * Simpan banyak suara sekaligus dalam 1 transaksi (efisien untuk import/pengujian skala 350-500 suara)
   */
  public async submitVotesBatch(teacherIds: string[], eventName = EVENT_CONFIG.eventName): Promise<void> {
    const db = await this.init();

    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['settings', 'votes'], 'readwrite');
      const settingsStore = tx.objectStore('settings');
      const votesStore = tx.objectStore('votes');

      const statusReq = settingsStore.get('votingStatus');

      statusReq.onsuccess = () => {
        const currentStatus = statusReq.result ? statusReq.result.value : 'OPEN';
        if (currentStatus === 'LOCKED') {
          tx.abort();
          reject(new Error('Voting telah ditutup/dikunci. Suara baru tidak dapat diterima.'));
          return;
        }

        for (const teacherId of teacherIds) {
          const newVote: Vote = {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) 
              ? crypto.randomUUID() 
              : `vote-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            teacherId,
            createdAt: new Date().toISOString(),
            eventName
          };
          votesStore.add(newVote);
        }
      };

      statusReq.onerror = () => reject(new Error(`Gagal memverifikasi status: ${statusReq.error?.message}`));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error(`Transaksi penyimpanan batch gagal: ${tx.error?.message}`));
    });
  }

  /**
   * Dapatkan seluruh data suara
   */
  public async getAllVotes(): Promise<Vote[]> {
    return this.getAllFromStore<Vote>('votes');
  }

  /**
   * Dapatkan total jumlah suara yang telah masuk
   */
  public async getTotalVotesCount(): Promise<number> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('votes', 'readonly');
      const store = tx.objectStore('votes');
      const countReq = store.count();

      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => reject(countReq.error);
    });
  }

  /**
   * Hitung dan akumulasi hasil pemilihan langsung dari data IndexedDB.
   * Tidak bergantung pada state frontend.
   * Menangani hasil seri (tie) secara adil tanpa memilih acak.
   */
  public async getResults(): Promise<ElectionResults> {
    const teachers = await this.getTeachers();
    const votes = await this.getAllVotes();

    const totalVotes = votes.length;

    // Hitung suara per guru
    const voteCounts: Record<string, number> = {};
    for (const t of teachers) {
      voteCounts[t.id] = 0;
    }

    let lastVoteAt: string | null = null;
    for (const v of votes) {
      if (voteCounts[v.teacherId] !== undefined) {
        voteCounts[v.teacherId]++;
      }
      if (!lastVoteAt || new Date(v.createdAt) > new Date(lastVoteAt)) {
        lastVoteAt = v.createdAt;
      }
    }

    // Urutkan guru berdasarkan suara terbanyak, kemudian displayOrder
    const sorted = [...teachers].sort((a, b) => {
      const diff = (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0);
      if (diff !== 0) return diff;
      return a.displayOrder - b.displayOrder;
    });

    // Berikan peringkat 1 sampai 21 secara berurutan (Juara 1, 2, dan 3 masing-masing tepat 1 guru)
    const results: TeacherResult[] = sorted.map((teacher, index) => {
      const teacherVotes = voteCounts[teacher.id] || 0;
      const percentage = totalVotes > 0 ? (teacherVotes / totalVotes) * 100 : 0;

      return {
        ...teacher,
        votes: teacherVotes,
        percentage: Number(percentage.toFixed(1)),
        rank: index + 1
      };
    });

    // Tentukan peraih suara tertinggi (jika ada hasil seri perolehan suara)
    let winners: TeacherResult[] = [];
    let isTie = false;

    if (totalVotes > 0) {
      const maxVotes = results[0]?.votes || 0;
      winners = results.filter((r) => r.votes === maxVotes && r.votes > 0);
      if (winners.length > 1) {
        isTie = true;
      }
    }

    return {
      results,
      totalVotes,
      winners,
      isTie,
      lastVoteAt
    };
  }

  /**
   * Tutup koneksi database
   */
  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }

  /**
   * Reset seluruh suara dan kembalikan status voting menjadi OPEN.
   */
  public async resetAllVotes(): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['votes', 'settings'], 'readwrite');
      const votesStore = tx.objectStore('votes');
      const settingsStore = tx.objectStore('settings');

      votesStore.clear();
      settingsStore.put({
        key: 'votingStatus',
        value: 'OPEN',
        updatedAt: new Date().toISOString()
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

// Singleton instance
export const dbService = new IndexedDBService();
