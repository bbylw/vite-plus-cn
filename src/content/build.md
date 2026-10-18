# 构建

`vp build` 为生产环境构建 Vite 应用。

## 概述

`vp build` 通过 Vite+ 运行标准的 Vite 生产构建。由于它直接基于 Vite，构建流水线与配置模型都与 Vite 相同。有关 Vite 生产构建工作原理的更多信息，请参阅 [Vite 指南](https://vite.dev/guide/build)。请注意，Vite+ 使用 Vite 8 与 [Rolldown](https://rolldown.rs/) 进行构建。

> [!NOTE]
> `vp build` 始终运行内置的 Vite 生产构建。如果你的项目在 `package.json` 中也有 `build` 脚本，想改为运行该脚本时请使用 `vp run build`。参见[内置命令与脚本](/guide/run)。

## 用法

```bash
vp build
vp build --watch
vp build --sourcemap
```

## 配置

在 `vite.config.ts` 中使用标准的 Vite 配置。完整的配置参考请参阅 [Vite 配置文档](https://vite.dev/config/)。

它可用于：

- [插件](https://vite.dev/guide/using-plugins)
- [别名](https://vite.dev/config/shared-options#resolve-alias)
- [`build`](https://vite.dev/config/build-options)
- [`preview`](https://vite.dev/config/preview-options)
- [环境模式](https://vite.dev/guide/env-and-mode)

## 预览

在 `vp build` 之后，使用 `vp preview` 在本地提供生产构建产物。

```bash
vp build
vp preview
```
