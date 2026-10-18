# 任务缓存

Vite Task 可以自动追踪依赖关系，并缓存通过 `vp run` 运行的任务。

## 概述

当任务成功运行（退出码为 0）后，其终端输出（stdout/stderr）以及所有写入的文件（输出文件）都会被保存。在下一次运行时，Vite Task 会检查是否有任何内容发生变化：

1. **参数：**传给任务的[附加参数](/guide/run)是否发生变化？
2. **环境变量：**是否有任何[纳入指纹的环境变量](/config/run)发生变化？
3. **输入：**命令读取的任何输入文件是否发生变化？

当所有检查都匹配时，Vite Task 会重放缓存的终端输出，恢复保存的输出文件，并跳过该命令。

当发生缓存未命中时，Vite Task 会准确告诉你原因：

```
$ vp lint ○ cache miss: 'src/utils.ts' modified, executing
$ vp build ○ cache miss: env 'VITE_GREETING' changed, executing
$ vp test ○ cache miss: args changed, executing
```

## 何时启用缓存？

由 `vp run` 运行的命令要么是 `vite.config.ts` 中定义的**任务**，要么是 `package.json` 中定义的**脚本**。任务名称与脚本名称不能重叠。默认情况下，**任务会被缓存，脚本不会被缓存。**

任务缓存有三类控制项，按顺序生效：

### 1. 单个任务的 `cache: false`

任务可以设置 [`cache: false`](/config/run) 来选择退出缓存。此设置不能被任何其他缓存控制标志覆盖。

### 2. CLI 标志

`--no-cache` 会为本次运行中的每个任务和脚本禁用缓存。`--cache` 会同时为任务和脚本启用缓存，相当于为本次调用设置 [`run.cache: true`](/config/run)。

### 3. 工作区配置

根 `vite.config.ts` 中的 [`run.cache`](/config/run) 选项控制每一类的默认值：

| 设置            | 默认值  | 作用                               |
| --------------- | ------- | ---------------------------------- |
| `cache.tasks`   | `true`  | 缓存 `vite.config.ts` 中定义的任务 |
| `cache.scripts` | `false` | 缓存 `package.json` 中的脚本       |

## 自动数据追踪

Vite Task 使用[自动数据追踪](/guide/automatic-data-tracking)来了解每个任务缓存所需的信息，因此你无需手动配置。自动数据追踪分为两个层级：

- **文件系统追踪：**对于所有启用了缓存的任务，Vite Task 会记录文件读取、缺失文件探测、目录列举以及写入的输出文件。
- **协作式追踪：**支持上报缓存的工具可以上报文件系统追踪无法推断的元数据。Vite+ 目前为 `vp build` 支持这一能力。

当任务需要手动追踪规则时，使用 [`cache.input`](/config/run) 或 [`cache.output`](/config/run)。`input` 控制什么会使缓存失效。`output` 控制缓存命中时 Vite Task 恢复哪些文件。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    cache: {
      input: [{ auto: true }, '!dist/**'],
      output: ['dist/**'],
    },
  },
}
```

## 环境变量

默认情况下，任务在干净的环境中运行。只有一小部分常见变量（例如 `PATH`、`HOME` 和 `CI`）会被传递。其他环境变量既对任务不可见，也不会包含在缓存指纹中。

要把某个环境变量加入缓存键，请将其添加到 [`cache.env`](/config/run)。之后只要它的值发生变化，缓存就会失效：

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'webpack --mode production',
    cache: {
      env: ['NODE_ENV'],
    },
  },
}
```

要把变量传递给任务但**不影响**缓存行为，请使用 [`cache.untrackedEnv`](/config/run)。这适用于 `CI` 或 `GITHUB_ACTIONS` 之类的变量：它们应在任务中可用，但不影响缓存行为。

关于通配符模式以及自动传递变量的完整列表，请参阅[运行配置](/config/run)。

## 缓存共享

Vite Task 的缓存基于内容。如果两个任务以相同的输入运行相同的命令，它们会共享缓存条目。当多个任务包含相同的步骤时（无论是作为独立任务，还是作为[复合命令](/guide/run)的一部分），这种情况会自然发生：

```json [package.json]
{
  "scripts": {
    "check": "vp lint && vp build",
    "release": "vp lint && deploy-script"
  }
}
```

在启用缓存的情况下（例如通过 `--cache` 或 [`run.cache.scripts: true`](/config/run)），先运行 `check` 意味着 `release` 中的 `vp lint` 步骤会立即命中缓存，因为两者对相同文件运行了相同的命令。

## 缓存命令

需要清除已缓存的任务结果时，使用 `vp cache clean`：

```bash
vp cache clean
```

任务缓存存储在项目根目录的 `node_modules/.vite/task-cache` 中。`vp cache clean` 会删除该缓存目录。
