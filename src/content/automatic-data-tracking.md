# 自动数据追踪

自动数据追踪是 Vite Task 无需显式配置即可了解任务需要哪些输入来缓存输出的方式。

当你运行一个启用了缓存的任务时，Vite Task 会观察任务的执行过程，记录读取和写入了哪些文件，以及任务上报的任何元数据。在下一次运行时，Vite Task 使用记录的指纹来决定是重放缓存还是运行任务。

当你需要了解任务为何命中或未命中缓存，或需要决定是否添加 `cache.input`、`cache.output`、`cache.env` 或 `cache.untrackedEnv` 配置时，请阅读本页。

## 追踪层级

自动数据追踪分为两个层级：

| 层级         | 适用范围                                    | 记录内容                                                                             |
| ------------ | ------------------------------------------- | ------------------------------------------------------------------------------------ |
| 文件系统追踪 | 所有启用了缓存的任务                        | 命令读取的文件；缺失文件的探测；目录列举；写入的输出文件                             |
| 协作式追踪   | 支持上报缓存的工具（`vp build`、`vp test`） | 工具上报的环境变量；不应作为输入或输出的工具管理路径，例如 `node_modules/.vite-temp` |

Vite Task 对任何命令都从文件系统追踪开始。支持上报缓存的工具可以在运行过程中补充只有该工具才知道的信息。

## 文件系统追踪

文件系统追踪适用于每个启用了缓存的任务。如果省略 [`cache.input`](/config/run)，Vite Task 会追踪命令在运行期间读取的文件：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'tsc',
      },
    },
  },
});
```

对于此任务，Vite Task 会记录源文件、配置文件、命令检查过的缺失文件以及命令扫描过的目录。当这些被追踪的输入之一发生变化时，后续运行会重新执行该任务。

文件系统追踪也会追踪输出。如果省略 [`cache.output`](/config/run)，Vite Task 会在成功运行后归档命令写入的文件，并在缓存命中时恢复它们。

### 限制

Vite Task 无法追踪环境变量的读取，也无法总是分辨被追踪的路径究竟是稳定的输入、生成的输出，还是不应成为输入或输出的工具管理缓存路径。

当文件系统追踪包含了不应影响缓存的文件、漏掉了本应影响的文件，或恢复了错误的输出时，请使用[覆盖输入与输出](#override-inputs-and-outputs)。

当命令需要某个环境变量且其值应影响缓存时，请使用 [`cache.env`](/config/run)；当其值不应影响缓存时，请使用 [`cache.untrackedEnv`](/config/run)。

这些限制不适用于 `vp build`：Vite 会自动上报[协作式追踪](#cooperative-tracking)元数据，包括 `VITE_*`、`NODE_ENV` 以及不应成为输入或输出的 Vite 管理缓存路径。标准的 `vp build` 任务无需手动配置 `input`、`output` 或 `env`。

### 覆盖输入与输出

[`cache.input`](/config/run) 控制什么会使缓存失效。[`cache.output`](/config/run) 控制缓存命中时 Vite Task 恢复哪些文件。

两个选项使用相同的语法，可以分别配置。

- 省略该选项即保留自动追踪。
- 添加 `{ auto: true }` 可在保留自动追踪的同时添加 glob 规则。
- 使用字符串 glob 来包含路径。
- 使用 `!` 开头的 glob 来排除路径。
- 使用 `[]` 用空列表替换自动追踪。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    cache: {
      // 保留自动输入追踪，但将 `dist` 从输入中排除。
      input: [{ auto: true }, '!dist/**'],

      // 关闭自动输出追踪，缓存命中时仅恢复 `dist/**`。
      output: ['dist/**'],
    },
  },
}
```

只有当你知道命令的完整输入集合时，才使用显式的 `input` glob。下面这个代码检查任务只覆盖输入，因此输出追踪仍保持自动：

```ts [vite.config.ts]
tasks: {
  lint: {
    command: 'vp lint',
    cache: {
      // 关闭自动输入追踪，仅为这些文件生成指纹。
      input: ['src/**', 'vite.config.ts'],
    },
  },
}
```

当没有任何文件应影响缓存指纹时，设置 `input: []`。这很少有用。例如，当同一个 URL 总是提供相同文件时，一个下载任务就可以被缓存。此任务不应有任何输入文件被纳入指纹，但更改 URL 仍会使缓存失效：

```ts [vite.config.ts]
tasks: {
  downloadSchema: {
    command: 'curl -O https://example.com/schema.json',
    cache: {
      input: [],
    },
  },
}
```

当缓存命中时不应恢复任何文件时，设置 `output: []`。

## 协作式追踪

文件系统追踪记录的是访问行为。它无法知道工具为何使用每个路径。

`vp build` 对一次 Vite 构建的了解超过了 Vite Task 能从文件访问中推断出的内容。当 `vp build` 在启用缓存的情况下运行时，Vite 会将这些元数据上报给 Vite Task。Vite Task 会将该报告与文件系统追踪合并，以构建更准确的缓存指纹。

对于标准的 Vite 构建，你无需自行添加这些条目，因为 Vite 会在运行时自动上报它们：

- `env: ['VITE_*']` 或 `env: ['NODE_ENV']`
- 针对 `node_modules/.vite-temp` 之类临时路径的输入或输出排除项

`dist` 等构建输出由自动的文件写入追踪捕获，并在缓存命中时恢复。

你只需用 `vp build` 定义任务：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      frontendBuild: 'vp build',
    },
  },
});
```

用 `vpr frontendBuild` 或 `vp run frontendBuild` 运行该任务。

手动配置会覆盖上报的元数据。当你的项目存在 Vite 无法上报的行为时，请添加 `cache.input`、`cache.output`、`cache.env` 或 `cache.untrackedEnv`。

Vite+ 为 `vp build` 和 `vp test` 支持协作式追踪。`vp test` 会上报 Vitest 的磁盘缓存路径（`node_modules/.vitest-cache` 以及 Vite 缓存目录下的结果缓存），使它们既不会使任务失效，也不会被恢复到任务中。未来会将这一支持扩展到更多一方工具。第三方工具可以通过 [`@voidzero-dev/vite-task-client`](https://npmx.dev/package/@voidzero-dev/vite-task-client) 上报缓存元数据。

## 何时添加手动配置

当你的项目存在命令或工具无法知晓的行为时，请添加配置。这些选项位于任务的 [`cache`](/config/run) 对象下。

| 场景                                   | 示例                                                                                          |
| -------------------------------------- | --------------------------------------------------------------------------------------------- |
| 从输入中排除某个输出目录               | `input: [{ auto: true }, '!dist/**']`                                                         |
| 从输入和输出追踪中排除某个临时生成文件 | `input: [{ auto: true }, '!.tmp/config.mjs']`；`output: [{ auto: true }, '!.tmp/config.mjs']` |
| 对任务关闭自动文件追踪                 | `input: ['src/**']`；`output: ['dist/**']`                                                    |
| 追踪并传递环境变量                     | `env: ['NODE_ENV']`                                                                           |
| 传递环境变量但不纳入指纹               | `untrackedEnv: ['GITHUB_ACTIONS']`                                                            |
