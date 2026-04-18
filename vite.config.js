import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Plotly 较大，不做过分压缩
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型第三方库单独分包
          'vendor-plotly': ['plotly.js-dist-min'],
          'vendor-mathjs': ['mathjs'],
          'vendor-mathlive': ['mathlive'],
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',  // 允许局域网访问
    port: 3000,
  }
});
