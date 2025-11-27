import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5174, // Different port from front_banking (5173)
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
            // Add other endpoints as needed
        }
    }
})