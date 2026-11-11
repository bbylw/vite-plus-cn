# vp pm ping

检查与包 registry 的连通性。

```bash
vp pm ping
vp pm ping --registry https://registry.npmjs.org
```

## 选项

| 选项               | 描述            | 备注 |
| ------------------ | --------------- | ---- |
| `--registry <url>` | 选择 registry。 |      |

## 兼容性

- **npm：**`npm ping`。
- **pnpm：**11 及更高版本：`pnpm ping`。更早的版本回退到 `npm ping`。
- **Yarn Classic：**回退：`npm ping`。
- **Yarn Modern：**回退：`npm ping`。
- **Bun：**回退：`npm ping`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注 |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ---- |
| `--registry <url>` | 是  | 是   | 是           | 是          | 是  |      |

registry 配置、输出与退出码取决于实际运行的命令。当你需要检查已认证的账户而非连通性时，请使用 [whoami](/guide/package-management/whoami)。

## 原生选项

原生选项参见 [npm ping](https://docs.npmjs.com/cli/v11/commands/npm-ping) 与 [pnpm ping](https://pnpm.io/cli/ping)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
