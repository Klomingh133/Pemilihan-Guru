import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'photos/*.png', 'photos/*.jpg'],
      manifest: {
        name: 'Pemilihan Guru Favorit Hari Guru',
        short_name: 'Guru Favorit',
        description: 'Aplikasi Pemilihan Guru Favorit Hari Guru - Offline & Local-First',
        theme_color: '#026fc7',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      }
    })
  ],
  server: {
    port: 3000,
    host: true
  }
});
