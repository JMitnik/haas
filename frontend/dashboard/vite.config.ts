import { defineConfig, loadEnv } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  let env = loadEnv(mode, process.cwd(), "VITE");

  // Populate NODE_ENV with mode
  env.NODE_ENV = mode;

  const envWithProcessPrefix = {
    "process.env": `${JSON.stringify(env)}`,
  };

  return {
    // Make `env` the environment variables
    define: envWithProcessPrefix,
    server: {
      port: 3002
    },
    build: {
      outDir: 'build',
    },
    logLevel: 'info',
    plugins: [tsconfigPaths(), reactRefresh(), svgr()],
  }
});
