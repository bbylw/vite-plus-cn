# vp pm search

搜索包 registry。

```bash
vp pm search vite plugin
vp pm search typescript --json
```

## 选项

至少需要一个搜索词。

| 选项               | 描述                 | 备注               |
| ------------------ | -------------------- | ------------------ |
| `--json`           | 请求原生 JSON 输出。 | 输出保留原生结构。 |
| `--long`           | 显示扩展信息。       |                    |
| `--registry <url>` | 选择 registry。      |                    |

## 兼容性

- **npm：**`npm search`。
- **pnpm：**11 及更高版本：`pnpm search`。更早的版本回退到 `npm search`。
- **Yarn Classic：**回退：`npm search`。
- **Yarn Modern：**回退：`npm search`。
- **Bun：**回退：`npm search`。

| 选项               | npm | pnpm    | Yarn Classic | Yarn Modern | Bun | 备注 |
| ------------------ | --- | ------- | ------------ | ----------- | --- | ---- |
| `--json`           | 是  | 是      | 是           | 是          | 是  |      |
| `--long`           | 是  | 11 之前 | 是           | 是          | 是  |      |
| `--registry <url>` | 是  | 是      | 是           | 是          | 是  |      |

registry 设置与输出取决于实际运行的命令。

## 原生选项

原生选项参见 [npm search](https://docs.npmjs.com/cli/v11/commands/npm-search) 与 [pnpm search](https://pnpm.io/cli/search)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
