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
});
