import { Teacher } from '../types';

/**
 * PANDUAN PENGATURAN DATA GURU:
 * ---------------------------------------------------------------------
 * 1. Anda dapat mengubah 'name' (Nama Guru) secara langsung di bawah ini.
 * 2. Anda dapat mengubah 'photoUrl':
 *    - Masukkan path foto lokal di dalam folder public, contoh: '/photos/guru-01.png'
 *    - Atau setel ke `null` jika foto belum tersedia (akan otomatis muncul placeholder profesional).
 * 3. Anda dapat mengubah 'displayOrder' untuk menentukan urutan kemunculan di layar voting.
 * 4. Tepat 21 slot guru telah dikonfigurasi (18 guru memiliki foto, 3 guru tanpa foto).
 */
export const INITIAL_TEACHERS: Teacher[] = [
  // --- 18 GURU DENGAN FOTO ---
  {
    id: "teacher-01",
    name: "Bu Ayu Miana",
    photoUrl: "/photos/guru-01.png",
    displayOrder: 1
  },
  {
    id: "teacher-02",
    name: "Pak Nova",
    photoUrl: "/photos/guru-02.png",
    displayOrder: 2
  },
  {
    id: "teacher-03",
    name: "",
    photoUrl: "/photos/guru-03.png",
    displayOrder: 3
  },
  {
    id: "teacher-04",
    name: "Pak Komang Sony",
    photoUrl: "/photos/guru-04.png",
    displayOrder: 4
  },
  {
    id: "teacher-05",
    name: "Bu Wayan Suparni",
    photoUrl: "/photos/guru-05.png",
    displayOrder: 5
  },
  {
    id: "teacher-06",
    name: "",
    photoUrl: "/photos/guru-06.png",
    displayOrder: 6
  },
  {
    id: "teacher-07",
    name: "Bu Yeyen",
    photoUrl: "/photos/guru-07.png",
    displayOrder: 7
  },
  {
    id: "teacher-08",
    name: "Bu Dian",
    photoUrl: "/photos/guru-08.png",
    displayOrder: 8
  },
  {
    id: "teacher-09",
    name: "Miss Mita",
    photoUrl: "/photos/guru-09.jpeg",
    displayOrder: 9
  },
  {
    id: "teacher-10",
    name: "",
    photoUrl: "/photos/guru-10.jpeg",
    displayOrder: 10
  },
  {
    id: "teacher-11",
    name: "Bu Tut Ayu",
    photoUrl: "/photos/guru-11.png",
    displayOrder: 11
  },
  {
    id: "teacher-12",
    name: "Mister Eret",
    photoUrl: "/photos/guru-12.png",
    displayOrder: 12
  },
  {
    id: "teacher-13",
    name: "Guru 13",
    photoUrl: "/photos/guru-13.png",
    displayOrder: 13
  },
  {
    id: "teacher-14",
    name: "Guru 14",
    photoUrl: "/photos/guru-14.png",
    displayOrder: 14
  },
  {
    id: "teacher-15",
    name: "Guru 15",
    photoUrl: "/photos/guru-15.png",
    displayOrder: 15
  },
  {
    id: "teacher-16",
    name: "Bu Eka",
    photoUrl: "/photos/guru-16.png",
    displayOrder: 16
  },
  {
    id: "teacher-17",
    name: "Bu Devi",
    photoUrl: "/photos/guru-17.png",
    displayOrder: 17
  },
  {
    id: "teacher-18",
    name: "Bu Tu Yeni",
    photoUrl: "/photos/guru-18.png",
    displayOrder: 18
  },

  // --- 3 GURU TANPA FOTO (FOTO BELUM TERSEDIA) ---
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
