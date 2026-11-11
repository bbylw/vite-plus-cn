# vp pm deprecate

为已发布的包版本或版本范围设置弃用消息。

```bash
vp pm deprecate 'my-package@<2.0.0' 'Upgrade to version 2 or later'
```

## 选项

必须提供包说明符与消息。

弃用只是向使用方发出警告；它不会取消发布该包。

| 选项               | 说明             | 备注 |
| ------------------ | ---------------- | ---- |
| `--otp <otp>`      | 提供一次性密码。 |      |
| `--registry <url>` | 选择 registry。  |      |

## 兼容性

- **npm：** `npm deprecate`。
- **pnpm：** 11 或更高版本：`pnpm deprecate`。更早的版本回退到 `npm deprecate`。
- **Yarn Classic：** 回退：`npm deprecate`。
- **Yarn Modern：** 回退：`npm deprecate`。
- **Bun：** 回退：`npm deprecate`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---- |
| `--otp <otp>`      | 是  | 是   | 是           | 是          | 是  |      |
| `--registry <url>` | 是  | 是   | 是           | 是          | 是  |      |

Bun 会发出回退警告。registry 配置与认证遵循实际运行的命令。

空消息会原样转发。原生 pnpm 会拒绝它；Vite+ 不会把它转换为 `undeprecate`。

## 原生选项

原生选项参见 [npm deprecate](https://docs.npmjs.com/cli/v11/commands/npm-deprecate) 与 [pnpm deprecate](https://pnpm.io/cli/deprecate)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
