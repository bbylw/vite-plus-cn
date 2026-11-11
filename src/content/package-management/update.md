# vp update

按所选包管理器的更新规则更新项目依赖。别名：`vp up`。

```bash
vp update
vp update react
vp update --latest
vp update -g
```

## 选项

| 选项                        | 描述                                                    | 备注                                                                        |
| --------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| `-L, --latest`              | 更新到最新版本（忽略 semver 范围）。                    | 全局模式会清除记录的版本范围。                                              |
| `-g, --global`              | 更新全局包。                                            | 需要全局 CLI。使用[全局包存储](/guide/package-management/global-packages)。 |
| `--concurrency <number>`    | 并行执行的全局包更新数量。                              | 需要 --global。必须为正整数。                                               |
| `--reinstall-node-mismatch` | 重新安装已是最新、但使用不同 Node.js 版本安装的全局包。 | 需要 --global。                                                             |
| `--ignore-node-mismatch`    | 跳过已是最新、但使用不同 Node.js 版本安装的全局包。     | 需要 --global。                                                             |
| `-r, --recursive`           | 在所有工作区包中递归更新。                              |                                                                             |
| `--filter <pattern>`        | 按模式选择工作区。                                      | 可重复指定。                                                                |
| `-w, --workspace-root`      | 包含工作区根目录。                                      |                                                                             |
| `-D, --dev`                 | 选择开发依赖。                                          |                                                                             |
| `-P, --prod`                | 选择生产依赖。                                          |                                                                             |
| `-i, --interactive`         | 交互模式。                                              |                                                                             |
| `--no-optional`             | 排除 optionalDependencies。                             |                                                                             |
| `--no-save`                 | 请求原生的 no-save 行为。                               |                                                                             |
| `--workspace`               | 仅更新工作区中可用的依赖。                              |                                                                             |

## 兼容性

以下命令描述的是项目操作。全局模式参见[选项](#选项)。

- **npm：**`npm update`。
- **pnpm：**`pnpm update`。
- **Yarn Classic：**`yarn upgrade` 或 `yarn upgrade-interactive`。
- **Yarn Modern：**`yarn up`。
- **Bun：**`bun update`。

| 选项                        | npm               | pnpm | Yarn Classic | Yarn Modern                       | Bun            | 备注 |
| --------------------------- | ----------------- | ---- | ------------ | --------------------------------- | -------------- | ---- |
| `-L, --latest`              | 仅全局模式        | 是   | 是           | 是                                | 是             |      |
| `-g, --global`              | 是                | 是   | 是           | 是                                | 是             |      |
| `--concurrency <number>`    | 是                | 是   | 是           | 是                                | 是             |      |
| `--reinstall-node-mismatch` | 是                | 是   | 是           | 是                                | 是             |      |
| `--ignore-node-mismatch`    | 是                | 是   | 是           | 是                                | 是             |      |
| `-r, --recursive`           | 8.1.0 或更高版本  | 是   | 否           | 是                                | 1.4 或更高版本 |      |
| `--filter <pattern>`        | 7.14.0 或更高版本 | 是   | 单个 filter  | 否                                | 1.4 或更高版本 |      |
| `-w, --workspace-root`      | 8.1.0 或更高版本  | 是   | 否           | 否                                | 否             |      |
| `-D, --dev`                 | 是                | 是   | 否           | 否                                | 1.4 或更高版本 |      |
| `-P, --prod`                | 7 或更高版本      | 是   | 是           | 否                                | 1.4 或更高版本 |      |
| `-i, --interactive`         | 否                | 是   | 是           | 是                                | 是             |      |
| `--no-optional`             | 是                | 是   | 是           | 否                                | 1.4 或更高版本 |      |
| `--no-save`                 | 是                | 是   | 否           | 带 --recursive 且不带 --latest 时 | 是             |      |
| `--workspace`               | 否                | 是   | 否           | 否                                | 否             |      |

在 npm 上要更改依赖声明的范围，请使用 [add](/guide/package-management/add) 并传入新的版本 spec。Yarn Modern 遵循项目级更新语义。不带 `--latest` 的递归模式会重新解析现有范围，而不改写清单；与 `--latest` 组合时则使用普通的 `yarn up`。

## 原生选项

原生选项参见 [npm update](https://docs.npmjs.com/cli/v11/commands/npm-update)、[pnpm update](https://pnpm.io/cli/update)、[Yarn up](https://yarnpkg.com/cli/up)、[Yarn Classic upgrade](https://classic.yarnpkg.com/en/docs/cli/upgrade)、[Yarn Classic upgrade-interactive](https://classic.yarnpkg.com/en/docs/cli/upgrade-interactive)、[Bun update](https://bun.com/docs/pm/cli/update)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
