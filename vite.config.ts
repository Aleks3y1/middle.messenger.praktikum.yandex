import { defineConfig } from 'vite';
// @ts-ignore
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        handlebars({
            partialDirectory: 'public/templates/partials',
        }),
    ],
    assetsInclude: ['**/*.hbs'],
    build: {
        outDir: 'dist',
    },
});
