# 代码检查

`vp check` 一次运行 **格式化、代码检查与类型检查** —— 全部在同一遍完成，而不是拆分到多个工具、多个配置中去。

## 一键检查

```bash
vp check                # 运行格式、lint、类型检查
vp check --fix          # 自动修复可修复的问题
```

相比“分别运行类型感知 lint 规则与类型检查”，`vp check` 可把静态检查加速到 **2 倍**。

你也可以单独运行某个工具：

```bash
vp lint                 # 只运行代码检查（Oxlint）
vp fmt                  # 只运行格式化（Oxfmt）
vp fmt --write          # 写入格式化结果
```

## 配置

配置都在 `vite.config.ts` 中：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['dist/**'],
  },
  fmt: {
    semi: true,
    singleQuote: true,
  },
});
```

## 基于 Rust 的速度

Oxlint 与 Oxfmt 基于 [Oxc](https://oxc.rs/)（Rust 编写），性能远超基于 JavaScript 的等价工具，同时保持与 ESLint/Prettier 生态兼容的配置习惯。借助 [tsgolint](https://oxc.rs/)，类型感知规则也能获得极大的性能提升。
