# vp pm logout

从包 registry 注销登录。

```bash
vp pm logout
vp pm logout --scope @my-org
```

## 选项

| 选项               | 说明               | 备注 |
| ------------------ | ------------------ | ---- |
| `--registry <url>` | 选择 registry。    |      |
| `--scope <scope>`  | 注销所用的 scope。 |      |

## 兼容性

- **npm：** `npm logout`。
- **pnpm：** 11 或更高版本：`pnpm logout`。更早的版本回退到 `npm logout`。
- **Yarn Classic：** `yarn logout`。
- **Yarn Modern：** `yarn npm logout`。
- **Bun：** 回退：`npm logout`。

| 选项               | npm | pnpm    | Yarn Classic | Yarn Modern | Bun | 备注                          |
| ------------------ | --- | ------- | ------------ | ----------- | --- | ----------------------------- |
| `--registry <url>` | 是  | 是      | 否           | 否          | 是  | 在 Yarn 设置中配置 registry。 |
| `--scope <scope>`  | 是  | 11 之前 | 否           | 是          | 是  |                               |

凭据移除与 token 失效遵循原生包管理器与 registry。原生 pnpm logout 不会运行 npm logout，也不会执行额外的凭据清理。使用 [login](/guide/package-management/login) 重新认证。

## 原生选项

原生选项参见 [npm logout](https://docs.npmjs.com/cli/v11/commands/npm-logout)、[pnpm logout](https://pnpm.io/cli/logout)、[Yarn npm logout](https://yarnpkg.com/cli/npm/logout) 与 [Yarn Classic logout](https://classic.yarnpkg.com/en/docs/cli/logout)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
