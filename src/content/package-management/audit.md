# vp pm audit

审计依赖中的已知漏洞。

```bash
vp pm audit
vp pm audit --json
vp pm audit --production --level high
```

## 选项

| 选项              | 描述                   | 备注               |
| ----------------- | ---------------------- | ------------------ |
| `--fix`           | 请求自动修复漏洞。     |                    |
| `--json`          | 请求原生 JSON 输出。   | 输出保留原生结构。 |
| `--level <level>` | 要报告的最低漏洞级别。 |                    |
| `--production`    | 仅审计生产依赖。       |                    |

## 兼容性

- **npm：**`npm audit` 或 `npm audit fix`。
- **pnpm：**`pnpm audit`。
- **Yarn Classic：**`yarn audit`。
- **Yarn Modern：**2.4 及更高版本：`yarn npm audit`。更早的版本会输出警告并跳过。
- **Bun：**`bun audit` 或 `bun audit fix`。

| 选项              | npm | pnpm | Yarn Classic | Yarn Modern | Bun               | 备注 |
| ----------------- | --- | ---- | ------------ | ----------- | ----------------- | ---- |
| `--fix`           | 是  | 是   | 否           | 否          | 1.4 及更高版本    |      |
| `--json`          | 是  | 是   | 是           | 是          | 是                |      |
| `--level <level>` | 是  | 是   | 是           | 是          | 是                |      |
| `--production`    | 是  | 是   | 是           | 是          | 1.2.21 及更高版本 |      |

漏洞输出与失败阈值保留原生包管理器的语义。

## 原生选项

原生选项参见 [npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit)、[pnpm audit](https://pnpm.io/cli/audit)、[Yarn npm audit](https://yarnpkg.com/cli/npm/audit)、[Yarn Classic audit](https://classic.yarnpkg.com/en/docs/cli/audit) 与 [Bun audit](https://bun.com/docs/pm/cli/audit)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
