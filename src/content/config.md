# 配置

Vite+ 可以通过项目根目录的单个 **`vite.config.ts`** 进行配置。一个文件就把 dev / build / preview / test / lint / fmt / run / staged 的配置集中在一起，类型安全且共享默认值。

## 一个文件配置一切

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  // 用于 dev/build/preview 的标准 Vite 配置。
  plugins: [],

  // Vitest 配置。
  test: {
    include: ['src/**/*.test.ts'],
  },

  // Oxlint 配置。
  lint: {
    ignorePatterns: ['dist/**'],
  },

  // Oxfmt 配置。
  fmt: {
    semi: true,
    singleQuote: true,
  },

  // Vite Task 配置。
  run: {
    tasks: {
      'generate:icons': {
        command: 'node scripts/generate-icons.js',
        envs: ['ICON_THEME'],
      },
    },
  },

  // `vp staged` 配置。
  staged: {
    '*': 'vp check --fix',
  },
});
```

这样，你就可以在**同一处**维护开发服务器、构建、测试、代码检查、格式化、任务运行器与暂存文件工作流，并共享类型安全配置与默认值。

使用 `vp migrate` 可以迁移到 Vite+。它会把 `.oxlintrc*`、`.oxfmtrc*` 与 lint-staged 等独立工具配置文件合并到 `vite.config.ts`。

## 为 React 项目开启插件

在本站（React + vite-plus + Bun）中，配置如下所示，同时启用 React 插件与 Tailwind v4 插件：

```ts
import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },

  fmt: { semi: true, singleQuote: true },
});
```

## 配置文件的加载规则

- Vite+ 会查找 `vite.config.ts`、`vite.config.js`、`vite.config.mts` 等常见文件名。
- `defineConfig` 来自 `vite-plus`，而不是 `vite`。
- 所有选项（`test`、`lint`、`fmt`、`run`、`staged`、`create`）都是类型安全的，并带有共享默认值。

## 无需配置即可开箱即用

大多数项目不需要任何配置就能用 Vite+ 启动：`vp create`、`vp install`、`vp dev`、`vp check`、`vp test`、`vp build` 都有合理的默认值。只有当你需要定制行为时，才需要 `vite.config.ts`。
