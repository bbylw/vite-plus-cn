# vp pm fund

显示已安装依赖的资助信息。

```bash
vp pm fund
vp pm fund --json
```

## 选项

| 选项     | 描述                 | 备注               |
| -------- | -------------------- | ------------------ |
| `--json` | 请求原生 JSON 输出。 | 输出保留原生结构。 |

## 兼容性

- **npm：**`npm fund`。
- **pnpm：**回退：`npm fund`。
- **Yarn Classic：**回退：`npm fund`。
- **Yarn Modern：**回退：`npm fund`。
- **Bun：**回退：`npm fund`。

| 选项     | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| -------- | --- | ---- | ------------ | ----------- | --- | ---- |
| `--json` | 是  | 是   | 是           | 是          | 是  |      |

Bun 会发出回退警告。结果以 npm 对已安装依赖的视图为准。

## 原生选项

原生选项参见 [npm fund](https://docs.npmjs.com/cli/v11/commands/npm-fund)，Vite+ 对所有包管理器都使用它。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
