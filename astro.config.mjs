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
          name: 'أذكار',
          short_name: 'أذكار',
          description: 'أذكار وأدعية المسلم اليومية',

          display: 'standalone',
          display_override: ['standalone', 'fullscreen'],

          start_url: '/pure-athkar/',
          scope: '/pure-athkar/',

          theme_color: '#196850',
          background_color: '#ffffff',
          lang: 'ar',
          dir: 'rtl',

          icons: [
            {
              src: '/pure-athkar/assets/icons/maskable_icon_x48.png',
              sizes: '48x48',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/pure-athkar/assets/icons/maskable_icon_x72.png',
              sizes: '72x72',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/pure-athkar/assets/icons/maskable_icon_x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/pure-athkar/assets/icons/maskable_icon_x128.png',
              sizes: '128x128',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/pure-athkar/assets/icons/maskable_icon_x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/pure-athkar/assets/icons/maskable_icon_x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/pure-athkar/assets/icons/maskable_icon_x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/pure-athkar/assets/icons/maskable_icon.png',
              sizes: '1024x1024',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],

          screenshots: [
            {
              src: '/pure-athkar/assets/screenshots/screenshot-light-wide-2880x1508.webp',
              sizes: '2880x1508',
              type: 'image/webp',
              form_factor: 'wide',
              label: 'أذكار المسلم اليومية بتصميم بسيط وخال من المشتتات',
            },
            {
              src: '/pure-athkar/assets/screenshots/screenshot-dark-wide-2880x1502.webp',
              sizes: '2880x1502',
              type: 'image/webp',
              form_factor: 'wide',
              label: 'أذكار المسلم اليومية بتصميم بسيط وخال من المشتتات',
            },
            {
              src: '/pure-athkar/assets/screenshots/screenshot-light-narrow-591x1280.webp',
              sizes: '591x1280',
              type: 'image/webp',
              form_factor: 'narrow',
              label: 'أذكار المسلم اليومية بتصميم بسيط وخال من المشتتات',
            },
            {
              src: '/pure-athkar/assets/screenshots/screenshot-dark-narrow-591x1280.webp',
              sizes: '591x1280',
              type: 'image/webp',
              form_factor: 'narrow',
              label: 'أذكار المسلم اليومية بتصميم بسيط وخال من المشتتات',
            },
          ],
        },
      }),
    ],
  },
});
