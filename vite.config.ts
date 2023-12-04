import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(
    {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('coin-tracker')
        }
      }
    }
  )],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // devpost
  build: {
    lib: {
      entry: './src/web-comp.ce.ts',
      name: 'coin-tracker',
      // the proper extensions will be added
      fileName: 'coin-tracker'
    }
  },
  define: {
    'process.env': process.env
  }
  // second video
  // build: {
  //   rollupOptions: {
  //     output: {
  //       entryFileNames: "index.js",
  //       sourcemap: false,
  //     },
  //   },
  // },
  // first video
  // build: {
  //   cssCodeSplit: false,
  //   lib: {
  //     entry: "./src/web-comp.js",
  //     formats: ["es", "cjs"],
  //     name: "vue-web-comp",
  //     fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
  //   },
  //   sourcemap: true,
  //   target: "esnext",
  //   minify: false
  // }
});
