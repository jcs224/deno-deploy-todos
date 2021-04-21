import vue from '@vitejs/plugin-vue'

export default ({ command }) => ({
  plugins: [
    vue()
  ],
  base: command === 'serve' ? '' : '/',
  build: {
      manifest: true,
      outDir: 'public',
      rollupOptions: {
          input: 'frontend/app.js',
      },
  },
});