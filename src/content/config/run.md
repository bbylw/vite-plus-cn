# run 配置

你可以在 `vite.config.ts` 的 `run` 字段下配置 Vite Task。有关使用 Vite+ 运行脚本与任务的更多信息，请参阅 [`vp run`](/guide/run)。

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    enablePrePostScripts: true,
    cache: {/* ... */},
    tasks: {/* ... */},
  },
});
```

## `run.enablePrePostScripts`

- **类型：** `boolean`
- **默认值：** `true`

是否在执行脚本 `X` 时，自动将 package.json 中的 `preX`/`postX` 脚本作为生命周期钩子运行。

启用时（默认），运行 `test` 这类脚本会自动在其之前运行 `pretest`、在其之后运行 `posttest`（如果它们存在于 `package.json` 中）。

```ts [vite.config.ts]
export default defineConfig({
  run: {
    enablePrePostScripts: false, // 禁用 pre/post 生命周期钩子
  },
});
```

> [!WARNING]
> 该选项只能在工作区根目录的 `vite.config.ts` 中设置。在包的配置中设置会导致错误。

## `run.cache`

- **类型：** `boolean | { scripts?: boolean, tasks?: boolean }`
- **默认值：** `{ scripts: false, tasks: true }`

控制任务结果是否缓存，并在后续运行中重放。

```ts [vite.config.ts]
export default defineConfig({
  run: {
    cache: {
      scripts: true, // 缓存 package.json 脚本（默认：false）
      tasks: true, // 缓存任务定义（默认：true）
    },
  },
});
```

`cache: true` 同时启用任务缓存和脚本缓存，`cache: false` 则同时禁用两者。

## `run.tasks`

- **类型：** `Record<string, Task | string | string[]>`

定义可通过 `vp run <task>` 运行的任务。

作为简写，任务值可以直接是命令字符串或命令字符串数组：

```ts [vite.config.ts]
tasks: {
  build: 'vp build',
  check: ['vp lint', 'vp build'],
}
```

这等价于在任务配置中只设置 `command`：

```ts [vite.config.ts]
tasks: {
  build: { command: 'vp build' },
  check: { command: ['vp lint', 'vp build'] },
}
```

当任务需要 `cache`、`dependsOn` 或 `cwd` 等其他字段时，请使用对象形式。

### `command`

- **类型：** `string | string[]`

定义任务要运行的 shell 命令。字符串由 shell 解释，因此空格、引号、`&&`、管道和重定向都会像在命令行中书写一样生效。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'vp build',
  },
}
```

数组会将每个条目作为独立命令按顺序执行，等价于用 `&&` 连接它们。它**不是**把一条命令拆分为 argv 标记的方式：`['vp', 'build']` 会先尝试运行一个名为 `vp` 且不带参数的命令，然后运行一个名为 `build` 的命令，而不是 `vp build`。

```ts [vite.config.ts]
tasks: {
  check: {
    // 两条命令，按顺序运行
    command: ['vp lint', 'vp build'],
  },
  bad: {
    // 错误：这不是 `vp build`，而是 `vp` 后跟 `build`
    command: ['vp', 'build'],
  },
}
```

在 `vite.config.ts` 中定义的每个任务都必须包含自己的 `command`。不能同时在 `vite.config.ts` 和 `package.json` 中定义同名任务。

用 `&&` 连接（或作为数组提供）的命令会自动拆分为可独立缓存的子任务。参见[复合命令](/guide/run)。

### `dependsOn`

- **类型：** `Array<string | { task: string, from: DependsOnFrom }>`
- **默认值：** `[]`

`from` 接受依赖类型 `"dependencies"`、`"devDependencies"`、`"peerDependencies"`，或这些值的数组，例如 `["dependencies", "devDependencies"]`。

必须在此任务开始前成功完成的任务。

```ts [vite.config.ts]
tasks: {
  deploy: {
    command: 'deploy-script --prod',
    dependsOn: ['build', 'test'],
  },
}
```

依赖可以使用 `package#task` 格式引用其他包中的任务：

