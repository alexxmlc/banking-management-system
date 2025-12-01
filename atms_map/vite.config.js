import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5174,
        proxy: {
            '/atms': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false,
            },
            '/auth': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false,
            },
            // Same for /accounts
            '/accounts': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false,
            },
            // Same for /user
            '/user': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
