# 快速上手

Vite+ 是 Web 开发的统一工具链与统一入口：通过把 [Vite](https://vite.dev/)、[Vitest](https://vitest.dev/)、[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)、[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)、[Rolldown](https://rolldown.rs/)、[tsdown](https://tsdown.dev/) 与 [Vite Task](https://github.com/voidzero-dev/vite-task) 组合在一起，在同一个地方管理你的运行时、包管理器与前端工具链。

Vite+ 以两部分交付：**`vp`**（全局命令行工具）与 **`vite-plus`**（安装在每个项目里的本地包）。如果你已有 Vite 项目，请使用 [`vp migrate`](/guide/migrate) 把它迁移到 Vite+，或把我们的[迁移提示](/guide/migrate#migration-prompt)粘贴给你的编程代理。

## 安装 `vp`

### macOS / Linux

```bash
curl -fsSL https://vite.plus | bash
```

### Windows

```powershell
irm https://vite.plus/ps1 | iex
```

也可以直接下载并运行 [`vp-setup.exe`](https://setup.viteplus.dev)。

> 💡 **提示 —— SmartScreen 警告**：该 `vp-setup.exe` 尚未签名。浏览器下载时可能会给出提示，请按 **“…”** → **“保留”** → **“仍然保留”** 继续。若 Windows Defender SmartScreen 在运行时拦截，请点击 **“更多信息”** → **“仍要运行”**。

安装完成后，打开新的终端并运行：

```bash
vp help
```

> ℹ️ **注意**：Vite+ 会接管你的全局 Node.js 运行时与包管理器。如果你想退出该行为，运行 `vp env off`。如果发现 Vite+ 不适合你，可以输入 `vp implode`，但请先[把你的反馈告诉我们](https://discord.gg/cAnsqHh5PX)。

> 📌 **哪些平台支持？** 预构建二进制已针对以下平台发布（按 [Node.js v24 平台支持级别](https://github.com/nodejs/node/blob/v24.x/BUILDING.md#platform-list)分组）：
>
> - **Level 1**：Linux x64 glibc、Linux arm64 glibc、Windows x64、macOS x64、macOS arm64
> - **Level 2**：Windows arm64
> - **实验性**：Linux x64 musl
> - **其他**：Linux arm64 musl
>
> 如果你的平台没有预构建二进制，安装将报错。在 Alpine Linux（musl）上，必须先安装 `libstdc++`：
>
> ```bash
> apk add libstdc++
> ```
>
> 这是因为受管的 Node.js 运行时（[unofficial-builds](https://unofficial-builds.nodejs.org/)）依赖 GNU C++ 标准库。

## 快速开始

创建项目、安装依赖，然后使用默认命令：

```bash
vp create   # 创建新项目
vp install  # 安装依赖
vp dev      # 启动开发服务器
vp check    # 格式化 + 代码检查 + 类型检查
vp test     # 运行 JavaScript 测试
vp build    # 生产构建
```

你也可以直接运行 `vp` 本身，使用交互式命令行。

## 核心命令

Vite+ 可以处理完整的本地前端开发周期：从启动项目、开发、检查与测试，到生产构建。

### 启动（Start）

- [`vp create`](/guide/create) 创建新的应用、包与 monorepo
- [`vp migrate`](/guide/migrate) 把现有项目迁移到 Vite+
- [`vp config`](/guide/ci) 安装 Git 钩子分发器并配置代理集成
- [`vp hooks`](/guide/ci) 管理 Git 钩子分发器（`enable`、`disable`、`status`）
- [`vp staged`](/guide/ci) 对暂存文件执行检查
- [`vp install`](/guide/install) 用正确的包管理器安装依赖
- [`vp env`](/guide/env) 管理 Node.js 版本

### 开发（Develop）

- [`vp dev`](/guide/dev) 启动由 Vite 驱动的开发服务器
- [`vp check`](/guide/check) 一次性运行格式化、代码检查与类型检查
- [`vp lint`](/guide/check)、[`vp fmt`](/guide/check) 与 [`vp test`](/guide/test) 让你直接运行这些工具

### 执行（Execute）

- [`vp run`](/guide/run) 跨工作区运行任务并带缓存
- [`vp exec`](/guide/run) 运行本地项目二进制
- [`vp node`](/guide/env) 用解析到的 Vite+ 环境运行 Node.js 脚本
- [`vp dlx`](/guide/run) 无需安装，下载并运行包二进制
- [`vp cache clean`](/guide/cache) 清理任务缓存条目

### 构建（Build）

- [`vp build`](/guide/build) 构建应用
- [`vp pack`](/guide/pack) 构建库或独立产物
- [`vp preview`](/guide/build) 本地预览生产构建

### 依赖管理（Manage Dependencies）

- [`vp add`](/guide/install)、[`vp remove`](/guide/install)、[`vp update`](/guide/install)、[`vp dedupe`](/guide/install)、[`vp outdated`](/guide/install)、[`vp list`](/guide/install)、[`vp why`](/guide/install) 与 [`vp info`](/guide/install) 包装了包管理器工作流
- [`vp link`](/guide/install)、[`vp unlink`](/guide/install) 与 [`vp rebuild`](/guide/install) 覆盖本地包链接与本机模块重建
- [`vp pm <command>`](/guide/install) 直接调用其他包管理器命令

### 维护（Maintain）

- [`vp toolchain`](/guide/upgrade#show-the-toolchain) 显示当前 Vite+ 工具链中各工具版本及其关系
- [`vp upgrade`](/guide/upgrade) 更新 `vp` 安装本身
- [`vp implode`](/guide/implode) 从机器上移除 `vp` 及相关的 Vite+ 数据

::: info
Vite+ 内置了大量预定义命令，如 `vp build`、`vp test`、`vp dev`。这些命令内置且不可更改。如果你想运行 `package.json` 脚本中的命令，请使用 `vp run <command>` 或 `vpr <command>`。

[了解更多关于 `vp run` 的信息。](/guide/run)
:::
