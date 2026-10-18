# test 配置

`vp test` 会从 `vite.config.ts` 的 `test` 配置块读取 Vitest 设置。详情请参阅 [Vitest 的配置](https://vitest.dev/config/)。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
```
