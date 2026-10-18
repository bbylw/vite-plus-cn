# 迁移规则

本参考详细说明 `vp migrate` 究竟会对项目做什么：如何更新依赖、重写源码导入与包脚本，以及调整包管理器配置。命令概览与工作流参见[迁移指南](/guide/migrate)。

除[迁移之前](#迁移之前)（列出由你自己完成的步骤）之外，下文所述均为自动行为。

## 迁移之前

1. 运行 `vp upgrade`，让全局 CLI 拥有最新的迁移规则。本地 `vite-plus` 版本较旧并不构成阻塞：当项目的本地副本较旧时，迁移会委托给全局 CLI。
2. 必要时先把项目升级到 Vite 7+ 与 Vitest 4+。
3. 从工作区根目录运行 `vp migrate`。在自动化环境中使用 `--no-interactive`。
4. 审查每个变更的清单文件、包管理器配置、源码重写与生成的锁文件。
5. 用 `vp install`、`vp check`、`vp test` 与 `vp build` 验证。

迁移是幂等的：成功迁移后再次运行不应产生新的差异。

## 升级与完整安装

在已经依赖 `vite-plus` 的项目上，`vp migrate` 只执行升级：更新依赖与包管理器配置，并完成导入收尾。它不会触碰项目设置。

- `--full` 还会执行设置操作：git 钩子、编辑器配置、代理文件、ESLint、Prettier 与 tsup 迁移、框架 shim、tsconfig 的 `baseUrl` 修复，以及 `.nvmrc`/Volta 到 `.node-version` 的转换。
- `--hooks`、`--agent` 与 `--editor` 可在不加 `--full` 的情况下选择执行单个设置操作。

当默认升级跳过了本应执行的设置操作时，它会打印一条提示，建议运行 `vp migrate --full`。全新的（非 Vite+）项目始终执行完整迁移。

## 打包配置

`vp migrate` 会为 [tsdown 0.23](https://github.com/rolldown/tsdown/releases/tag/v0.23.0) 更新 `vite.config.*` 中的静态 `pack` 对象以及 `tsdown.config.*` 中导出的对象。该操作也会在现有 Vite+ 项目上运行（无需 `--full`），包括工作区包。支持数组以及由 `defineConfig` 回调直接返回的对象。JSON 形式的 tsdown 配置在合并进 `vite.config.ts` 后会获得相同的更新。

| 旧选项                                                             | 更新后的选项                                                |
| ------------------------------------------------------------------ | ----------------------------------------------------------- |
| `bundle: false`                                                    | `unbundle: true`                                            |
| `bundle: true`                                                     | 移除；打包仍是默认行为                                      |
| `outExtension`                                                     | `outExtensions`                                             |
| `publicDir`                                                        | `copy`                                                      |
| `removeNodeProtocol: true`                                         | `nodeProtocol: 'strip'`                                     |
| `injectStyle`                                                      | `css.inject`                                                |
| `inlineOnly` / `deps.onlyAllowBundle`                              | `deps.onlyBundle`                                           |
| `noExternal`                                                       | `deps.alwaysBundle`                                         |
| `skipNodeModulesBundle: true` / `deps.skipNodeModulesBundle: true` | `deps.neverBundle: true`                                    |
| `dts.tsgo` / `dts.oxc`                                             | 通过 `dts.generator` 选择；保留生成器选项对象并移除布尔标志 |
| `dts.cjsReexport`                                                  | 移除；tsdown 会单独生成 CJS 声明                            |
| `tsdown` 或 `vp pack` 脚本中的 `--public-dir`                      | `--copy`                                                    |

迁移会在最终依赖安装之前检查项目已安装的 tsdown 版本。对于 Vite+ pack 配置，它会读取已安装的 `vite-plus/dist/toolchain.json`。这也包括在迁移重写导入之前就已经导入 `vite-plus/pack` 的 `tsdown.config.*` 文件。独立的 tsdown 配置使用其已安装的 tsdown 版本。没有该清单的旧版 Vite+ 安装保留旧默认值。对于 tsdown 0.23 或更高版本，它不会插入兼容性默认值。对于较旧或未知的版本，它会在缺失时把 `deps.resolveDepSubpath` 设为 `true`，以保留先前的默认值。已启用的 ATTW 检查在未设置 profile 时会获得 `profile: 'strict'`。显式值（包括 `false`）保持不变。

插入的设置包含带文档链接与采用新默认值说明的注释。移除 `deps.resolveDepSubpath: true` 可[按原样保留外部子路径导入](https://tsdown.dev/options/dependencies#deps-resolvedepsubpath)。移除插入的 `attw.profile: 'strict'` 可使用新的 `esm-only` [解析配置](https://tsdown.dev/options/lint#profiles)。这会跳过 `node10` 与 CommonJS 解析检查。如果你的包需要先前行为，请保留其中任一设置。迁移不会把这类注释添加到显式设置上。

`noExternal` 会移到 `deps.alwaysBundle`，并保留匹配表达式、引用与回调方法。已有的 `deps.alwaysBundle` 值保持不变。

当 `external` 与任一种 `skipNodeModulesBundle` 形式同时出现时，静态匹配器与对本地常量的引用会在设置 `deps.neverBundle` 之前移到 `inputOptions.external`。常量声明与引用保持完整。这会保留原始匹配规则，包括外部文件路径。不支持的匹配器、冲突的 `inputOptions` 以及声明特有的依赖规则会使 pack 对象保持不变，并产生手动迁移警告。

该转换不会求值配置代码。包含展开、计算键或重复键的对象，以及新旧选项冲突的情况，都需要手动审查。动态布尔选择器保持不变。无关的 Vite 与插件选项保持不变。迁移后运行 `vp pack` 检查结果。Node.js 要求、TypeScript 模块解析以及程序化的 `build()` 返回值需要单独审查。

## 任务缓存配置

`vp migrate` 会把每个任务顶层的 `env`、`untrackedEnv`、`input` 与 `output` 移入该任务的 [`cache`](/config/run) 对象。它会更新 `vite.config.*` 中的静态 `run.tasks` 对象。该操作也会在现有 Vite+ 项目上运行（无需 `--full`），包括工作区包。

| 之前的任务配置   | 更新后的任务配置                |
| ---------------- | ------------------------------- |
| 没有 `cache`     | 添加 `cache` 并放入被移动的设置 |
| `cache: true`    | 用被移动的设置替换 `true`       |
| `cache: { ... }` | 把被移动的设置添加到现有对象    |

```ts
// 之前
build: {
  command: 'vp build',
  env: ['NODE_ENV'],
  input: [{ auto: true }, '!dist/**'],
},

// 之后
build: {
  command: 'vp build',
  cache: {
    env: ['NODE_ENV'],
    input: [{ auto: true }, '!dist/**'],
  },
},
```

被移动的设置会保留其文本与缩进，[迁移之后](#迁移之后)所述的格式化步骤会把它们缩进到 `cache` 内。位于被移动设置上方独立成行的注释，以及紧随该设置之后的同行 `//` 注释，都会随之移动。

该转换不会求值配置代码。当任务具有以下情况时，它会保持任务不变并打印手动迁移警告：

- 展开，或计算键、转义键、重复键；
- 被移动的设置以方法形式书写，如 `input() { ... }`；
- 被移动的设置与其逗号之间存在注释，或在 `cache` 中最后一个设置之后存在注释；
- `cache` 中已存在同名的被移动设置；
- `cache` 的值不是 `true` 或对象字面量。

它还会对位于非导出配置对象中的任务发出警告，例如配置所引用的变量或传给 `mergeConfig` 的对象。在其他模块中创建的任务（例如通过共享辅助函数创建）不会被检测到。请手动移动它们的设置；`vp run` 会列出每一个仍需要处理的任务。

当 `cache: false` 时，被移动的设置不会生效，因此需要决定是移除它们还是启用缓存。在其余方面已是最新的项目上，`vp migrate` 会打印这些警告，而不会运行迁移的其余部分。

## 依赖规则

迁移会保留项目的包管理器声明策略。已有的 `packageManager` 或 `devEngines.packageManager` 字段仍是唯一事实来源，而仅依赖其锁文件的项目保持未固定状态。特别是，迁移不会把自身安装所使用的包管理器版本变成面向贡献者或 CI 的新的精确要求。当迁移推断出未声明的包管理器时，它会打印警告，并为希望显式固定的项目指向 `vp env pin`。

各种工具链依赖的处理方式一览：

| 依赖                           | 处理方式                                                                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `vite-plus`                    | 在迁移的包中添加；普通范围会直接或通过 catalog 重新固定到具体目标版本。                                                           |
| `vite`                         | 保留现有声明并指向 core 别名。只使用 `vite-plus` 的 pnpm 包无需新增 `vite` 条目（参见 [Vite 与 Overrides](#vite-与-overrides)）。 |
| `vitest`                       | 在常见的 node 模式场景中移除，因为 `vite-plus` 会传递提供它。仅在[需要直接安装](#何时需要直接安装-vitest)时保留或添加。           |
| `@vitest/*`                    | 直接安装的同步发布包会对齐到捆绑的 Vitest 版本（参见 [Vitest 生态包](#vitest-生态包)）。                                          |
| `@voidzero-dev/vite-plus-test` | 在所有位置移除：依赖、overrides、resolutions 与 catalog 别名。导入会被重写为当前的 `vite-plus/test*` 接口。                       |

### 版本选择

- `vite-plus` 会固定到运行迁移的 CLI 的具体版本，绝不使用 `latest` dist-tag。
- `vite` 别名指向同一 Vite+ 版本中的 `@voidzero-dev/vite-plus-core`。
- 由 catalog 支撑的清单可能包含 `catalog:` 或具名 catalog 引用。迁移会保留该引用，并把所引用的 catalog 值更新为具体的工具链目标版本。
- 有意使用的协议固定会被保留：`workspace:`、`file:`、`link:`、`npm:`、`github:`、Git URL 与 HTTP URL。
- 迁移会协调每个工作区包，而不仅是根清单。共享的 overrides 与 catalog 保留在工作区根目录；提供 peer 的依赖应放在需要它的各个包中。

### Vite 与 Overrides

你可以在 pnpm 包中使用 `vite-plus` 而不声明 `vite`。`vite-plus` 包包含一个别名指向其 core 的 `vite` 依赖，它提供了 Vitest 所需的 peer。迁移会为其他 Vite 使用方保留工作区 override，但不会仅仅因为某个包使用了 `vite-plus` 就为它添加 `vite`。

相关规则：

- 直接声明的 `vite` 绝不会仅因为存在根 override 就被移除。
- 普通或过期的别名会被规范化；具名 catalog 引用会被保留。
- 在 pnpm 下，受管理的 override 键使用显式的 `@*` 范围（`vite@*`、`vitest@*`）。pnpm 通过替换每个清单（包括 importer 清单）中声明的 spec 来应用 override。裸键会匹配任何 spec，包括 `catalog:`，随后 `vp up` 会把该引用重写为具体版本。`@*` 范围使 override 作用于传递依赖与 peer 声明所使用的 semver 范围，并把 `catalog:` 引用留给 catalog——后者已将其解析为 Vite+ core。迁移会为仍使用裸键的项目重新设置键，并保留其具名 catalog 选择。
- Bun 会为核心别名镜像一个直接依赖以服务于其 peer 解析器；npm 的浏览器 provider 布局可能需要一个顶层 `vite` 边，以便嵌套的 Vitest 包能够解析 `vite`。

### 何时需要直接安装 Vitest

当满足以下任一条件时，迁移会以捆绑的确切版本保留或添加包内的 `vitest`：

- 某个已安装依赖具有非可选的 `vitest` peer，无论是精确版本还是版本范围；
- 该包使用 Vitest 浏览器模式或可选的浏览器 provider；
- 源码或 TypeScript 配置保留了上游 `vitest` 引用；
- 该包声明了 `@nuxt/test-utils`；或
- 依赖元数据不可用，且现有的直接 `vitest` 可能正在满足某个未知的必需 peer。

检测会读取已安装的 peer 元数据，因此像 `vite-plugin-gherkin` 这类名称中不含 `vitest` 的集成也能被处理。

当某个包符合条件时，迁移会：

- 把 `vitest` 添加到该包，而不是不加区分地添加到每个工作区包；
- 在支持时使用现有 catalog 引用，否则使用捆绑的确切版本；以及
- 保留匹配的工作区 override 或 resolution，使依赖图解析出单一的 Vitest 版本。

仅凭 peer 声明并不会安装 Vitest。如果保留下来的 `peerDependencies.vitest` 使用了迁移将要移除的 catalog 条目，会先把它解析为公开的 peer 范围。

### Vitest 生态包

官方现行的 `@vitest/*` 包通常与 Vitest 同步发布。迁移会对齐项目直接安装的这些包，包括 `@vitest/coverage-v8`、`@vitest/coverage-istanbul`、`@vitest/ui` 与 `@vitest/web-worker`：

- 当包管理器支持 catalog 时，它们会通过工具链 catalog 引用：保留已有的 `catalog:` / `catalog:<name>` 引用，为缺少条目的包添加 catalog 条目，并把每个条目更新为捆绑的 Vitest 版本；
- 当不支持 catalog 时（npm、独立的 bun 项目，或 catalog 之前的 pnpm/Yarn），则写入具体的捆绑版本。

**不**参与对齐的包：

- `@vitest/eslint-plugin` 遵循自己的版本线；
- `@vitest/coverage-c8` 停留在较早的版本，没有 Vitest 4 版本；以及
- 第三方 `vitest-*` 集成保持各自兼容的版本，但它们所需的 Vitest peer 仍可能触发[直接安装](#何时需要直接安装-vitest)。

对于浏览器模式，Vite+ 捆绑了基础 `@vitest/browser` 运行时与 `@vitest/browser-preview`；迁移会移除它们的直接依赖条目。Playwright provider 仍为可选。迁移会通过首选的工具链 catalog 或依赖条目，为 `@vitest/browser-playwright` 使用捆绑的 Vitest 版本，并同时安装其 `playwright` peer。

迁移会在重写导入之前检测 Playwright 的使用情况，包括旧有的 `vitest/browser-playwright`、`vitest/browser/providers/playwright` 与 `vitest/plugins/browser-playwright` 别名。

`vp migrate` 会把已移除的 Vite+ WebDriverIO 别名恢复为 `@vitest/browser-webdriverio`，并在 provider 缺失时添加 `^5.0.0`。它会升级较旧的版本、收窄允许低于 `5.0.0` 的范围、更新所引用的 catalog 条目，并移除强制使用旧 provider 的 overrides。满足最低要求的版本与范围保持不变。迁移会确保所需的 `webdriverio` peer 就位，并添加与捆绑 Vitest 匹配的 `@vitest/browser` override（Yarn 使用 `resolutions`）。后续的社区 provider 升级由你管理。参见[社区 WebDriverIO provider](/guide/vitest-v5)。

对象值的嵌套 npm 与 Bun overrides 会被保留：它们是用户定义的作用域，而不是标量版本固定。

## 源码重写规则

### `vite` 导入

`vite` 与 `vite/*` 导入**仅在配置入口文件中**会被重写为 `vite-plus`：`vite.config.*`、`vitest.config.*`，以及迁移所解析到的任何配置文件。其他所有文件保留其 `vite` 导入，原因有二：

- `vite-plus` 并非 Vite 暴露面的超集保证。它只拥有 `defineConfig`、`defineProject` 与 `lazyPlugins`，因此重写 `createBuilder` 或 `loadConfigFromFile` 这类透传符号（包括 `typeof import('vite')` 类型位置中的）可能导致问题。
- 未重写的 `vite` 导入在 Vite+ 项目中仍会通过 `@voidzero-dev/vite-plus-core` 别名解析。

插件包（以 `vite-plugin-` 或 `unplugin-` 开头的无 scope 名称，或在 `peerDependencies`/`dependencies` 中声明 `vite` 的包）即使在配置文件中也会跳过重写。该规则仅作用于 `vite` 说明符。

`declare module 'vite'` 增强遵循同一规则，并在配置文件之外被保留。通过 core 别名，它们会到达同一个 `@voidzero-dev/vite-plus-core` 模块，而该模块的 `UserConfig` 类型为来自 `vite-plus` 的 `defineConfig` 提供类型，因此迁移后它们仍能正常工作；`vite-plus` 本身不导出 `UserConfig` 符号，所以被重写的 `declare module 'vite-plus'` 增强将无从合并。针对 `vite-plus` 自身暴露面的扩展需要手动基于 `vite-plus` 编写。

### `vitest` 与浏览器导入

- 普通的 `vitest` 与 `vitest/*` 导入会被重写为 `vite-plus/test*`。
- 旧有的 Playwright 与 WebdriverIO provider 导入会在该重写之前被检测到，以免它们的可选 provider 依赖丢失。
- 带 scope 的 `@vitest/browser*` 导入会被重写为对应的 `vite-plus/test/browser*` 导出，并在需要时提供可选 provider。
- 已有的 `vite-plus/test*` 导入保持不变。

### Oxlint JS 插件导入

Vite+ 捆绑了 Oxlint，因此迁移会移除独立的 `oxlint` 依赖。你自己的 Oxlint JS 插件按名称导入编写 API。依赖消失后，该导入将无法解析。随后 `vp lint` 会加载插件失败。

迁移会把这些导入重新指向 Vite+：

- 把 `@oxlint/plugins` 重写为 `vite-plus/lint/plugins`。
- 把 `oxlint/plugins-dev` 重写为 `vite-plus/lint/plugins-dev`。
- 当导入命名的是编写 API 中的绑定（如 `defineRule`、`definePlugin` 或 `Context`）时，把 `oxlint` 重写为 `vite-plus/lint/plugins`。较旧的 Oxlint 版本从主入口暴露该 API。它现在位于 `@oxlint/plugins`。

通过 Vite+ 的导入始终与 Vite+ 捆绑的 Oxlint 版本一致。你无需再固定第二个包。该导入也能从任何已经依赖 `vite-plus` 的包中解析。

迁移会保持三种形式不变：

- 只命名配置面（如 `defineConfig`、`OxlintConfig` 或 `OxlintOverride`）的 `oxlint` 导入。它们仍会针对独立包解析。
- 默认导入与命名空间形式的 `oxlint` 导入。它们没有命名任何绑定，因此迁移无法区分这两种暴露面。
- 仅产生副作用的裸 `oxlint` 导入，原因相同。

迁移还会跳过在 `dependencies` 或 `peerDependencies` 中声明 `oxlint` 或 `@oxlint/plugins`、或在 `optionalDependencies` 中声明 `@oxlint/plugins` 的包。这些依赖可能提供已发布的 Oxlint 插件，而其使用方可能并不运行 Vite+。

当源码、包导入别名或已构建的插件仍引用 `@oxlint/plugins` 时，清理会保留对它的开发依赖。这也包括 `dist`、`build` 和 `out` 等目录中被忽略的输出。

### 永不重写的内容

- `declare module 'vitest'` 与 `declare module '@vitest/browser*'`：模块增强必须保留上游模块标识。
- 遗留下来的引用，如 `compilerOptions.types`、`require.resolve`、`import.meta.resolve` 与 `vitest/package.json`，需要包内的 Vitest（参见[何时需要直接安装 Vitest](#何时需要直接安装-vitest)）。
- 在声明了 `@nuxt/test-utils` 的包中，每个 `vitest` 与 `vitest/*` 模块说明符都会在整个包范围内保留：Nuxt 的转换要求上游标识，否则可能注入重复的 `vi` 导入。该例外不适用于同级包，也不适用于带 scope 的 `@vitest/browser*` 导入。

`prefer-vite-plus-imports` 代码检查规则遵循相同的 Nuxt 例外，因此代码检查的自动修复也会保留这些导入。

## 包脚本重写规则

迁移会重写 `package.json` 脚本中由 Vite+ 工具链提供的命令，同时保留其参数：

| 之前          | 之后                           |
| ------------- | ------------------------------ |
| `vite`        | `vp dev`，或对应的 `vp` 子命令 |
| `vitest`      | `vp test`                      |
| `oxlint`      | `vp lint`                      |
| `oxfmt`       | `vp fmt`                       |
| `tsdown`      | `vp pack`                      |
| `lint-staged` | `vp staged`                    |
| `eslint`      | `vp lint`，当其可选迁移运行时  |
| `prettier`    | `vp fmt`，当其可选迁移运行时   |
| `tsup`        | `vp pack`，当其可选迁移运行时  |

对于通过 `bunx` 启动的命令，迁移会保留 `bunx` 及其 `--bun` 标志（保留用户选择的运行时），只重写受管理的命令。当 `bunx` 跟在 `run` 或 `--` 这类命令启动分隔符之后时，这也同样适用：

| 之前                                                    | 之后                                                     |
| ------------------------------------------------------- | -------------------------------------------------------- |
| `bunx --bun vite build`                                 | `bunx --bun vp build`                                    |
| `bunx --bun vitest run`                                 | `bunx --bun vp test run`                                 |
| `portless --tailscale run bunx --bun vite`              | `portless --tailscale run bunx --bun vp dev`             |
| `dotenv -e .env.test -- bunx --bun oxlint --type-aware` | `dotenv -e .env.test -- bunx --bun vp lint --type-aware` |

无关的 `bunx` 命令以及其他包执行器形式保持不变。

## 持续集成规则

迁移会把 `.github` 下 GitHub Actions 工作流与复合 action 中精确的 `voidzero-dev/setup-vp@v1` 引用替换为该 Vite+ 版本已知的最新精确 `setup-vp` 发布版本。冻结的 `v1` 标签不再接收新版本。已有的精确版本与提交 SHA 保持不变。

## Node.js 版本规则

迁移会把旧有的 Node.js 版本管理器文件转换为 `.node-version`，即 Vite+ 读取的格式。在现有 Vite+ 项目上，该转换属于完整安装操作的一部分，因此通过 `vp migrate --full` 运行；全新迁移则无条件运行。

- `.nvmrc` 与 Volta 的 `volta.node` 固定会被转换为 `.node-version`。已有的 `.node-version` 会被保留。
- 当 `.nvmrc` 被移除时，`.github/workflows/*.{yml,yaml}` 及 `.github` 下复合 action（`.github/**/action.{yml,yaml}`）中任何 `actions/setup-node` 的 `node-version-file: .nvmrc` 引用都会被重新指向 `.node-version`，以免 CI 因 "node version file ... does not exist" 而失败。

## 包管理器规则

### pnpm

**根设置位置。** pnpm 10.6.2+ 使用 `pnpm-workspace.yaml` 作为受支持根设置的唯一来源。迁移会把可识别的 `package.json#pnpm` 字段移入其中，包括 overrides、peer 规则、patch 设置、包扩展、架构与构建策略、audit/update 配置以及配置依赖。当 `pnpm` 对象变空时移除它，并保留可能属于其他工具的未知键。

- 当两个文件定义了相同的迁移设置时，对象条目会递归合并，唯一的数组条目会被保留。在冲突的标量叶子处，`package.json#pnpm` 的值优先，同时保留仅存在于工作区的同级条目。
- 在 pnpm 10.6.2 之前，这些设置保留在 `package.json#pnpm` 中。（工作区设置的支持是逐步加入的：总体从 10.5.0 开始，overrides 从 10.5.1 开始，`peerDependencyRules` 从 10.6.2 开始。pnpm 11 不再读取旧的 `package.json` 设置。）

**Catalogs。** Catalogs 是一项独立特性，从 pnpm 9.5.0 开始支持，与上述设置边界无关。即使低于 10.6.2（overrides 仍留在 `package.json#pnpm`），迁移仍会重写工作区 catalog 以摆脱过期的包装别名，并保留 `catalog:` overrides 作为引用，而不是将其内联为具体版本。

- 依赖引用、默认与具名 catalog、overrides 以及 `peerDependencyRules` 之间保持一致。
- pnpm 接受逻辑默认 catalog 为顶层 `catalog` 或 `catalogs.default`，但二者不能并存。迁移会保留现有形式，绝不会在其旁边创建另一种形式。
- 当已有具名 catalog 拥有 `vite-plus`、`vite` 或 `vitest` 时，迁移会复用该受管理的工具链 catalog 来承载新增的依赖与 overrides。只有在无法复用任何受管理或默认 catalog 时，才会创建顶层默认 catalog。

**其他规则。**

- 使用 `vite-plus` 而未直接声明 `vite` 的包保持该布局（参见 [Vite 与 Overrides](#vite-与-overrides)）。
- 无关的选择器形式与对象值 overrides 会被保留。

### npm

- 直接别名会在添加匹配的 override 之前规范化，以免 npm 因 `EOVERRIDE` 失败。
- 当真实的 Vite 安装变为 core 别名时，会在重新安装之前清除过期的 Vite 安装与锁文件状态。
- 可选的浏览器 provider 布局在嵌套 Vitest 包无法解析 `vite` 时，会获得一个顶层 `vite` 边。

### Yarn

- Vite+ 不支持 Plug'n'Play。迁移会检测显式与隐式 PnP，并把项目转换为 `nodeLinker: node-modules`，同时保留所有无关的 `.yarnrc.yml` 设置。`--no-interactive` 会接受该转换；进程级的 `YARN_NODE_LINKER=pnp` 必须由调用方修正。
- catalog 引用与用户的 hoisting 设置会被保留。
- 迁移会避免在工作区 hoisting 隔离下出现分裂的 Vitest 副本：尽可能应用包级修复，并在无法安全更改隔离时给出警告。

### Bun

- Bun catalog 只在工作区内解析（根 `package.json` 具有非空的 `workspaces`）。在 bun 工作区中，保留现有的顶层或工作区 catalog 位置以及具名 catalog 引用。独立（单包）bun 项目保留具体 spec，且不会获得 catalog 字段，因为 `bun install` 无法在工作区之外解析 `catalog:`。
- core 别名会被镜像为直接 `vite` 依赖，以便 Bun 在应用 overrides 之前看到 peer 提供方。

## 迁移之后

- 检查每个 Vite 配置是否存在与 Rolldown 不兼容的模式（如 `manualChunks`）。发现的内容会作为警告报告；配置不会被改动。
- 依赖会重新安装一次以刷新锁文件。如果安装失败，迁移会报告错误并以非零状态退出。
- 迁移成功后，`vp fmt` 会对迁移期间变更的文件运行，排除在 Git 工作树中本就已脏的路径。Oxfmt 会选择受支持的格式；非 Git 项目保留全项目格式化。项目仍使用 Prettier 时会跳过格式化。格式化器失败会作为警告报告，以便迁移结果与手动格式化命令仍然可用。
