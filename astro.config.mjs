// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import { VitePWA } from 'vite-plugin-pwa';
import { pwaIntegration } from './integrations/pwa.mjs';

export default defineConfig({
  site: 'https://ahmedalshair.net',
  base: '/pure-athkar',

  integrations: [svelte(), sitemap(), pwaIntegration()],

  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: null,
        strategies: 'generateSW',
        manifest: {
          id: '/pure-athkar/',
          name: 'Pure Athkar',
          short_name: 'Pure Athkar',
          description: 'Daily Muslim Remembrance and Supplications',

          display: 'standalone',
          display_override: ['standalone'],

          start_url: '/pure-athkar/',
          scope: '/pure-athkar/',

          theme_color: '#196850',
          background_color: '#ffffff',

          icons: [
            {
              src: '/pure-athkar/assets/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pure-athkar/assets/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pure-athkar/assets/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
  },
});
