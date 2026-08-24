import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 一个 Vite+ 配置文件同时管理 dev / build / test / lint / fmt / run / staged。
// 所有配置在类型安全的环境中共享同一份默认值。
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Vitest 配置
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },

  // Oxlint 配置（默认即可，无需独立 .oxlintrc 文件）
  lint: {
    ignorePatterns: ['dist/**'],
  },

  // Oxfmt 配置
  fmt: {
    semi: true,
    singleQuote: true,
  },
});
