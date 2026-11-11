# vp rebuild

重建已安装的包，例如在切换 Node.js 版本之后，或原生插件需要重新编译时。此顶层命令需要全局 CLI。全局 CLI 与项目本地 CLI 都接受 `vp pm rebuild` 及其别名 `vp pm rb`。

```bash
vp rebuild
vp rebuild better-sqlite3 sharp
vp rebuild -- --update-binary
```

## 选项

提供包名可仅重建这些包。省略包名则请求完整重建。没有额外的 Vite+ 选项。

没有命令专属的选项。

## 兼容性

- **npm：**`npm rebuild`。
- **pnpm：**`pnpm rebuild`。
- **Yarn Classic：**无对应命令。发出警告并成功退出，不执行该操作。
- **Yarn Modern：**`yarn rebuild`。
- **Bun：**无对应命令。发出警告并成功退出，不执行该操作。

在 pnpm 10 及更高版本中，直接运行 rebuild 会遵循构建脚本的批准结果。显式指定包名会绕过该批准环节，因此请只重建你信任其脚本的包。

在 npm 12 上，[批准依赖的脚本](/guide/package-management/approve-builds)只会记录策略，不会执行先前安装跳过的脚本。批准后请重建该包。

## 原生选项

原生选项参见 [npm rebuild](https://docs.npmjs.com/cli/v11/commands/npm-rebuild)、[pnpm rebuild](https://pnpm.io/cli/rebuild)、[Yarn rebuild](https://yarnpkg.com/cli/rebuild)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
