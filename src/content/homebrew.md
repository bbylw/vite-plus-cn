# Homebrew tap

官方 tap 支持 ARM64 与 x64 上的 macOS 和 glibc Linux。Homebrew 管理原生 `vp` 可执行文件；`vp` 管理其 JavaScript 依赖、下载的 Node.js 版本、包管理器，以及用户目录中的设置。
稳定版安装会从 GitHub Releases 下载可执行文件及其依赖锁文件。这一步不需要已有的 Node.js 或包管理器安装，也不需要访问 npm registry。

## 安装

安装 tap：

```bash
brew tap voidzero-dev/vite-plus https://github.com/voidzero-dev/vite-plus
brew install voidzero-dev/vite-plus/vp
vp
```

由于 formula 是 Vite+ 仓库的一部分，必须提供显式的仓库 URL。
如果你已经在使用 Vite+，请按照[迁移步骤](#切换已有安装)操作。

## 首次使用

首次使用时，`vp` 会安装与之匹配的 CLI 依赖，并配置你的 shell 与工具管理偏好。这一步需要能够访问 Node.js 下载与你的 npm registry。
即使你选择优先使用系统工具，安装也会使用发布版固定的 Node.js 与 pnpm 版本。兼容的 [`VP_SETUP_NODE_VERSION`](/guide/global-cli) 可以覆盖安装所用的运行时，而不改变项目的 Node.js 选择。
`vp` 把依赖存储在 `<DATA>/cli-packages/<version>/<platform>`。
`<DATA>` 来自 [Vite+ 目录配置](/guide/global-cli)。

安装完成后打开一个新终端，使 shim 出现在 `PATH` 上。之后的调用会复用已完成的安装。
使用 [`vp env on` 与 `vp env off`](/guide/env) 可以更改 `vp` 管理哪些工具。

## 自定义 npm registry

首次运行的安装会读取 `~/.npmrc`，包括 npm 兼容的认证信息：

```ini
registry=https://registry.example.com/repository/npm/
//registry.example.com/repository/npm/:_authToken=${NPM_TOKEN}
```

在运行 `vp` 之前导出 `NPM_TOKEN`。原生 pnpm 下载器与 pnpm 依赖安装都会使用该配置。
你可以用 `NPM_CONFIG_USERCONFIG` 选择其他文件，或用 `NPM_CONFIG_REGISTRY` 覆盖 registry。
相对的用户配置路径从当前目录解析。不需要任何 Homebrew 特有的 npm 变量。

认证失败会中止安装。修正配置后再次运行 `vp`；安装会保留你的管理选择。

## 从失败的安装中恢复

运行 `vp env doctor` 检查可执行文件、依赖目录与 shim。它的 CLI 依赖检查只读取本地文件，不会安装或修复依赖。其他检查可能会获取 Node.js 版本元数据。

修复报告的配置、访问或磁盘空间问题，然后运行 `vp --help` 重试安装。
遇到锁文件错误时，[安装器恢复选项](/guide/global-cli)同样适用于 Homebrew：

```bash
VP_SETUP_SKIP_INSTALL_LOCKFILE=1 vp --help
```

这会在不使用已发布锁文件的情况下解析依赖。之后不带该覆盖变量的调用会恢复正常的锁文件检查，并可能重新安装这些依赖。
如果 pnpm 失败，报告的日志会包含其退出码与可识别的错误码，而不包含原始的包管理器输出。
已配置的工具 shim 可以独立于 CLI 依赖修复，运行缓存的 Node.js、包管理器与全局包。

## 切换已有安装

保留你现有的目录设置。迁移会保留你的偏好、运行时与全局包，并把它们的 shim 更新为 Homebrew 公开的 `vp` 命令。
不要运行 `vp implode`：它会移除这些用户数据。切换后打开一个新终端。

### 从脚本安装器切换

运行上面的 `brew tap` 与 `brew install` 命令。然后直接调用 Homebrew 的可执行文件，以免已有的脚本安装 shim 抢占优先：

```bash
"$(brew --prefix)/bin/vp" env setup --refresh
```

### 从 Homebrew Core 切换

`vite-plus` formula 提供相同的命令，安装 tap 之前必须先移除它：

```bash
brew tap voidzero-dev/vite-plus https://github.com/voidzero-dev/vite-plus
brew uninstall vite-plus
brew install voidzero-dev/vite-plus/vp
"$(brew --prefix)/bin/vp" env setup --refresh
```

## 升级或移除

```bash
brew upgrade voidzero-dev/vite-plus/vp
```

升级后运行 `vp` 以准备与之匹配的依赖。安装会保留你的偏好。
`vp upgrade` 会识别官方 tap，并指引你运行 `brew upgrade voidzero-dev/vite-plus/vp`。

要完全移除，请在卸载可执行文件之前移除用户数据：

```bash
vp implode
brew uninstall voidzero-dev/vite-plus/vp
```

仅运行 `brew uninstall` 会保留用户数据。在共享机器上，每个操作系统账户都可以在可执行文件被移除之前，用 `vp implode` 移除自己的数据。

## 测试预览构建

把 `HOMEBREW_VP_PR_VERSION` 设为 PR 编号或完整的提交 SHA。该 PR 必须已发布包含 Homebrew tap 支持的 `preview-build`。使用完整 SHA 可以让安装与验证停留在同一提交上：

```bash
brew tap voidzero-dev/vite-plus https://github.com/voidzero-dev/vite-plus
HOMEBREW_VP_PR_VERSION="<full-commit-sha>" brew install voidzero-dev/vite-plus/vp
HOMEBREW_VP_PR_VERSION="<full-commit-sha>" brew test voidzero-dev/vite-plus/vp
```

要替换已安装的 tap 构建，请使用 `brew reinstall` 而不是 `brew install`。如果安装了 `vite-plus` formula，请先运行 `brew uninstall vite-plus`；这会保留你的用户数据。
`brew test` 使用临时用户数据，不会更改你的 shell 配置。之后运行 `vp` 为你的账户完成预览版安装。如果是从脚本安装器切换，请[刷新其 shim](#从脚本安装器切换)以使用 Homebrew 可执行文件。

Homebrew 只从 registry 桥下载原生预览包并校验其 checksum。它会把 PR 编号解析为最新发布的提交，这可能与当前 PR 头部不同。
首次启动会从桥安装匹配的依赖。显式的 `NPM_CONFIG_REGISTRY` 必须指向同时提供这些预览包的 registry。

该选择器仅作用于这个 tap。它不会更改其他 Homebrew formula，`brew install` 期间也不需要 npm 客户端。
要测试 formula 本身的变更，请先在 tap 仓库中检出该 PR。为这些命令设置 `HOMEBREW_NO_AUTO_UPDATE=1` 以保持该检出。

要回到稳定版，请清除覆盖变量，如果你更改过 tap 的检出则恢复其 `main` 分支，并在重新安装前更新它：

```bash
unset HOMEBREW_VP_PR_VERSION HOMEBREW_NO_AUTO_UPDATE
git -C "$(brew --repository voidzero-dev/vite-plus)" switch main
brew update
brew reinstall voidzero-dev/vite-plus/vp
```
