import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // loadEnv (no process.env) porque Vite todavia no parseo el .env cuando
  // este archivo se evalua. Necesario para exponer el front por un tunel
  // (ngrok/cloudflared) al probar el flujo de suscripcion con webhooks
  // reales de Mercado Pago.
  const env = loadEnv(mode, process.cwd(), '')
  const tunnelHosts = (env.VITE_DEV_ALLOWED_HOSTS ?? '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      allowedHosts: tunnelHosts,
      proxy: {
        '/api': {
          target: env.VITE_DEV_API_TARGET || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  }
})
