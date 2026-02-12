import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: './vitest.setup.ts',
        alias: {
            '@': path.resolve(__dirname, './'),
        },
        deps: {
            inline: ['calculateAge', 'formatDateFr'], // Maybe correct if vitest complains about ES modules
        },
        // Exclude e2e tests if they exist
        exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'],
    },
})
