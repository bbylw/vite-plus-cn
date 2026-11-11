# vp pm whoami

显示已在 registry 认证的账户。

```bash
vp pm whoami
vp pm whoami --registry https://registry.npmjs.org
```

## 选项

| 选项               | 说明            | 备注 |
| ------------------ | --------------- | ---- |
| `--registry <url>` | 选择 registry。 |      |

## 兼容性

- **npm：** `npm whoami`。
- **pnpm：** 11 或更高版本：`pnpm whoami`。更早的版本回退到 `npm whoami`。
- **Yarn Classic：** 无对应命令。发出警告并成功退出，不执行该操作。
- **Yarn Modern：** `yarn npm whoami`。
- **Bun：** `bun pm whoami`。

| 选项               | npm | pnpm | Yarn Classic | Yarn Modern | Bun | 备注                                 |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ------------------------------------ |
| `--registry <url>` | 是  | 是   | 否           | 否          | 是  | 在 Yarn Modern 设置中配置 registry。 |

## 原生选项

原生选项参见 [npm whoami](https://docs.npmjs.com/cli/v11/commands/npm-whoami)、[pnpm whoami](https://pnpm.io/cli/whoami)、[Yarn npm whoami](https://yarnpkg.com/cli/npm/whoami) 与 [Bun pm whoami](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
