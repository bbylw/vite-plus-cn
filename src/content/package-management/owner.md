# vp pm owner

管理包的所有者。别名：`vp pm author`。

```bash
vp pm owner list my-package
vp pm owner add alice my-package
vp pm owner rm alice my-package
```

## 选项

- `list <package>` 列出所有者。别名：`ls`。
- `add <user> <package>` 授予所有权。
- `rm <user> <package>` 移除所有权。

每个子命令都接受 `--otp <code>`。这些子命令不接受 `--` 之后的额外原生参数。所有权变更影响的是 registry 权限，而不是本地清单的 author 字段。

### `list`

| 选项          | 说明             | 备注 |
| ------------- | ---------------- | ---- |
| `--otp <otp>` | 提供一次性密码。 |      |

### `add`

| 选项          | 说明             | 备注 |
| ------------- | ---------------- | ---- |
| `--otp <otp>` | 提供一次性密码。 |      |

### `rm`

| 选项          | 说明             | 备注 |
| ------------- | ---------------- | ---- |
| `--otp <otp>` | 提供一次性密码。 |      |

## 兼容性

### `list`

- **npm：** `npm owner list`。
- **pnpm：** 11.1 或更高版本：`pnpm owner list`。更早的版本回退到 `npm owner list`。
- **Yarn Classic：** `yarn owner list`。
- **Yarn Modern：** 回退：`npm owner list`。
- **Bun：** 回退：`npm owner list`。

| 选项          | npm | pnpm | Yarn Classic      | Yarn Modern | Bun | 备注 |
| ------------- | --- | ---- | ----------------- | ----------- | --- | ---- |
| `--otp <otp>` | 是  | 是   | 1.12.1 或更高版本 | 是          | 是  |      |

### `add`

- **npm：** `npm owner add`。
- **pnpm：** 11.1 或更高版本：`pnpm owner add`。更早的版本回退到 `npm owner add`。原生 pnpm 的参数顺序是包名在用户名之前。
- **Yarn Classic：** `yarn owner add`。保持用户名在包名之前。
- **Yarn Modern：** 回退：`npm owner add`。
- **Bun：** 回退：`npm owner add`。

| 选项          | npm | pnpm | Yarn Classic      | Yarn Modern | Bun | 备注 |
| ------------- | --- | ---- | ----------------- | ----------- | --- | ---- |
| `--otp <otp>` | 是  | 是   | 1.12.1 或更高版本 | 是          | 是  |      |

### `rm`

- **npm：** `npm owner rm`。
- **pnpm：** 11.1 或更高版本：`pnpm owner rm`。更早的版本回退到 `npm owner rm`。原生 pnpm 的参数顺序是包名在用户名之前。
- **Yarn Classic：** `yarn owner remove`。保持用户名在包名之前。由于上游的一个 bug，在 Yarn Classic 1.22.22 中移除可能失败。Vite+ 不会通过 npm 重试。
- **Yarn Modern：** 回退：`npm owner rm`。
- **Bun：** 回退：`npm owner rm`。

| 选项          | npm | pnpm | Yarn Classic      | Yarn Modern | Bun | 备注 |
| ------------- | --- | ---- | ----------------- | ----------- | --- | ---- |
| `--otp <otp>` | 是  | 是   | 1.12.1 或更高版本 | 是          | 是  |      |

registry 凭据与授权遵循实际运行的命令。

## 原生选项

registry 要求与原生选项参见 [npm owner](https://docs.npmjs.com/cli/v11/commands/npm-owner)、[pnpm owner](https://pnpm.io/cli/owner) 与 [Yarn Classic owner](https://classic.yarnpkg.com/en/docs/cli/owner)。上面未列出的选项必须直接使用原生命令。
