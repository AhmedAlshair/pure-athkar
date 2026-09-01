// @ts-check
/**
 * Custom Astro integration for PWA service worker generation.
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
        const distDir = fileURLToPath(dir);

        logger.info('Generating service worker with Workbox...');

        try {
          const { count, size, warnings } = await generateSW({
            swDest: path.join(distDir, 'sw.js'),
            globDirectory: distDir,
            globPatterns: [
              '**/*.{js,css,html,webmanifest,jpg,jpeg,png,svg,ico,woff2}',
            ],
            globIgnores: ['sw.js', 'workbox-*.js'],

            // Prefix precached URLs with the base path
            modifyURLPrefix: {
              '': '/pure-athkar/',
            },

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
