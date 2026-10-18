# 测试

`vp test` 使用 [Vitest](https://vitest.dev) 运行测试。

Vite+ 依赖 Vitest `5.0.5`，它要求 Node `^22.18.0 || ^24.11.0 || >=26.0.0`。对于已有项目，请在更新依赖之前先按照[升级到 Vitest 5](/guide/vitest-v5)操作。

`vp test` 会先从 `vite-plus` 的依赖中解析 Vitest，然后再从你的项目中解析。

## 概述

`vp test` 构建在 [Vitest](https://vitest.dev/) 之上，因此你得到的是一个 Vite 原生的测试运行器：它复用你的 Vite 配置与插件，支持 Jest 风格的断言、快照与覆盖率，并能干净地处理现代 ESM、TypeScript 与 JSX 项目。

Vitest 的 API 可从 `vite-plus/test` 获取，因此只需安装一次 `vite-plus` 就够了 —— 你不需要单独安装 `vitest`：

**src/example.test.ts**

```ts
import { describe, expect, it, vi } from 'vite-plus/test';
```

关于浏览器模式子路径（`vite-plus/test/browser*`），请参阅[迁移 Vitest](/guide/migrate)。

> [!NOTE]
> `vp test` 始终运行内置的 Vitest 命令。如果你的项目在 `package.json` 中也有 `test` 脚本，想改为运行该脚本时请使用 `vp run test`。参见[内置命令与脚本](/guide/run)。

## 用法

```bash
vp test
vp test watch
vp test run --coverage
```

> [!NOTE]
> 与单独使用 Vitest 不同，`vp test` 默认不会停留在监听模式。需要一次常规的测试运行时使用 `vp test`，需要进入监听模式时使用 `vp test watch`。

## 配置

将测试配置直接放在 `vite.config.ts` 的 `test` 块中，这样所有配置都集中在一处。在 Vite+ 中我们不建议使用 `vitest.config.ts`。

**vite.config.ts**

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

完整的 Vitest 配置参考请参阅 [Vitest 配置文档](https://vitest.dev/config/)。
