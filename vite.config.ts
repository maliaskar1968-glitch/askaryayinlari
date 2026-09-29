import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2020',
      minify: 'esbuild' as const,
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-icons': ['lucide-react'],
            'vendor-motion': ['motion'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
<<<<<<< HEAD
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/.tmp.driveupload/**', '**/dist/**', '**/visitor_stats.json'],
      },
=======
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
>>>>>>> a2502d1935ee43419e3b8e6f3866f6340b3b7c25
    },
  };
});
