# vp pm stage

使用暂存发布把包的上传与正式发布分开。CI 任务可以先在无需 2FA 的情况下把版本上传到暂存区，然后由维护者在可信设备上通过 2FA 批准或拒绝它。

```bash
vp pm stage publish --dry-run
vp pm stage publish
vp pm stage list
vp pm stage view <stage-id>
vp pm stage download <stage-id>
vp pm stage approve <stage-id>
vp pm stage reject <stage-id>
```

## 选项

使用下面的子命令上传、查看、批准或拒绝已暂存的版本。

### `publish`

上传包。可接受可选的 tarball 或文件夹目标。

| 选项                            | 说明                         | 备注                  |
| ------------------------------- | ---------------------------- | --------------------- |
| `--tag <tag>`                   | 发布 tag。                   |                       |
| `--access <public\|restricted>` | 请求公开或受限的包访问权限。 |                       |
| `--otp <otp>`                   | 提供一次性密码。             |                       |
| `--dry-run`                     | 预览而不实际暂存。           |                       |
| `--json`                        | 请求原生 JSON 输出。         | 输出保留原生 schema。 |
| `-r, --recursive`               | 暂存所有可发布的工作区包。   |                       |
| `--filter <pattern>`            | 按模式选择工作区。           | 可重复使用。          |
| `--provenance`                  | 携带 provenance 暂存。       | 需要兼容的发布环境。  |
| `--registry <url>`              | 选择 registry。              |                       |

### `list`

列出已暂存的版本。可接受可选的包说明符。别名：`ls`。

| 选项               | 说明                 | 备注                  |
| ------------------ | -------------------- | --------------------- |
| `--json`           | 请求原生 JSON 输出。 | 输出保留原生 schema。 |
| `--registry <url>` | 选择 registry。      |                       |

### `view`

查看已暂存的版本。需要 stage ID。

| 选项               | 说明                 | 备注                  |
| ------------------ | -------------------- | --------------------- |
| `--json`           | 请求原生 JSON 输出。 | 输出保留原生 schema。 |
| `--registry <url>` | 选择 registry。      |                       |

### `download`

下载已暂存的 tarball。需要 stage ID。

| 选项               | 说明            | 备注 |
| ------------------ | --------------- | ---- |
| `--registry <url>` | 选择 registry。 |      |

### `approve`

将已暂存的版本提升到线上 registry。需要 stage ID。

| 选项               | 说明             | 备注 |
| ------------------ | ---------------- | ---- |
| `--otp <otp>`      | 提供一次性密码。 |      |
| `--registry <url>` | 选择 registry。  |      |

### `reject`

丢弃已暂存的版本。需要 stage ID。

| 选项               | 说明             | 备注 |
| ------------------ | ---------------- | ---- |
| `--otp <otp>`      | 提供一次性密码。 |      |
| `--registry <url>` | 选择 registry。  |      |

## 兼容性

所有 npm 路径（包括回退）都要求 npm 11.15 或更高版本以及 Node.js 22.14 或更高版本。

### `publish`

- **npm：** 11.15 或更高版本：`npm stage publish`。更早的版本会发出警告并跳过。
- **pnpm：** 11.3 或更高版本：`pnpm stage publish`。更早的版本会发出警告并跳过。
- **Yarn Classic：** 回退：`npm stage publish`。
- **Yarn Modern：** 4.16.0 或更高版本：`yarn npm publish --staged`。更早的版本回退到 `npm stage publish`。显式目标使用 npm 回退。
- **Bun：** 回退：`npm stage publish`。

| 选项                            | npm                | pnpm | Yarn Classic       | Yarn Modern                     | Bun                | 备注                                           |
| ------------------------------- | ------------------ | ---- | ------------------ | ------------------------------- | ------------------ | ---------------------------------------------- |
| `--tag <tag>`                   | 是                 | 是   | 是                 | 是                              | 是                 |                                                |
| `--access <public\|restricted>` | 是                 | 是   | 是                 | 是                              | 是                 |                                                |
| `--otp <otp>`                   | 是                 | 是   | 是                 | 是                              | 是                 |                                                |
| `--dry-run`                     | 是                 | 是   | 是                 | 是                              | 是                 |                                                |
| `--json`                        | 是                 | 是   | 是                 | 是                              | 是                 |                                                |
| `-r, --recursive`               | 无目标或目标为 `.` | 是   | 无目标或目标为 `.` | 4.16 之前且无目标，或目标为 `.` | 无目标或目标为 `.` |                                                |
| `--filter <pattern>`            | 无目标或目标为 `.` | 是   | 无目标或目标为 `.` | 4.16 之前且无目标，或目标为 `.` | 无目标或目标为 `.` |                                                |
| `--provenance`                  | 是                 | 是   | 是                 | 是                              | 是                 |                                                |
| `--registry <url>`              | 是                 | 是   | 是                 | 4.16 之前，或显式目标           | 是                 | 在原生 Yarn 路径上使用 Yarn 的 registry 设置。 |

