# 迁移到 Vite+

`vp migrate` 帮助把现有项目迁移到 Vite+。

## 概览

该命令是把分散的 Vite、Vitest、Oxlint、Oxfmt、ESLint、Prettier、tsdown 和 tsup 配置整合到 Vite+ 的起点。

当你希望把一个现有项目交由 Vite+ 的默认配置接管、而不是手动逐个接入每个工具时，可以使用它。

## 用法

```bash
vp migrate
vp migrate <path>
vp migrate --no-interactive
```

## 目标路径

位置参数 `PATH` 是可选的。

- 省略时，`vp migrate` 迁移当前目录
- 提供时，改为迁移该目标目录
- 对于 monorepo，目标必须是工作区根目录。Vite+ 无法只迁移一个工作区成员，因为迁移会更新所有成员共享的包管理器配置、catalog 与锁文件。

```bash
vp migrate
vp migrate my-app
```

## 选项

- `--agent <name>` 把代理指令写入项目
- `--no-agent` 跳过代理指令设置
- `--editor <name>` 把编辑器配置文件写入项目
- `--no-editor` 跳过编辑器配置设置
- `--hooks` 设置提交钩子
- `--no-hooks` 跳过钩子设置
- `--no-interactive` 无提示运行迁移

## 迁移流程

`migrate` 命令旨在快速把现有项目迁移到 Vite+。以下是该命令所做的工作：

- 更新项目依赖
- 在需要处重写导入
- 把各工具特有的配置合并进 `vite.config.ts`
- 把脚本更新为 Vite+ 的命令集合
- 可以设置提交钩子
- 可以写入代理与编辑器配置文件
- 对迁移后的项目执行格式化

关于具体的依赖、源码重写与包管理器行为，参见[迁移规则](/guide/migrate-rules)。

大多数项目在运行 `vp migrate` 之后仍需要进一步手动调整。

