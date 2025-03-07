import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteCompression({ algorithm: "brotliCompress" }), viteCompression({ algorithm: "gzip" })],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            "@": path.resolve(__dirname, "./src"),
        },
    },
    optimizeDeps: {
        exclude: ["react-toastify"],
    },
    build: {
        minify: "esbuild",
        target: "esnext", 
        cssCodeSplit: true, 
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return "vendor"; // Separate vendor files
                    }
                },
            },
        },
    },
});
