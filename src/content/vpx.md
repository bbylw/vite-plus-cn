# 运行二进制

使用 `vpx`、`vp exec` 和 `vp dlx` 运行包二进制与脚本，无需在本地安装、下载的包和项目特定工具之间来回切换。

## 概述

`vpx` 根据第一个参数做两件事之一：

- [`vpx <package>`](#运行包二进制) 运行来自本地或远程 npm 包的二进制，类似 `npx`。
- [`vpx <file>`](#运行脚本) 运行 TypeScript 或 JavaScript 文件，类似 `tsx`；[`vpx --watch <file>`](#监听模式) 会在它使用的文件变化时重新运行，类似 `tsx watch`。

其他命令对二进制的来源提供更严格的控制：

- [`vp exec`](#vp-exec) 从本地 `node_modules/.bin` 目录运行命令，未找到时回退到 `PATH`。
- [`vp dlx`](#vp-dlx) 运行包二进制，而不将其添加为依赖。

`vpx -v` 或 `vpx --version` 打印 Vite+ 版本，与 `vp --version` 类似。在 `package.json` 脚本中，`vpx` 打印项目 `vite-plus` 包的版本。

## 运行包二进制

```bash
vpx [options] <pkg[@version]> [args...]
```

`vpx` 依次在本地 `node_modules/.bin` 目录、Vite+ 管理的全局包以及系统 `PATH` 中查找二进制。如果都没有，`vpx` 会下载该包并通过 `vp dlx` 运行。使用 `pkg@version`、`--package/-p` 或 `--shell-mode` 时，它直接通过 `vp dlx` 运行。

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

包管理器与 `vp run` 会把 `node_modules/.bin` 放在 `PATH` 最前面，因此 `package.json` 脚本运行的是项目 `vite-plus` 包的 `vpx` bin。该 bin 不需要全局 CLI，且只在本地 `node_modules/.bin` 目录中查找。它像全局 `vpx` 一样直接运行已安装的二进制，`pkg@version`、`--package/-p` 或 `--shell-mode` 则通过 `vp dlx` 运行。未安装的二进制会报错，因此脚本绝不会意外下载包：

```
error: vpx: 'eslint' is not installed in node_modules
note: Add it to devDependencies, or run `vp dlx eslint` to download and run it.
```

## 运行脚本

```bash
vpx [--tsconfig <path>] [node options] <file> [args...]
```

`vpx` 直接运行 TypeScript 与 JavaScript 文件，无需 `tsx` 或 `ts-node` 依赖。脚本运行在项目的 Node.js 版本上——与 [`vp node`](/guide/env) 选择的是同一个——并使用 Vite+ 随附的 [oxc-node](https://github.com/oxc-project/oxc-node) 加载器。

```bash
vpx ./scripts/seed.ts --dry-run
vpx scripts/build.mts
vpx --watch ./server.ts
vpx --env-file=.env ./scripts/migrate.ts
vpx --tsconfig tsconfig.scripts.json ./tools/gen.ts
```

### 文件与包名

当参数满足以下条件时，`vpx` 把它作为文件运行：

- 以 `.ts`、`.mts`、`.cts`、`.tsx`、`.js`、`.mjs`、`.cjs` 或 `.jsx` 结尾的路径（以 `./`、`../` 或 `/` 开头；在 Windows 上还包括 `.\`、`..\`、`C:\` 之类的盘符或 `\\`）
- 带上述扩展名之一且作为文件存在的名称，例如 `scripts/seed.ts`
- 指向 shebang 使用 `vpx` 的文件的路径（参见 [Shebang 脚本](#shebang-脚本)）

不存在的路径，或带 TypeScript 扩展名但不存在的名称，都会报错：`vpx` 绝不会为它下载包。在 Node.js 选项之后（例如 `vpx --inspect seed.ts`），`vpx` 只报告不存在的路径；不存在的名称由 Node.js 自己报告。带 JavaScript 扩展名但不是文件的名称（例如 `highlight.js`）会运行同名包。

### 支持的语法

- Node.js 类型剥离会拒绝的 TypeScript 语法：枚举、命名空间、参数属性与 JSX
- `"experimentalDecorators": true` 时的装饰器，包括 `emitDecoratorMetadata`；标准装饰器与 `accessor` 字段尚不支持
- `import` 的 tsconfig `paths`、指向 `.ts` 文件的 `.js` 导入，以及无扩展名导入
- ESM 与 CommonJS，包括 `require()` 一个 `.ts` 文件；`.cts` 文件是 CommonJS，因此使用 `import x = require('...')` 与 `export =`，在其中写 `import`/`export` 声明会失败，并提示把文件重命名为 `.mts`
- 发布在 `node_modules` 中的 TypeScript
- tsconfig 的 `jsx`、`jsxImportSource`、`jsxFactory`、`jsxFragmentFactory`、`useDefineForClassFields` 与 `verbatimModuleSyntax`；默认值参见 [JSX](#jsx) 与 [tsconfig](#tsconfig)

`vpx` 不做类型检查。类型检查请运行 [`vp check`](/guide/check)。

### 选项

- `--tsconfig <path>` 对每个文件应用同一个 tsconfig（参见 [tsconfig](#tsconfig)）
- `--watch` 在它使用的文件变化时重新运行该文件（参见[监听模式](#监听模式)）
- 文件之前的 Node.js 选项（例如 `--inspect`、`--test`、`--env-file`、`--require` 与 `--import`）会传给 Node.js；用 `--require` 与 `--import` 加载的模块也可以是 TypeScript
- 文件之后的所有内容（包括 `--`）都传给脚本

### Shebang 脚本

脚本可以把 `vpx` 用作解释器。让文件可执行并保留其扩展名：

```ts
#!/usr/bin/env vpx
// scripts/release.ts
```

### 在 `package.json` 脚本中

`vite-plus` 包的 `vpx` bin 可以自行运行脚本，因此 `"seed": "vpx ./scripts/seed.ts"` 无需全局 CLI 即可在 `package.json` 脚本中工作。它运行在启动它的 Node.js 上，在 `vp run` 与包管理器脚本内部就是项目的版本。

### 直接使用 Node.js

要用 `node` 运行 TypeScript，请使用 `--import vite-plus/register`。它会在脚本运行之前注册 Vite+ TypeScript 加载器：

```bash
node --import=vite-plus/register ./scripts/seed.ts
node --import vite-plus/register --test ./test/example.test.ts
NODE_OPTIONS='--import=vite-plus/register' node ./scripts/seed.ts
```

请先在项目中安装 `vite-plus`。Node.js 会从项目解析 `vite-plus/register`。该加载器提供与 `vpx` 相同的 TypeScript 转换、tsconfig 解析与 source map，并要求与 Vite+ 相同的 Node.js 版本。

如果某个工具自行启动 Node.js，请把 `--import vite-plus/register` 加入它的 Node.js 参数或 `NODE_OPTIONS`。把现有的 `--import tsx` 参数替换为 `--import vite-plus/register`。例如，AVA 配置可以这样写：

```json
{
  "ava": {
    "nodeArguments": ["--import=vite-plus/register"]
  }
}
```

保留工具现有的 TypeScript 文件模式与其他设置。JavaScript 启动器也可以在动态导入 TypeScript 文件之前运行 `await import('vite-plus/register')`。启动器中的静态 TypeScript 导入会在注册之前解析，因此静态导入请使用 `--import`。

`fork()` 与 worker 通过 Node.js 参数继承 `--import` 选项。`NODE_OPTIONS` 也会把该选项传给派生的 Node.js 进程。替换子进程的参数或环境遵循 Node.js 的正常继承规则。

要选择 tsconfig，请设置 `VP_SCRIPT_TSCONFIG=tsconfig.scripts.json`。现有的 `TSX_TSCONFIG_PATH` 变量也有效，`VP_SCRIPT_TSCONFIG` 优先。否则应用[常规的 tsconfig 发现](#tsconfig)。每个 worker 从自己的环境选择配置，因此 worker 可以使用与父进程不同的配置。

Node.js 拥有其标志、测试发现与原生 watch 模式。Eval 与 stdin 可以导入 TypeScript 文件，但其输入文本不会被转换。用 `--require` 加载的模块先于用 `--import` 加载的模块运行。要加载 TypeScript 设置文件，请把 `--import ./setup.ts` 放在 `--import vite-plus/register` 之后。重复导入 `vite-plus/register` 没有副作用，即使工具已经运行在 `vpx` 之下。

[与 tsx 的编译器差异](#从-tsx-迁移)在使用 `vite-plus/register` 时同样适用。

### 监听模式

```bash
vpx --watch [watch options] [node options] <file> [args...]
```

`vpx --watch` 运行一个文件，并在它使用的文件变化时重新运行，类似 `tsx watch`。它不是 Node.js 自己的 watch 模式：`vpx` 运行的是 oxc-node 的 watcher（`oxnode watch`），由它用 `vpx` 加载器运行文件。

```bash
vpx --watch ./src/server.ts --port 3000
vpx --watch --include "./config/*.json" --exclude "src/**/*.test.ts" ./src/server.ts
vpx --watch --inspect --clear-screen=false ./src/index.ts
```

它会监听脚本导入或 require 的每个文件（在 Node.js 24 及更高版本上也包括 worker 线程中的）、`vpx` 读取的 tsconfig 文件及其 `extends` 的文件、失败导入所查找的文件（因此创建其中一个会重新运行脚本），以及 `--env-file` 文件。除非 `--include` 指名，否则不监听 `node_modules`。按回车立即重新运行。Ctrl+C 停止脚本与 watcher；再按一次强制终止。`vpx --watch --help` 列出选项：

- `--include <glob>` 同时监听匹配的文件，`--exclude <glob>` 从不监听它们
- `--clear-screen=false`（或 `--no-clear-screen`）保留先前运行的输出；只在终端中清屏
- `--kill-signal <signal>` 在重新运行前停止脚本（默认 `SIGTERM`），`--kill-timeout <ms>` 在超过该时长后强制终止（默认 5000）
- `--rerun-on-enter=false`（或 `--no-rerun-on-enter`）把 stdin 留给脚本
- `--poll[=<ms>]` 轮询文件而非使用文件系统事件，适用于 Docker、WSL 与网络驱动器
- `--tsconfig <path>` 对每个文件应用同一个 tsconfig，与 `vpx <file>` 相同

`tsx watch` 的 `--ignore`、`--no-cache` 及其 `CHOKIDAR_USEPOLLING` 变量也有效（`--no-cache` 不起作用：`vpx` 没有转换缓存），Node.js watch 模式选项 `--watch-preserve-output` 与 `--watch-kill-signal` 同样有效，因此为 `tsx watch` 或 `node --watch` 编写的脚本可以平滑迁移。`--watch-path` 会启动 Node.js 的 watch 模式，因此是一个指向 `--include` 的错误；`--test`、`--eval` 以及其他不运行文件的选项也是如此。其他 Node.js 选项放在文件之前。

### tsconfig

`vpx` 从 tsconfig 读取编译器选项，但不用它做类型检查。每个文件使用其上方最近的、通过 `files`、`include`、`exclude` 或项目 `references` 包含它的 `tsconfig.json`，与 `tsc` 一致，并跟随 `extends`。`node_modules` 中的文件不使用 tsconfig，没有任何 tsconfig 包含的文件也不使用，因此获得下文的默认值。这样的文件仍会通过其上方最近的 `tsconfig.json` 解析 `paths` 别名，与 tsx 一致：当根 tsconfig 的 `include` 是 `["src"]` 时，`scripts/` 中的脚本可以导入与 `src/` 相同的别名。由于配置取决于文件位置而非工作目录，无论从何处运行，`vpx` 都以相同方式编译文件。

`--tsconfig <path>` 改为对每个文件应用同一个配置，包括该配置未包含的文件。没有 `--tsconfig` 时，`TSX_TSCONFIG_PATH`、`TS_NODE_PROJECT` 或 `OXC_TSCONFIG_PATH` 可以按此顺序选择配置。如果它指向不存在的文件，或 tsconfig 解析失败，`vpx` 会打印警告并不使用该配置运行。

没有适用 tsconfig 的文件按 `compilerOptions` 为空运行：

| 选项                              | 没有 tsconfig 时                                                                                                                                                                                                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `module`                          | 模块格式来自 `package.json` 的 `"type"`：`"module"` 为 ESM，否则为 CommonJS。`.mts` 始终是 ESM，`.cts` 始终是 CommonJS。tsconfig `module` 为 `node16`、`node18`、`nodenext`、`es2015` 或更高时，`.ts` 与 `.tsx` 文件无论 `"type"` 如何都按 ESM 运行；对于 `node*` 值，`tsc` 与 tsx 则跟随 `"type"`。 |
| `paths`、`baseUrl`                | 无。导入按 Node.js 方式解析，另加 `.js` 到 `.ts` 或 `.tsx`、`.mjs` 到 `.mts`、`.cjs` 到 `.cts`，以及无扩展名导入。                                                                                                                                                                                   |
| `useDefineForClassFields`         | `true`：类字段具有 `[[Define]]` 语义并原生运行，如同 `target` 为 `ES2022` 或更高。更低的 `target` 会切换到 `[[Set]]` 语义，与 `tsc` 一致。                                                                                                                                                           |
| `experimentalDecorators`          | `false`：装饰器会失败，并提示需要该选项。                                                                                                                                                                                                                                                            |
| `emitDecoratorMetadata`           | `false`。                                                                                                                                                                                                                                                                                            |
| `jsx`、`jsxImportSource`          | 自动运行时，导入 `react/jsx-runtime`（参见 [JSX](#jsx)）。                                                                                                                                                                                                                                           |
| `verbatimModuleSyntax`            | `false`：运行时未使用其绑定的导入会被移除，连同其副作用。                                                                                                                                                                                                                                            |
| `rewriteRelativeImportExtensions` | `false`。`./file.ts` 导入两种方式都有效。                                                                                                                                                                                                                                                            |

无论 tsconfig 如何，类型都会被移除，枚举、命名空间与参数属性都会被编译。`strict`、`lib` 与其他类型检查选项没有效果，`target` 只改变类字段默认值。

### JSX

`.jsx` 与 `.tsx` 文件被编译为对 JSX 运行时的调用，默认是 React 的。请安装它们使用的运行时——`react` 或 `jsxImportSource` 指名的包；Vite+ 不随附运行时。tsconfig 选项选择运行时：

| tsconfig `jsx`                 | 输出                                                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| 未设置，或 `"react-jsx"`       | 自动运行时：来自 `<jsxImportSource>/jsx-runtime` 的 `jsx()` 与 `jsxs()`，`jsxImportSource` 默认为 `react` |
| `"react-jsxdev"`               | 开发运行时：来自 `<jsxImportSource>/jsx-dev-runtime` 的 `jsxDEV()`，带每个元素的文件名、行与列            |
| `"react"`                      | 经典运行时：`React.createElement()` 或 `jsxFactory`，片段为 `React.Fragment` 或 `jsxFragmentFactory`      |
| `"preserve"`、`"react-native"` | 自动运行时，因为 Node.js 无法运行 JSX                                                                     |

文件导入的经典工厂（例如 `import { h, Fragment } from 'my-jsx'`）会被保留，即使只有 JSX 使用它。

Pragma 注释会覆盖该文件的 tsconfig：

```tsx
/** @jsxImportSource my-jsx */
```

```tsx
/** @jsxRuntime classic */
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'my-jsx';
```

当文件同时有 `@jsx` 与 `@jsxImportSource` 时，`@jsxImportSource` 选择自动运行时，`@jsx` 被忽略。Pragma 从文件的每个注释中读取，因此普通注释中的 `// @jsxImportSource is set above` 之类的文字也会改变运行时。

`.jsx` 文件只有在 tsconfig 设置 `"allowJs": true` 时才获得该 tsconfig 的 JSX 选项，与 `tsc` 和 tsx 一致。否则使用上文的默认值。

不支持依赖编译器插件的 JSX。`vpx` 只把 JSX 编译为对运行时 `jsx()`、`jsxs()`、`jsxDEV()` 导出或经典工厂的调用。依赖 Babel 或打包器插件转换 JSX 的配置（通常带 `"jsx": "preserve"`）会在运行时失败，或丢失该插件添加的内容。

### 从 tsx 迁移

`vp migrate` 会把 `package.json` 脚本中的 tsx 命令重写为 `vpx`，并在没有任何内容使用 tsx 后移除 `tsx` devDependency；参见 [tsx 到 `vpx`](/guide/migrate-rules)。大多数用 tsx 运行的脚本无需改动即可用 `vpx` 运行。以下差异可能需要修改：

- **JSX 默认值**：没有 tsconfig `jsx` 选项时，tsx 把 JSX 编译为 `React.createElement()`，需要作用域中有 `React`，而 `vpx` 使用自动运行时。设置 `"jsx": "react"` 可保留经典输出。由于其默认值，tsx 还会忽略单独的 `/** @jsxImportSource … */` 注释，除非文件有 `/** @jsxRuntime automatic */` 或 tsconfig 设置了 `"jsx": "react-jsx"`；`vpx` 会直接应用该注释。
- **带 `import` 或 `export` 的 `.cts` 文件**：tsx 把它们编译为 CommonJS，`vpx` 则报错。把文件重命名为 `.mts`，或用 `import x = require()` 与 `export =` 编写。
- **CommonJS 包中的 `import`**：在没有 `"type": "module"` 的包中，tsx 把使用 `import`、`export` 或 `import.meta` 的 `.ts` 或 `.js` 文件编译为 CommonJS，因此 `__filename`、`__dirname` 与 `require` 仍可用。`vpx` 像 Node.js 一样把这样的文件作为 ES 模块运行，因此它们未定义，且从 ES 模块默认导入它时得到的是其默认导出而非整个模块。请改用 `import.meta.filename`、`import.meta.dirname` 与 `createRequire(import.meta.url)`。
- **`require()` 解析**：tsx 把 `require('./a.js')` 映射到 `a.ts`，并对 `require()` 应用 tsconfig `paths`。`vpx` 按 Node.js 方式解析 `require()`，因此请写 `.ts` 扩展名，且只在 `import` 中使用 `paths` 别名。
- **信号**：tsx 把 `SIGINT` 与 `SIGTERM` 转换为退出码 130 与 143，并先运行 `process.on('exit')` 处理器。在 `vpx` 下，信号像在 Node.js 下一样结束脚本，因此请在 `process.on('SIGINT')` 或 `process.on('SIGTERM')` 处理器中清理。
- **Node.js 版本**：`vpx` 需要 Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`，而 tsx 也能在更旧的发行版上运行。
- **Watch 模式**：`tsx watch` 变为 `vpx --watch`，接受 tsx watch 的选项（参见[监听模式](#监听模式)）。它还会在 tsconfig 编辑时，以及失败导入所查找的文件被创建时重新运行脚本，这些是 tsx watch 会遗漏的。
- **Eval、REPL 与 `--check`**：`vpx --eval`、REPL 与 `vpx --check` 不转换 TypeScript。
- **`node --import tsx`**：替换为 [`node --import vite-plus/register`](#直接使用-nodejs)，包括工具设置与 `NODE_OPTIONS` 中的。
- **其他加载器**：把 `--import tsx` 替换为 `--import vite-plus/register`。同时注册两个 TypeScript 加载器会让它们争抢同一批文件。

### 从 oxnode 迁移

`vp migrate` 可以把 `oxnode <file>` 替换为 `vpx <file>`，把 `oxnode watch <file>` 替换为 `vpx --watch <file>`。两者都使用 oxc-node 的转换器与 watcher。加载 `@oxc-node/core/register` 的 Node.js 命令与字面 `NODE_OPTIONS` 赋值改用 `vite-plus/register`。迁移只在没有剩余命令或导入需要它们时移除独立的开发依赖。参见 [oxnode 到 `vpx`](/guide/migrate-rules)。

### 从 ts-node 迁移

`vp migrate` 可以把受支持的仅转译 ts-node 命令替换为 `vpx`。受支持的 Node.js 预加载与字面 `NODE_OPTIONS` 赋值使用 `vite-plus/register`。迁移会保留做类型检查的命令，因为两种替代都不执行该检查。自定义编译器设置以及剩余的加载器或 API 用法也可能让 `ts-node` 保持安装。参见 [ts-node 到 `vpx`](/guide/migrate-rules)。

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

需要一次性执行包而不将其添加到项目依赖时，使用 `vp dlx`。选项与包管理器兼容性参见 [dlx 命令参考](/guide/package-management/dlx)。

```bash
vp dlx <package> [args...]
```

示例：

```bash
vp dlx create-vite
vp dlx oxlint@1.85.0 --version
```
