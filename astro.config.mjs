// @ts-check
import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      include: ['**/*.tsx', '**/*.jsx']
    }),
    AstroPWA({
      manifest: {
        name: 'Terminal POS',
        short_name: 'POS',
        theme_color: '#ffffff',
        icons: [],
        display: 'standalone',
        start_url: '/'
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
    }
  }
});
