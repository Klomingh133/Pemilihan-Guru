export const EVENT_CONFIG = {
  title: "Pemilihan Guru Favorit",
  subtitle: "Dalam rangka memperingati Hari Guru",
  instructions: "Pilih satu guru favorit Anda, kemudian tekan Lanjutkan.",
  successMessage: "Terima kasih, pilihan Anda telah berhasil dicatat.",
  eventName: "Pemilihan Guru Favorit Hari Guru",
  
  // Timeout inaktivitas siswa: 3 menit (180.000 ms)
  studentInactivityTimeoutMs: 3 * 60 * 1000,
  
  // Waktu tampil pop-up sukses sebelum kembali otomatis ke halaman pemilihan guru (1.5 detik)
  successRedirectDelayMs: 1500,
  
  // Database name
  dbName: "teacher-favorite-voting",
  dbVersion: 1
};
