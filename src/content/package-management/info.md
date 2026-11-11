# vp info

从 registry 读取包的元数据。别名：`vp view`、`vp show`、`vp pm view`、`vp pm info` 与 `vp pm show`。

```bash
vp info react
vp info react versions --json
vp info react@19 dist.tarball
```

## 选项

提供包名（可带版本），后面可再跟一个可选的字段名。

| 选项     | 描述                 | 备注                  |
| -------- | -------------------- | --------------------- |
| `--json` | 请求原生 JSON 输出。 | 输出保留原生 schema。 |

## 兼容性

- **npm：**`npm view`。
- **pnpm：**`pnpm view`。
- **Yarn Classic：**`yarn info`。
- **Yarn Modern：**`yarn npm info`。请求的字段会以 `--fields` 传入。
- **Bun：**`bun info`。

| 选项     | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| -------- | --- | ---- | ------------ | ----------- | --- | ---- |
| `--json` | 是  | 是   | 是           | 是          | 是  |      |

此命令查询的是 registry 元数据，而不是本地依赖树。使用 [list](/guide/package-management/list) 或 [why](/guide/package-management/why) 可查看已安装的包。

## 原生选项

原生选项参见 [npm view](https://docs.npmjs.com/cli/v11/commands/npm-view)、[pnpm view](https://pnpm.io/cli/view)、[Yarn npm info](https://yarnpkg.com/cli/npm/info)、[Yarn Classic info](https://classic.yarnpkg.com/en/docs/cli/info)、[Bun info](https://bun.com/docs/pm/cli/info)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
