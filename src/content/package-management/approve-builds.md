# vp pm approve-builds

按所选包管理器的信任策略批准依赖的生命周期脚本。只批准你确实打算执行其安装脚本的包。

```bash
vp pm approve-builds
vp pm approve-builds sharp
vp pm approve-builds '!untrusted-package'
vp pm approve-builds --all
```

## 选项

传入要批准的包，或在包名前加 `!` 前缀以请求拒绝（在支持的情况下）。请为拒绝参数加引号，以避免 shell 历史展开。

| 选项    | 描述                           | 备注                                       |
| ------- | ------------------------------ | ------------------------------------------ |
| `--all` | 批准所有等待构建脚本批准的包。 | 不能与包名同时使用，包括 `--` 之后的包名。 |

## 兼容性

- **npm：**11.16 及更高版本：`npm approve-scripts`。更早的版本会输出警告并跳过。拒绝操作使用 `npm deny-scripts`。
- **pnpm：**10.1 及更高版本：`pnpm approve-builds`。更早的版本会输出警告并跳过。
- **Yarn Classic：**无对应命令。输出警告并成功退出，不执行该操作。
- **Yarn Modern：**无对应命令。输出警告并成功退出，不执行该操作。
- **Bun：**对指定的包或 `--all` 使用 `bun pm trust`。

| 选项    | npm                | pnpm               | Yarn Classic | Yarn Modern | Bun | 备注 |
| ------- | ------------------ | ------------------ | ------------ | ----------- | --- | ---- |
| `--all` | 11.16.0 及更高版本 | 10.32.0 及更高版本 | 否           | 否          | 是  |      |

不指定包名时，pnpm 会打开交互式流程，npm 会通过 `--allow-scripts-pending` 列出待处理的包。Bun 不会打开交互式选择器；请用 `bun pm untrusted` 查看待处理的包，然后指定要信任的包名。

以 `!` 为前缀的拒绝参数需要 pnpm 11 及更高版本或 npm 11.16 及更高版本。npm 要求批准与拒绝分开调用。Bun 使用 `trustedDependencies` 而非拒绝列表，因此会跳过拒绝条目并发出警告。

对于 Yarn Modern，请配置 `enableScripts: false`，并通过 `dependenciesMeta` 显式允许受信任的包。

### npm 构建脚本策略

npm 12 会强制执行 `package.json` 中的 `allowScripts`。未被该策略涵盖的依赖安装脚本会被跳过，包括隐式的原生构建。批准会更新策略，但不会执行先前被跳过的脚本。请随后运行 [`vp pm rebuild <package>`](/guide/package-management/rebuild)。

在 npm 11.16 到 11.x 中，该策略是建议性的。脚本仍会运行，npm 会对未经审查的包发出警告。

## 原生选项

原生选项参见 [npm approve-scripts](https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts)、[npm deny-scripts](https://docs.npmjs.com/cli/v11/commands/npm-deny-scripts)、[pnpm approve-builds](https://pnpm.io/cli/approve-builds)、[Bun pm trust](https://bun.com/docs/pm/cli/pm) 与 [Bun pm untrusted](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。

脚本策略配置参见 [npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)、[Yarn enableScripts](https://yarnpkg.com/configuration/yarnrc#enableScripts) 与 [Bun 生命周期脚本](https://bun.com/docs/pm/lifecycle)。
