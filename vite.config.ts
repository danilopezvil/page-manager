import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['iife'],
      name: 'NewTabApp',
      fileName: () => 'newtab.js'
    }
  }
});
