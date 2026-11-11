# vp link

通过所选包管理器创建本地开发链接。别名：`vp ln`。

```bash
vp link ../my-library
```

## 选项

可选的包名或目录会传递给包管理器。

没有命令专属的选项。

## 兼容性

- **npm：**`npm link`。
- **pnpm：**`pnpm link`。
- **Yarn Classic：**`yarn link`。
- **Yarn Modern：**`yarn link`。
- **Bun：**`bun link`。

目录、包名或省略参数的含义遵循该包管理器的原生链接工作流。特别地，Yarn 2 及更高版本链接项目的方式与 Yarn Classic 的包注册工作流不同。

这些链接不使用 Vite+ 的[全局包存储](/guide/package-management/global-packages)，也不会出现在 `vp list -g` 中。使用 [unlink](/guide/package-management/unlink) 可移除原生链接。

## 原生选项

原生选项参见 [npm link](https://docs.npmjs.com/cli/v11/commands/npm-link)、[pnpm link](https://pnpm.io/cli/link)、[Yarn link](https://yarnpkg.com/cli/link)、[Yarn Classic link](https://classic.yarnpkg.com/en/docs/cli/link)、[Bun link](https://bun.com/docs/pm/cli/link)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
