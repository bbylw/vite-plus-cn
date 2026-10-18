# 命令行参考

`vp` 是 Vite+ 的统一命令行入口。运行 `vp help` 可以查看当前可用命令，运行 `vp <command> --help` 可以查看某个命令的完整选项。

Vite+ 有两种分发形式：

- **全局 CLI**：独立的 `vp` 二进制，负责机器级的 Node.js 与包管理器管理，并可在所有项目中使用。
- **项目本地 CLI**：安装为开发依赖的 `vite-plus` 包，把工具链版本记录在项目的清单与锁文件中。

大多数开发命令在两种形式中都可用；`vp env`、`vp upgrade` 与 `vp implode` 等机器级命令需要全局 CLI。下文会在有差异的地方注明。

## 项目搭建

- **`vp create`** —— 从模板创建新项目、monorepo 或工作区成员
- **`vp migrate`** —— 把现有项目迁移到 Vite+
- **`vp install`**（别名 `i`）—— 安装依赖；带包名时等同于添加依赖
- **`vp add`** —— 向依赖中添加包（`-D` 开发依赖、`-O` 可选依赖、`--save-peer` 对等依赖）
- **`vp remove`**（`rm`、`un`、`uninstall`）—— 从依赖中移除包
- **`vp update`**（`up`）—— 将包更新到更新版本
- **`vp dedupe`** —— 合并重复依赖
- **`vp outdated`** —— 列出有可用更新的包
- **`vp list`**（`ls`）—— 列出已安装的包（仅全局 CLI；本地 CLI 使用 `vp pm list`）
- **`vp why`**（`explain`）—— 解释某个包为何被安装
- **`vp info`**（`view`、`show`）—— 查看注册表中的包元数据
- **`vp link`**（`ln`）/ **`vp unlink`** —— 管理本地包链接
- **`vp rebuild`** —— 重建原生模块（仅全局 CLI；本地 CLI 使用 `vp pm rebuild`）
- **`vp pm <command>`** —— 把命令转发给当前包管理器，并做兼容性适配

## 开发与检查

- **`vp dev`** —— 启动由 Vite 驱动的开发服务器
- **`vp check`** —— 一次运行格式化、代码检查与类型检查
- **`vp lint`** —— 使用 Oxlint 检查代码
- **`vp fmt`**（`format`）—— 使用 Oxfmt 格式化代码
- **`vp test`** —— 使用内置 Vitest 运行测试
- **`vp build`** —— 为生产环境构建应用
- **`vp preview`** —— 本地预览生产构建
- **`vp pack`** —— 使用 tsdown 构建库或独立可执行文件

## 任务与执行

- **`vp run`**（`vpr`）—— 运行 `package.json` 脚本与工作区任务，支持缓存与依赖感知调度
- **`vp exec`** —— 运行本地 `node_modules/.bin` 中的命令
- **`vp dlx`** —— 下载并运行包二进制，不将其添加为依赖
- **`vp node`** —— 使用解析后的 Vite+ 环境运行 Node.js 脚本
- **`vp cache`** —— 管理任务缓存（`vp cache clean` 清空缓存）
- **`vpx`** —— 全局下载并运行包二进制

## 工作流

- **`vp config`** —— 安装 Git 钩子分发器并配置代理集成
- **`vp hooks`** —— 管理 Git 钩子分发器（`enable`、`disable`、`status`）
- **`vp staged`** —— 对暂存文件运行检查器

## 全局 CLI

以下命令管理机器级的 Vite+ 安装与运行时：

- **`vp env`** —— 管理 Node.js 与包管理器版本，以及受管模式
- **`vp upgrade`** —— 把全局 `vp` 升级到最新版本
- **`vp implode`** —— 移除全局 `vp` 及其受管数据
- **`vp toolchain`** —— 查看 Vite+、Vite、Rolldown、Oxc 等工具版本（本地 CLI 与全局 CLI 均可用）

`vp env` 的常用子命令包括 `setup`、`on` / `off`、`pin` / `unpin`、`use`、`install`、`uninstall`、`default`、`current`、`doctor`、`which`、`list`、`list-remote` 与 `exec`。完整说明请参阅[环境管理](/guide/env)。

## 包管理器子命令

`vp pm` 会根据项目检测到的 pnpm、npm、Yarn 或 Bun 转发命令，并统一常见差异。支持的子命令类别包括：

| 类别       | 子命令                                                         |
| ---------- | -------------------------------------------------------------- |
| 依赖       | `ci`、`prune`、`list`、`rebuild`、`approve-builds`             |
| 打补丁     | `patch`、`patch-commit`                                        |
| 打包与发布 | `pack`、`version`、`publish`、`stage`、`dist-tag`、`deprecate` |
| 查看       | `view`、`search`、`licenses`、`audit`、`fund`、`ping`          |
| 认证与访问 | `login`、`logout`、`whoami`、`token`、`owner`、`team`          |
| 配置       | `config`、`cache`                                              |
| 包清单     | `pkg get`、`pkg set`、`pkg delete`、`pkg fix`                  |

具体支持情况取决于包管理器及其版本。运行 `vp pm --help` 列出命令，或 `vp pm <command> --help` 查看选项。

```bash
vp pm config get registry
vp pm audit --json
vp pm pkg set private=true --json
vp pm stage publish
```

## 全局选项

| 选项         | 说明                                |
| ------------ | ----------------------------------- |
| `-C <DIR>`   | 把 `<DIR>` 当作当前工作目录执行命令 |
| `-h, --help` | 显示帮助                            |
| `--version`  | 显示版本                            |

## 常用别名

| 命令         | 别名                               |
| ------------ | ---------------------------------- |
| `vp install` | `vp i`                             |
| `vp remove`  | `vp rm` / `vp un` / `vp uninstall` |
| `vp update`  | `vp up`                            |
| `vp list`    | `vp ls`                            |
| `vp why`     | `vp explain`                       |
| `vp info`    | `vp view` / `vp show`              |
| `vp link`    | `vp ln`                            |
| `vp fmt`     | `vp format`                        |
| `vp run`     | `vpr`                              |

## 相关文档

- [全局 CLI](/guide/global-cli) 与[项目本地 CLI](/guide/local-cli)：两种分发的安装与选择
- [包管理](/guide/package-management)：依赖命令与包管理器适配细节
- [任务编排](/guide/run)：`vp run` 的筛选器、缓存与工作区行为
