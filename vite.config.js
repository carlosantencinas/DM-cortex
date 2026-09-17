import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANTE: cambiá "nombre-del-repo" por el nombre real de tu repositorio
// de GitHub. GitHub Pages sirve el sitio en /<usuario>.github.io/<repo>/,
// así que Vite necesita saber ese "base path" para que los assets carguen bien.
export default defineConfig({
  plugins: [react()],
  base: '/DM-cortex/',
});
