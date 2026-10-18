# 配置概览

Vite+ 将项目配置集中在一个地方：`vite.config.ts`，让你可以把许多顶层配置文件合并到一个文件中。你可以继续使用现有的 Vite 配置，例如 `server` 或 `build`，并为工作流的其余部分添加 Vite+ 配置块：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  server: {},
  build: {},
  preview: {},

  create: {},
  run: {},
  fmt: {},
  lint: {},
  check: {},
  test: {},
  pack: {},
  staged: {},
});
```

## Vite+ 专属配置

Vite+ 在基础 Vite 配置之上扩展了以下内容：

- [`create`](/config/create)，用于项目与模板脚手架的默认值
- [`run`](/config/run)，用于 Vite Task
- [`fmt`](/config/fmt)，用于 Oxfmt
- [`lint`](/config/lint)，用于 Oxlint
- [`check`](/config/check)，用于 `vp check` 默认值
- [`test`](/config/test)，用于 Vitest
- [`pack`](/config/pack)，用于 tsdown
- [`staged`](/config/staged)，用于暂存文件检查
- [`defaultPackage`](#defaultpackage)，用于在工作区根目录直接运行应用命令时的默认目标

## defaultPackage

当你在包含该配置的目录中直接运行 `vp dev` / `vp build` / `vp preview` / `vp pack` 时，`defaultPackage` 指定默认的目标目录，相当于隐式的 [`vp -C <dir>`](/guide/monorepo)：

```ts [vite.config.ts]
export default {
  defaultPackage: './frontend',
};
```

vp 读取这些值时不会执行配置，因此 `defaultPackage` 在没有任何 vite-plus 依赖的仓库根目录下同样有效（例如 Laravel 或 Rails 仓库，其 Vite 应用位于 `frontend/`，并且只在其中安装了 vite-plus）。正是因为采用静态读取，这些值必须保持为纯字符串字面量，而不能是表达式。显式的 `-C` 或位置参数目标始终优先于配置。