关于 Vitest v5 升级，请阅读[兼容性设置与审查清单](/guide/vitest-v5)和[上游 Vitest 迁移指南](https://vitest.dev/guide/migration/)。预检会在更新依赖之前检查你原始的 runner 版本与 Node 运行时。请保留原始锁文件，并在重试之前解决阻塞性问题。

## 推荐工作流

在运行迁移之前：

- 对于尚未使用 Vite+ 的项目，先升级到 Vite 7+ 和 Vitest 4+
- 确保你了解需要保留的现有代码检查、格式化或测试设置

运行迁移之后：

- 运行 `vp install`
- 运行 `vp check`
- 运行 `vp test`
- 运行 `vp build`（如果你在构建库，则运行 `vp pack`）

## 迁移提示

查看并复制以下提示，粘贴到你的编程代理中，即可把现有项目迁移到 Vite+：

```text
请将此项目迁移到 Vite+，同时保留其应用、测试与库构建行为。

在做出改动前，先阅读以下指南：
- https://viteplus.dev/guide/migrate
- https://viteplus.dev/guide/migrate-rules
- https://viteplus.dev/guide/vitest-v5
- https://vitest.dev/guide/migration/
- https://github.com/rolldown/tsdown/releases/tag/v0.23.0

检查工作树并保留无关改动。确认工作区根目录、包管理器、脚本、配置文件与正在使用的工具。如果项目已经使用 Vite+，请遵循迁移指南中的升级流程并保留现有设置；除非我要求，否则不要使用 --full。

对于尚未使用 Vite+ 的项目，先检查其所用工具的前置条件：Vite 7+ 与 Vitest 4+。完成必要的上游升级并验证，然后再开始 Vite+ 迁移。随后保留这些清单文件、锁文件与已安装的包，以便迁移工具识别原始的 Vitest 版本。不要在运行迁移之前安装 vite-plus，或把 Vitest 升级到目标版本捆绑的版本。

使用目标 Vite+ 1.0 版本（或其预览构建）的 CLI，并使用兼容性指南中受支持的 Node.js 运行时。全局安装是可选的：
- 已全局安装 vp 时，按 https://viteplus.dev/guide/upgrade 选择目标版本，并检查 `vp toolchain --global`。运行 `vp help` 与 `vp help migrate`，然后在工作区根目录运行 `vp migrate --no-interactive`。
- 未安装全局 CLI 时，在工作区根目录通过包管理器运行目标 CLI。对于 1.3.0 版本，使用 `pnpm dlx --package=vite-plus@1.3.0 vp migrate --no-interactive` 或 `npx --package=vite-plus@1.3.0 vp migrate --no-interactive`。先运行带 `help migrate` 的同一命令（而不是 `migrate --no-interactive`）以阅读其帮助信息。这些命令会在不替换旧项目依赖的前提下拉取目标 CLI。

把 1.3.0 替换为预期的发布版本。如需预览版，使用其 PR 中的版本，并在 vp 命令之前向 pnpm 或 npx 传入 --registry=https://registry-bridge.viteplus.dev。

不要使用旧项目的 node_modules/.bin/vp 运行迁移。monorepo 请从工作区根目录迁移，以保证共享清单、catalog、overrides 与锁文件保持一致。

解决 BLOCK 项并重新运行迁移。即使迁移成功退出，也要按链接中的指引审查每个 REVIEW 项与手动迁移警告。首次验证运行前，保留生成的 Vitest v4 与 tsdown <0.23 兼容性设置及注释。

对照迁移规则检查生成的改动：
- 确认 Vite 与测试导入使用受支持的 vite-plus 与 vite-plus/test* 入口。类型增强仍保留在上游模块标识上，社区 WebDriverIO provider 仍使用 @vitest/browser-webdriverio。
- 保留迁移工具配置的依赖、别名、catalog 与 overrides。在 pnpm 上保留配置的 vite 与 vitest 条目。当迁移规则要求时，保留上游包。
- 把其余工具专属配置移入 vite.config.ts 中对应的块。审查代码检查、格式化、打包与钩子的手动后续工作，不要丢弃项目特有的行为。
- 区分内置命令与任务：`vp dev` 与 `vp test` 运行内置工具；`vp run dev` 与 `vp run test` 运行对应的项目脚本或任务。packageManager 字段决定 `vp install`、`vp add` 与 `vp remove` 使用的包管理器。

运行 `vp install`、`vp check` 与 `vp test`，以及已配置的浏览器、覆盖率与基准测试套件。应用运行 `vp build`，库运行 `vp pack`，工作区两者兼备时都运行。对照产出的导入与声明检查库的使用方。没有全局 CLI 时，用项目的包管理器安装，并通过它调用更新后的本地 CLI，例如 `pnpm exec vp check` 或 `npm exec -- vp check`。修复失败时不要削弱断言或降低测试覆盖率。

在建立通过的基线后，尝试在不改动代码或仅做小幅本地修复的情况下，移除生成的 "Vitest v4 compatibility" 设置：
1. 借助迁移 diff 与生成的注释，找出根配置、工作区配置与内联项目配置中的新增项。阅读每条链接说明，并检查移除后的实际生效值，包括继承值。保留原有的用户设置与来源不明的设置。
2. 每次只移除一个新增设置，先在改动代码之前运行受影响的测试。必要时做小幅本地修复（应用、测试或 setup），以保留测试意图。不要削弱断言、未经审查就接受快照变化，或减少测试集。对于 fakeTimers.toNotFake，只移除新增的 Temporal 条目，并保留其他排除项。不要削弱覆盖率约束：除非我批准聚合检查，否则保留 glob 阈值的 perFile: true。
3. 只有在受影响的测试通过且仍执行相同测试（没有新增跳过）时才保留移除结果，同时删除该设置生成的注释。如果移除需要大量测试改动或共享 setup 重构，暂时保留兼容性并报告后续工作。如果验证失败、无法运行或行为仍不确定，恢复该设置及其注释。
4. 在接受这些移除后重新运行完整的验证命令。报告每个候选项的配置路径、移除或保留状态、代码改动、命令与结果，以及保留原因。

对于使用 vp pack 的项目，在库构建通过后还要审查生成的 "tsdown <0.23 compatibility" 设置。利用迁移 diff 与链接注释区分插入的设置与原有的用户选择。移除 deps.resolveDepSubpath: true 会按原样保留外部子路径导入，请确认使用方仍能解析产出的导入。移除 attw.profile: 'strict' 会采用 esm-only 配置，从而跳过 node10 与 CommonJS 解析检查。如果这些检查属于包的预期支持范围，请保留 strict。不要仅仅为了让构建通过而放弃声明检查。每次移除一个设置及其注释，然后运行 vp pack 与包的使用方检查。如果验证失败或所需的使用方行为不明确，恢复该设置与注释。

报告迁移改动、验证结果、保留的兼容性设置与未解决的问题。除非我要求，否则不要提交或推送。
```

## 从 Vite+ 0.3 升级到 1.0

Vite+ 1.0 包含 Vitest 5 中的破坏性变更。请同时阅读 [Vite+ 兼容性指南](/guide/vitest-v5) 与[上游迁移指南](https://vitest.dev/guide/migration/)。

库构建也改用 tsdown 0.23。请查看[打包配置迁移规则](/guide/migrate-rules)与[上游发布说明](https://github.com/rolldown/tsdown/releases/tag/v0.23.0)，了解选项变化与新默认值。

在迁移识别出旧 runner 之前，请保留项目原有的依赖与锁文件。提前更新项目依赖可能导致迁移无法保留 v4 行为。请从工作区根目录使用以下任一方式。

### 使用全局 CLI

把[全局 CLI](/guide/upgrade)升级到目标 1.0 版本，然后运行 `vp migrate --no-interactive`。如需预览版，请遵循[预览安装说明](/guide/upgrade)。

### 不安装全局 CLI

使用满足 `^22.18.0 || ^24.11.0 || >=26.0.0` 的现有 Node.js 运行时。通过包管理器运行目标迁移工具，而不要先把它加入项目。对于 `1.3.0` 版本：

**pnpm**

```bash
pnpm dlx --package=vite-plus@1.3.0 vp migrate --no-interactive
```

**npm**

```bash
npx --package=vite-plus@1.3.0 vp migrate --no-interactive
```

把 `1.3.0` 替换为目标版本。如需预览版，使用其 PR 中的版本，并在 `vp` 命令之前向 `pnpm` 或 `npx` 传入 `--registry=https://registry-bridge.viteplus.dev`。请始终在 `--package` 中写明显式版本，以确保运行的是目标迁移工具，而不是旧的本地 CLI。

迁移完成后，使用更新后的本地 CLI 完成依赖安装并验证：

**pnpm**

```bash
pnpm install
pnpm exec vp check
pnpm exec vp test
pnpm exec vp build
```

**npm**

```bash
npm install
npm exec -- vp check
npm exec -- vp test
npm exec -- vp build
```

对于使用 pack 命令的库，请用 `vp pack` 代替 `vp build`。同时运行已配置的浏览器、覆盖率与基准测试套件。

### 审查升级

在现有 Vite+ 项目上，使用默认升级流程。如果你还想重复项目设置，请加上 `--full`。提交之前解决阻塞项并审查按文件列出的报告。关于每种模式的范围，参见[升级与完整安装](/guide/migrate-rules)。

迁移后的项目通过验证后，[检查是否可以在不改代码或仅做小幅本地修复的情况下移除生成的 v4 兼容性设置](/guide/vitest-v5)。如果移除需要大量测试改动，或者你无法验证结果，请暂时保留兼容性。

对于库，在 `vp pack` 成功运行后，审查生成的 [tsdown 兼容性设置](#tsdown)。在采用新默认值之前，先阅读它们的文档链接，并与包的使用方一起检查产出的导入与声明。

### 复制提示

查看并复制以下提示，粘贴到你的编程代理中，即可升级现有的 Vite+ 0.3 项目：

```text
请将此项目从 Vite+ 0.3.x 升级到 Vite+ 1.0，同时保留其测试与库构建行为。

在做出改动前，先阅读以下指南：
- https://viteplus.dev/guide/migrate
- https://viteplus.dev/guide/vitest-v5
- https://vitest.dev/guide/migration/
- https://viteplus.dev/guide/migrate-rules
- https://github.com/rolldown/tsdown/releases/tag/v0.23.0

检查工作树并保留无关改动。保留原始清单文件、锁文件与已安装的包，以便迁移工具识别原始的 Vitest 版本。不要在运行迁移之前更新项目的 vite-plus 或 Vitest 依赖。

使用目标 Vite+ 1.0 版本（或其预览构建）的 CLI。全局安装是可选的。使用 Vite+ 兼容性指南中受支持的 Node.js 运行时。

- 已全局安装 vp 时，按 https://viteplus.dev/guide/upgrade 升级它，并检查 `vp toolchain --global`。运行 `vp help migrate`，然后在工作区根目录运行 `vp migrate --no-interactive`。
- 未安装全局 CLI 时，在工作区根目录通过包管理器运行目标 CLI。对于 1.3.0 版本，运行 `pnpm dlx --package=vite-plus@1.3.0 vp migrate --no-interactive` 或 `npx --package=vite-plus@1.3.0 vp migrate --no-interactive`。先阅读其帮助输出，这些命令不会先替换项目依赖。

把 1.3.0 替换为预期的发布版本。如需预览版，使用其 PR 中的版本，并在 vp 命令之前向 pnpm 或 npx 传入 --registry=https://registry-bridge.viteplus.dev。不要使用旧项目的 node_modules/.bin/vp 运行迁移。保留现有的项目设置；除非我要求，否则不要使用 --full。

解决 BLOCK 项并重新运行迁移。即使迁移成功退出，也要按文档链接审查每个 REVIEW 项。保留测试意图，并在首次验证运行前保留生成的 Vitest v4 与 tsdown <0.23 兼容性设置及注释。

对照 Vite+ 指南检查工作区清单、catalog、overrides 与导入改动。把测试 API 保留在受支持的 vite-plus/test 入口上；社区 WebDriverIO provider 使用 @vitest/browser-webdriverio。

运行 `vp install`、`vp check` 与 `vp test`，以及项目已配置的浏览器、覆盖率与基准测试套件。按需运行 `vp build` 或 `vp pack`。没有全局 CLI 时，用项目的包管理器完成安装，并通过它调用更新后的本地 CLI，例如 `pnpm exec vp check` 或 `npm exec -- vp check`。修复迁移失败时不要削弱断言或降低测试覆盖率。

在建立通过的基线后，尝试在不改动代码或仅做小幅本地修复的情况下，移除生成的 "Vitest v4 compatibility" 设置：
1. 逐项移除，先在改动代码之前运行受影响的测试，并检查移除后的实际生效值，包括继承值。保留原有的用户设置与来源不明的设置。
2. 只有在测试通过且仍执行相同测试（没有新增跳过）时才保留移除结果，同时删除对应的生成注释。不要削弱断言或覆盖率约束；对于 fakeTimers.toNotFake，只移除新增的 Temporal 条目。
3. 每接受一项移除后重新运行完整验证。报告每个候选项的配置路径、决定、代码改动、命令与结果。

对于使用 vp pack 的项目，在库构建通过后同样审查生成的 "tsdown <0.23 compatibility" 设置。移除 deps.resolveDepSubpath: true 会按原样保留外部子路径导入；移除 attw.profile: 'strict' 会采用 esm-only 配置，跳过 node10 与 CommonJS 解析检查。如果这些检查属于包的预期支持范围，请保留 strict。每次只移除一项设置及其注释，然后运行 vp pack 与使用方检查。

报告迁移改动与未解决的问题。除非我要求，否则不要提交或推送。
```

## 按工具划分的迁移

### Vitest

Vitest 会通过 `vp migrate` 自动迁移。`vite-plus` 在 `vite-plus/test*` 下重新导出上游的 `vitest@5.0.5`，因此对于 node 模式的测试，只安装一个 `vite-plus` 即可——你不再需要直接安装 `vitest`。

对于浏览器模式，你可以使用 `vite-plus` 内置的基础浏览器运行时（`@vitest/browser`）与 Preview provider（`@vitest/browser-preview`）。要使用 Playwright 或 WebDriverIO，你还需要可选的 provider（`@vitest/browser-playwright` 或 `@vitest/browser-webdriverio`）及其框架 peer（`playwright` 或 `webdriverio`）。

`vp migrate` 会以捆绑的 Vitest 版本添加 Playwright provider，并确保其框架 peer 就位。你可以从 `vite-plus/test/browser-playwright` 导入它。

对于 WebDriverIO，请从社区维护的 `@vitest/browser-webdriverio` 导入。迁移会恢复旧有的 Vite+ provider 导入，确保 provider 版本至少为 `5.0.0`，并添加与捆绑 runner 匹配的 `@vitest/browser` override。后续的 provider 升级与框架 peer 需要你自己管理。参见[社区 WebDriverIO provider](/guide/vitest-v5)。

如果你在手动迁移，请改为把所有导入更新到 `vite-plus/test*`：

```ts
// 之前
import { playwright } from '@vitest/browser-playwright';
import { describe, expect, it, vi } from 'vitest';
import { defineConfig } from 'vitest/config';

const { page } = await import('@vitest/browser/context');

// 之后
import { defineConfig } from 'vite-plus';
import { describe, expect, it, vi } from 'vite-plus/test';
import { playwright } from 'vite-plus/test/browser-playwright';

const { page } = await import('vite-plus/test/browser/context');
```

`declare module 'vitest'` / `declare module '@vitest/browser*'` 增强会被**有意**保留而不重写——`vite-plus/test*` 只是上游 `vitest*` 的薄重导出，因此类型增强必须指向上游模块标识才能正确合并。请让这些 `declare module` 语句继续指向 `'vitest'` / `'@vitest/browser*'`。

### tsdown

`vp migrate` 会为 tsdown 0.23 更新 `pack` 块与 `tsdown.config.*` 中受支持的静态选项。对于现有 Vite+ 项目以及工作区包，即使不加 `--full` 也会执行此操作。关于选项映射与需要手动审查的情况，参见[打包配置](/guide/migrate-rules)。

当项目已安装的 tsdown 版本低于 0.23 或无法确定时，转换会通过插入 `deps.resolveDepSubpath: true`（以及在启用 ATTW 检查且缺少该设置时插入 `attw.profile: 'strict'`）来保留较早的默认值。对于 Vite+ pack 配置，它会读取已安装的 `vite-plus/dist/toolchain.json`。这也包括在迁移重写导入之前就已经导入 `vite-plus/pack` 的 `tsdown.config.*` 文件。独立的 tsdown 配置使用其已安装的 tsdown 版本。没有该清单的旧版 Vite+ 安装保留旧默认值。已经使用 tsdown 0.23 或更高版本的项目不会获得这些默认值。每个插入的设置都附带 `tsdown <0.23 compatibility` 注释，其中包含文档链接与移除指引。显式设置保持不变。

在首次运行 `vp pack` 时请保留这些设置。验证之后，再审查你的包是否可以采用新的默认值：

- 移除 `deps.resolveDepSubpath: true` 会[按原样保留外部子路径导入](https://tsdown.dev/options/dependencies#deps-resolvedepsubpath)。请确认使用方能够解析产出的导入。
- 移除插入的 `attw.profile: 'strict'` 会选择 `esm-only` [解析配置](https://tsdown.dev/options/lint#profiles)。这会跳过 `node10` 与 CommonJS 解析检查。如果你的包需要这些检查，请保留 `strict`。

同时移除每个被接受设置所生成的注释。每次改动后运行 `vp pack` 以及包的使用方检查。当你无法验证结果时，请保留该设置。

如果你的项目使用 `tsdown.config.ts`，请把其中的选项移入 `vite.config.ts` 的 `pack` 块：

```ts [tsdown.config.ts] {4-6}
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
});
```

```ts [vite.config.ts] {4-8}
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    format: ['esm', 'cjs'],
  },
});
```

合并之后，删除 `tsdown.config.ts`。完整配置参考见[打包指南](/guide/pack)。

### lint-staged

Vite+ 用 `vite.config.ts` 中自有的 `staged` 块取代 lint-staged。`vp staged` 从 `vite.config.ts` 的 `staged` 块读取配置，而不是从独立的 lint-staged 配置文件读取。非 JSON 格式的独立 `.lintstagedrc` 与 `lint-staged.config.*` 不会被自动迁移。

把你的 lint-staged 规则移入 `staged` 块：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
});
```

当没有现成的钩子策略接管该工作流时，`vp migrate` 可以迁移受支持的 lint-staged 规则，并移除旧配置与依赖。如果保留了现有的钩子工具，请继续保留 lint-staged，直到你手动转换该钩子策略。详情参见[提交钩子指南](/guide/commit-hooks)与[staged 配置参考](/config/staged)。

### Git 钩子工具

`vp migrate` 命令不会自动转换 Husky 设置。检测到 Husky 时，Vite+ 会保持其钩子、生命周期脚本、配置与依赖不变，并给出警告。你可以按照[提交钩子指南](/guide/commit-hooks)手动迁移项目。

项目自有的现有 Vite+ 钩子同样会被保留。只有在未找到现有钩子策略时，才会引入默认的 staged 工作流。

如果你的项目当前使用 `lefthook`、`simple-git-hooks` 或 `yorkie`，`vp migrate` 会保持你现有的配置不变并给出警告。即使你在提示中选择设置钩子或传入 `--hooks` 标志，情况也是如此。

如果你想手动把其中某个工具迁移到 Vite+，可以按以下步骤操作。首先，把暂存文件命令移入 `vite.config.ts` 的 `staged` 块。然后，更新生命周期脚本，使其运行 `vp config`。你还需要在 `.vite-hooks/pre-commit` 创建一个运行 `vp staged` 的 Vite+ 钩子。运行 `vp hooks enable`（或 `vp config`）以安装分发器并设置 `core.hooksPath`。最后，在你确认 Vite+ 钩子按预期工作后，可以移除旧工具的配置与依赖。

使用 `vp hooks status` 确认分发器处于活动状态；如果需要在此克隆中再次关闭它，使用 `vp hooks disable`。关于完整的 Vite+ 钩子设置，详见[提交钩子指南](/guide/commit-hooks)。

## 示例

```bash
# 迁移当前项目
vp migrate

# 迁移指定目录
vp migrate my-app

# 无提示运行
vp migrate --no-interactive

# 在迁移过程中写入代理与编辑器设置
vp migrate --agent claude --editor zed
```
