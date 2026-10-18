# check 配置

`vp check` 会一起运行格式化、代码检查和类型检查。`vite.config.ts` 中的 `check` 配置块为这个组合命令设置默认值，对应 `--no-fmt` 和 `--no-lint` 这两个 CLI 参数。

当项目希望保留大部分工具链但默认跳过某个步骤时，这很有用。例如，一个只做代码检查但不做格式化的团队可以禁用 `check.fmt`，这样直接运行 `vp check`（智能体与贡献者最常运行的命令）时只会执行代码检查，无需任何人记住 `--no-fmt`。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  check: {
    // 在 `vp check` 中跳过格式化步骤。默认为 true。
    fmt: false,
    // 在 `vp check` 中跳过代码检查规则。当同时启用
    // `lint.options.typeAware` 和 `lint.options.typeCheck` 时，类型检查仍会运行。
    // 默认为 true。
    lint: true,
  },
});
```

当此处禁用某个步骤时，`vp check` 会打印一行简短的 `note:` 提示，以清楚说明该步骤为何没有运行。使用上面的 `check.fmt: false` 配置：

```bash
$ vp check
note: Format skipped (check.fmt: false in vite.config.ts)
pass: Found no warnings or lint errors in 1 file (12ms, 8 threads)
```

## 作用范围与优先级

- 这些选项仅影响组合命令 `vp check`。独立的 [`vp fmt`](/config/fmt) 和 [`vp lint`](/config/lint) 不受影响，因此当你偶尔需要时仍可直接运行被禁用的工具。注意，任何 `vp check` 调用都会遵循这些默认值，包括从提交钩子中运行的那一次：如果你的 [`staged`](/config/staged) 任务调用 `vp check`，该步骤在那里也会被跳过。
- 如果配置禁用了某个步骤**或**传入了对应的 CLI 参数，该步骤就会被跳过。没有参数可以重新启用配置中禁用的步骤；请直接运行 `vp fmt` 或 `vp lint`。
