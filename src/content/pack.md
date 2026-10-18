# 打包库

`vp pack` 使用 [tsdown](https://tsdown.dev/guide/) 为生产环境构建库。

## 概述

`vp pack` 通过 tsdown 构建库与独立可执行文件。它适用于需要发布的包以及二进制产物。如果你想构建 Web 应用，请使用 `vp build`。`vp pack` 开箱即用地覆盖了构建库所需的一切，包括声明文件生成、多种输出格式、source map 与压缩。

有关 tsdown 工作原理的更多信息，请参阅官方 [tsdown 指南](https://tsdown.dev/guide/)。

## 用法

```bash
vp pack
vp pack src/index.ts --dts
vp pack --watch
```

## 配置

将打包配置直接放在 `vite.config.ts` 的 `pack` 块中，这样所有配置都集中在一处。在 Vite+ 中我们不建议使用 `tsdown.config.ts`。

请参阅 [tsdown 指南](https://tsdown.dev/guide/)与 [tsdown 配置文件文档](https://tsdown.dev/options/config-file)，了解如何使用与配置 `vp pack`。

它可用于：

- [声明文件（`dts`）](https://tsdown.dev/options/dts)
- [输出格式](https://tsdown.dev/options/output-format)
- [监听模式](https://tsdown.dev/options/watch-mode)
- [独立可执行文件](https://tsdown.dev/options/exe#executable)

**vite.config.ts**

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    dts: true,
    format: ['esm', 'cjs'],
    sourcemap: true,
  },
});
```

## 独立可执行文件

`vp pack` 也可以通过 tsdown 的实验性 [`exe` 选项](https://tsdown.dev/options/exe#executable)构建独立可执行文件。

当你希望把 CLI 或其他基于 Node 的工具作为原生可执行文件发布，且运行时无需单独安装 Node.js 时，可以使用此功能。

**vite.config.ts**

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/cli.ts'],
    exe: true,
  },
});
```

可执行文件支持已内置在 Vite+ 中，因此你不需要单独安装 `@tsdown/exe`。

构建可执行文件使用 Node 的[单文件可执行应用（Single Executable Applications）](https://nodejs.org/api/single-executable-applications.html)支持，并要求 Node.js 25.7.0 或更高版本。如果 `vp pack --exe` 报告版本不受支持，请使用 `vp env use 26` 切换当前运行时。

有关配置自定义文件名、内嵌资源与跨平台目标的详细信息，请参阅官方 [tsdown 可执行文件文档](https://tsdown.dev/options/exe#executable)。

## CSS 打包

`vp pack` 可以为你的入口转换并打包 CSS（包括 CSS Modules 与 [Lightning CSS](https://lightningcss.dev/) 优化）。该支持已内置在 Vite+ 中，因此你不需要单独安装 `@tsdown/css` 或 `lightningcss`，开箱即可使用。
