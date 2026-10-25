# 🏆 Pemilihan Guru Favorit Hari Guru

Aplikasi web modern, ringan, dan **Local-First** untuk pemilihan "Guru Favorit" dalam rangka memperingati Hari Guru. Dirancang khusus untuk skenario **satu laptop bergantian** yang digunakan oleh 350–500 siswa tanpa ketergantungan koneksi internet dan tanpa server database online.

---

## 📋 Daftar Isi
1. [Konsep & Arsitektur Utama](#-konsep--arsitektur-utama)
2. [Fitur Unggulan](#-fitur-unggulan)
3. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
4. [Instalasi & Menjalankan Aplikasi](#-instalasi--menjalankan-aplikasi)
5. [Instruksi Penggantian Nama Guru](#-instruksi-penggantian-nama-guru)
6. [Instruksi Penggantian Foto Guru](#-instruksi-penggantian-foto-guru)
7. [Instruksi Mengganti PIN Admin](#-instruksi-mengganti-pin-admin)
8. [Panduan Pengoperasian Hari-H](#-panduan-pengoperasian-hari-h)
   - [Membuka Panel Admin](#1-membuka-panel-admin)
   - [Alur Siswa Memilih](#2-alur-siswa-memilih)
   - [Mengakhiri & Mengunci Voting](#3-mengakhiri--mengunci-voting)
   - [Menampilkan Layar Hasil ala Kahoot di Proyektor](#4-menampilkan-layar-hasil-ala-kahoot-di-proyektor)
   - [Reset / Memulai Voting Baru](#5-reset--memulai-voting-baru)
9. [Menjalankan Pengujian Otomatis (Testing)](#-menjalankan-pengujian-otomatis-testing)

---

## 💡 Konsep & Arsitektur Utama

### 1. Mengapa Database Online Tidak Diperlukan?
Seluruh 350–500 siswa menggunakan **satu laptop fisik yang sama** milik panitia secara bergantian. Penggunaan database online (seperti MySQL, Firebase, atau Supabase) justru menambah risiko kegagalan teknis di sekolah seperti:
- Masalah koneksi Wi-Fi yang lambat atau terputus mendadak.
- Kebutuhan kuota internet atau hotspot.
- Ketergantungan server pihak ketiga dan latency API.
Dengan sistem lokal, seluruh proses berjalan 100% instan (sub-milidetik per suara) dan bebas biaya infrastruktur.

### 2. Mengapa IndexedDB Digunakan (Bukan localStorage)?
- **Kapasitas Besar & Andal**: `localStorage` memiliki batasan ketat (~5MB berupa string) dan memblokir thread JavaScript (sinkron). Sebaliknya, **IndexedDB** adalah basis data transaksional asinkron berkekuatan tinggi di dalam browser yang mampu menyimpan ribuan data terstruktur tanpa membebani memori laptop.
- **Transaksi Atomik (ACID-like)**: Penyimpanan suara menggunakan transaksi `readwrite`. Jika terjadi kegagalan sistem di tengah proses, integritas database tetap terjaga.
- **Tahan Refresh & Tahan Crash**: Data yang telah masuk tersimpan permanen di penyimpanan browser laptop dan tidak akan hilang meskipun halaman direfresh atau browser tertutup.

### 3. Bagaimana 350–500 Suara Disimpan?
Setiap kali siswa menekan **"Kirim Pilihan"**:
1. Sistem membuka transaksi IndexedDB pada object store `votes`.
2. Sistem memverifikasi status voting (`votingStatus !== 'LOCKED'`).
3. Suara baru ditambahkan dengan skema:
   ```ts
   {
     id: "uuid-otomatis",
     teacherId: "teacher-01",
     createdAt: "2026-10-23T04:00:00.000Z",
     eventName: "Pemilihan Guru Favorit Hari Guru"
   }
   ```
4. Indeks `teacherId` dan `createdAt` memungkinkan pencarian dan agregasi berlangsung instan.

### 4. Bagaimana Siswa Berikutnya Dapat Memilih?
Setelah satu suara sukses dicatat:
1. Tombol langsung dinonaktifkan untuk mencegah klik ganda (*double-click*).
2. Muncul notifikasi terima kasih selama 2.5 detik.
3. Seluruh state lokal siswa (`selectedTeacher`) **dikosongkan secara menyeluruh**.
4. Aplikasi otomatis kembali ke Halaman Awal (*Welcome Screen*).
5. Siswa berikutnya langsung maju dan tidak dapat melihat apa pun yang dipilih siswa sebelumnya.
6. Tersedia pula **timeout otomatis 3 menit** jika siswa meninggalkan laptop tanpa menyelesaikan pemilihan.

### 5. Bagaimana Hasil Ditampilkan Setelah Voting Selesai?
Ketika panitia menekan tombol **"Selesai Voting"** di panel admin:
1. Sistem meminta konfirmasi *"Apakah seluruh siswa sudah memberikan suara?"*.
2. Status diubah menjadi `LOCKED`, sehingga suara baru akan ditolak.
3. Panitia diarahkan ke **Halaman Hasil Penuh ala Kahoot**:
   - Peringkat 3 diungkap terlebih dahulu (Perunggu).
   - Peringkat 2 diungkap berikutnya (Perak).
   - Peringkat 1 diungkap dengan efek *spotlight* dan confetti (Emas).
   - Podium juara dan klasemen lengkap seluruh 21 guru (termasuk guru dengan 0 suara).
   - Jika terdapat perolehan suara tertinggi yang kembar/sama, sistem otomatis menetapkan status **"Hasil Seri (Juara Bersama)"** tanpa memilih acak.

---

## ✨ Fitur Unggulan

- 🎯 **Tepat 21 Slot Guru**: Dikonfigurasi 12 slot berfoto dan 9 slot tanpa foto (dilengkapi placeholder profesional).
- 🛡️ **Bebas Curang / Privasi Tinggi**: Siswa tidak dapat melihat perolehan suara sementara maupun peringkat saat voting berlangsung.
- ⚡ **Offline & PWA Ready**: Service Worker terpasang otomatis untuk caching aset foto dan kode program.
- 📺 **Kahoot-Style Celebration**: Tampilan animasi panggung perayaan proyektor dengan podium 1, 2, 3 dan confetti.
- ⏱️ **Auto Inactivity Timeout**: Reset otomatis setelah 3 menit tidak ada interaksi di laptop.
- 📊 **Panel Admin Terproteksi PIN**: Dilengkapi tombol kunci voting, monitoring perolehan suara real-time, ekspor CSV, dan tombol reset 2 langkah.

---

## 🛠️ Teknologi yang Digunakan

- **React 19 & TypeScript**: Menjamin type-safety dan stabilitas antarmuka.
- **Vite 6**: Bundler ultra-cepat dengan optimasi produksi yang ringan.
- **Tailwind CSS**: Desain elegan, responsif, ramah layar proyektor sekolah.
- **IndexedDB**: Penyimpanan lokal transaksional database `teacher-favorite-voting`.
- **Vite PWA (Workbox)**: Dukungan offline penuh setelah halaman pertama kali dimuat.
- **Canvas-Confetti**: Animasi perayaan kemenangan juara 1 yang ringan.
- **Vitest & React Testing Library**: Pengujian otomatis 16 skenario wajib.

---

## 🚀 Instalasi & Menjalankan Aplikasi

Pastikan laptop Anda telah terpasang **Node.js** (versi 18+).

### 1. Masuk ke Direktori Proyek
Buka terminal (Command Prompt / PowerShell / Terminal) di folder aplikasi:
```bash
cd "d:\!1 website pemilihan guru"
```

### 2. Pasang Dependencies (Jika Baru Pertama Kali)
```bash
npm install
```

### 3. Menjalankan Aplikasi untuk Hari-H (Mode Development)
Jalankan server lokal:
```bash
npm run dev
```
Aplikasi akan aktif di:
👉 **`http://localhost:3000`** atau port yang tampil di terminal.

### 4. Menjalankan Mode Produksi (Opsional - Performa Maksimal)
```bash
npm run build
npm run preview
```

---

## ✏️ Instruksi Penggantian Nama Guru

Seluruh daftar nama guru dikelola terpusat pada satu file:
📄 **`src/config/teachers.ts`**

Contoh isi:
```ts
export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "teacher-01",
    name: "Bpk. Budi Santoso, S.Pd", // <- Ganti nama di sini
    photoUrl: "/photos/teacher-01.png",
    displayOrder: 1,
    subject: "Matematika"
  },
  {
    id: "teacher-13",
    name: "Ibu Siti Rahmawati, M.Pd", // <- Guru tanpa foto
    photoUrl: null,
    displayOrder: 13,
    subject: "Informatika"
  }
  // ... hingga 21 guru
];
```
Simpan file tersebut. Perubahan akan langsung tercermin di layar.

---

## 📸 Instruksi Penggantian Foto Guru

1. Letakkan file foto guru di dalam folder:
   📁 **`public/photos/`**
2. Gunakan format `.png`, `.jpg`, atau `.webp`.
3. Buka file **`src/config/teachers.ts`**:
   - Jika guru memiliki foto: isi `photoUrl: "/photos/nama-file-anda.png"`
   - Jika guru belum memiliki foto: isi `photoUrl: null`
4. Untuk guru dengan `photoUrl: null`, antarmuka akan secara otomatis menampilkan placeholder elegan bertuliskan:
   `"Foto belum tersedia"`

---

## 🔐 Instruksi Mengganti PIN Admin

Kode PIN panel admin dapat diganti di file:
📄 **`src/config/admin.ts`**

```ts
export const ADMIN_CONFIG = {
  ADMIN_PIN: "1234", // Ganti dengan 4-6 digit angka yang diinginkan
  SESSION_TIMEOUT_MS: 15 * 60 * 1000,
};
```
*Default PIN: `1234`.*

---

## 🎯 Panduan Pengoperasian Hari-H

### 1. Membuka Panel Admin
Ada 2 cara mudah bagi panitia untuk mengakses panel admin:
- **Cara 1 (Tombol Tersembunyi)**: Di bagian paling bawah halaman awal siswa (*welcome screen*) atau di bilah atas halaman pemilihan, klik teks/tombol **"Admin" / "Panel Panitia"**.
- **Cara 2 (URL Langsung)**: Buka alamat browser dengan akhiran hash:
  `http://localhost:3000/#admin`
- Masukkan PIN: **`1234`** (atau PIN yang telah Anda ubah).

### 2. Alur Siswa Memilih
1. Siswa berdiri di depan laptop dan melihat layar awal bertuliskan *"Pemilihan Guru Favorit"*.
2. Siswa menekan tombol **"Mulai Memilih"**.
3. Siswa melihat 21 kartu calon guru dalam tampilan grid.
4. Siswa mengklik salah satu guru favoritnya (akan muncul garis biru tebal dan tanda centang).
5. Tombol **"Lanjutkan"** menjadi aktif.
6. Layar berpindah ke halaman konfirmasi *"Guru yang Anda pilih: [Nama Guru]"*.
7. Siswa menekan **"Kirim Pilihan"**.
8. Muncul pesan sukses *"Terima kasih, pilihan Anda telah berhasil dicatat."*.
9. Dalam 2.5 detik, layar kembali bersih ke halaman awal untuk siswa berikutnya.

### 3. Mengakhiri & Mengunci Voting
1. Buka **Panel Admin** (`#admin`).
2. Periksa apakah seluruh siswa telah memilih (misal: 450 suara).
3. Klik tombol oranye **"Selesai Voting (Kunci)"**.
4. Akan muncul dialog: *“Apakah seluruh siswa sudah memberikan suara?”*.
5. Klik **"Ya, Selesai & Kunci"**.
6. Status pemilihan berubah menjadi **LOCKED**. Suara baru akan ditolak jika ada yang mencoba memilih.
7. Sistem langsung mengarahkan Anda ke Halaman Hasil Pemenang.

### 4. Menampilkan Layar Hasil ala Kahoot di Proyektor
1. Hubungkan kabel HDMI laptop ke proyektor aula/kelas.
2. Di halaman hasil, klik ikon **Layar Penuh (Maximize)** di kanan atas untuk tampilan sinematik.
3. Animasi pengumuman bertahap akan berjalan otomatis:
   - Pengenalan & Total Suara.
   - Peringkat 3 (Podium Perunggu).
   - Peringkat 2 (Podium Perak).
   - Peringkat 1 (Podium Emas) dengan samburan confetti kembang api.
   - Pemenang utama ditampilkan paling besar.
   - Klasemen lengkap 21 guru dengan progress bar perolehan suara.
4. Jika ingin langsung melihat hasil tanpa menunggu animasi, klik tombol **"Lewati Animasi"**.
5. Untuk memutar ulang presentasi kepada hadirin, klik **"Putar Ulang Animasi"**.

### 5. Reset / Memulai Voting Baru
Jika ingin membersihkan seluruh data untuk acara periode berikutnya:
1. Masuk ke **Panel Admin**.
2. Klik tombol merah **"Ulangi Voting"**.
3. Sistem menampilkan dialog konfirmasi aman untuk mengulang voting dan menghapus perolehan suara.
4. Klik **"Ya, Hapus & Mulai Baru"**. Seluruh suara di IndexedDB akan dikosongkan dan status dibuka kembali menjadi `ACTIVE` untuk pemungutan suara baru.

---

## 🧪 Menjalankan Pengujian Otomatis (Testing)

Proyek ini telah dilengkapi dengan 18 suite unit & integration test menggunakan Vitest:
```bash
npm test
```
Hasil pengujian mencakup:
- ✅ Siswa dapat memilih satu guru
- ✅ Tombol Pilih dinonaktifkan sebelum memilih
- ✅ Siswa dapat kembali dari halaman konfirmasi
- ✅ Pencegahan double-click pengiriman suara
- ✅ State siswa dikosongkan setelah submit
- ✅ Siswa berikutnya dapat memilih tanpa melihat pilihan sebelumnya
- ✅ Refresh browser tidak menghapus suara tersimpan
- ✅ Uji kapasitas 350+ suara di IndexedDB
- ✅ Perhitungan pemenang utama dan persentase akurat
- ✅ Penanganan hasil seri (juara bersama tanpa randomisasi)
- ✅ Guru tanpa foto tetap tampil dengan placeholder resmi
- ✅ Guru dengan 0 suara tetap tampil di leaderboard
- ✅ Penguncian voting (status LOCKED) menolak suara baru
- ✅ Tombol reset dengan konfirmasi modal instan
- ✅ Tombol "Lewati Animasi" menampilkan hasil langsung tanpa mengubah skor
- ✅ Tampilan loading "Tunggu..." dan animasi sukses "Terkirim"
- ✅ Podium juara 1, 2, dan 3 masing-masing berdiri sendiri secara proporsional
- ✅ Transisi mulus antar sesi siswa pemilih berikutnya
