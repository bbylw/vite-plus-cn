# vp dlx

下载并运行包，而不将其添加到项目的依赖中。

```bash
vp dlx create-vite my-app
vp dlx --silent create-vite my-app
```

## 选项

将 Vite+ 选项放在包或命令之前：

命令之后的参数会传递给被执行的程序，而不会被解析为 Vite+ 选项。shell 模式会解释 shell 语法；请仅对可信的命令字符串使用它。

| 选项                   | 描述                                          | 备注         |
| ---------------------- | --------------------------------------------- | ------------ |
| `-p, --package <name>` | 让所选的包可供被执行的命令使用。              | 可重复指定。 |
| `-c, --shell-mode`     | 在 shell 环境中执行。                         |              |
| `-s, --silent`         | 抑制 Vite+ 输出，并在支持时请求原生静默输出。 |              |

## 兼容性

- **npm：**`npm exec --yes`。
- **pnpm：**`pnpm dlx`。
- **Yarn Classic：**回退：`npx --yes`。
- **Yarn Modern：**`yarn dlx`。
- **Bun：**`bun x`。

| 选项                   | npm | pnpm              | Yarn Classic | Yarn Modern | Bun | 备注                    |
| ---------------------- | --- | ----------------- | ------------ | ----------- | --- | ----------------------- |
| `-p, --package <name>` | 是  | 是                | 是           | 是          | 是  |                         |
| `-c, --shell-mode`     | 是  | 7.21.0 或更高版本 | 是           | 否          | 否  |                         |
| `-s, --silent`         | 是  | 是                | 是           | 是          | 是  | Bun 仅抑制 Vite+ 输出。 |

对于已安装的项目二进制文件，请改用 `vp exec` 或 `vpx`。相关工作流参见[运行二进制文件](/guide/vpx)。

## 原生选项

原生选项参见 [npm exec](https://docs.npmjs.com/cli/v11/commands/npm-exec)、[pnpm dlx](https://pnpm.io/cli/dlx)、[Yarn dlx](https://yarnpkg.com/cli/dlx)、[Bun x](https://bun.com/docs/pm/bunx)。Yarn Classic 的回退参见 [npx](https://docs.npmjs.com/cli/v11/commands/npx)。参数处理参见[原生参数](/guide/package-management)。
