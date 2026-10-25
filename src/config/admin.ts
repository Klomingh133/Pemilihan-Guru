/**
 * PANDUAN PENGATURAN KEAMANAN ADMIN:
 * ---------------------------------------------------------------------
 * Ubah ADMIN_PIN di bawah ini untuk mengganti kode akses panel panitia/admin.
 * PIN standar adalah '1234' agar mudah diingat panitia.
 */
export const ADMIN_CONFIG = {
  // PIN akses panel admin
  ADMIN_PIN: "1234",
  
  // Waktu sesi admin sebelum timeout otomatis (dalam milidetik, 15 menit)
  SESSION_TIMEOUT_MS: 15 * 60 * 1000,
};
