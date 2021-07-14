import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  server: {
    port: 3002
  },
  logLevel: 'info',
  plugins: [tsconfigPaths(), reactRefresh(), svgr()],
})
