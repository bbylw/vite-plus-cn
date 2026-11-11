# vp dedupe

使用所选包管理器减少重复的依赖条目。

```bash
vp dedupe
vp dedupe --check
```

## 选项

| 选项      | 描述                     | 备注 |
| --------- | ------------------------ | ---- |
| `--check` | 检查去重是否会产生变更。 |      |

## 兼容性

- **npm：**`npm dedupe`。
- **pnpm：**`pnpm dedupe`。
- **Yarn Classic：**回退：`yarn install`。
- **Yarn Modern：**`yarn dedupe`。
- **Bun：**1.4 或更高版本：`bun dedupe`。更早版本回退到 `bun install`。

| 选项      | npm | pnpm | Yarn Classic | Yarn Modern | Bun            | 备注 |
| --------- | --- | ---- | ------------ | ----------- | -------------- | ---- |
| `--check` | 是  | 是   | 否           | 是          | 1.4 或更高版本 |      |

回退安装不是只读检查。不支持的 `--check` 请求会在回退运行之前失败。

## 原生选项

原生选项参见 [npm dedupe](https://docs.npmjs.com/cli/v11/commands/npm-dedupe)、[pnpm dedupe](https://pnpm.io/cli/dedupe)、[Yarn dedupe](https://yarnpkg.com/cli/dedupe)、[Yarn Classic install](https://classic.yarnpkg.com/en/docs/cli/install)、[Bun dedupe](https://bun.com/docs/pm/cli/dedupe)。Bun 的回退参见 [Bun install](https://bun.com/docs/pm/cli/install)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
