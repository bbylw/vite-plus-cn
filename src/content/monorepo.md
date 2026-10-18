# Monorepo

Vite+ 支持在根目录使用 `vite.config.ts` 的 monorepo。你可以在根目录定义 `lint`、`fmt` 等的默认值，并使用 `overrides` 应用针对特定包的代码检查与格式化设置。

由于 `vite.config.ts` 本身就是 JavaScript，你可以选择将整个配置放入此文件，也可以通过常规的 JavaScript 导入来组合配置。你仍然可以在每个包中保留单独的 `vite.config.ts` 文件，用于 Vite、Vitest、框架或运行时配置。

## 带覆盖项的根配置

在工作区根目录运行 `vp lint`、`vp fmt` 和 `vp check`，即可将根目录的代码检查与格式化设置应用到各包。这些命令不会将嵌套配置应用到单个文件。请使用根 `vite.config.ts` 中的覆盖项定义文件级或包级设置。

在包目录中运行时，`vp lint` 和 `vp fmt` 仍使用根目录设置，除非该包配置定义了自己的 `lint` 或 `fmt` 块。我们不建议使用包级块；请改用根配置中的覆盖项。文件参数仍然相对于包的工作目录。

当根 `lint` 和 `fmt` 块存在时，`vp check` 会使用它们。包配置无法替换 `vp check` 中的根格式化设置、代码检查规则或类型检查选项。

为 `vp lint` 或 `vp fmt` 传入 `-c <path>` 或 `--config <path>` 可显式选择其他配置文件。

对仅适用于某些包的 Oxlint 规则，使用 `lint.overrides`：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    plugins: ['typescript'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
    overrides: [
      {
        files: ['apps/web/**', 'packages/ui/**'],
        plugins: ['react'],
        rules: {
          'react/self-closing-comp': 'error',
        },
      },
      {
        files: ['apps/api/**'],
        env: {
          node: true,
        },
        rules: {
          'no-console': 'off',
        },
      },
      {
        files: ['**/*.test.ts', '**/*.spec.ts'],
        plugins: ['vitest'],
        rules: {
          'typescript/no-explicit-any': 'off',
          'vitest/no-disabled-tests': 'error',
        },
      },
    ],
  },
});
```

glob 从根 `vite.config.ts` 解析，因此请使用工作区路径，例如 `apps/web/**`、`apps/api/**` 和 `packages/ui/**`。

> [!TIP]
> 当 `lint.overrides` 条目设置了 `plugins` 时，该列表会与基础 `lint.plugins` 列表合并后应用于匹配的文件。仅当覆盖项应原样继承基础列表时才省略 `plugins`。

## 格式化覆盖项

对文件级或包级的 Oxfmt 选项，使用 `fmt.overrides`。格式化覆盖项将其设置放在 `options` 下：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
    semi: true,
    overrides: [
      {
        files: ['apps/api/**'],
        options: {
          printWidth: 120,
        },
      },
      {
        files: ['**/*.md'],
        options: {
          proseWrap: 'always',
        },
      },
    ],
  },
});
```

## 组合配置文件

你可以将配置拆分到仓库各处，并使用 JavaScript 导入来组合它们。从附近的文件或包中导出 JavaScript 对象，在根配置中导入，并将它们合并到相应的覆盖项中。

```ts [tooling/lint/react.ts]
import type { OxlintOverride } from 'vite-plus/lint';

export const reactLint = {
  plugins: ['typescript', 'react'],
  rules: {
    'react/self-closing-comp': 'error',
  },
} satisfies Omit<OxlintOverride, 'files'>;
```

```ts [tooling/lint/node.ts]
import type { OxlintOverride } from 'vite-plus/lint';

export const nodeLint = {
  env: {
    node: true,
  },
  rules: {
    'no-console': 'off',
  },
} satisfies Omit<OxlintOverride, 'files'>;
```

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

import { nodeLint } from './tooling/lint/node';
import { reactLint } from './tooling/lint/react';

export default defineConfig({
  lint: {
    plugins: ['typescript'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ['apps/web/**', 'packages/ui/**'],
        ...reactLint,
      },
      {
        files: ['apps/api/**'],
        ...nodeLint,
      },
    ],
  },
});
```

