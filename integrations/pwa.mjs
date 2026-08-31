// @ts-check
/**
 * Custom Astro integration for PWA service worker generation.
 *
 * Rationale: vite-plugin-pwa hooks into Vite's `closeBundle`, but Astro 7
 * runs two separate Vite builds internally (client + server), and the hook
 * fires at the wrong time — meaning Workbox's generateSW never runs.
 * @vite-pwa/astro does not support Astro 7 yet.
 *
 * This integration directly calls workbox-build's generateSW in the
 * `astro:build:done` hook, which runs after all static pages are written.
 */

import { generateSW } from 'workbox-build';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @returns {import('astro').AstroIntegration} */
export function pwaIntegration() {
  return {
    name: 'custom-pwa',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        // Correctly handle file:// URL across all OS environments
        const distDir = fileURLToPath(dir);

        logger.info('Generating service worker with Workbox...');

        try {
          const { count, size, warnings } = await generateSW({
            swDest: path.join(distDir, 'sw.js'),
            globDirectory: distDir,
            globPatterns: ['**/*.{js,css,html,webmanifest,png,svg,ico,woff2}'],
            globIgnores: ['sw.js', 'workbox-*.js'],

            navigateFallback: '/pure-athkar/',
            navigateFallbackDenylist: [/sitemap/, /robots\.txt/],

            cleanupOutdatedCaches: true,
            skipWaiting: true,
            clientsClaim: true,
          });

          if (warnings.length > 0) {
            warnings.forEach((w) => logger.warn(w));
          }

          logger.info(
            `Service worker generated: ${count} files precached (${(size / 1024).toFixed(1)} KB).`,
          );
        } catch (err) {
          logger.error('Failed to generate service worker:');
          logger.error(String(err));
          throw err;
        }
      },
    },
  };
}
