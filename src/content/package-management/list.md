# vp list

列出已安装的依赖。别名：`vp ls`。这些顶层命令需要全局 CLI。全局 CLI 与项目本地 CLI 都接受 `vp pm list` 与 `vp pm ls`。

```bash
vp list
vp list react --depth 2
vp list --json
vp list -g
```

## 选项

| 选项                      | 描述                 | 备注                                                                        |
| ------------------------- | -------------------- | --------------------------------------------------------------------------- |
| `--depth <depth>`         | 依赖树的最大深度。   |                                                                             |
| `--json`                  | 请求原生 JSON 输出。 | 输出保留原生 schema。                                                       |
| `--long`                  | 显示扩展信息。       |                                                                             |
| `--parseable`             | 可解析的输出格式。   |                                                                             |
| `-P, --prod`              | 仅生产依赖。         |                                                                             |
| `-D, --dev`               | 包含开发依赖。       |                                                                             |
| `--no-optional`           | 排除可选依赖。       |                                                                             |
| `--exclude-peers`         | 排除 peer 依赖。     |                                                                             |
| `--only-projects`         | 仅显示项目包。       |                                                                             |
| `--find-by <finder_name>` | 使用 finder 函数。   |                                                                             |
| `-r, --recursive`         | 在所有工作区中列出。 |                                                                             |
| `--filter <pattern>`      | 按模式选择工作区。   | 可重复指定。                                                                |
| `-g, --global`            | 列出全局包。         | 需要全局 CLI。使用[全局包存储](/guide/package-management/global-packages)。 |

## 兼容性

以下命令描述的是项目操作。全局模式参见[选项](#选项)。

- **npm：**`npm list`。
- **pnpm：**`pnpm list`。
- **Yarn Classic：**`yarn list`。
- **Yarn Modern：**无对应命令。发出警告并成功退出，不执行该操作。
- **Bun：**`bun pm ls`。

| 选项                      | npm               | pnpm               | Yarn Classic | Yarn Modern | Bun | 备注                                                |
| ------------------------- | ----------------- | ------------------ | ------------ | ----------- | --- | --------------------------------------------------- |
| `--depth <depth>`         | 是                | 是                 | 是           | 否          | 否  |                                                     |
| `--json`                  | 是                | 是                 | 是           | 否          | 否  |                                                     |
| `--long`                  | 是                | 是                 | 否           | 否          | 否  |                                                     |
| `--parseable`             | 是                | 是                 | 否           | 否          | 否  |                                                     |
| `-P, --prod`              | 是                | 是                 | 是           | 否          | 否  | npm 6 使用 `--production`，它同时会排除 peer 依赖。 |
| `-D, --dev`               | 是                | 是                 | 是           | 否          | 否  |                                                     |
| `--no-optional`           | 7 或更高版本      | 是                 | 否           | 否          | 否  |                                                     |
| `--exclude-peers`         | 7 或更高版本      | 是                 | 否           | 否          | 否  |                                                     |
| `--only-projects`         | 否                | 是                 | 否           | 否          | 否  |                                                     |
| `--find-by <finder_name>` | 否                | 10.16.0 或更高版本 | 否           | 否          | 否  |                                                     |
| `-r, --recursive`         | 7.14.0 或更高版本 | 是                 | 否           | 否          | 否  |                                                     |
| `--filter <pattern>`      | 7.14.0 或更高版本 | 是                 | 否           | 否          | 否  |                                                     |
| `-g, --global`            | 是                | 是                 | 是           | 是          | 是  |                                                     |

这些结果描述的是已安装的包，而不是 Vite+ 捆绑的工具。使用 `vp toolchain [tool]` 可查看捆绑的 Vite、Rolldown、Oxc 及其他工具的版本。

## 原生选项

原生选项参见 [npm ls](https://docs.npmjs.com/cli/v11/commands/npm-ls)、[pnpm list](https://pnpm.io/cli/list)、[Yarn Classic list](https://classic.yarnpkg.com/en/docs/cli/list)、[Bun pm ls](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