```ts [vite.config.ts]
dependsOn: ['@my/core#build', '@my/utils#lint'];
```

使用对象形式 `{ task: string, from: DependsOnFrom }` 引用所有依赖中的任务：

```ts [vite.config.ts]
tasks: {
  test: {
    command: 'vp test',
    dependsOn: [{ task: 'build', from: ['dependencies', 'devDependencies'] }],
  },
}
```

对于上例，Vite Task 会读取声明该任务的包的直接 `dependencies` 和 `devDependencies`，并在每个定义了 `build` 任务的依赖中运行它。没有 `build` 的包会被跳过。

关于显式依赖与拓扑依赖如何交互的详细信息，请参阅[任务依赖](/guide/run)。

### `cache`

- **类型：** `boolean | { env?: string[], untrackedEnv?: string[], input?: Array<...>, output?: Array<...> }`
- **默认值：** `true`

是否以及如何缓存该任务。当省略 `cache`、设为 `true` 或 `{}` 时，将使用默认设置启用缓存。

使用对象，并通过 [`cache.env`](#cache-env)、[`cache.untrackedEnv`](#cache-untrackedenv)、[`cache.input`](#cache-input) 和 [`cache.output`](#cache-output) 配置任务的缓存方式：

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    cache: {
      env: ['NODE_ENV'],
      input: [{ auto: true }, '!dist/**'],
    },
  },
}
```

对于开发服务器这类永远不应缓存的任务，请将 `cache` 设为 `false`：

```ts [vite.config.ts]
tasks: {
  dev: {
    command: 'vp dev',
    cache: false,
  },
}
```

### `cache.env`

- **类型：** `string[]`
- **默认值：** `[]`

包含在缓存指纹中的环境变量。当所列任一变量的值发生变化时，缓存即失效。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    cache: {
      env: ['NODE_ENV'],
    },
  },
}
```

支持通配符模式和 `!` 排除模式：`VITE_*` 匹配所有以 `VITE_` 开头的变量，`!VITE_SECRET` 将 `VITE_SECRET` 变量从匹配中排除。

对于 `vp build`，Vite 会通过[自动追踪](/guide/automatic-data-tracking)上报 Vite 环境变量。对于标准 Vite 构建，除非你的项目有 Vite 无法上报的额外构建行为，否则不要在此添加 `VITE_*` 或 `NODE_ENV`。

```bash
$ NODE_ENV=development vp run build    # 首次运行
$ NODE_ENV=production vp run build     # 缓存未命中：环境变量 'NODE_ENV' 已变化
```

### `cache.untrackedEnv`

- **类型：** `string[]`
- **默认值：** 见下文

传递给任务进程但**不**包含在缓存指纹中的环境变量。更改这些值不会使缓存失效。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    cache: {
      untrackedEnv: ['CI', 'GITHUB_ACTIONS'],
    },
  },
}
```

`untrackedEnv` 接受与 [`env`](#cache-env) 相同的通配符和 `!` 排除模式。

如果某个变量的值会影响任务结果，请不要将其放入 `untrackedEnv`。如果某个缓存上报工具通过[自动追踪](/guide/automatic-data-tracking)覆盖了该变量，请同时将其从 `env` 和 `untrackedEnv` 中省略。

Vite Task 为系统变量和常见工具提供了默认的未追踪模式。示例包括：

- **系统：** `HOME`、`USER`、`PATH`、`SHELL`、`LANG`、`TZ`、`TMP`、`TEMP`
- **Node.js 与包管理器：** `NODE_OPTIONS`、`NPM_CONFIG_STORE_DIR`、`PNPM_HOME`
- **CI：** `CI`、`VERCEL_*`、`NEXT_*`、`GITHUB_*`、`RUNNER_*`、`ACTIONS_ID_TOKEN_REQUEST_URL`
- **Windows：** `APPDATA`、`LOCALAPPDATA`、`SYSTEMROOT`、`USERPROFILE`
- **开发工具：** `VSCODE_*`、`JB_IDE_*`、`DOCKER_*`、`BUILDKIT_*`、`COMPOSE_*`、`PLAYWRIGHT_*`
- **令牌：** `*_TOKEN`，包括 `ACTIONS_ID_TOKEN_REQUEST_TOKEN`

颜色变量如 `FORCE_COLOR`、`NO_COLOR`、`COLORTERM`、`TERM` 和 `TERM_PROGRAM` 需要显式添加到 `env` 或 `untrackedEnv`。如果未列出 `FORCE_COLOR`，Vite Task 会设置 `FORCE_COLOR=1`，以保持缓存日志带颜色。当终端无法渲染颜色时，颜色会在显示时被去除。

### `cache.input`

- **类型：** `Array<string | { auto: boolean } | { pattern: string, base: "workspace" | "package" }>`
- **默认值：** `[{ auto: true }]`（自动推断）

Vite Task 会自动检测命令使用了哪些文件。详情以及何时需要添加手动配置，请参阅[自动数据追踪](/guide/automatic-data-tracking)。

**从自动追踪中排除文件：**

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'vp build',
    cache: {
      // 使用 `{ auto: true }` 启用自动指纹计算（默认）。
      input: [{ auto: true }, '!**/*.tsbuildinfo', '!dist/**'],
    },
  },
}
```

