# 检查（vp check）

`vp check` 将格式化、代码检查与类型检查一起运行。

## 概览

`vp check` 是 Vite+ 中快速静态检查的默认命令。它汇集了通过 [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) 完成的格式化、通过 [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) 完成的代码检查，以及通过 [tsgolint](https://github.com/oxc-project/tsgolint) 完成的 TypeScript 类型检查。通过将所有这些任务合并到单个命令中，`vp check` 比在独立命令中分别运行格式化、代码检查与类型检查工具更快。

当 `vite.config.ts` 中 `lint.options` 块的 `typeAware` 与 `typeCheck` 同时启用时，`vp check` 还会通过由 TypeScript Go 工具链与 [tsgolint](https://github.com/oxc-project/tsgolint) 驱动的 Oxlint 类型感知路径运行 TypeScript 类型检查。`vp create` 与 `vp migrate` 默认启用 `typeAware` 和 `typeCheck`。

我们建议同时开启 `typeAware` 与 `typeCheck`，使 `vp check` 成为开发期间静态检查的唯一命令。

## 用法

```bash
vp check
vp check --fix              # 格式化并运行自动修复程序。
vp check --quiet            # 隐藏代码检查警告；仍报告错误并因错误而失败。
vp check --deny-warnings    # 将代码检查警告视为错误。
vp check --no-fmt           # 跳过格式化；运行代码检查（如果已启用还包括类型检查）。
vp check --no-lint          # 跳过代码检查规则；在已启用时保留类型检查。
vp check --no-fmt --no-lint # 仅类型检查（需要同时启用 `typeAware` 和 `typeCheck`）。
```

## 配置

`vp check` 使用你已为代码检查与格式化定义的相同配置：

- `vite.config.ts` 中的 [`lint`](/guide/lint) 块
- `vite.config.ts` 中的 [`fmt`](/guide/fmt) 块
- 用于类型感知代码检查的 TypeScript 项目结构与 tsconfig 文件

在工作区包中运行时，`vp check` 使用工作区根目录的 `lint` 与 `fmt` 块。包配置无法替换根目录的格式设置、代码检查规则或类型检查选项。文件路径与 TypeScript 项目仍从包的工作目录解析。

推荐的基础 `lint` 配置：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
```

### 默认禁用某个步骤

若希望 `vp check` 在每次运行时都跳过格式化或代码检查而无需传入标志，请设置 `vite.config.ts` 中的 [`check`](/config/check) 块。当项目需要工具链的其余部分但不需要某项功能（例如格式化）时，这会很方便：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  check: {
    fmt: false, // `vp check` 会进行代码检查（以及类型检查），但不进行格式化
  },
});
```

这些选项仅影响 `vp check`；独立的 `vp fmt` 与 `vp lint` 仍会正常运行。如果某个步骤在配置中被禁用，或传入了对应的 `--no-fmt` / `--no-lint` 标志，则会跳过该步骤。由于默认值会应用于每次 `vp check` 运行，调用 `vp check` 的提交钩子也会跳过被禁用的步骤。完整参考请参阅 [check 配置](/config/check)。
