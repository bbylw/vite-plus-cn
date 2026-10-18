# 提交钩子

使用 `vp hooks` 管理 Git 钩子分发器，使用 `vp config` 进行项目设置（钩子 + 智能体集成），使用 `vp staged` 对暂存文件运行检查。

## 概述

Vite+ 无需额外工具即可支持提交钩子和暂存文件检查。

使用：

- `vp hooks enable` / `disable` / `status` 管理生成的分发器
- `vp config` 安装分发器（未被禁用时）并更新智能体集成
- `vp staged` 对当前在 Git 中暂存的文件运行检查

如果你使用 [`vp create`](/guide/create) 或 [`vp migrate`](/guide/migrate)，Vite+ 会提示你为项目自动完成这项设置。

### 快速开始

```bash
# 安装或刷新分发器
vp hooks enable

# 查看此克隆中哪些内容处于启用状态
vp hooks status

# 在此克隆中关闭钩子（在 npm install / prepare 后仍然有效）
vp hooks disable

# 重新开启
vp hooks enable
```

## 命令

### `vp hooks`

管理当前仓库的 Vite+ Git 钩子分发器：

```bash
vp hooks enable
vp hooks enable --hooks-dir .custom-hooks
vp hooks disable
vp hooks status
```

| 命令      | 行为                                                                                                                                                                  |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enable`  | 在 `<hooks-dir>/_` 下安装或刷新生成的分发器，并设置 `core.hooksPath`。清除之前的禁用偏好。                                                                            |
| `disable` | 拆除分发器（当 `core.hooksPath` 指向 Vite+ 时取消设置，并移除 `<hooks-dir>/_`），并在本地 git 配置中**持久化**禁用决定，使 `vp config` / 生命周期脚本不会重新安装它。 |
| `status`  | 显示偏好、`core.hooksPath`、分发器是否存在以及项目自有的钩子脚本。                                                                                                    |

默认情况下，项目钩子位于 `.vite-hooks` 中。传入 `--hooks-dir` 可使用其他子目录。首次成功启用后，该目录会被记录在本地 git 配置中，供此克隆后续的 `enable` / `disable` / `status` / `vp config` 调用使用。

`status` 以如下方式报告偏好：

- `not set`——此克隆中没有禁用偏好，也没有先前的启用
- `enabled`——已运行 enable（或当前拥有分发器）
- `disabled (local)`——在 `vp hooks disable` 之后

检查 `Dispatcher` 和 `core.hooksPath` 行，了解钩子是否真正生效。

`disable` / `enable` **不会**删除项目自有的钩子脚本（例如 `.vite-hooks/pre-commit`）、`vite.config.ts` 中的 `staged` 块，或调用 `vp config` 的生命周期脚本。

### `vp config`

`vp config` 为当前项目配置 Vite+。它会安装生成的 Git 钩子分发器（除非已通过 `vp hooks disable` 禁用钩子），还可以处理相关的项目集成，例如智能体设置。钩子目录默认为 `.vite-hooks`，或此克隆中 `vp hooks` / `vp config` 上次使用的目录：

```bash
vp config
vp config --hooks-dir .vite-hooks
vp config --no-hooks
vp config --no-agent
```

当你希望 `vp config` 不更改 Git 钩子分发器时，使用 `--no-hooks`。当你希望它跳过对现有编码智能体指令文件的更新时，使用 `--no-agent`。可以同时传入两个标志，让 `vp config` 跳过这两个设置步骤。执行 `vp hooks disable` 后，`vp config` 会跳过重新安装分发器，并提示你使用 `vp hooks enable`，而不再弹出询问。

如果 `core.hooksPath` 指向其他钩子目录，`vp config` 会跳过分发器安装以保留现有设置。运行 `vp hooks status` 查看当前配置。

你也可以设置 `VP_GIT_HOOKS=0`，从 `prepare` 或 `postinstall` 等生命周期脚本中禁用钩子安装。

项目自有的钩子脚本（例如 `.vite-hooks/pre-commit`）应提交到仓库。`.vite-hooks/_` 下生成的分发器和 shim 会被忽略，并由 `vp config` 或 `vp hooks enable` 重新创建。这两个命令都不会创建或修改项目钩子脚本或暂存文件配置。

### `vp staged`

`vp staged` 使用 `vite.config.ts` 中的 `staged` 配置运行暂存文件检查。它内置 `lint-staged` 17，并要求：

- `22.x` 系列中 Node.js `22.22.1` 或更高版本，或 `24.11.0` 或更高版本
- Git `2.32.0` 或更高版本

Node.js `20.x` 不再支持暂存检查。当 pre-commit 钩子运行 `vp staged` 时，这些要求同样适用。在使用该命令之前，请升级项目在开发者机器和 CI runner 上的 Node.js 运行时与 Git 安装。上游变更请参阅 [lint-staged 17 发布说明](https://github.com/lint-staged/lint-staged/releases/tag/v17.0.0)。

要在每次提交前运行它，请将其添加到项目自有的 pre-commit 钩子：

```bash
vp staged
vp staged --verbose
vp staged --fail-on-changes
```

```sh [.vite-hooks/pre-commit]
vp staged
```

## 配置

在 `vite.config.ts` 的 `staged` 块中定义暂存文件检查：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
});
```

