# 运行二进制

使用 `vpx`、`vp exec` 和 `vp dlx` 运行二进制，无需在本地安装、下载的包和项目特定工具之间来回切换。

## 概述

`vpx` 执行来自本地或远程 npm 包的命令。它可以运行本地已有的包、按需下载包，或指定明确的包版本。

当你需要更严格的控制时，请使用其他二进制命令：

- `vpx` 依次在本地 `node_modules/.bin` 目录、Vite+ 管理的全局包以及系统 `PATH` 中查找二进制，然后回退到 `vp dlx`。使用 `pkg@version`、`--package/-p` 或 `--shell-mode` 时，它直接通过 `vp dlx` 运行。
- `vp exec` 从本地 `node_modules/.bin` 目录运行命令，未找到时回退到 `PATH`
- `vp dlx` 运行包二进制，而不将其添加为依赖

## `vpx`

需要运行任何本地或远程二进制时，使用 `vpx`：

```bash
vpx <pkg[@version]> [args...]
```

### 选项

- `-p, --package <name>` 在运行命令前安装一个或多个额外的包
- `-c, --shell-mode` 在 shell 中执行命令
- `-s, --silent` 抑制 Vite+ 输出，仅显示命令输出

### 示例

```bash
vpx eslint .
vpx create-vue my-app
vpx oxlint@1.85.0 --version
vpx -p cowsay -c 'echo "hi" | cowsay'
```

## `vp exec`

使用 `vp exec` 运行已安装在项目中的工具，或环境中可用的工具。

```bash
vp exec <command> [args...]
```

示例：

```bash
vp exec eslint .
vp exec tsc --noEmit
```

## `vp dlx`

需要一次性执行包而不将其添加到项目依赖时，使用 `vp dlx`。

```bash
vp dlx <package> [args...]
```

示例：

```bash
vp dlx create-vite
vp dlx oxlint@1.85.0 --version
```
