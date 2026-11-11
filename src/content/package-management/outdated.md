# vp outdated

检查哪些依赖有更新版本可用。

```bash
vp outdated
vp outdated react
vp outdated --format json
vp outdated -g
```

## 选项

| 选项                           | 描述                       | 备注                                                                        |
| ------------------------------ | -------------------------- | --------------------------------------------------------------------------- |
| `--long`                       | 显示扩展信息。             |                                                                             |
| `--format <table\|list\|json>` | 选择输出格式。             |                                                                             |
| `-r, --recursive`              | 在所有工作区中递归检查。   |                                                                             |
| `--filter <pattern>`           | 按模式选择工作区。         | 可重复指定。                                                                |
| `-w, --workspace-root`         | 包含工作区根目录。         |                                                                             |
| `-P, --prod`                   | 仅生产依赖与可选依赖。     |                                                                             |
| `-D, --dev`                    | 包含开发依赖。             |                                                                             |
| `--no-optional`                | 排除可选依赖。             |                                                                             |
| `--compatible`                 | 仅显示兼容范围内的版本。   |                                                                             |
| `--sort-by <field>`            | 按字段排序结果。           |                                                                             |
| `-g, --global`                 | 检查全局安装的包。         | 需要全局 CLI。使用[全局包存储](/guide/package-management/global-packages)。 |
| `--concurrency <number>`       | 并行执行的全局包检查数量。 | 需要 --global。必须为正整数。                                               |

## 兼容性

以下命令描述的是项目操作。全局模式参见[选项](#选项)。

- **npm：**`npm outdated`。
- **pnpm：**`pnpm outdated`。
- **Yarn Classic：**`yarn outdated`。
- **Yarn Modern：**替代命令：`yarn upgrade-interactive`。
- **Bun：**`bun outdated`。

| 选项                           | npm               | pnpm              | Yarn Classic | Yarn Modern | Bun | 备注                                                 |
| ------------------------------ | ----------------- | ----------------- | ------------ | ----------- | --- | ---------------------------------------------------- |
| `--long`                       | 是                | 是                | 否           | 否          | 否  |                                                      |
| `--format <table\|list\|json>` | table, list, json | table, list, json | table, json  | 否          | 否  |                                                      |
| `-r, --recursive`              | 7.14.0 或更高版本 | 是                | 否           | 否          | 是  | npm 使用 `--workspaces` 检查各工作区，而非传递依赖。 |
| `--filter <pattern>`           | 7.14.0 或更高版本 | 是                | 否           | 否          | 是  |                                                      |
| `-w, --workspace-root`         | 8.1.0 或更高版本  | 是                | 否           | 否          | 否  |                                                      |
| `-P, --prod`                   | 7 或更高版本      | 是                | 否           | 否          | 是  |                                                      |
| `-D, --dev`                    | 是                | 是                | 否           | 否          | 否  |                                                      |
| `--no-optional`                | 7 或更高版本      | 是                | 否           | 否          | 是  |                                                      |
| `--compatible`                 | 否                | 是                | 否           | 否          | 否  |                                                      |
| `--sort-by <field>`            | 否                | 是                | 否           | 否          | 否  |                                                      |
| `-g, --global`                 | 是                | 是                | 是           | 是          | 是  |                                                      |
| `--concurrency <number>`       | 是                | 是                | 是           | 是          | 是  |                                                      |

Yarn Modern 不会转发位置参数形式的包名。它的交互式更新器可以更改依赖，这与只读的过期查询不同。

原生输出与退出码各不相同。非零退出码可能表示存在过期的依赖，而不是查询 registry 失败。

## 原生选项

原生选项参见 [npm outdated](https://docs.npmjs.com/cli/v11/commands/npm-outdated)、[pnpm outdated](https://pnpm.io/cli/outdated)、[Yarn upgrade-interactive](https://yarnpkg.com/cli/upgrade-interactive)、[Yarn Classic outdated](https://classic.yarnpkg.com/en/docs/cli/outdated)、[Bun outdated](https://bun.com/docs/pm/cli/outdated)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
