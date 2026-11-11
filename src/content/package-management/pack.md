# vp pm pack

从项目创建包 tarball。这不同于 [`vp pack`](/guide/pack)，后者使用 tsdown 构建库。

```bash
vp pm pack
vp pm pack --pack-destination ./artifacts
```

## 选项

| 选项                                    | 描述                               | 备注               |
| --------------------------------------- | ---------------------------------- | ------------------ |
| `-r, --recursive`                       | 打包所有工作区包。                 |                    |
| `--filter <pattern>`                    | 按模式选择工作区。                 | 可重复使用。       |
| `--out <out>`                           | 指定 tarball 输出路径。            |                    |
| `--pack-destination <pack-destination>` | 指定 tarball 输出目录。            |                    |
| `--pack-gzip-level <pack-gzip-level>`   | 请求 0 到 9 之间的 gzip 压缩级别。 |                    |
| `--json`                                | 请求原生 JSON 输出。               | 输出保留原生结构。 |

## 兼容性

- **npm：**`npm pack`。
- **pnpm：**`pnpm pack`。
- **Yarn Classic：**`yarn pack`。
- **Yarn Modern：**`yarn pack`。
- **Bun：**`bun pm pack`。

| 选项                                    | npm               | pnpm               | Yarn Classic | Yarn Modern | Bun | 备注                        |
| --------------------------------------- | ----------------- | ------------------ | ------------ | ----------- | --- | --------------------------- |
| `-r, --recursive`                       | 7.9.0 及更高版本  | 10.11.0 及更高版本 | 否           | 是          | 否  |                             |
| `--filter <pattern>`                    | 7.9.0 及更高版本  | 10.11.0 及更高版本 | 否           | 是          | 否  |                             |
| `--out <out>`                           | 否                | 10.0.0 及更高版本  | 是           | 是          | 是  |                             |
| `--pack-destination <pack-destination>` | 7.18.0 及更高版本 | 是                 | 否           | 否          | 是  | Vite+ 会为 npm 创建该目录。 |
| `--pack-gzip-level <pack-gzip-level>`   | 否                | 8.3.0 及更高版本   | 否           | 否          | 是  |                             |
| `--json`                                | 是                | 9.14.0 及更高版本  | 是           | 是          | 否  |                             |

## 原生选项

原生选项参见 [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack)、[pnpm pack](https://pnpm.io/cli/pack)、[Yarn pack](https://yarnpkg.com/cli/pack)、[Yarn Classic pack](https://classic.yarnpkg.com/en/docs/cli/pack) 与 [Bun pm pack](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
