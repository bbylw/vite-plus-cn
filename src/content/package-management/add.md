# vp add

向项目添加包，并更新其清单与锁文件。

```bash
vp add react
vp add -D typescript
vp add --save-peer react
vp add --filter web react
```

## 选项

每次只能选择一个依赖目标。peer 依赖遵循原生包管理器的行为，包括是否同时记录一条开发依赖。

| 选项                         | 描述                                  | 备注                                                                        |
| ---------------------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `-P, --save-prod`            | 保存到 dependencies，这是默认目标。   | 只能选择一个依赖目标。                                                      |
| `-D, --save-dev`             | 保存到 devDependencies。              | 只能选择一个依赖目标。                                                      |
| `--save-peer`                | 请求包管理器的 peer 依赖保存行为。    | 只能选择一个依赖目标。                                                      |
| `-O, --save-optional`        | 保存到 optionalDependencies。         | 只能选择一个依赖目标。                                                      |
| `-E, --save-exact`           | 保存确切的依赖版本。                  |                                                                             |
| `--save-catalog-name <name>` | 将依赖保存到具名 catalog。            |                                                                             |
| `--save-catalog`             | 将依赖保存到默认 catalog。            |                                                                             |
| `--allow-build <names>`      | 允许指定的包运行 postinstall 脚本。   |                                                                             |
| `--ignore-scripts`           | 跳过生命周期脚本。                    |                                                                             |
| `--no-optional`              | 不安装 optionalDependencies。         | 不能与 --global 一起使用。                                                  |
| `--frozen-lockfile`          | 阻止锁文件变更。                      | 不能与 --global 一起使用。覆盖先前的 `--no-frozen-lockfile`。               |
| `--no-frozen-lockfile`       | 显式允许更新锁文件。                  | 不能与 --global 一起使用。覆盖先前的 `--frozen-lockfile`。                  |
| `--lockfile-only`            | 仅更新锁文件，不执行完整安装。        | 不能与 --global 一起使用。                                                  |
| `--prefer-offline`           | 可用时优先使用缓存的包。              | 不能与 --global 一起使用。                                                  |
| `--offline`                  | 仅使用已在缓存中的包。                | 不能与 --global 一起使用。                                                  |
| `-f, --force`                | 请求强制重新安装。                    | 不能与 --global 一起使用。                                                  |
| `--no-lockfile`              | 跳过读取或生成锁文件。                | 不能与 --global 一起使用。                                                  |
| `--shamefully-hoist`         | 创建扁平的 `node_modules` 布局。      | 不能与 --global 一起使用。                                                  |
| `--silent`                   | 抑制 Vite+ 输出，并请求原生静默输出。 | 不能与 --global 一起使用。                                                  |
| `--filter <pattern>`         | 按模式选择工作区。                    | 可重复指定。                                                                |
| `-w, --workspace-root`       | 添加到工作区根目录。                  |                                                                             |
| `--workspace`                | 要求依赖存在于工作区中。              |                                                                             |
| `-g, --global`               | 全局安装。                            | 需要全局 CLI。使用[全局包存储](/guide/package-management/global-packages)。 |
| `--node <version>`           | 全局安装使用的 Node.js 版本。         | 需要 --global。                                                             |
| `--concurrency <number>`     | 并行执行的全局包安装数量。            | 需要 --global。必须为正整数。                                               |

## 兼容性

以下命令描述的是项目操作。全局模式参见[选项](#选项)。

- **npm：**`npm install`。
- **pnpm：**`pnpm add`。
- **Yarn Classic：**`yarn add`。
- **Yarn Modern：**`yarn add`。
- **Bun：**`bun add`。

| 选项                         | npm               | pnpm               | Yarn Classic | Yarn Modern  | Bun              | 备注                                          |
| ---------------------------- | ----------------- | ------------------ | ------------ | ------------ | ---------------- | --------------------------------------------- |
| `-P, --save-prod`            | 是                | 是                 | 是           | 是           | 是               |                                               |
| `-D, --save-dev`             | 是                | 是                 | 是           | 是           | 是               |                                               |
| `--save-peer`                | 是                | 是                 | 是           | 是           | 是               |                                               |
| `-O, --save-optional`        | 是                | 是                 | 是           | 是           | 是               |                                               |
| `-E, --save-exact`           | 是                | 是                 | 是           | 是           | 是               |                                               |
| `--save-catalog-name <name>` | 否                | 10.12.0 或更高版本 | 否           | 否           | 1.4 或更高版本   |                                               |
| `--save-catalog`             | 否                | 10.12.0 或更高版本 | 否           | 否           | 1.4 或更高版本   |                                               |
| `--allow-build <names>`      | 否                | 10.4.0 或更高版本  | 否           | 否           | 否               |                                               |
| `--ignore-scripts`           | 是                | 是                 | 是           | 3 或更高版本 | 是               | 在 Yarn Modern 上，--lockfile-only 模式优先。 |
| `--no-optional`              | 是                | 是                 | 是           | 否           | 是               |                                               |
| `--frozen-lockfile`          | 否                | 否                 | 是           | 否           | 是               |                                               |
| `--no-frozen-lockfile`       | 否                | 否                 | 否           | 否           | 是               |                                               |
| `--lockfile-only`            | 是                | 是                 | 否           | 3 或更高版本 | 是               |                                               |
| `--prefer-offline`           | 是                | 是                 | 是           | 否           | 1.4.1 或更高版本 |                                               |
| `--offline`                  | 是                | 是                 | 是           | 否           | 1.4.1 或更高版本 |                                               |
| `-f, --force`                | 是                | 是                 | 是           | 否           | 是               |                                               |
| `--no-lockfile`              | 是                | 是                 | 是           | 否           | 否               |                                               |
| `--shamefully-hoist`         | 否                | 是                 | 否           | 否           | 否               |                                               |
| `--silent`                   | 是                | 是                 | 是           | 否           | 是               |                                               |
| `--filter <pattern>`         | 7.14.0 或更高版本 | 是                 | 否           | 是           | 1.4 或更高版本   |                                               |
| `-w, --workspace-root`       | 8.1.0 或更高版本  | 是                 | 是           | 否           | 否               |                                               |
| `--workspace`                | 否                | 是                 | 否           | 否           | 否               |                                               |
| `-g, --global`               | 是                | 是                 | 是           | 是           | 是               |                                               |
| `--node <version>`           | 是                | 是                 | 是           | 是           | 是               |                                               |
| `--concurrency <number>`     | 是                | 是                 | 是           | 是           | 是               |                                               |

## 原生选项

原生选项参见 [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install)、[pnpm add](https://pnpm.io/cli/add)、[Yarn add](https://yarnpkg.com/cli/add)、[Yarn Classic add](https://classic.yarnpkg.com/en/docs/cli/add)、[Bun add](https://bun.com/docs/pm/cli/add)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
