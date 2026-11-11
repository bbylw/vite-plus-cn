# vp pm pkg

无需手动编辑清单，即可读取并更新 `package.json` 中的字段。

```bash
vp pm pkg get name version
vp pm pkg set scripts.check='vp check'
vp pm pkg set private=true --json
vp pm pkg delete scripts.old
vp pm pkg fix
```

## 选项

- `get [key...]` 读取字段；未提供键时读取整个清单。`--json` 请求原生 JSON 输出。
- `set <key=value...>` 写入字段。`--json` 会将值按 JSON 解析，因此布尔值、数字、数组与对象不会被保存为字符串。
- `delete <key...>` 移除字段。
- `fix` 请求包管理器修正常见的清单错误。

字段路径与规范化行为遵循原生包管理器。包含方括号或 shell 敏感字符的路径请加引号。

### `get`

| 选项     | 描述               | 备注               |
| -------- | ------------------ | ------------------ |
| `--json` | 以 JSON 格式输出。 | 输出保留原生结构。 |

### `set`

| 选项     | 描述                     | 备注                                               |
| -------- | ------------------------ | -------------------------------------------------- |
| `--json` | 写入前将值按 JSON 解析。 | 解析布尔值、数字、数组与对象，而不是保存为字符串。 |

### `delete`

没有命令专属选项。

### `fix`

没有命令专属选项。

## 兼容性

### `get`

- **npm：**7.20.0 及更高版本：`npm pkg get`。更早的版本会输出警告并跳过。
- **pnpm：**11.3.0 及更高版本：`pnpm pkg get`。更早的版本会输出警告并跳过。
- **Yarn Classic：**无对应命令。输出警告并成功退出，不执行该操作。
- **Yarn Modern：**无对应命令。输出警告并成功退出，不执行该操作。
- **Bun：**1.2.19 及更高版本：`bun pm pkg get`。更早的版本会输出警告并跳过。

| 选项     | npm               | pnpm              | Yarn Classic | Yarn Modern | Bun               | 备注 |
| -------- | ----------------- | ----------------- | ------------ | ----------- | ----------------- | ---- |
| `--json` | 7.20.0 及更高版本 | 11.3.0 及更高版本 | 否           | 否          | 1.2.19 及更高版本 |      |

### `set`

- **npm：**7.20.0 及更高版本：`npm pkg set`。更早的版本会输出警告并跳过。
- **pnpm：**11.3.0 及更高版本：`pnpm pkg set`。更早的版本会输出警告并跳过。
- **Yarn Classic：**无对应命令。输出警告并成功退出，不执行该操作。
- **Yarn Modern：**无对应命令。输出警告并成功退出，不执行该操作。
- **Bun：**1.2.19 及更高版本：`bun pm pkg set`。更早的版本会输出警告并跳过。

| 选项     | npm               | pnpm              | Yarn Classic | Yarn Modern | Bun               | 备注 |
| -------- | ----------------- | ----------------- | ------------ | ----------- | ----------------- | ---- |
| `--json` | 7.20.0 及更高版本 | 11.3.0 及更高版本 | 否           | 否          | 1.2.19 及更高版本 |      |

### `delete`

- **npm：**7.20.0 及更高版本：`npm pkg delete`。更早的版本会输出警告并跳过。
- **pnpm：**11.3.0 及更高版本：`pnpm pkg delete`。更早的版本会输出警告并跳过。
- **Yarn Classic：**无对应命令。输出警告并成功退出，不执行该操作。
- **Yarn Modern：**无对应命令。输出警告并成功退出，不执行该操作。
- **Bun：**1.2.19 及更高版本：`bun pm pkg delete`。更早的版本会输出警告并跳过。

### `fix`

- **npm：**9.8.0 及更高版本：`npm pkg fix`。更早的版本会输出警告并跳过。
- **pnpm：**11.3.0 及更高版本：`pnpm pkg fix`。更早的版本会输出警告并跳过。
- **Yarn Classic：**无对应命令。输出警告并成功退出，不执行该操作。
- **Yarn Modern：**无对应命令。输出警告并成功退出，不执行该操作。
- **Bun：**1.2.19 及更高版本：`bun pm pkg fix`。更早的版本会输出警告并跳过。

低于上述版本要求的会输出警告并成功退出，不执行该操作。对于不支持的包管理器或版本，不会回退到 npm。

## 原生选项

原生选项参见 [npm pkg](https://docs.npmjs.com/cli/v11/commands/npm-pkg)、[pnpm pkg](https://pnpm.io/cli/pkg) 与 [Bun pm pkg](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
