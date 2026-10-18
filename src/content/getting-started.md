# 快速上手

Vite+ 是 Web 开发的统一工具链与统一入口。

它将 [Vite](https://vite.dev/)、[Vitest](https://vitest.dev/)、[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)、[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)、[Rolldown](https://rolldown.rs/)、[tsdown](https://tsdown.dev/) 与 [Vite Task](https://github.com/voidzero-dev/vite-task) 整合进一个 [`vite-plus` 包](/guide/local-cli)，构成极速的前端工具链。

Vite+ 还提供[全局 `vp` CLI](/guide/global-cli)，用于管理 Node.js 与包管理器，让 Vite+ 在跨项目使用时更加方便。两个 CLI 可以独立使用，但我们建议[将它们搭配使用](/guide/global-cli)。

如果你已有 Vite 项目，请运行 [`vp migrate`](/guide/migrate) 将其迁移到 Vite+，或把我们的[迁移提示](/guide/migrate)交给你的编程代理。

使用 AI 助手进行开发？[迁移指南](/guide/migrate)提供了可复制的提示词，覆盖新建项目、迁移现有项目与升级 Vite+ 三种场景，可直接粘贴给编程代理。

## 全局安装 `vp`

下面的命令会安装全局 `vp` CLI，它负责管理 Node.js 与包管理器，并让 `vp` 在所有项目中可用。如果你只需要在单个项目中使用前端工具链，可以改为安装[项目本地 CLI](/guide/local-cli)。

### macOS / Linux

```bash
curl -fsSL https://vite.plus | bash
```

### Windows

```powershell
irm https://vite.plus/ps1 | iex
```

或者，下载并运行 [`vp-setup.exe`](https://setup.viteplus.dev)。

> [!TIP]
> **SmartScreen 警告**
> `vp-setup.exe` 尚未进行代码签名。下载时浏览器可能会显示警告。依次点击 **“...”** → **“保留”** → **“仍然保留”** 即可继续。如果 Windows Defender SmartScreen 在运行文件时将其拦截，请依次点击 **“更多信息”** → **“仍要运行”**。

安装脚本与 `vp-setup.exe` 会读取[环境变量](/guide/global-cli)，例如 `VP_VERSION` 与 `VP_HOME`。

如果你使用 Nushell 并自定义了 XDG 目录，请在安装前阅读 [Nushell 启动要求](/guide/global-cli)。

安装完成后，打开新的 shell 并运行：

```bash
vp help
```

> [!NOTE]
> Vite+ 将管理你的全局 Node.js 运行时与包管理器。如果你想退出这一行为，请运行 `vp env off`。如果你发现自己并不需要 Vite+，可以输入 `vp implode`，但请[把你的反馈告诉我们](https://discord.gg/cAnsqHh5PX)。

**使用小众平台（CPU 架构、操作系统）？**

预构建二进制文件针对以下平台分发（按 [Node.js v24 平台支持层级](https://github.com/nodejs/node/blob/v24.x/BUILDING.md#platform-list)分组）：

- Tier 1
  - Linux x64 glibc（`x86_64-unknown-linux-gnu`）
  - Linux arm64 glibc（`aarch64-unknown-linux-gnu`）
  - Windows x64（`x86_64-pc-windows-msvc`）
  - macOS x64（`x86_64-apple-darwin`）
  - macOS arm64（`aarch64-apple-darwin`）
- Tier 2
  - Windows arm64（`aarch64-pc-windows-msvc`）
- 实验性
  - Linux x64 musl（`x86_64-unknown-linux-musl`）
- 其他
  - Linux arm64 musl（`aarch64-unknown-linux-musl`）

如果你的平台没有可用的预构建二进制文件，安装会失败并报错。

在 Alpine Linux（musl）上，使用 Vite+ 之前需要安装 `libstdc++`：

```sh
apk add libstdc++
```

这是必需的，因为受管的 [unofficial-builds](https://unofficial-builds.nodejs.org/) Node.js 运行时依赖 GNU C++ 标准库。

## 快速开始

安装全局 CLI 之后，创建项目、安装依赖并使用默认命令：

```bash
vp create  # 创建新项目
vp install # 安装依赖
vp dev     # 启动开发服务器
vp check   # 格式化、代码检查、类型检查
vp test    # 运行 JavaScript 测试
vp build   # 生产构建
```

你也可以单独运行 `vp` 打开交互式命令行。在仅使用项目本地 CLI 的配置中，请通过包管理器运行相同的命令，例如 `pnpm exec vp check`。

## 核心命令

Vite+ 覆盖完整的前端开发周期，从启动项目开始，贯穿开发、检查、测试与生产构建。大多数命令在两种分发形式中都可用；机器级的环境命令与自管理命令需要全局 CLI。

### 设置项目

- [`vp create`](/guide/create) 创建新的应用、包与 monorepo。
- [`vp migrate`](/guide/migrate) 将现有项目迁移到 Vite+。
- [`vp install`](/guide/package-management) 使用正确的包管理器安装依赖。
- [`vp add`](/guide/package-management)、[`vp remove`](/guide/package-management)、[`vp update`](/guide/package-management)、[`vp dedupe`](/guide/package-management)、[`vp outdated`](/guide/package-management)、[`vp list`](/guide/package-management)、[`vp why`](/guide/package-management) 与 [`vp info`](/guide/package-management) 覆盖包管理器工作流的其余环节。
- [`vp link`](/guide/package-management)、[`vp unlink`](/guide/package-management)、[`vp rebuild`](/guide/package-management) 与 [`vp pm <command>`](/guide/package-management) 提供更底层的包管理器操作。

### 项目工具链

- [`vp check`](/guide/check) 一次性运行格式化、代码检查与类型检查。
- [`vp lint`](/guide/lint) 与 [`vp fmt`](/guide/fmt) 直接运行单项检查。
- [`vp test`](/guide/test) 使用 Vitest 运行测试。
- [`vp dev`](/guide/dev) 启动由 Vite 驱动的开发服务器。
- [`vp build`](/guide/build) 构建应用，[`vp preview`](/guide/build) 在本地预览生产构建。
- [`vp pack`](/guide/pack) 构建库或独立产物。
- [`vp toolchain`](/guide/upgrade) 显示当前项目的工具链；使用 `--global` 可改为检查全局安装。
- [`vp run`](/guide/run) 跨工作区运行任务，并带有缓存。
- [`vp cache clean`](/guide/cache) 清理任务缓存条目。
- [`vp exec`](/guide/vpx) 运行本地项目二进制文件，[`vp dlx`](/guide/vpx) 与 [`vpx`](/guide/vpx) 下载并运行包二进制文件。
- [`vp config`](/guide/commit-hooks) 安装 Git 提交钩子分发器并配置代理集成。
- [`vp hooks`](/guide/commit-hooks) 管理 Git 提交钩子分发器，[`vp staged`](/guide/commit-hooks) 对暂存文件运行检查。
- [Monorepo 指南](/guide/monorepo)介绍多包项目的结构与命令。

### 全局 CLI

- [`vp env`](/guide/env) 管理 Node.js 与包管理器环境，[`vp node`](/guide/env) 使用解析后的环境运行脚本。
- [`vp upgrade`](/guide/upgrade) 更新全局 `vp` 安装本身。
- [`vp implode`](/guide/implode) 从你的机器上移除全局 `vp` 安装与相关的 Vite+ 数据。

### 工作流

- [IDE 集成](/guide/ide-integration)、[CI](/guide/ci) 与 [Docker](/guide/docker) 介绍常见的开发与部署环境。

### 参考

- [故障排查](/guide/troubleshooting)涵盖常见的命令、配置与集成问题。

> [!NOTE]
> Vite+ 内置了许多预定义命令，例如 `vp build`、`vp test` 与 `vp dev`。这些命令是内置的，无法更改。如果你想运行 `package.json` 脚本中的命令，请使用 `vp run <command>` 或 `vpr <command>`。
>
> [进一步了解 `vp run`。](/guide/run)
