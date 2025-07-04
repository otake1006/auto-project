import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        allowedHosts: ['.ngrok-free.app'],
    },
    define: {
        'import.meta.env.RENDER_GIT_COMMIT': JSON.stringify(process.env.RENDER_GIT_COMMIT || 'dev'),
    },
});
