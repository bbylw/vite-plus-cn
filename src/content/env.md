# 环境管理

`vp env` 在全局与按项目两个维度管理 **Node.js 版本**。

## 概览

受管模式默认开启，因此 `node`、`npm` 及相关 shim 会通过 Vite+ 解析，并为当前项目挑选正确的 Node.js 版本。

Vite+ 先从当前目录查找，然后逐级向上遍历父目录。最近的、声明了版本支持的目录胜出。在每个目录内，按以下顺序检查来源：

1. `.node-version` 文件
2. `package.json` 中的 `devEngines.runtime`（[devEngines 标准](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines)）
3. `package.json` 中的 `engines.node`
4. `.nvmrc` 文件

如果没有目录声明版本，Vite+ 使用全局默认值（`vp env default`），然后是最近的 LTS。

`devEngines.runtime` 优先于 `engines.node`，因为前者声明的是**开发环境**要求，而后者是面向使用者的支持范围。当 `devEngines.runtime` 与 `engines.node` 冲突时，`vp env doctor` 会给出警告。

当项目在 `package.json` 中声明了 `packageManager`（或 `devEngines.packageManager`）时，匹配的包管理器 shim 也会使用该版本。例如 `packageManager: "npm@10.9.4"` 会让 `npm` 与 `npx` 都通过 npm 10.9.4 运行。别名对遵循已安装的包管理器 shim：`npm`/`npx`、`pnpm`/`pnpx`、`yarn`/`yarnpkg`、`bun`/`bunx`。

## 常用命令

```bash
# 设置
vp env setup                            # 为 node、npm、npx、corepack 创建 shim
vp env on                               # 使用 Vite+ 受管的 Node.js
vp env print                            # 输出当前会话的 shell 片段

# 管理
vp env pin lts                          # 把项目固定到最近 LTS
vp env install                          # 从 .node-version / package.json / .nvmrc 安装
vp env default lts                      # 设置全局默认版本
vp env use 20                           # 当前 shell 会话使用 Node.js 20
vp env uninstall <version>              # 卸载某个已安装版本
vp env clean                            # 清理未使用的受管缓存

# 检查
vp env current                          # 显示当前解析到的环境
vp env current --json                   # 以 JSON 输出，便于自动化
vp env which node                       # 显示将使用哪个 node 二进制
vp env list                             # 显示本地已安装的 Node.js 版本
vp env list-remote --lts                # 只列出 LTS 版本

# 执行
vp env exec --node lts npm i            # 用最近 LTS 执行 npm i
vp node script.js                       # 快捷方式：用解析到的版本运行脚本
```

## 开启 / 关闭受管模式

保持默认行为：

```bash
vp env on
```

这开启受管模式，使 shim 始终使用 Vite+ 受管的 Node.js 安装。

如果不想让 Vite+ 优先管理 Node.js：

```bash
vp env off
```

这切换到「系统优先」模式，shim 优先使用你的系统 Node.js，仅在需要时才回退到 Vite+ 受管的运行时。

## 自定义 Node.js 镜像

默认情况下，Vite+ 从 `https://nodejs.org/dist` 下载 Node.js。如果你在代理之后，或需要使用内部镜像（如 Artifactory），可设置 `VP_NODE_DIST_MIRROR`：

```bash
VP_NODE_DIST_MIRROR=https://my-mirror.example.com/nodejs/dist vp env install 22
```

## 签名校验

在从官方 `nodejs.org` 分发安装 Node.js 时，Vite+ 会下载 PGP 签名的 `SHASUMS256.txt.asc`，并在信任任何校验和之前，先对照内置的 Node.js 发布密钥进行校验。随后仍会校验下载归档的 SHA-256 校验和。自定义镜像若只发布普通 `SHASUMS256.txt`，则回退为仅校验和校验。
