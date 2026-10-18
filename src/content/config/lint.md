# lint 配置

`vp lint` 会从工作目录使用 Oxlint 的[原生配置发现](/guide/lint)机制。使用 `vp lint -c <path>` 或 `vp lint --config <path>` 选择其他配置。详情请参阅 [Oxlint 的配置](https://oxc.rs/docs/guide/usage/linter/config.html)。

当工作区根目录存在 `lint` 配置块时，`vp check` 会使用它，从包目录运行时也是如此。包级配置不会在 `vp check` 中替换这些代码检查设置。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'no-console': ['error', { allow: ['error'] }],
    },
  },
});
```

我们建议同时启用 `options.typeAware` 和 `options.typeCheck`，以便 `vp lint` 和 `vp check` 使用完整的类型感知路径。

针对特定文件或包的代码检查规则，请使用根 `vite.config.ts` 中的 [`lint.overrides`](/guide/monorepo)。

Oxlint 在 Vite+ 模式下会禁用嵌套配置，因此嵌套的代码检查配置不会覆盖单个文件的设置。详情请参阅[故障排查](/guide/troubleshooting)。
