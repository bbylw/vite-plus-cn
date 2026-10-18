# pack 配置

`vp pack` 会从 `vite.config.ts` 的 `pack` 配置块读取 tsdown 设置。详情请参阅 [tsdown 的配置](https://tsdown.dev/options/config-file)。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    dts: true,
    format: ['esm', 'cjs'],
    sourcemap: true,
  },
});
```
