# vp pm patch-commit

将通过 [patch](/guide/package-management/patch) 准备的修改保存为依赖补丁。

```bash
vp pm patch-commit /path/to/edited-package
```

## 选项

传入包管理器补丁流程给出的编辑目录。没有额外的 Vite+ 选项。

没有命令专属选项。

## 兼容性

- **npm：**12 及更高版本：`npm patch commit`。更早的版本会输出警告并跳过。
- **pnpm：**7.4 及更高版本：`pnpm patch-commit`。更早的版本会输出警告并跳过。
- **Yarn Classic：**无对应命令。输出警告并成功退出，不执行该操作。
- **Yarn Modern：**3 及更高版本：`yarn patch-commit --save`。更早的版本会输出警告并跳过。
- **Bun：**`bun patch --commit`。

请审查并提交补丁，以及包管理器产生的任何清单或锁文件变更。

## 原生选项

原生选项参见 [npm patch commit](https://docs.npmjs.com/cli/v12/commands/npm-patch)、[pnpm patch-commit](https://pnpm.io/cli/patch-commit)、[Yarn patch-commit](https://yarnpkg.com/cli/patch-commit) 与 [Bun patch --commit](https://bun.com/docs/pm/cli/patch)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