### `list`

- **npm：** 11.15 或更高版本：`npm stage list`。更早的版本会发出警告并跳过。
- **pnpm：** 11.3 或更高版本：`pnpm stage list`。更早的版本会发出警告并跳过。
- **Yarn Classic：** 回退：`npm stage list`。
- **Yarn Modern：** 4.16.0 或更高版本：`yarn npm stage list`。更早的版本回退到 `npm stage list`。
- **Bun：** 回退：`npm stage list`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注                                           |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---------------------------------------------- |
| `--json`           | 是  | 是   | 是           | 是          | 是  |                                                |
| `--registry <url>` | 是  | 是   | 是           | 4.16.0 之前 | 是  | 在原生 Yarn 路径上使用 Yarn 的 registry 设置。 |

### `view`

- **npm：** 11.15 或更高版本：`npm stage view`。更早的版本会发出警告并跳过。
- **pnpm：** 11.3 或更高版本：`pnpm stage view`。更早的版本会发出警告并跳过。
- **Yarn Classic：** 回退：`npm stage view`。
- **Yarn Modern：** 回退：`npm stage view`。
- **Bun：** 回退：`npm stage view`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---- |
| `--json`           | 是  | 是   | 是           | 是          | 是  |      |
| `--registry <url>` | 是  | 是   | 是           | 是          | 是  |      |

### `download`

- **npm：** 11.15 或更高版本：`npm stage download`。更早的版本会发出警告并跳过。
- **pnpm：** 11.3 或更高版本：`pnpm stage download`。更早的版本会发出警告并跳过。
- **Yarn Classic：** 回退：`npm stage download`。
- **Yarn Modern：** 回退：`npm stage download`。
- **Bun：** 回退：`npm stage download`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---- |
| `--registry <url>` | 是  | 是   | 是           | 是          | 是  |      |

### `approve`

- **npm：** 11.15 或更高版本：`npm stage approve`。更早的版本会发出警告并跳过。
- **pnpm：** 11.3 或更高版本：`pnpm stage approve`。更早的版本会发出警告并跳过。
- **Yarn Classic：** 回退：`npm stage approve`。
- **Yarn Modern：** 4.16.0 或更高版本：`yarn npm stage approve`。更早的版本回退到 `npm stage approve`。
- **Bun：** 回退：`npm stage approve`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注                                           |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---------------------------------------------- |
| `--otp <otp>`      | 是  | 是   | 是           | 是          | 是  |                                                |
| `--registry <url>` | 是  | 是   | 是           | 4.16.0 之前 | 是  | 在原生 Yarn 路径上使用 Yarn 的 registry 设置。 |

### `reject`

- **npm：** 11.15 或更高版本：`npm stage reject`。更早的版本会发出警告并跳过。
- **pnpm：** 11.3 或更高版本：`pnpm stage reject`。更早的版本会发出警告并跳过。
- **Yarn Classic：** 回退：`npm stage reject`。
- **Yarn Modern：** 4.16.0 或更高版本：`yarn npm stage reject`。更早的版本回退到 `npm stage reject`。
- **Bun：** 回退：`npm stage reject`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注                                           |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---------------------------------------------- |
| `--otp <otp>`      | 是  | 是   | 是           | 是          | 是  |                                                |
| `--registry <url>` | 是  | 是   | 是           | 4.16.0 之前 | 是  | 在原生 Yarn 路径上使用 Yarn 的 registry 设置。 |

Yarn 的回退路径与 Bun 会在调用 npm 之前发出警告。

此命令与 Yarn 的版本控制暂存命令以及 Vite+ 的暂存文件检查无关。

## 原生选项

原生选项参见 [npm stage](https://docs.npmjs.com/cli/v11/commands/npm-stage)、[pnpm stage](https://pnpm.io/cli/stage)、[Yarn npm publish](https://yarnpkg.com/cli/npm/publish)、[Yarn npm stage list](https://yarnpkg.com/cli/npm/stage/list)、[Yarn npm stage approve](https://yarnpkg.com/cli/npm/stage/approve) 与 [Yarn npm stage reject](https://yarnpkg.com/cli/npm/stage/reject)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。

registry 工作流参见 [npm 暂存发布](https://docs.npmjs.com/staged-publishing)。
