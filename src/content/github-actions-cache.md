# GitHub Actions 缓存

> [!WARNING]
> **实验性**
>
> 在多次 GitHub Actions 运行之间复用 Vite Task 的缓存目前是实验性功能。在将其用于 CI 之前，请先在项目中测试并评估。

Vite Task 将任务结果存储在工作区根目录的 `node_modules/.vite/task-cache` 中。在后续的 GitHub Actions 运行中恢复该目录，Vite Task 就能复用之前的任务结果。

GitHub Actions 缓存和 Vite Task 各自做出独立的决策：

1. `actions/cache` 根据工作流中的键来恢复和保存缓存目录。
2. Vite Task 使用恢复的缓存目录，仅重放指纹仍然匹配的任务。

## 开始之前

当以下条件全部满足时，才使用此工作流：

- 命令通过 `vp run` 运行。
- 紧接着的第二次运行报告该任务缓存命中。
- 该任务在 CI 中具有稳定的输入和输出追踪。
- 工作流在恢复 `node_modules/.vite/task-cache` 之前安装依赖。

如果紧接着的第二次运行未命中，请先修复任务的追踪配置，再添加 GitHub Actions 缓存。常见的不稳定缓存原因与解决方法请参阅[何时添加手动配置](/guide/automatic-data-tracking)。

## 跨运行缓存前先评估

在以下情况下，你可能不需要在多次 GitHub Actions 运行之间恢复 Vite Task 缓存：

- 任务已经足够快。恢复和保存步骤会带来额外开销，因此短任务不采用此工作流反而能更快完成。
- 缓存传输比重新运行任务更耗时。在同一工作流运行内，同一任务运行多次时 Vite Task 仍能节省时间，但跨运行场景下传输时间也是成本的一部分。

在添加 GitHub Actions 缓存之前先进行评估。比较有无恢复和保存步骤时的工作流时长。同时检查 GitHub 缓存步骤耗时和 `vp run` 耗时。

## 1. 定义可缓存的 CI 任务

只有通过 `vp run` 运行的命令才会使用 Vite Task 缓存。像 `vp build` 这样的直接命令不会使用任务缓存。在 `vite.config.ts` 中为每个希望在 CI 中缓存的命令定义任务：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      build: 'vp build',
      lint: 'vp lint',
    },
  },
});
```

本指南假设每个任务在本地已经能够命中缓存。如果某个任务未命中，请先在 `vite.config.ts` 中修复其追踪配置，再添加 GitHub Actions 缓存步骤。参见[自动数据追踪](/guide/automatic-data-tracking)和 [`run.tasks`](/config/run)。

将每个任务运行两次：

```bash
vp run build
vp run build # 应输出 "cache hit"
vp run lint
vp run lint  # 应输出 "cache hit"
```

## 2. 在安装之后恢复缓存

在 `setup-vp` 步骤之后恢复 `node_modules/.vite/task-cache`，因为安装包可能会重建或修改 `node_modules`。

将下面的 `<setup-vp-version>` 设置为 [`setup-vp` 发布页](https://github.com/voidzero-dev/setup-vp/releases)中的确切版本。也可以改用 commit SHA。

参见[自动版本更新](/guide/ci)来配置 Dependabot 或 Renovate。

```yaml [.github/workflows/ci.yml]
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: voidzero-dev/setup-vp@<setup-vp-version>
        with:
          node-version: '24'
          cache: true

      - name: Restore Vite Task cache
        id: vite-task-cache
        uses: actions/cache/restore@v6
        with:
          path: node_modules/.vite/task-cache
          key: vite-task-${{ runner.os }}-${{ runner.arch }}-${{ github.run_id }}-${{ github.run_attempt }}
          restore-keys: |
            vite-task-${{ runner.os }}-${{ runner.arch }}-

      - run: vp run lint
      - run: vp run build

      - name: Save Vite Task cache
        if: success()
        uses: actions/cache/save@v6
        with:
          path: node_modules/.vite/task-cache
          key: ${{ steps.vite-task-cache.outputs.cache-primary-key }}
```

主键包含 `github.run_id` 和 `github.run_attempt`，因此每次成功运行都会保存一个新的不可变缓存条目。恢复前缀让 GitHub 恢复同一操作系统和架构下最新的缓存。

不要把任务输入（包括源文件和锁文件）放进 GitHub Actions 的键中。Vite Task 会为它们生成指纹。如果它们改变了 Actions 键，GitHub 可能会在 Vite Task 判断哪些任务仍然命中之前跳过有用的恢复。

对于 monorepo，请从工作区根目录恢复任务缓存。然后运行你在本地使用的相同 `vp run` 命令，例如 `vp run -t @my/app#build`。Vite Task 可以复用所请求的包及其依赖包的结果。

## 3. 在日志中验证

首次运行时，恢复步骤应显示未找到缓存，保存步骤应创建一个缓存。来自 fork 的拉取请求可能只能恢复而不能保存，因为 GitHub 可能只授予缓存令牌只读访问权限。在这种情况下，保存步骤会发出警告并成功退出，而不会写入缓存条目。

在后续运行中，请同时查看这两层信息：

```text
Cache restored from key: vite-task-Linux-X64-...
$ vp build ◉ cache hit, replaying
vp run: cache hit, 1.10s saved.
```

如果 GitHub 恢复了缓存但 Vite Task 输出缓存未命中，说明工作流恢复了缓存目录，但任务的指纹发生了变化。

## 保持任务追踪稳定

如果 GitHub 恢复了缓存但 `vp run` 输出缓存未命中，请先修复任务指纹，再更改 Actions 缓存键。参见[自动数据追踪](/guide/automatic-data-tracking)和 [`run.tasks`](/config/run)。

## 选择缓存键

使用滚动主键加恢复前缀：

```yaml [.github/workflows/ci.yml]
key: vite-task-${{ runner.os }}-${{ runner.arch }}-${{ github.run_id }}-${{ github.run_attempt }}
restore-keys: |
  vite-task-${{ runner.os }}-${{ runner.arch }}-
```

主键对每次运行都是唯一的，因为它包含 `github.run_id` 和 `github.run_attempt`。随后 GitHub 会搜索恢复前缀并恢复最新的匹配缓存。

应包含：

- `runner.os` 和 `runner.arch`，因为输出和原生工具可能与平台相关。
- 每次运行的值，例如 `github.run_id` 和 `github.run_attempt`，因为 GitHub 缓存条目是不可变的。

如果某个依赖文件会影响任务结果，请将其纳入任务指纹，而不是 GitHub Actions 键。

## 管理缓存驱逐与作用域

GitHub 根据其缓存保留和仓库存储规则驱逐缓存。缓存作用域也与分支相关：工作流运行可以恢复当前分支和默认分支的缓存，而拉取请求 merge-ref 缓存的作用域有限。

Vite Task 可以清除整个任务缓存，但目前不会按时间或大小驱逐单个任务条目。随着新的任务条目和输出归档不断保存，`node_modules/.vite/task-cache` 可能持续增长。

在 GitHub Actions 缓存层管理大小：

- 将缓存的 `path` 限制为 Vite Task 缓存目录。
- 将恢复前缀限定在兼容的 runner 上，例如相同的操作系统和架构。
- 如果大型缓存导致频繁驱逐，请删除过期的 GitHub Actions 缓存条目、减少保存缓存的工作流数量，或调整仓库缓存上限。

有关当前的驱逐和作用域规则，请参阅 [GitHub 的缓存参考文档](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)。
