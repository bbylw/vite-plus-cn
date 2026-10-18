<p align="center">
  <a href="https://viteplus.dev" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./public/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="./public/logo.svg">
      <img alt="Vite+" src="./public/logo.svg" height="60">
    </picture>
  </a>
</p>

**面向 Web 的统一工具链**

_运行时与包管理、创建、开发、检查、测试、构建、打包以及 monorepo 任务缓存，全部集成在单一依赖中_

---

Vite+ 是本地 Web 开发的统一入口。它将 [Vite](https://vite.dev/)、[Vitest](https://vitest.dev/)、[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)、[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)、[Rolldown](https://rolldown.rs/)、[tsdown](https://tsdown.dev/) 以及 [Vite Task](https://github.com/voidzero-dev/vite-task) 整合进一套零配置的工具链，同时还能管理运行时与包管理器的工作流：

- **`vp env`：** 全局及按项目管理 Node.js 与包管理器
- **`vp install`：** 自动识别包管理器并安装依赖
- **`vp dev`：** 运行 Vite 快速的原生 ESM 开发服务器，支持即时 HMR
- **`vp check`：** 一条命令同时完成格式化、lint 与类型检查
- **`vp test`：** 通过内置的 Vitest 运行测试
- **`vp build`：** 使用 Vite + Rolldown 为生产环境构建应用
- **`vp run`：** 运行 `package.json` 中的脚本与 monorepo 任务，支持缓存与依赖感知调度
- **`vp pack`：** 构建用于 npm 发布的库，或打包为独立的应用二进制文件
- **`vp toolchain`：** 查看 Vite+、Vite、Rolldown、Oxc 等工具的版本
- **`vp create` / `vp migrate`：** 搭建新项目脚手架并迁移已有项目

以上全部从项目根目录进行配置，并可适配 Vite 的整个框架生态。
Vite+ 完全开源，采用 MIT 许可证。

## 快速开始

将 Vite+ 以 `vp` 命令全局安装：

适用于 Linux 或 macOS：

```bash
curl -fsSL https://vite.plus | bash
```

适用于 Windows：

```bash
irm https://viteplus.dev/install.ps1 | iex
```

`vp` 负责完整的开发生命周期，包括包管理、开发服务器、lint、格式化、测试以及生产环境构建。

## 配置 Vite+

Vite+ 可通过项目根目录下的单个 `vite.config.ts` 进行配置：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  // 面向 dev/build/preview 的标准 Vite 配置。
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
        cache: {
          env: ['ICON_THEME'],
        },
      },
    },
  },

  // `vp staged` 配置。
  staged: {
    '*': 'vp check --fix',
  },
});
```

这样你就可以把开发服务器、构建、测试、lint、格式化、任务运行器以及暂存文件工作流的配置集中在一处，并享有类型安全的配置与共享的默认值。

使用 `vp migrate` 即可迁移到 Vite+。它会将 `.oxlintrc*`、`.oxfmtrc*` 以及 lint-staged 等各工具专属的配置文件合并进 `vite.config.ts`。

### CLI 工作流（`vp help`）

#### 起步

- **create** - 基于模板创建新项目
- **migrate** - 将已有项目迁移到 Vite+
- **config** - 配置钩子与 Agent 集成
- **hooks** - 管理 Git 钩子分发器
- **staged** - 对暂存文件运行 lint
- **install** (`i`) - 安装依赖
- **env** - 管理 Node.js 与包管理器

#### 开发

- **dev** - 运行开发服务器
- **check** - 运行格式化、lint 与类型检查
- **lint** - 对代码进行 lint
- **fmt** - 格式化代码
- **test** - 运行测试

#### 执行

- **run** - 运行 monorepo 任务
- **exec** - 执行本地 `node_modules/.bin` 中的命令
- **node** - 在已解析的 Vite+ 环境中运行 Node.js 脚本
- **dlx** - 不安装为依赖即可执行某个包的可执行文件
- **cache** - 管理任务缓存

#### 构建

- **build** - 为生产环境构建
- **pack** - 构建库
- **preview** - 预览生产环境构建结果

#### 依赖管理

Vite+ 会根据 `packageManager` 与 lockfile 自动封装你的包管理器（pnpm、npm、Yarn 或 Bun）：

- **add** - 向依赖中添加包
- **remove** (`rm`, `un`, `uninstall`) - 从依赖中移除包
- **update** (`up`) - 将包更新到最新版本
- **dedupe** - 对依赖进行去重
- **outdated** - 检查过时的包
- **list** (`ls`) - 列出已安装的包
- **why** (`explain`) - 显示某个包被安装的原因
- **info** (`view`, `show`) - 查看来自注册表的包元数据
- **link** (`ln`) / **unlink** - 管理本地包链接
- **rebuild** - 重建原生模块
- **pm** - 将命令转发给包管理器

#### 维护

- **toolchain** - 显示 Vite+ 各工具版本及其关系
- **upgrade** - 将 `vp` 自身更新到最新版本
- **implode** - 移除 `vp` 及其所有相关数据

### 搭建你的第一个 Vite+ 项目

使用 `vp create` 创建新项目：

```bash
vp create
```

你也可以在某个项目内部运行 `vp create`，为该项目添加新的应用或库。

组织可以在其 npm scope 下，通过发布一个在其 `package.json` 中带有 `createConfig.templates` 清单的 `@org/create`，来公开一套精选模板。
发布后，`vp create @org` 会基于这些模板打开一个交互式选择器；而在
`vite.config.ts` 中设置 `create: { defaultTemplate: '@org' }` 即可将其作为裸命令 `vp create` 的默认模板。有关编写工作流，请参阅
[组织模板指南](https://viteplus.dev/guide/create#organization-templates)；有关配置说明，请参阅
[`create.defaultTemplate`](https://viteplus.dev/config/create)。

### 迁移已有项目

你可以将已有项目迁移到 Vite+：

```bash
vp migrate
```

### GitHub Actions

使用官方的 [`setup-vp`](https://github.com/voidzero-dev/setup-vp) action 在 GitHub Actions 中安装 Vite+：

```yaml
- uses: voidzero-dev/setup-vp@<setup-vp-version>
  with:
    node-version: '22'
    cache: true
