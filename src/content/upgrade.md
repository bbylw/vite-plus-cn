# 升级 Vite+

使用 `vp upgrade` 更新全局 `vp` 二进制。要更新项目中的本地 `vite-plus` 包，请参阅[更新 Vite+](/guide/upgrade-project)。

## 概览

升级 Vite+ 涉及两个部分：

- 安装在你的机器上的全局 `vp` 命令
- 单个项目使用的[本地 `vite-plus` 包](/guide/upgrade-project)

你可以独立升级这两者。

## 查看工具链

运行 `vp toolchain` 显示当前目录的组件：

```bash
vp toolchain
vp toolchain vite
vp toolchain vite rolldown oxc
vp toolchain --json
```

当项目包含本地 `vite-plus` 包时，该命令会使用它。使用 `--global` 显示全局 `vp` 命令的发行版：

```bash
vp toolchain --global
```

`vp why <package>` 显示来自包管理器的依赖图。它无法显示打包进 `@voidzero-dev/vite-plus-core` 的代码，也无法显示编译进 Vite+ 的引擎。使用 `vp toolchain` 显示这些版本和关系。

## 全局 `vp`

使用以下命令更新全局 CLI：

```bash
vp upgrade                        # 升级到最新版本
vp upgrade --check                # 检查更新而不安装
vp upgrade <version>              # 安装特定版本
vp upgrade --registry <registry>  # 使用自定义 npm 注册表
```

### 自动更新检查

全局 CLI 在正常使用终端期间会在后台检查更新，并缓存结果 24 小时。当有较新版本可用时，它会向 stderr 打印通知，但不会安装。

设置 `VP_NO_UPDATE_CHECK=1` 可禁用这些检查和通知。它们在 CI 和 Homebrew 安装中也会被禁用。

### 将现有安装迁移到分离目录布局

Vite+ 0.3.0 是首个支持分离目录布局的版本。Vite+ 0.2.x 及更早版本在全新安装和升级时使用单根布局。

`vp upgrade` 会将现有的默认安装保留在 Unix 的 `~/.vite-plus` 或 Windows 的 `%USERPROFILE%\.vite-plus` 中。该命令会升级该目录中的 CLI，但不会将安装移动到分离的平台目录。你可以继续使用现有布局。

要立即使用分离布局，请移除现有安装，然后重新安装 Vite+。在使用当前安装的 shell 中运行 `vp implode`。该命令会移除生成的环境文件和 shell 配置文件条目，但不会取消当前 shell 中的目录变量。在运行安装程序之前，请取消设置所有 Vite+ 目录变量。这可能包括来自早期预览环境文件的值。或者，在 `vp implode` 之后启动新 shell，然后在新 shell 中运行安装程序。

> [!WARNING]
> `vp implode` 会移除所有 Vite+ 管理的 Node.js 运行时、全局包、配置和缓存。如果你不想重新创建这些数据，请保留现有布局。

```bash
vp implode
unset VP_HOME VP_DATA_DIR VP_BIN_DIR VP_CACHE_DIR
curl -fsSL https://vite.plus | bash
```

在 Windows 上：

```powershell
vp implode
Remove-Item Env:\VP_HOME, Env:\VP_DATA_DIR, Env:\VP_BIN_DIR, Env:\VP_CACHE_DIR -ErrorAction SilentlyContinue
irm https://vite.plus/ps1 | iex
```

还要从 shell 配置文件或系统环境中移除 `VP_HOME`、`VP_DATA_DIR`、`VP_BIN_DIR` 和 `VP_CACHE_DIR` 的持久定义。全新安装会使用仍然设置的 `VP_HOME` 或完整的 `VP_*_DIR` 组。`VP_HOME` 会选择单根布局。如果你安装 Vite+ 0.2.x 或更早版本，安装程序也会使用此布局。安装程序会打印通知。

### 回滚

Vite+ 会保留**最近 3 个**已安装版本，以便你快速回退：

```bash
vp upgrade --rollback
```

每次升级后会自动清理较旧的版本。活动版本和上一个版本始终保留，因此回滚目标永远不会被移除。

### Homebrew

Homebrew 管理其安装的二进制和 JavaScript 包。使用以下命令更新它们：

```bash
brew upgrade vite-plus
```

`vp upgrade` 会检测 Homebrew 安装，并引导你使用该命令，而不会下载或安装其他版本。这同样适用于 `--force`、特定版本和 `--rollback`。请使用 Homebrew 管理这些安装。

`vp upgrade --check` 会引导你使用 `brew outdated vite-plus`。Homebrew 安装的自动 npm 更新检查和通知已禁用。

## 预览构建

一些 Vite+ 拉取请求会在 npm 发布之前发布临时包用于测试。请将它们视为 nightly 或前沿构建：当你需要验证特定修复、测试最新的上游依赖升级，或在下一个版本之前确认更改时，它们很有用。对于日常工作，请优先使用已发布的 `latest` 版本。

符合条件的拉取请求上的每个提交都会发布到[注册表桥接](https://registry-bridge.viteplus.dev/)。该桥接将这些构建作为普通的 npm 版本提供，形式为 `0.0.0-commit.<sha>`，并将所有其他包代理到 npm 注册表。这意味着你可以使用普通版本规格而不是可变 URL 来安装预览版，并且相同的版本在 CI 中也能解析。

`vite-plus` 和 `@voidzero-dev/vite-plus-core` 都以相同的 `0.0.0-commit.<sha>` 版本发布。每个拉取请求都会附带一条评论，列出其最新提交的确切版本，以及可直接复制的安装步骤。

你可以在自动更新上游依赖的拉取请求中找到预览构建。例如，在已合并的拉取请求中搜索[上游依赖更新](https://github.com/voidzero-dev/vite-plus/pulls?q=is%3Apr+is%3Amerged+upgrade+upstream+dependencies)。

预览构建通过拉取请求编号或提交 SHA 定位。它们不是稳定的版本范围，除非维护者要求，否则应避免将它们留在长期分支中。

### 全局 `vp` 预览

通过向安装程序传递 `VP_PR_VERSION` 来安装全局 CLI 的预览构建。传递拉取请求编号或提交 SHA：

```bash
curl -fsSL https://vite.plus | VP_PR_VERSION=<pr-or-sha> bash
```

在 Windows 上：

```powershell
$env:VP_PR_VERSION = "<pr-or-sha>"
irm https://vite.plus/ps1 | iex
Remove-Item Env:\VP_PR_VERSION
```

安装程序使用注册表桥接将 ref 解析为 `0.0.0-commit.<sha>` 构建，并像其他版本一样安装它。运行 `vp toolchain --global` 显示活动构建和工具版本。测试完成后，运行 `vp upgrade --force` 恢复已发布的版本。你也可以在不设置 `VP_PR_VERSION` 的情况下运行安装程序。

### 本地 `vite-plus` 预览

要在项目中使用相同的预览版，请遵循[更新 Vite+](/guide/upgrade-project)。