这是 Vite+ 的默认做法，在大多数项目中应取代单独的 `lint-staged` 配置。在 `vp create` 期间选择启用钩子时，Vite+ 会同时生成此配置和对应的 pre-commit 钩子。在 `vp migrate` 期间，会保留现有钩子策略，仅当未发现现有钩子策略时才引入默认配置。由于 `vp staged` 从 `vite.config.ts` 读取配置，你的暂存文件检查与代码检查、格式化、测试、构建及任务运行器配置都集中在同一处。

## 在特定环境中禁用钩子

已安装的钩子会在每次运行时检查环境，因此你可以按机器或按进程禁用它们，而无需卸载任何内容。当提交发生在开发环境之外时（例如通过扁平文件 CMS 或其他进程），这很有用。

### 环境变量

在运行 `git commit` 的进程环境中设置 `VP_GIT_HOOKS=0`，所有 Vite+ 钩子都会立即退出而不运行：

```bash
VP_GIT_HOOKS=0 git commit -m "content update"
```

出于生态工具兼容性，`HUSKY=0` 也会以相同方式生效。在环境中设置 `VP_GIT_HOOKS=0` 还能阻止 `vp config` / `vp hooks enable` 在 `prepare` 等生命周期脚本运行时于该环境中重新安装钩子。

### 初始化脚本

在检查环境变量之前，每个钩子会加载一个初始化脚本（如果存在）：

1. `$XDG_CONFIG_HOME/vite-plus/hooks-init.sh`（默认为 `~/.config/vite-plus/hooks-init.sh`）
2. `$XDG_CONFIG_HOME/husky/init.sh` 作为回退

要为整台机器禁用钩子，请创建该初始化脚本并在其中导出变量：

```sh [~/.config/vite-plus/hooks-init.sh]
export VP_GIT_HOOKS=0
```

由于钩子本身会读取此文件，即使提交进程没有继承你的 shell 环境（例如由守护进程或 Web 服务器发起提交），它也能生效。

## 移除提交钩子

要在此克隆中停止使用 Vite+ 钩子分发器（并避免 `prepare` / `vp config` 重新安装它）：

```bash
vp hooks disable
# 或者，如果你使用了自定义目录：
vp hooks disable --hooks-dir .custom-hooks
```

这会：

1. 当 `core.hooksPath` 指向 Vite+ 分发器时取消设置它
2. 移除生成的分发器目录 `<hooks-dir>/_`
3. 记录一个**本地**禁用偏好，使生命周期脚本在你再次运行 `vp hooks enable` 之前跳过重新安装

要重新启用：

```bash
vp hooks enable
```

如果你完全不再需要项目的钩子（与队友共享），还应从 `package.json` 的 `prepare` 或 `postinstall` 脚本中移除 `vp config`。

### 手动等价操作

如果你更愿意手动操作：

```bash
git config --unset core.hooksPath
rm -rf .vite-hooks/_
# 可选：阻止 prepare/vp config 在此克隆中重新安装
git config --local vp.hooks.disabled true
# 可选：记住的钩子目录（由 enable/disable 设置）
# git config --local vp.hooks.dir .vite-hooks
```

像 `.vite-hooks/pre-commit` 这样的项目自有脚本以及 `vite.config.ts` 中的 `staged` 块可以保留以备后用，如果项目不再需要，也可以单独删除它们。`vp hooks disable` **不会**删除这些项目自有文件。
