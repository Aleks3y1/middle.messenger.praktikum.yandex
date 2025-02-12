import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import NodePolyfills from "vite-plugin-node-polyfills";

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        NodePolyfills(),
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
