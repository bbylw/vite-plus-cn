# vp pm token

管理 registry 认证 token。

```bash
vp pm token list
vp pm token list --json
vp pm token revoke <token-id>
```

## 选项

- `list`（也写作 `ls`）列出 token。支持 `--json` 与 `--registry <url>`。
- `create` 请求新的 token。支持 `--json`、`--registry <url>`、`--readonly`，以及可重复使用的 `--cidr <range>` 限制。
- `revoke <token-or-id>` 吊销 token。支持 `--registry <url>`。

请把 token 当作机密对待。吊销时优先使用 token ID，而不是把原始 token 留在 shell 历史中。token 的创建与支持的 token 类型取决于 registry 当前的策略以及原生包管理器版本；提供 `create` 并不保证某个 registry 允许通过 CLI 创建 token。

### `list`

| 选项               | 说明                 | 备注                  |
| ------------------ | -------------------- | --------------------- |
| `--json`           | 请求原生 JSON 输出。 | 输出保留原生 schema。 |
| `--registry <url>` | 选择 registry。      |                       |

### `create`

| 选项               | 说明                          | 备注                  |
| ------------------ | ----------------------------- | --------------------- |
| `--json`           | 请求原生 JSON 输出。          | 输出保留原生 schema。 |
| `--registry <url>` | 选择 registry。               |                       |
| `--cidr <cidr>`    | 限制 token 可用的 CIDR 范围。 | 可重复使用。          |
| `--readonly`       | 创建只读 token。              |                       |

### `revoke`

| 选项               | 说明            | 备注 |
| ------------------ | --------------- | ---- |
| `--registry <url>` | 选择 registry。 |      |

## 兼容性

### `list`

- **npm：** `npm token list`。
- **pnpm：** 12.13 或更高版本：`pnpm token list`。更早的版本回退到 `npm token list`。
- **Yarn Classic：** 回退：`npm token list`。
- **Yarn Modern：** 回退：`npm token list`。
- **Bun：** 回退：`npm token list`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---- |
| `--json`           | 是  | 是   | 是           | 是          | 是  |      |
| `--registry <url>` | 是  | 是   | 是           | 是          | 是  |      |

### `create`

- **npm：** `npm token create`。
- **pnpm：** 12.13 或更高版本：`pnpm token create`。更早的版本回退到 `npm token create`。
- **Yarn Classic：** 回退：`npm token create`。
- **Yarn Modern：** 回退：`npm token create`。
- **Bun：** 回退：`npm token create`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---- |
| `--json`           | 是  | 是   | 是           | 是          | 是  |      |
| `--registry <url>` | 是  | 是   | 是           | 是          | 是  |      |
| `--cidr <cidr>`    | 是  | 是   | 是           | 是          | 是  |      |
| `--readonly`       | 是  | 是   | 是           | 是          | 是  |      |

### `revoke`

- **npm：** `npm token revoke`。
- **pnpm：** 12.13 或更高版本：`pnpm token revoke`。更早的版本回退到 `npm token revoke`。
- **Yarn Classic：** 回退：`npm token revoke`。
- **Yarn Modern：** 回退：`npm token revoke`。
- **Bun：** 回退：`npm token revoke`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---- |
| `--registry <url>` | 是  | 是   | 是           | 是          | 是  |      |

`revoke` 接受一个 token 或 ID。认证、密码提示与 token 解析遵循原生命令。Vite+ 不会规范化 token 类型或输出 schema。

## 原生选项

原生选项参见 [npm token](https://docs.npmjs.com/cli/v11/commands/npm-token) 与 [pnpm token](https://pnpm.io/cli/token)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
