import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_TITLE: env.VITE_TITLE,
            VITE_KEYWORDS: env.VITE_KEYWORDS,
            VITE_DESCRIPTION: env.VITE_DESCRIPTION,
            VITE_FAVICON: env.VITE_FAVICON,
            VITE_ICON_LIBRARY: env.VITE_ICON_LIBRARY,
            VITE_FONT_LIBRARY: env.VITE_FONT_LIBRARY,
          },
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      copyPublicDir: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      port: 3000,
    },
  };
});