// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 3000,
//     open: true
//   },
//   // Add these for Vercel deployment
//   build: {
//     outDir: 'dist',
//     sourcemap: false,
//     rollupOptions: {
//       output: {
//         manualChunks: undefined
//       }
//     }
//   },
//   base: '/' // Important for Vercel
// })






import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Sitemap } from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://vumatanzania.or.tz',
      routes: [
        '/',
        '/login',
        '/signup'
      ]
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  base: '/'
})