```

请将 `<setup-vp-version>` 替换为来自 [`setup-vp` 发布页](https://github.com/voidzero-dev/setup-vp/releases) 的确切版本号。你也可以改用 commit SHA。请勿使用 `v1` 标签——该标签已不再接收更新。

请参阅 [自动版本更新](https://viteplus.dev/guide/ci#automatic-version-updates) 来配置 Dependabot 或 Renovate。

#### 手动安装与迁移

如果你要手动将某个项目迁移到 Vite+，请先安装以下开发依赖：

```bash
vp install -D vite-plus
```

添加包管理器覆盖规则，使其他包使用 Vite+ 的版本。将 `vite` 别名为 `@voidzero-dev/vite-plus-core`，并把 `<vite-plus-version>` 设为已安装的 `vite-plus` 版本。将 `vitest` 固定为 `<vitest-version>`，使用 `vp toolchain vitest` 显示的随附版本。这样项目与 `vp test` 就会使用同一份 Vitest 副本。若不固定版本，某个依赖或 workspace 包可能会安装不同版本的 Vitest，而这两个版本可能使用相互独立的 mock、`expect` 函数以及 runner 状态：

```json
"overrides": {
  "vite": "npm:@voidzero-dev/vite-plus-core@<vite-plus-version>",
  "vitest": "<vitest-version>"
}
```

如果你使用的是 `pnpm`，请将以下内容加入 `pnpm-workspace.yaml`：

```yaml
overrides:
  vite@*: npm:@voidzero-dev/vite-plus-core@<vite-plus-version> # 与已安装的 vite-plus 版本一致
  vitest@*: <vitest-version> # 与 vp toolchain vitest 显示的版本一致
```

或者，如果你使用的是 Yarn：

```json
"resolutions": {
  "vite": "npm:@voidzero-dev/vite-plus-core@<vite-plus-version>",
  "vitest": "<vitest-version>"
}
```

## 赞助商

感谢 [namespace.so](https://namespace.so) 以快速、免费的 macOS、Linux 与 Windows 运行器为我们的 CI/CD 流水线提供支持。