**仅指定显式文件**，不使用自动追踪：

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'vp build',
    cache: {
      input: ['src/**/*.ts', 'vite.config.ts'],
    },
  },
}
```

**使用对象形式相对于工作区根目录解析模式：**

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'vp build',
    cache: {
      input: [
        { auto: true },
        { pattern: 'shared-config/**', base: 'workspace' },
      ],
    },
  },
}
```

`base` 字段是必需的，用于控制 glob 模式的解析方式：

- `"package"`：相对于包目录
- `"workspace"`：相对于工作区根目录

**完全禁用文件追踪**，仅根据命令/环境变量变化进行缓存：

```ts [vite.config.ts]
tasks: {
  greet: {
    command: 'node greet.mjs',
    cache: {
      input: [],
    },
  },
}
```

> [!TIP]
> 字符串 glob 模式默认相对于包目录解析。使用带 `base: "workspace"` 的对象形式可相对于工作区根目录解析。

### `cache.output`

- **类型：** `Array<string | { auto: boolean } | { pattern: string, base: "workspace" | "package" }>`
- **默认值：** 自动写入追踪

Vite Task 会自动归档成功任务运行所生成的文件，并在缓存命中时恢复它们。

如果省略 `output`，Vite Task 会使用自动写入追踪来选择这些文件。当你需要覆盖要恢复的文件时，请添加显式的 `output` 条目。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    cache: {
      output: ['dist/**', '!dist/cache/**'],
    },
  },
}
```

使用 `{ auto: true }` 可在添加显式 output glob 的同时保留自动写入追踪。

当任务写入了不应从缓存恢复的文件时，这很有用。例如，排除 TypeScript 的 `.tsbuildinfo` 文件：

```ts [vite.config.ts]
tasks: {
  typecheck: {
    command: 'tsc --build',
    cache: {
      output: [{ auto: true }, '!*.tsbuildinfo'],
    },
  },
}
```

如果任务写入其自身包之外的位置，请使用带 `base: "workspace"` 的对象形式：

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    cache: {
      output: [
        'dist/**',
        { pattern: 'shared-artifacts/**', base: 'workspace' },
      ],
    },
  },
}
```

设置 `output: []` 可禁用缓存任务的输出恢复：

```ts [vite.config.ts]
tasks: {
  report: {
    command: 'node scripts/report.mjs',
    cache: {
      output: [],
    },
  },
}
```

与 `cache: false` 不同，`output: []` 仍允许 Vite Task 对该任务进行指纹计算。缓存命中时，Vite Task 会跳过命令并重放其终端输出。当任务的输出文件已存在且无需恢复时，可将此用于本地缓存。

### `cwd`

- **类型：** `string`
- **默认值：** 包根目录

任务的工作目录，相对于包根目录。

```ts [vite.config.ts]
tasks: {
  'test-e2e': {
    command: 'vp test',
    cwd: 'tests/e2e',
  },
}
```
