import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
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
            },

            '/register': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false,
            },

            '/documents': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false,
            },

            
        },
    }
})
