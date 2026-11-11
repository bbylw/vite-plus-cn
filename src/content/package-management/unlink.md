# vp unlink

移除为本地开发创建的原生包管理器链接。

```bash
vp unlink my-library
```

## 选项

可选的包名或目录会转发给包管理器。在支持的情况下，`-r, --recursive` 请求跨工作区解除链接。

| 选项              | 描述                       | 备注 |
| ----------------- | -------------------------- | ---- |
| `-r, --recursive` | 在每个工作区包中解除链接。 |      |

## 兼容性

- **npm：**`npm unlink`。
- **pnpm：**`pnpm unlink`。
- **Yarn Classic：**`yarn unlink`。
- **Yarn Modern：**3 或更高版本：`yarn unlink`。更早版本会发出警告并跳过。
- **Bun：**`bun unlink`。

| 选项              | npm              | pnpm | Yarn Classic | Yarn Modern  | Bun | 备注                     |
| ----------------- | ---------------- | ---- | ------------ | ------------ | --- | ------------------------ |
| `-r, --recursive` | 8.1.0 或更高版本 | 是   | 否           | 3 或更高版本 | 否  | npm 会包含工作区根目录。 |

操作数与清单更新行为遵循原生包管理器。此命令不会从 Vite+ 的[全局存储](/guide/package-management/global-packages)中移除包。

## 原生选项

原生选项参见 [npm unlink](https://docs.npmjs.com/cli/v11/commands/npm-uninstall)、[pnpm unlink](https://pnpm.io/cli/unlink)、[Yarn unlink](https://yarnpkg.com/cli/unlink)、[Yarn Classic unlink](https://classic.yarnpkg.com/en/docs/cli/unlink)、[Bun unlink](https://bun.com/docs/pm/cli/link)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
