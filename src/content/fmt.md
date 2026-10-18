# 代码格式化（Format）

`vp fmt` 使用 Oxfmt 格式化代码。

## 概览

`vp fmt` 基于 [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) 构建，即 Oxc 的格式化工具。Oxfmt 完全兼容 Prettier，旨在作为 Prettier 的快速直接替代品。

使用 `vp fmt` 格式化项目，使用 `vp check` 一次性完成格式化、代码检查与类型检查。

## 用法

```bash
vp fmt
vp fmt --check
vp fmt . --write
```

## 配置

将格式化配置直接放在根目录 `vite.config.ts` 的 `fmt` 块中，使所有配置都集中在一处。我们不建议在 Vite+ 中使用 `.oxfmtrc.json`。

`vp fmt` 从工作目录查找配置，因此没有自己 `fmt` 块的包目录会使用根配置。相对文件参数仍保持原有含义。请使用 [`fmt.overrides`](/guide/monorepo) 为特定文件或包设置选项，而不是向包配置添加 `fmt` 块。

当工作区根目录的 `fmt` 块存在时，`vp check` 会使用它，包括从包目录运行时。包配置无法在 `vp check` 中替换这些格式设置。

显式指定 `vp fmt -c <path>` 或 `vp fmt --config <path>` 会选择其他配置。否则，Oxfmt 会发现最近的包含 `fmt` 块的 `vite.config.*` 文件。支持的扩展名为 `.js`、`.mjs`、`.ts`、`.cjs`、`.mts` 与 `.cts`。嵌套配置不会覆盖单个文件的设置。

对于编辑器，请禁用嵌套格式化配置，以防止逐文件覆盖（`.vscode/settings.json`）：

```json
{
  "oxc.fmt.disableNestedConfig": true
}
```

有关上游格式化行为与配置参考，请参阅 [Oxfmt 文档](https://oxc.rs/docs/guide/usage/formatter.html)。

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
  },
});
```
