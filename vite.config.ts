import { defineConfig } from "vite";
// @ts-expect-error: Возможно, нет типов
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        handlebars({
            partialDirectory: "public/templates/partials",
        }),
    ],
    resolve: {
        alias: {
            crypto: "crypto-browserify",
        },
    },
    define: {
        global: "window",
        "process.env": {},
    },
    assetsInclude: ["**/*.hbs"],
    build: {
        outDir: "dist",
    },
});
