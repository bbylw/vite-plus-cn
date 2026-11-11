# vp pm team

管理 registry 组织中的团队及其成员。

```bash
vp pm team list my-org
vp pm team list my-org:developers --json
vp pm team create my-org:developers
vp pm team add my-org:developers alice
vp pm team rm my-org:developers alice
vp pm team destroy my-org:developers
```

## 选项

- `create <scope:team>` 创建团队。
- `destroy <scope:team>` 删除团队。
- `add <scope:team> <user>` 添加成员。
- `rm <scope:team> <user>` 移除成员。别名：`remove`。
- `list <scope[:team]>` 列出组织的团队或某个团队的成员。别名：`ls`。

所有子命令都接受 `--registry <url>`、`--otp <code>` 与 `--json`。JSON 输出保留原生包管理器的 schema。registry 权限决定已认证账户可以进行哪些变更。

### `create`

| 选项               | 说明                 | 备注                  |
| ------------------ | -------------------- | --------------------- |
| `--otp <otp>`      | 提供一次性密码。     |                       |
| `--json`           | 请求原生 JSON 输出。 | 输出保留原生 schema。 |
| `--registry <url>` | 选择 registry。      |                       |

### `destroy`

| 选项               | 说明                 | 备注                  |
| ------------------ | -------------------- | --------------------- |
| `--otp <otp>`      | 提供一次性密码。     |                       |
| `--json`           | 请求原生 JSON 输出。 | 输出保留原生 schema。 |
| `--registry <url>` | 选择 registry。      |                       |

### `add`

| 选项               | 说明                 | 备注                  |
| ------------------ | -------------------- | --------------------- |
| `--otp <otp>`      | 提供一次性密码。     |                       |
| `--json`           | 请求原生 JSON 输出。 | 输出保留原生 schema。 |
| `--registry <url>` | 选择 registry。      |                       |

### `rm`

| 选项               | 说明                 | 备注                  |
| ------------------ | -------------------- | --------------------- |
| `--otp <otp>`      | 提供一次性密码。     |                       |
| `--json`           | 请求原生 JSON 输出。 | 输出保留原生 schema。 |
| `--registry <url>` | 选择 registry。      |                       |

### `list`

| 选项               | 说明                 | 备注                  |
| ------------------ | -------------------- | --------------------- |
| `--otp <otp>`      | 提供一次性密码。     |                       |
| `--json`           | 请求原生 JSON 输出。 | 输出保留原生 schema。 |
| `--registry <url>` | 选择 registry。      |                       |

## 兼容性

回退到 npm 时会发出警告。

### `create`

- **npm：** `npm team create`。
- **pnpm：** 11.13.0 或更高版本：`pnpm team create`。更早的版本回退到 `npm team create`。
- **Yarn Classic：** `yarn team create`。
- **Yarn Modern：** 无对应命令。发出警告并成功退出，不执行该操作。
- **Bun：** 回退：`npm team create`。

| 选项               | npm | pnpm | Yarn Classic      | Yarn Modern | Bun | 备注                                                         |
| ------------------ | --- | ---- | ----------------- | ----------- | --- | ------------------------------------------------------------ |
| `--otp <otp>`      | 是  | 是   | 1.12.1 或更高版本 | 否          | 是  | 较旧的 Yarn Classic 可能忽略 --otp。Vite+ 在此不检查其版本。 |
| `--json`           | 是  | 是   | 是                | 否          | 是  |                                                              |
| `--registry <url>` | 是  | 是   | 是                | 否          | 是  |                                                              |

### `destroy`

- **npm：** `npm team destroy`。
- **pnpm：** 11.13.0 或更高版本：`pnpm team destroy`。更早的版本回退到 `npm team destroy`。
- **Yarn Classic：** `yarn team destroy`。
- **Yarn Modern：** 无对应命令。发出警告并成功退出，不执行该操作。
- **Bun：** 回退：`npm team destroy`。

| 选项               | npm | pnpm | Yarn Classic      | Yarn Modern | Bun | 备注                                                         |
| ------------------ | --- | ---- | ----------------- | ----------- | --- | ------------------------------------------------------------ |
| `--otp <otp>`      | 是  | 是   | 1.12.1 或更高版本 | 否          | 是  | 较旧的 Yarn Classic 可能忽略 --otp。Vite+ 在此不检查其版本。 |
| `--json`           | 是  | 是   | 是                | 否          | 是  |                                                              |
| `--registry <url>` | 是  | 是   | 是                | 否          | 是  |                                                              |

### `add`

- **npm：** `npm team add`。
- **pnpm：** 11.13.0 或更高版本：`pnpm team add`。更早的版本回退到 `npm team add`。
- **Yarn Classic：** `yarn team add`。
- **Yarn Modern：** 无对应命令。发出警告并成功退出，不执行该操作。
- **Bun：** 回退：`npm team add`。

| 选项               | npm | pnpm | Yarn Classic      | Yarn Modern | Bun | 备注                                                         |
| ------------------ | --- | ---- | ----------------- | ----------- | --- | ------------------------------------------------------------ |
| `--otp <otp>`      | 是  | 是   | 1.12.1 或更高版本 | 否          | 是  | 较旧的 Yarn Classic 可能忽略 --otp。Vite+ 在此不检查其版本。 |
| `--json`           | 是  | 是   | 是                | 否          | 是  |                                                              |
| `--registry <url>` | 是  | 是   | 是                | 否          | 是  |                                                              |

### `rm`

- **npm：** `npm team rm`。
- **pnpm：** 11.13.0 或更高版本：`pnpm team rm`。更早的版本回退到 `npm team rm`。
- **Yarn Classic：** `yarn team remove`。
- **Yarn Modern：** 无对应命令。发出警告并成功退出，不执行该操作。
- **Bun：** 回退：`npm team rm`。

| 选项               | npm | pnpm | Yarn Classic      | Yarn Modern | Bun | 备注                                                         |
| ------------------ | --- | ---- | ----------------- | ----------- | --- | ------------------------------------------------------------ |
| `--otp <otp>`      | 是  | 是   | 1.12.1 或更高版本 | 否          | 是  | 较旧的 Yarn Classic 可能忽略 --otp。Vite+ 在此不检查其版本。 |
| `--json`           | 是  | 是   | 是                | 否          | 是  |                                                              |
| `--registry <url>` | 是  | 是   | 是                | 否          | 是  |                                                              |

### `list`

- **npm：** `npm team ls`。
- **pnpm：** 11.13.0 或更高版本：`pnpm team ls`。更早的版本回退到 `npm team ls`。
- **Yarn Classic：** `yarn team list`。
- **Yarn Modern：** 无对应命令。发出警告并成功退出，不执行该操作。
- **Bun：** 回退：`npm team ls`。

| 选项               | npm | pnpm | Yarn Classic      | Yarn Modern | Bun | 备注                                                         |
| ------------------ | --- | ---- | ----------------- | ----------- | --- | ------------------------------------------------------------ |
| `--otp <otp>`      | 是  | 是   | 1.12.1 或更高版本 | 否          | 是  | 较旧的 Yarn Classic 可能忽略 --otp。Vite+ 在此不检查其版本。 |
| `--json`           | 是  | 是   | 是                | 否          | 是  |                                                              |
| `--registry <url>` | 是  | 是   | 是                | 否          | 是  |                                                              |

## 原生选项

原生选项参见 [npm team](https://docs.npmjs.com/cli/v11/commands/npm-team)、[pnpm team](https://pnpm.io/cli/team) 与 [Yarn Classic team](https://classic.yarnpkg.com/en/docs/cli/team)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
