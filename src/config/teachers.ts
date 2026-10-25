import { Teacher } from '../types';

/**
 * PANDUAN PENGATURAN DATA GURU:
 * ---------------------------------------------------------------------
 * 1. Anda dapat mengubah 'name' (Nama Guru) secara langsung di bawah ini.
 * 2. Anda dapat mengubah 'photoUrl':
 *    - Masukkan path foto lokal di dalam folder public, contoh: '/photos/teacher-01.png'
 *    - Atau setel ke `null` jika foto belum tersedia (akan otomatis muncul placeholder profesional).
 * 3. Anda dapat mengubah 'displayOrder' untuk menentukan urutan kemunculan di layar voting.
 * 4. Tepat 21 slot guru telah dikonfigurasi (12 guru memiliki foto, 9 guru tanpa foto).
 */
export const INITIAL_TEACHERS: Teacher[] = [
  // --- 12 GURU DENGAN FOTO ---
  {
    id: "teacher-01",
    name: "Bu Ayu Miana",
    photoUrl: "/photos/teacher-01.png",
    displayOrder: 1
  },
  {
    id: "teacher-02",
    name: "Pak Nova",
    photoUrl: "/photos/teacher-02.png",
    displayOrder: 2
  },
  {
    id: "teacher-03",
    name: "Pak Komang Sony",
    photoUrl: "/photos/teacher-03.png",
    displayOrder: 3
  },
  {
    id: "teacher-04",
    name: "Bu Wayan Suparni",
    photoUrl: "/photos/teacher-04.png",
    displayOrder: 4
  },
  {
    id: "teacher-05",
    name: "Bu Yeyen",
    photoUrl: "/photos/teacher-05.png",
    displayOrder: 5
  },
  {
    id: "teacher-06",
    name: "Bu Tut Ayu",
    photoUrl: "/photos/teacher-06.png",
    displayOrder: 6
  },
  {
    id: "teacher-07",
    name: "Mister Eret",
    photoUrl: "/photos/teacher-07.png",
    displayOrder: 7
  },
  {
    id: "teacher-08",
    name: "Bu Dian",
    photoUrl: "/photos/teacher-08.png",
    displayOrder: 8
  },
  {
    id: "teacher-09",
    name: "Miss Mita",
    photoUrl: "/photos/teacher-09.png",
    displayOrder: 9
  },
  {
    id: "teacher-10",
    name: "Bu Eka",
    photoUrl: "/photos/teacher-10.png",
    displayOrder: 10
  },
  {
    id: "teacher-11",
    name: "Bu Devi",
    photoUrl: "/photos/teacher-11.png",
    displayOrder: 11
  },
  {
    id: "teacher-12",
    name: "Bu Tu Yeni",
    photoUrl: "/photos/teacher-12.png",
    displayOrder: 12
  },

  // --- 9 GURU TANPA FOTO (FOTO BELUM TERSEDIA) ---
  {
    id: "teacher-13",
    name: "Guru 13",
    photoUrl: null,
    displayOrder: 13
  },
  {
    id: "teacher-14",
    name: "Guru 14",
    photoUrl: null,
    displayOrder: 14
  },
  {
    id: "teacher-15",
    name: "Guru 15",
    photoUrl: null,
    displayOrder: 15
  },
  {
    id: "teacher-16",
    name: "Guru 16",
    photoUrl: null,
    displayOrder: 16
  },
  {
    id: "teacher-17",
    name: "Guru 17",
    photoUrl: null,
    displayOrder: 17
  },
  {
    id: "teacher-18",
    name: "Guru 18",
    photoUrl: null,
    displayOrder: 18
  },
  {
    id: "teacher-19",
    name: "Guru 19",
    photoUrl: null,
    displayOrder: 19
  },
  {
    id: "teacher-20",
    name: "Guru 20",
    photoUrl: null,
    displayOrder: 20
  },
  {
    id: "teacher-21",
    name: "Guru 21",
    photoUrl: null,
    displayOrder: 21
  }
];
