import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
 plugins:[react(), tailwindcss()],
 assetsInclude:[/\.dat$/, /\.wasm$/, /\.so$/, /\.la$/],
 worker:{format:'es'},
 build:{target:'esnext',minify:false},
 optimizeDeps:{exclude:['@php-wasm/web-8-3'],include:['@php-wasm/universal']}
});
