# vp remove

从项目中移除依赖。别名：`vp rm`、`vp un` 与 `vp uninstall`。

```bash
vp remove react
vp remove --filter web react
vp remove -g --dry-run typescript
```

## 选项

| 选项                   | 描述                               | 备注                                                                        |
| ---------------------- | ---------------------------------- | --------------------------------------------------------------------------- |
| `-D, --save-dev`       | 从 devDependencies 中移除。        |                                                                             |
| `-O, --save-optional`  | 从 optionalDependencies 中移除。   |                                                                             |
| `-P, --save-prod`      | 从 dependencies 中移除。           |                                                                             |
| `--filter <pattern>`   | 按模式选择工作区。                 | 可重复指定。                                                                |
| `-w, --workspace-root` | 从工作区根目录移除。               |                                                                             |
| `-r, --recursive`      | 从所有工作区包中递归移除。         |                                                                             |
| `-g, --global`         | 移除全局包。                       | 需要全局 CLI。使用[全局包存储](/guide/package-management/global-packages)。 |
| `--dry-run`            | 预览将被移除的内容，而不实际移除。 | 需要 --global。                                                             |

## 兼容性

以下命令描述的是项目操作。全局模式参见[选项](#选项)。

- **npm：**`npm uninstall`。
- **pnpm：**`pnpm remove`。
- **Yarn Classic：**`yarn remove`。
- **Yarn Modern：**`yarn remove`。
- **Bun：**`bun remove`。

| 选项                   | npm               | pnpm | Yarn Classic | Yarn Modern | Bun            | 备注                     |
| ---------------------- | ----------------- | ---- | ------------ | ----------- | -------------- | ------------------------ |
| `-D, --save-dev`       | 是                | 是   | 否           | 否          | 否             |                          |
| `-O, --save-optional`  | 是                | 是   | 否           | 否          | 否             |                          |
| `-P, --save-prod`      | 是                | 是   | 否           | 否          | 否             |                          |
| `--filter <pattern>`   | 7.14.0 或更高版本 | 是   | 单个 filter  | 是          | 1.4 或更高版本 |                          |
| `-w, --workspace-root` | 8.1.0 或更高版本  | 是   | 否           | 否          | 否             |                          |
| `-r, --recursive`      | 8.1.0 或更高版本  | 是   | 否           | 是          | 否             | npm 会包含工作区根目录。 |
| `-g, --global`         | 是                | 是   | 是           | 是          | 是             |                          |
| `--dry-run`            | 是                | 是   | 是           | 是          | 是             |                          |

## 原生选项

原生选项参见 [npm uninstall](https://docs.npmjs.com/cli/v11/commands/npm-uninstall)、[pnpm remove](https://pnpm.io/cli/remove)、[Yarn remove](https://yarnpkg.com/cli/remove)、[Yarn Classic remove](https://classic.yarnpkg.com/en/docs/cli/remove)、[Bun remove](https://bun.com/docs/pm/cli/remove)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
