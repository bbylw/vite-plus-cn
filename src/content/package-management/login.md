# vp pm login

向包 registry 进行认证。别名：`vp pm adduser`。

```bash
vp pm login
vp pm login --scope @my-org
```

## 选项

| 选项               | 说明               | 备注 |
| ------------------ | ------------------ | ---- |
| `--registry <url>` | 选择 registry。    |      |
| `--scope <scope>`  | 登录所用的 scope。 |      |

## 兼容性

- **npm：** `npm login`。
- **pnpm：** 11 或更高版本：`pnpm login`。更早的版本回退到 `npm login`。
- **Yarn Classic：** `yarn login`。
- **Yarn Modern：** `yarn npm login`。
- **Bun：** 回退：`npm login`。

| 选项               | npm | pnpm                        | Yarn Classic | Yarn Modern | Bun | 备注                          |
| ------------------ | --- | --------------------------- | ------------ | ----------- | --- | ----------------------------- |
| `--registry <url>` | 是  | 是                          | 否           | 否          | 是  | 在 Yarn 设置中配置 registry。 |
| `--scope <scope>`  | 是  | 11 之前，或 11.2 及更高版本 | 否           | 是          | 是  |                               |

认证提示与凭据存储由原生命令负责。pnpm login 不会把凭据复制到 npm，因此仍使用 npm 的命令可能需要单独登录。参见 [whoami](/guide/package-management/whoami) 检查所选账户，参见 [logout](/guide/package-management/logout) 结束认证。

## 原生选项

原生选项参见 [npm login](https://docs.npmjs.com/cli/v11/commands/npm-login)、[pnpm login](https://pnpm.io/cli/login)、[Yarn npm login](https://yarnpkg.com/cli/npm/login) 与 [Yarn Classic login](https://classic.yarnpkg.com/en/docs/cli/login)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
