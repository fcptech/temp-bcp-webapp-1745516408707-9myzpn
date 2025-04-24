import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/widget/',
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/Widget.tsx'),
      name: 'VestivaWidget',
      formats: ['umd'],
      fileName: () => 'widget.bundle.js'
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'chart.js',
        'i18next',
        'i18next-browser-languagedetector',
        'react-i18next',
        'react-router-dom',
        'zod',
        'axios'
      ],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'chart.js': 'Chart',
          'i18next': 'i18next',
          'i18next-browser-languagedetector': 'i18nextBrowserLanguageDetector',
          'react-i18next': 'ReactI18next',
          'react-router-dom': 'ReactRouterDOM',
          'zod': 'Zod',
          'axios': 'axios'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'widget.css';
          return assetInfo.name;
        }
      }
    },
    minify: false,
    target: 'es2015',
    outDir: 'dist/widget',
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.VITE_API_URL': JSON.stringify('https://api.vestiva.com'),
      'process.env.VITE_ENVIRONMENT': JSON.stringify('production')
    }
  }
});