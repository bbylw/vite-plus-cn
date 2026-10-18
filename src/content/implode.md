# 移除 Vite+

使用 `vp implode` 从机器上移除 Vite+ 管理的[全局 `vp` 安装](/guide/global-cli)及相关用户数据。它不会移除项目中的 `vite-plus` 依赖，也不会移除 Homebrew 拥有的包。

## 概览

`vp implode` 是用于移除 Vite+ 安装及其受管数据的清理命令。如果你不再希望 Vite+ 管理运行时、包管理器及相关本地工具状态，请使用它。

> [!NOTE]
> 如果你认为 Vite+ 不适合你，请[与我们分享反馈](https://discord.gg/cAnsqHh5PX)。

## 用法

```bash
vp implode
```

查看命令列出的目录和 shell 配置文件，然后输入 `boom` 确认移除。任何其他输入都会取消操作。

使用以下命令跳过确认提示：

```bash
vp implode --yes
```

## Homebrew

先运行 `vp implode` 移除 Vite+ 管理的运行时、全局包、配置、shim 和 shell 条目。然后移除 Homebrew 包：

```bash
vp implode
brew uninstall vite-plus
```

确认提示会说明 Homebrew 包将保持安装。清理完成后，`vp implode` 会引导你执行 `brew uninstall vite-plus`。

再次运行 `vp` 之前请重启终端。在 Bash 中，你可以运行 `hash -r` 来清除缓存的命令路径。如果 Homebrew 包仍然安装，下一次 `vp` 命令会重新开始首次运行设置。
