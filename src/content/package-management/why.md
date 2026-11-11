# vp why

解释为什么安装了某个依赖。别名：`vp explain`。

```bash
vp why react
vp why react --json
vp why react --filter web
```

## 选项

| 选项                      | 描述                                        | 备注                  |
| ------------------------- | ------------------------------------------- | --------------------- |
| `--json`                  | 请求原生 JSON 输出。                        | 输出保留原生 schema。 |
| `--long`                  | 显示扩展信息。                              |                       |
| `--parseable`             | 显示可解析的输出。                          |                       |
| `-r, --recursive`         | 在所有工作区中递归检查。                    |                       |
| `--filter <pattern>`      | 按模式选择工作区。                          | 可重复指定。          |
| `-w, --workspace-root`    | 在工作区根目录中检查。                      |                       |
| `-P, --prod`              | 仅生产依赖。                                |                       |
| `-D, --dev`               | 仅开发依赖。                                |                       |
| `--depth <depth>`         | 限制树的深度。                              |                       |
| `--no-optional`           | 排除可选依赖。                              |                       |
| `--exclude-peers`         | 排除 peer 依赖。                            |                       |
| `--find-by <finder_name>` | 使用在 .pnpmfile.cjs 中定义的 finder 函数。 |                       |

## 兼容性

- **npm：**`npm explain`。
- **pnpm：**`pnpm why`。
- **Yarn Classic：**`yarn why`。提供多个包名时会发出警告，且只检查第一个。
- **Yarn Modern：**`yarn why`。提供多个包名时会发出警告，且只检查第一个。
- **Bun：**`bun why`。

| 选项                      | npm               | pnpm               | Yarn Classic | Yarn Modern | Bun | 备注                             |
| ------------------------- | ----------------- | ------------------ | ------------ | ----------- | --- | -------------------------------- |
| `--json`                  | 是                | 是                 | 是           | 是          | 否  |                                  |
| `--long`                  | 否                | 是                 | 否           | 否          | 否  |                                  |
| `--parseable`             | 否                | 是                 | 否           | 否          | 否  |                                  |
| `-r, --recursive`         | 7.14.0 或更高版本 | 是                 | 否           | 是          | 否  |                                  |
| `--filter <pattern>`      | 7.14.0 或更高版本 | 是                 | 否           | 否          | 否  |                                  |
| `-w, --workspace-root`    | 否                | 是                 | 否           | 否          | 否  |                                  |
| `-P, --prod`              | 否                | 是                 | 否           | 否          | 否  |                                  |
| `-D, --dev`               | 否                | 是                 | 否           | 否          | 否  |                                  |
| `--depth <depth>`         | 否                | 是                 | 否           | 否          | 是  |                                  |
| `--no-optional`           | 否                | 是                 | 否           | 否          | 否  |                                  |
| `--exclude-peers`         | 否                | 是                 | 否           | 是          | 否  | Yarn Modern 默认包含 peer 依赖。 |
| `--find-by <finder_name>` | 否                | 10.16.0 或更高版本 | 否           | 否          | 否  |                                  |

依赖图不包含 Vite+ 捆绑或编译的工具。为便于阅读，当 Vite+ 也提供所查询的包时，会给出提示。使用 `vp toolchain [tool]` 可查看捆绑的工具。

## 原生选项

原生选项参见 [npm explain](https://docs.npmjs.com/cli/v11/commands/npm-explain)、[pnpm why](https://pnpm.io/cli/why)、[Yarn why](https://yarnpkg.com/cli/why)、[Yarn Classic why](https://classic.yarnpkg.com/en/docs/cli/why)、[Bun why](https://bun.com/docs/pm/cli/why)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
