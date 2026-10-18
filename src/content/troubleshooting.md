# 故障排查

当 Vite+ 的某些行为不符合你的预期时，请使用本页。

> [!NOTE]
> Vite+ 1.0 已可用。我们会持续改进它，并欢迎社区反馈，因此如果某些功能未按预期工作，请[联系我们](#寻求帮助)。

## 支持的工具版本

自动迁移要求现有 Vite 和 Vitest 依赖满足以下最低版本：

- Vite 7 或更高版本
- Vitest 4 或更高版本

如果你正在迁移现有项目，而它仍依赖较旧的 Vite 或 Vitest 版本，请先升级它们，然后再采用 Vite+。

运行 `vp toolchain` 显示本地 Vite+ 包的版本。运行 `vp toolchain --global` 显示全局 Vite+ 发行版的版本。

## `vp check` 不运行类型感知的代码检查规则或类型检查

- 确认 `vite.config.ts` 中已启用 `lint.options.typeAware` 和 `lint.options.typeCheck`
- 检查你的 `tsconfig.json` 是否仍使用 `compilerOptions.baseUrl`

由 `tsgolint` 驱动的 Oxlint 类型检查器路径不支持 `baseUrl`。`vp migrate` 和 `vp lint --init` 会尝试在启用类型感知代码检查之前运行 `vp dlx @andrewbranch/ts5to6 --fixBaseUrl <tsconfig path>` 修复。如果该修复失败或被拒绝，Vite+ 会跳过 `typeAware` 和 `typeCheck`。

## 嵌套的代码检查或格式化配置未生效

运行 `vp lint`、`vp fmt` 或 `vp check` 时，子目录中的配置不会覆盖单个文件的设置。`vp lint` 和 `vp fmt` 允许 Oxlint 和 Oxfmt 从工作目录发现配置，因此在包配置中的 `lint` 或 `fmt` 块从该包运行时生效，我们不推荐这样做。`vp check` 在存在时选择工作区根目录的 `lint` 和 `fmt` 块。使用 `vp lint` 或 `vp fmt` 的 `-c <path>` 或 `--config <path>` 显式选择其他配置。

将代码检查和格式化设置保留在根 `vite.config.ts` 中。使用 [`lint.overrides`](/guide/monorepo) 和 [`fmt.overrides`](/guide/monorepo) 进行文件或包特定的设置。你也可以将[配置对象导入](/guide/monorepo)根配置，以将设置保留在单独的文件中。

请将编辑器的代码检查和格式化配置为使用工作区根目录的 `vite.config.ts`。有关编辑器特定设置说明，请参阅 [IDE 集成](/guide/ide-integration)。

我们暂时不将嵌套配置应用于单个文件。我们正在考虑的一些因素包括：隐式配置发现如何影响代码检查和格式化的可预测性、AI 代理需要什么上下文来理解适用的设置，以及查找和加载多个配置的潜在性能成本。同时，我们认识到将包特定上下文保持在代码附近可能有益。迄今为止我们听到的用例还没有给我们足够强的理由来承诺这些语义。等待为以后添加支持留出了空间，我们希望听到你的项目为什么需要嵌套配置，尤其是根级覆盖不足的情况。

你需要嵌套配置吗？[在 GitHub 上分享你的用例和意见](https://github.com/voidzero-dev/vite-plus/discussions/2669)，包括你的项目结构、需要它们的原因，以及根级覆盖是否满足你的需求。

我们真诚希望听到你的反馈。这将帮助我们决定将来是否改善当前状况。

## VS Code 扩展不读取 `vite.config.ts`

如果 VS Code 打开了多个文件夹，共享的 Oxc 语言服务器可能会选择与预期不同的工作区。这可能会让人看起来 `vite.config.ts` 支持缺失。

- 确认扩展正在使用预期的工作区。

## `vp dev` 或 `vp build` 不运行我的脚本

与包管理器不同，内置命令无法被覆盖。如果你尝试运行 `package.json` 脚本，请改用 `vp run <script>`。

例如：

- `vp dev` 始终启动内置的 Vite 开发服务器
- `vp build` 始终运行内置的 Vite 构建
- `vp test` 始终运行内置的 Vitest 命令
- `vp run dev`、`vp run build` 和 `vp run test` 则运行匹配的 `package.json` 脚本

有关何时优先使用哪种方式，请参阅[内置命令与脚本](/guide/run)。

> [!NOTE]
> 你也可以运行 `vite.config.ts` 中定义的自定义任务，并完全从 `package.json` 脚本迁移出去。

## 暂存检查与提交钩子

如果 `vp staged` 失败或你的 pre-commit 钩子未运行：

- 确保 `vite.config.ts` 包含 `staged` 块
- 确保项目拥有的 pre-commit 钩子运行 `vp staged`（例如 `.vite-hooks/pre-commit`）
- 运行 `vp hooks status` 查看偏好、`core.hooksPath` 以及调度器是否已安装
- 运行 `vp hooks enable`（或 `vp config`）安装钩子调度器
- 如果状态显示 `Preference: disabled (local)`，请使用 `vp hooks enable` 重新启用
- 检查是否通过 `VP_GIT_HOOKS=0` 有意跳过了钩子

要在不删除项目策略文件的情况下停止此克隆中的钩子，请运行 `vp hooks disable`。完整工作流请参阅[提交钩子指南](/guide/commit-hooks)。

最小的 staged 配置如下所示：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
});
```

## 重量级插件导致配置加载缓慢

当 `vite.config.ts` 在顶层导入插件时，每个命令都会评估它们，包括 `vp lint`、`vp fmt`、编辑器集成和长期运行的后台进程。这会使配置加载变慢，并可能触发插件设置的副作用，例如读取文件、启动监视器或连接服务。

使用 `lazyPlugins`，在 vite-plus 仅为了读取元数据块（`lint`、`fmt`、`check`、`staged`、`pack`、`create`、`run`/`cache` 任务查找以及编辑器工具）而加载配置时跳过插件工厂。插件仍会在 Vite 实际运行时加载，包括 `dev`、`build`、`test`、`preview`，以及你自己的脚本启动的任何构建（`vp run` 任务、`vp exec`）：

```ts [vite.config.ts]
import myPlugin from 'vite-plugin-foo';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
  plugins: lazyPlugins(() => [myPlugin()]),
});
```

对于应延迟导入的重量级插件，请结合动态 `import()`：

```ts [vite.config.ts]
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
  plugins: lazyPlugins(async () => {
    const { default: heavyPlugin } = await import('vite-plugin-heavy');
    return [heavyPlugin()];
  }),
});
```

在回调内部直接导入插件包。对本地模块使用动态 `import()`（例如 `await import('./vite.plugins.ts')`）并不能避免开销：Vite 会在加载配置之前打包它，并跟踪本地文件的动态导入，因此该模块及其导入的包仍会在每个命令中处理，即使回调从未运行。

## 寻求帮助

如果你遇到困难，请联系我们：

- [Discord](https://discord.gg/cAnsqHh5PX) 用于实时讨论和故障排查帮助
- [GitHub](https://github.com/voidzero-dev/vite-plus) 用于问题、讨论和错误报告

报告问题时，请包括：

- `vp env current`、`vp --version` 和 `vp toolchain` 的完整输出
- 项目使用的包管理器
- 重现问题所需的确切步骤以及你的 `vite.config.ts`
- 最小的重现仓库或可运行的沙盒
