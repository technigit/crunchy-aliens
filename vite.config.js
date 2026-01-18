import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@src': resolve(__dirname, 'src'),
    },
  },
});
