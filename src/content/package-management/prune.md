# vp pm prune

移除不再需要的已安装包。

```bash
vp pm prune
vp pm prune --prod
```

## 选项

| 选项            | 描述                   | 备注 |
| --------------- | ---------------------- | ---- |
| `--prod`        | 移除 devDependencies。 |      |
| `--no-optional` | 移除可选依赖。         |      |

## 兼容性

- **npm：**`npm prune`。
- **pnpm：**`pnpm prune`。
- **Yarn Classic：**无对应命令。输出警告并成功退出，不执行该操作。
- **Yarn Modern：**无对应命令。输出警告并成功退出，不执行该操作。
- **Bun：**1.4 及更高版本：`bun prune`。更早的版本会输出警告并跳过。

| 选项            | npm          | pnpm | Yarn Classic | Yarn Modern | Bun            | 备注 |
| --------------- | ------------ | ---- | ------------ | ----------- | -------------- | ---- |
| `--prod`        | 是           | 是   | 否           | 否          | 1.4 及更高版本 |      |
| `--no-optional` | 7 及更高版本 | 是   | 否           | 否          | 1.4 及更高版本 |      |

npm 7 及更高版本会把选择标志转换为 `--omit=dev` 与 `--omit=optional`。npm 6 会把 `--prod` 转换为 `--production`，且不支持 `--no-optional`。Bun 会把 `--prod` 转换为 `--production`。Yarn 与旧版 Bun 不提供原生的 prune 命令，而是在安装期间移除多余的包。

## 原生选项

原生选项参见 [npm prune](https://docs.npmjs.com/cli/v11/commands/npm-prune)、[pnpm prune](https://pnpm.io/cli/prune) 与 [Bun prune](https://bun.com/docs/pm/cli/prune)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
