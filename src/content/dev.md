# 开发服务器

`vp dev` 启动 Vite 开发服务器。

## 概述

`vp dev` 通过 Vite+ 运行标准的 Vite 开发服务器，因此你在使用与工具链其余部分相同的 CLI 入口的同时，仍能保留常规的 Vite 开发体验。有关使用与配置开发服务器的更多信息，请参阅 [Vite 指南](https://vite.dev/guide/)。

> [!NOTE]
> `vp dev` 始终运行内置的 Vite 开发服务器。如果你的项目在 `package.json` 中也有 `dev` 脚本，想改为运行该脚本时请使用 `vp run dev`。参见[内置命令与脚本](/guide/run)。

## 用法

```bash
vp dev
```

## 配置

在 `vite.config.ts` 中使用标准的 Vite 配置。完整的配置参考请参阅 [Vite 配置文档](https://vite.dev/config/)。

它可用于：

- [插件](https://vite.dev/guide/using-plugins)
- [别名](https://vite.dev/config/shared-options#resolve-alias)
- [`server`](https://vite.dev/config/server-options)
- [环境模式](https://vite.dev/guide/env-and-mode)
