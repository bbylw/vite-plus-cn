# vp pm version

运行包管理器的 version 命令。它管理的是包的版本，而不是 `vp --version` 显示的 Vite+ 版本。

```bash
vp pm version patch
vp pm version 2.0.0
```

## 选项

传入一个版本或递增策略，例如 `major`、`minor` 或 `patch`。省略时保留包管理器的原生行为，可能会显示信息、进行交互式提示，或要求提供策略。

| 选项     | 描述                 | 备注               |
| -------- | -------------------- | ------------------ |
| `--json` | 请求原生 JSON 输出。 | 输出保留原生结构。 |

## 兼容性

- **npm：**`npm version`。
- **pnpm：**`pnpm version`。
- **Yarn Classic：**`yarn version`。
- **Yarn Modern：**`yarn version`。
- **Bun：**1.2.18 及更高版本：`bun pm version`。更早的版本会在命令被调用前输出警告。

| 选项     | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| -------- | --- | ---- | ------------ | ----------- | --- | ---- |
| `--json` | 是  | 是   | 是           | 否          | 否  |      |

Yarn Classic 会把递增策略转换为 `--patch` 之类的标志。显式版本会转换为 `--new-version <version>`。其他包管理器保留其原生的操作数语法。

version 命令可能修改清单与锁文件，并可能创建 Git 提交或标签。Vite+ 会保留所选包管理器的行为。

## 原生选项

原生选项参见 [npm version](https://docs.npmjs.com/cli/v11/commands/npm-version)、[pnpm version](https://pnpm.io/cli/version)、[Yarn version](https://yarnpkg.com/cli/version)、[Yarn Classic version](https://classic.yarnpkg.com/en/docs/cli/version) 与 [Bun pm version](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
