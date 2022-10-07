import { resolve } from "path";
import Unocss from "unocss/vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";
import UnocssConfig from "./unocss.config";
import commonjs from "rollup-plugin-commonjs";
import externalGlobals from "rollup-plugin-external-globals";

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    Unocss({
      mode: "vue-scoped",
      ...UnocssConfig
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/"),
      api: resolve(__dirname, "src/api"),
      store: resolve(__dirname, "src/store"),
      utils: resolve(__dirname, "src/utils"),
    },
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      external: ['vue', 'vue-router', 'element-plus', 'vue-demi', 'pinia', 'lottie-web', 'plyr', 'axios'],
      plugins: [
        commonjs(),
        externalGlobals({
          vue: 'Vue',
          'plyr': 'Plyr',
          'axios': 'axios',
          'pinia': "Pinia",
          'vue-demi': 'VueDemi',
          'lottie-web': 'lottie',
          'vue-router': 'VueRouter',
          'element-plus': 'ElementPlus'
        }),
      ],
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    open: true,
    host: true
  }
});