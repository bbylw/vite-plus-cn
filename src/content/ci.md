# CI / 持续集成

你可以使用 `voidzero-dev/setup-vp` 在 CI 环境中使用 Vite+。

## 概览

[`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) 为 GitHub Actions、GitLab CI/CD 和 Azure Pipelines 提供集成。这三者都会安装 Vite+、可以选择项目的 Node.js 版本，并可安装项目依赖。GitHub Action 和 Azure Pipelines 模板还可以自动缓存包管理器数据。GitLab CI/CD 使用作业原生的缓存配置，并需要 Node.js 来启动设置运行时。

## setup-vp 版本管理

将每个示例中的 `<setup-vp-version>` 设置为 [`setup-vp` 发布页](https://github.com/voidzero-dev/setup-vp/releases)中的确切版本。你也可以使用提交 SHA。不要使用 `v1` 标签。`v1` 标签不再接收更新。

运行 `vp migrate` 可将 GitHub Actions 工作流和 `.github` 下的复合操作中精确的 `voidzero-dev/setup-vp@v1` 引用替换为你的 Vite+ 版本已知的最新确切发行版。现有的确切版本和提交 SHA 保持不变。

## 安装期间的 Node.js

Vite+ 安装器默认使用仓库 [`.node-version`](https://github.com/voidzero-dev/vite-plus/blob/main/.node-version) 中固定的 Node.js 版本。每个 Vite+ 发行版在构建时内嵌该版本，依赖升级工作流会保持此固定版本最新。在支持 [`VP_SETUP_NODE_VERSION`](/guide/global-cli) 的版本中，`setup-vp` 也可以在安装时使用项目的版本。当该版本同时支持全局 CLI 及其固定的 `pnpm` 时，这样可以避免第二次下载 Node.js。

`setup-vp` 在启动安装器之前选择版本。显式的 Node.js 版本优先于版本文件输入。如果两个输入都没有提供，它会按[项目声明顺序](/guide/env)检查工作目录及其父目录。集成通过 `VP_SETUP_NODE_VERSION` 传递选择结果；安装器本身不读取项目声明。

如果没有选择结果、Node.js 管理被禁用，或所选版本不兼容，安装会使用内嵌的默认版本。旧版安装器保持其原有行为。自动项目发现不会创建会话覆盖，因此后续命令仍保留正常的基于目录的版本选择。

集成会自动处理这些安装器变量。在 GitHub Actions 和 GitLab CI/CD 中配置 `node-version` 或 `node-version-file`，在 Azure Pipelines 中配置 `nodeVersion` 或 `nodeVersionFile`。完整的输入参考请参阅 [`setup-vp` 文档](https://github.com/voidzero-dev/setup-vp#inputs)。

## GitHub Actions

GitHub Action 会设置 Vite+、所需的 Node.js 版本和包管理器。这意味着你通常不需要在工作流中单独执行 `setup-node`、包管理器设置、依赖安装或手动依赖缓存步骤。

```yaml [.github/workflows/ci.yml]
- uses: voidzero-dev/setup-vp@<setup-vp-version>
  with:
    node-version: '24'
    cache: true
- run: vp check
- run: vp test
- run: vp build
```

`setup-vp` 默认运行 `vp install`。如果你设置 `run-install: false`，请确保在运行其他命令之前添加 `vp install` 步骤。使用 `cache: true` 时，`setup-vp` 会为你自动处理依赖缓存。

> [!TIP]
> `setup-vp` 会缓存包管理器数据。要在 CI 运行之间复用 Vite 任务结果，请添加单独的 [Vite 任务的 GitHub Actions 缓存](/guide/github-actions-cache)。

## GitLab CI/CD

在你的 GitLab CI/CD 配置中使用可复用的 `setup-vp` 远程模板。将远程 URL 和 `setup-ref` 设置为相同的发行版标签或提交 SHA：

```yaml [.gitlab-ci.yml]
include:
  - remote: 'https://raw.githubusercontent.com/voidzero-dev/setup-vp/<setup-vp-version>/gitlab/setup-vp.yml'
    inputs:
      setup-ref: '<setup-vp-version>'

test:
  extends: .setup-vp
  image: node:24
  script:
    - vp check
    - vp test
    - vp build
```

GitLab CI/CD 集成与 GitHub Action 有几处不同：

- 模板需要 Node.js 来启动设置运行时。请使用 Node.js 镜像（如上所示），或以其他方式在作业中提供 Node.js。使用 `node-version` 或 `node-version-file` 可通过 `vp env use` 选择受管的项目运行时。
- 使用作业的 GitLab [`cache`](https://docs.gitlab.com/ci/yaml/#cache) 关键字配置依赖缓存。
- 使用带 Bash 以及 `curl` 或 `wget` 的类 Unix 运行器环境。

有关高级配置和完整的输入参考，请参阅 [`setup-vp` GitLab CI/CD 文档](https://github.com/voidzero-dev/setup-vp#gitlab-cicd)。

## Azure Pipelines

在你的 Azure Pipelines 配置中使用可复用的 `setup-vp` 步骤模板。创建一个名为 `github` 的 GitHub 服务连接，然后从 `setup-vp` 仓库引用模板：

```yaml [azure-pipelines.yml]
resources:
  repositories:
    - repository: setupVp
      type: github
      endpoint: github
      name: voidzero-dev/setup-vp
      ref: refs/tags/<setup-vp-version>

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self
  - template: azure/setup-vp.yml@setupVp
    parameters:
      setupRef: '<setup-vp-version>'
      nodeVersion: 24.x
      cache: true
      runInstall: true
  - script: vp check
  - script: vp test
  - script: vp build
```

将 `ref` 和 `setupRef` 固定到相同的标签或提交 SHA，以实现严格的可复现性。

Azure Pipelines 模板支持 Microsoft 托管的 Linux、macOS 和 Windows 代理。`UseNode@1` 通过 `bootstrapNodeVersion` 提供用于启动设置运行时的 Node.js。`nodeVersion` 和 `nodeVersionFile` 参数通过 `vp env use` 选择受管的项目运行时。`Cache@2` 缓存包管理器数据。

有关高级配置和完整的参数参考，请参阅 [`setup-vp` Azure Pipelines 文档](https://github.com/voidzero-dev/setup-vp#azure-pipelines)。

## 自动版本更新

Dependabot 和 Renovate 可以更新 GitHub Actions 工作流中的确切版本。

要使用 [Dependabot 版本更新](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates)，请将 `github-actions` 条目添加到 `.github/dependabot.yml`：

```yaml [.github/dependabot.yml]
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

Dependabot 每周检查 `.github/workflows` 中的 `uses:` 条目。

[Renovate 的 GitHub Actions 管理器](https://docs.renovatebot.com/modules/manager/github-actions/)默认检测 `uses:` 条目。你不需要为 `setup-vp` 配置包规则。

当你使用提交 SHA 时，请在注释中添加确切的发行版标签。Renovate 会使用该注释查找更新：

```yaml
- uses: voidzero-dev/setup-vp@<commit-sha> # <setup-vp-version>
```

这些设置仅适用于 GitHub Actions 工作流。对于 GitLab CI/CD 和 Azure Pipelines，请同时更新两个版本值。

## 简化现有工作流

如果你正在迁移现有的 GitHub Actions 工作流，通常可以用单个 `setup-vp` 步骤替换大块的 Node、包管理器和缓存设置。

#### 之前：

```yaml [.github/workflows/ci.yml]
- uses: pnpm/action-setup@v6
  with:
    version: 11

- uses: actions/setup-node@v6
  with:
    node-version: '24'
    cache: pnpm

- run: pnpm ci && pnpm dev:setup
- run: pnpm check
- run: pnpm test
```

#### 之后：

```yaml [.github/workflows/ci.yml]
- uses: voidzero-dev/setup-vp@<setup-vp-version>
  with:
    node-version: '24'
    cache: true

- run: vp run dev:setup
- run: vp check
- run: vp test
```

## 使用私有注册表的离线 CI

你可以在没有公网访问的环境下，从私有 npm 注册表（例如 Verdaccio）安装[项目本地 CLI](/guide/local-cli)。如果已经安装了 Node.js，则无需 Node.js 下载镜像。如果你还需要 `vp env`，请参阅[从私有镜像安装](/guide/global-cli#从私有镜像安装)。

在项目的 `.npmrc` 中配置注册表地址，将示例 URL 替换为你自己的地址。

```ini [.npmrc]
registry=https://npm.corp.example/
```

如果你手动镜像依赖包，可运行 `pnpm list --lockfile-only --depth Infinity --json` 列出项目锁定的依赖项。请包含开发依赖，并根据 `pnpm-lock.yaml` 中的 `os`、`cpu` 和 `libc` 字段为你的平台选择可选的原生包。

> [!TIP] 阻止包管理器下载
> 在 `vite-plus` `1.6.x` 和 `1.7.x` 版本中，运行 `vp` 前请设置 `VP_ENV_FORBIDDEN=1`，以阻止它下载项目固定的包管理器。在 PowerShell 中，请与下方命令在同一会话中设置：
>
> ```powershell
> $env:VP_ENV_FORBIDDEN = '1'
> ```
>
> 此设置会禁用 Vite+ 对 Node.js 和包管理器的管理。在这些版本上请直接运行 `pnpm install`，因为 `vp install` 需要受管的包管理器。
>
> 从 `1.8.0` 开始，当你仅使用项目本地 CLI 时可以省略该变量，它会直接使用 `PATH` 上的包管理器。

在 Windows 上，请在声明了 `vite-plus` 的包目录中运行以下命令，并确保 `PATH` 上有项目固定的 pnpm 且已提交 `pnpm-lock.yaml`。

```powershell
pnpm install --frozen-lockfile
.\node_modules\.bin\vp.cmd check
.\node_modules\.bin\vp.cmd test
```

### 哪些命令会使用网络？

- `vp lint`、`vp fmt --check`、`vp check` 和 `vp test` 使用已安装的工具。请提前安装测试套件所需的测试环境、覆盖率提供程序或浏览器二进制文件。项目配置、插件和测试本身可能会发起各自的网络请求。
- `vp run` 可以从本地缓存重放任务。缓存未命中时，任务会执行其自身的命令，该命令可能会使用网络。配置了远程缓存时同样需要网络访问。
- `vp install`、`vp add` 和 `vp dlx` 可能会拉取包。`vp migrate` 可能会安装依赖。对于 `vp create`，来源取决于模板：例如 `vite:application` 会从注册表使用 `create-vite@latest`，而 `vite:library` 会从 GitHub 下载其模板。
