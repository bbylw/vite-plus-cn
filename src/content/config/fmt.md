# fmt 配置

`vp fmt` 会从工作目录使用 Oxfmt 的[原生配置发现](/guide/fmt)机制。使用 `vp fmt -c <path>` 或 `vp fmt --config <path>` 选择其他配置。详情请参阅 [Oxfmt 的配置](https://oxc.rs/docs/guide/usage/formatter/config.html)。

当工作区根目录存在 `fmt` 配置块时，`vp check` 会使用它，从包目录运行时也是如此。包级配置不会在 `vp check` 中替换这些格式化设置。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    ignorePatterns: ['dist/**'],
    singleQuote: true,
    semi: true,
    sortPackageJson: true,
  },
});
```

针对特定文件或包的格式化设置，请使用根 `vite.config.ts` 中的 [`fmt.overrides`](/guide/monorepo)。

Oxfmt 在 Vite+ 模式下会禁用嵌套配置，因此嵌套的格式化配置不会覆盖单个文件的设置。详情请参阅[故障排查](/guide/troubleshooting)。
