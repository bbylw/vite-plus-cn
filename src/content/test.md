# 测试

`vp test` 通过内置的 **Vitest** 运行测试。默认只运行一次，并提供监听、相关文件、基准与列表等子命令。

## 用法

```bash
vp test                       # 运行一次测试
vp test watch                 # 监听模式
vp test related               # 运行与变更文件相关的测试
vp test src/components/Button  # 运行指定文件
```

测试的配置同样放在 `vite.config.ts` 的 `test` 字段中：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
```

## 子命令

| 子命令            | 说明                     |
| ----------------- | ------------------------ |
| `vp test run`     | 只运行一次               |
| `vp test watch`   | 监听模式                 |
| `vp test dev`     | 开发模式                 |
| `vp test related` | 运行与变更文件相关的测试 |
| `vp test bench`   | 运行基准测试             |
| `vp test list`    | 列出匹配的测试           |

## 常用选项（部分）

| 选项                              | 说明                        |
| --------------------------------- | --------------------------- |
| `--coverage`                      | 启用覆盖率报告              |
| `--ui` / `--open`                 | 启用图形化界面并自动打开    |
| `--dom`                           | 用 happy-dom 模拟浏览器 API |
| `--browser <name>`                | 在浏览器中运行测试          |
| `--globals`                       | 注入全局 API                |
| `--pool <pool>`                   | 指定运行池（默认 `forks`）  |
| `-t, --testNamePattern <pattern>` | 按名称正则匹配运行          |
| `--passWithNoTests`               | 没有测试时也通过            |
| `--typecheck`                     | 测试时同时进行类型检查      |

Vitest 提供与 Jest 兼容的测试体验，但基于 Vite 的高速 HMR 与转换管线。细节请参阅 [Vitest 官方文档](https://vitest.dev/)。