这样既保持了行为的集中管理，又让每个团队或包拥有自己需要的配置片段。

## 应用命令

根 `vite.config.ts` 对共享的代码检查、格式化、暂存检查和任务定义最有价值。开发、构建、预览和打包仍然作用于单个应用，因此 Vite+ 让内置命令感知 monorepo，而不是迫使你在包之间 `cd`。

### 在工作区根目录运行

`vp dev`、`vp build`、`vp preview` 和 `vp pack` 绝不会悄悄作用于通常没有自身应用的工作区根目录。在 monorepo 顶层运行它们时，Vite+ 会判断你指的是哪个应用。

当恰好只有一个包看起来像应用时，vp 会运行它，并显示下次可直接使用的命令：

```
$ vp dev
Selected package: web (apps/web)
Tip: run this directly with `vp -C apps/web dev`

  VITE+ v0.2.2

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

当有多个包可能成为目标时，vp 会打开模糊包选择器（与 `vp run` 相同的选择器）；输入内容可筛选，按 Enter 运行所选包：

```
$ vp build
Select a package to build (↑/↓, Enter to run, type to search):

  › admin apps/admin
    web   apps/web
    ui    packages/ui
```

```
Selected package: web (apps/web)
Tip: run this directly with `vp -C apps/web build`

  ✓ built in 187ms
```

在非交互式 shell（CI、管道、重定向）中，vp 会以纯列表形式打印相同的包，并附带可直接复制的命令，然后以退出码 1 结束：

```
$ vp build | cat
error: `vp build` at the workspace root needs a target package.

  Packages in this workspace:
    admin     apps/admin
    web       apps/web
    @shop/ui  packages/ui

  Pass a directory:  vp -C apps/admin build
  Or run every package's build script:  vp run -r build
```

在包选择器和列表中，vp 都会将看起来可运行该命令的包排在前面：对于 `dev` / `build` / `preview`，看是否存在 `vite.config.*` 或根 `index.html`；对于 `pack`，看是否有 `pack` 配置块或 tsdown 默认的 `src/index.ts` 入口。

### 使用 `-C` 指定包

全局 `-C` 标志会像先 `cd` 到该包一样运行任何 vp 命令，与 `cd <dir> && vp <command>` 完全一致：

```bash
vp -C apps/web dev
vp -C apps/web build
vp -C packages/ui pack
```

将文件夹作为位置参数传入（`vp dev apps/web`）仍然有效，但会保留上游 Vite 的语义：它设置 Vite 的 `root` 选项，而不改变工作目录，因此配置和插件中的 `process.cwd()` 读取会相对于你运行 vp 的位置解析。当希望包的行为如同你已 `cd` 进入其中时，优先使用 `-C`。当使用目录位置参数时，vp 会打印一行提示，指向 `-C` 形式。

### 使用 `defaultPackage` 固定默认值

要始终指定一个目录并跳过上述解析，请在根配置中设置 [`defaultPackage`](/config)：

```ts [vite.config.ts]
export default {
  defaultPackage: './apps/web',
};
```

```
$ vp dev
note: vp dev: using ./apps/web (defaultPackage in vite.config.ts)

  VITE+ v0.2.2

  ➜  Local:   http://localhost:5173/
```

对于不是 JavaScript 工作区的框架 monorepo（例如带有 `frontend/` 目录的 Laravel 或 Rails 应用），这是正确的选择：没有可解析的包列表，因此 `defaultPackage` 直接让 vp 指向该应用。由于 vp 在不执行配置的情况下读取它，因此即使 `vite-plus` 只安装在该子目录中也能生效。

对象形式可逐个映射命令，因此 `vp pack` 可以指向库，而 `vp dev` 指向应用；对象中不存在的命令会回退到上述解析逻辑：

```ts [vite.config.ts]
export default {
  defaultPackage: { dev: './apps/web', pack: './packages/ui' },
};
```

### 包脚本与工作区级任务

当命令因应用而异时，请将包特定的脚本保留在各包中：

```json [apps/api/package.json]
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json"
  }
}
```

使用 `vp run` 在整个工作区运行脚本：

```bash
vp run -r build
vp run -r --parallel dev
vp run --filter ./apps/web build
```

关于递归、并行、筛选与缓存的工作区任务，请参阅[运行指南](/guide/run)。
