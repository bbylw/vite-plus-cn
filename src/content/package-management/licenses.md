# vp pm licenses

列出已安装依赖所报告的许可证。

```bash
vp pm licenses list
vp pm licenses list --json
```

## 选项

支持的子命令是 `list`，也可写作 `ls`。`--json` 请求包管理器的原生 JSON 输出。Vite+ 不会将输出规范化为统一的结构。

### `list`

| 选项     | 描述                 | 备注               |
| -------- | -------------------- | ------------------ |
| `--json` | 请求原生 JSON 输出。 | 输出保留原生结构。 |

## 兼容性

### `list`

- **npm：**无对应命令。输出警告并成功退出，不执行该操作。
- **pnpm：**7.17.0 及更高版本：`pnpm licenses list`。更早的版本会输出警告并跳过。
- **Yarn Classic：**`yarn licenses list`。
- **Yarn Modern：**无对应命令。输出警告并成功退出，不执行该操作。
- **Bun：**1.4.0 及更高版本：`bun pm licenses`。更早的版本会输出警告并跳过。

| 选项     | npm | pnpm              | Yarn Classic | Yarn Modern | Bun              | 备注 |
| -------- | --- | ----------------- | ------------ | ----------- | ---------------- | ---- |
| `--json` | 否  | 7.17.0 及更高版本 | 是           | 否          | 1.4.0 及更高版本 |      |

## 原生选项

例如，pnpm 项目可以使用：

```bash
vp pm licenses list -- --prod --long
```

原生选项参见 [pnpm licenses](https://pnpm.io/cli/licenses)、[Yarn Classic licenses](https://classic.yarnpkg.com/en/docs/cli/licenses) 与 [Bun pm licenses](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
