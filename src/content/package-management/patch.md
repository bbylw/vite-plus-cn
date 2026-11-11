# vp pm patch

准备一个已安装的依赖，以便在本地打补丁。

```bash
vp pm patch my-dependency@1.0.0
```

在原生包管理器给出的位置编辑该包，然后使用 [patch-commit](/guide/package-management/patch-commit) 保存补丁。

## 选项

必须提供一个包 spec。没有额外的 Vite+ 选项。

没有命令专属选项。

## 兼容性

- **npm：**12 及更高版本：`npm patch add`。更早的版本会输出警告并跳过。
- **pnpm：**7.4 及更高版本：`pnpm patch`。更早的版本会输出警告并跳过。
- **Yarn Classic：**无对应命令。输出警告并成功退出，不执行该操作。
- **Yarn Modern：**`yarn patch`。
- **Bun：**`bun patch`。

编辑位置与补丁存储格式属于原生包管理器的细节。Vite+ 不会在不同包管理器之间转换补丁。

## 原生选项

原生选项参见 [npm patch add](https://docs.npmjs.com/cli/v12/commands/npm-patch)、[pnpm patch](https://pnpm.io/cli/patch)、[Yarn patch](https://yarnpkg.com/cli/patch) 与 [Bun patch](https://bun.com/docs/pm/cli/patch)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
