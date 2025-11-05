import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
          },
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
          },
        ],
        // 👇 Ignore known ad/network URLs to reduce console errors
        navigateFallbackDenylist: [
          /pagead\//,
          /adsbygoogle\.js/,
          /doubleclick\.net/,
          /adservice\.google\.com/,
          /adtrafficquality\.google/,
        ],
        // Reduce workbox logging
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: true // Enable in development for testing
      },
      manifest: {
        name: 'YugalMeet',
        short_name: 'YugalMeet',
        description: 'Connect and meet with your community easily 🌐',
        theme_color: '#ffffff',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        icon: 'src/assets/logo.png', // Add your app icon path here
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'https://backend-vauju-1.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('➡️ Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Response from Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
    historyApiFallback: true, // fixes /@:username 404 issue
  },

  build: {
    rollupOptions: {},
  },
});