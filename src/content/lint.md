# 代码检查（Lint）

`vp lint` 使用 Oxlint 检查代码。

## 概览

`vp lint` 基于 [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) 构建，即 Oxc 的代码检查工具。Oxlint 旨在作为大多数前端项目中 ESLint 的快速替代品，并内置支持核心 ESLint 规则与许多流行的社区规则。

使用 `vp lint` 检查项目，使用 `vp check` 一次性完成格式化、代码检查与类型检查。

## 用法

```bash
vp lint
vp lint --fix
vp lint --type-aware
```

## 配置

将代码检查配置直接放在根目录 `vite.config.ts` 的 `lint` 块中，使所有配置都集中在一处。我们不建议在 Vite+ 中使用 `oxlint.config.ts` 或 `.oxlintrc.json`。

`vp lint` 从工作目录查找配置，因此没有自己 `lint` 块的包目录会使用根配置。相对文件参数仍保持原有含义。请使用 [`lint.overrides`](/guide/monorepo) 为特定文件或包设置规则，而不是向包配置添加 `lint` 块。

当工作区根目录的 `lint` 块存在时，`vp check` 会使用它，包括从包目录运行时。包配置无法在 `vp check` 中替换这些代码检查设置。

显式指定 `vp lint -c <path>` 或 `vp lint --config <path>` 会选择其他配置。否则，Oxlint 会发现最近的包含 `lint` 块的 `vite.config.*` 文件。支持的扩展名为 `.js`、`.mjs`、`.ts`、`.cjs`、`.mts` 与 `.cts`。嵌套配置不会覆盖单个文件的设置。

有关上游规则集、选项与兼容性详情，请参阅 [Oxlint 文档](https://oxc.rs/docs/guide/usage/linter.html)。

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
```

## 类型感知代码检查

我们建议在 `lint` 块中同时启用 `typeAware` 与 `typeCheck`：

- `typeAware: true` 启用需要 TypeScript 类型信息的规则
- `typeCheck: true` 在代码检查期间启用完整类型检查

该路径由 [tsgolint](https://github.com/oxc-project/tsgolint) 在 TypeScript 7（即 TypeScript Go）工具链之上提供支持。它让 Oxlint 能够访问类型信息，并允许直接通过 `vp lint` 与 `vp check` 进行类型检查。

## JS 插件

如果你正在从 ESLint 迁移，并且仍依赖少数关键的基于 JavaScript 的 ESLint 插件，Oxlint 提供了 [JS 插件支持](https://oxc.rs/docs/guide/usage/linter/js-plugins)，可帮助你在完成迁移期间继续运行这些插件。

JS 插件还允许为 Oxlint [编写自定义规则](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins.html)。

### 编写自定义规则

从 `vite-plus/lint/plugins` 导入插件编写 API（`lint/my-plugin.js`）：

```js
import { definePlugin, defineRule } from 'vite-plus/lint/plugins';

const noFoo = defineRule({
  meta: { messages: { noFoo: 'Do not name things "foo".' } },
  create(context) {
    return {
      Identifier(node) {
        if (node.name === 'foo') {
          context.report({ node, messageId: 'noFoo' });
        }
      },
    };
  },
});

export default definePlugin({
  meta: { name: 'my' },
  rules: { 'no-foo': noFoo },
});
```

在 `lint.jsPlugins` 下注册它并启用其规则：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    jsPlugins: ['./lint/my-plugin.js'],
    rules: {
      'my/no-foo': 'error',
    },
  },
});
```

对于规则测试，可以从 `vite-plus/lint/plugins-dev` 使用 `RuleTester`。

这两个入口都重新导出 Vite+ 附带的副本。因此 API 始终与捆绑的 Oxlint 匹配。

请使用它们，而不是将 `@oxlint/plugins` 或 `oxlint` 添加为直接依赖。单独固定版本的副本可能会与加载你插件的代码检查器产生偏差。在 pnpm 的严格布局下，除非每个包含插件的包都声明了它，否则它也无法从插件文件解析。

`vp migrate` 会为你重写现有的 `oxlint` 与 `@oxlint/plugins` 导入。请参阅 [Oxlint JS 插件导入](/guide/migrate-rules)。`vite-plus/prefer-vite-plus-imports` 规则会报告任何重新出现的导入。
