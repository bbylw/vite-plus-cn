# vp install

安装项目声明的依赖。别名：`vp i`。提供包名时会切换为 [add](/guide/package-management/add) 的行为。

```bash
vp install
vp install --frozen-lockfile
vp install --lockfile-only
vp install --filter web
vp install react
```

## 选项

| 选项                     | 描述                                               | 备注                                                                                  |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `-P, --prod`             | 选择生产依赖，或将添加的包保存到 dependencies。    |                                                                                       |
| `-D, --dev`              | 包含开发依赖，或将添加的包保存到 devDependencies。 |                                                                                       |
| `--no-optional`          | 不安装 optionalDependencies。                      |                                                                                       |
| `--frozen-lockfile`      | 阻止锁文件变更。                                   | 覆盖先前的 `--no-frozen-lockfile`。                                                   |
| `--no-frozen-lockfile`   | 显式允许更新锁文件。                               | 覆盖先前的 `--frozen-lockfile`。                                                      |
| `--lockfile-only`        | 仅更新锁文件，不执行完整安装。                     |                                                                                       |
| `--prefer-offline`       | 可用时优先使用缓存的包。                           |                                                                                       |
| `--offline`              | 仅使用已在缓存中的包。                             |                                                                                       |
| `-f, --force`            | 请求强制重新安装。                                 |                                                                                       |
| `--ignore-scripts`       | 跳过生命周期脚本。                                 |                                                                                       |
| `--no-lockfile`          | 跳过读取或生成锁文件。                             |                                                                                       |
| `--fix-lockfile`         | 修复锁文件条目。                                   | 不能与包名一起使用。                                                                  |
| `--shamefully-hoist`     | 创建扁平的 `node_modules` 布局。                   |                                                                                       |
| `--resolution-only`      | 重新运行依赖解析以供分析。                         | 不能与包名一起使用。                                                                  |
| `--silent`               | 抑制 Vite+ 输出，并请求原生静默输出。              |                                                                                       |
| `--filter <pattern>`     | 按模式选择工作区。                                 | 可重复指定。                                                                          |
| `-w, --workspace-root`   | 选择工作区根目录。                                 |                                                                                       |
| `-E, --save-exact`       | 保存确切的依赖版本。                               | 需要包名。                                                                            |
| `--save-peer`            | 请求包管理器的 peer 依赖保存行为。                 | 需要包名。                                                                            |
| `-O, --save-optional`    | 保存到 optionalDependencies。                      | 需要包名。                                                                            |
| `--save-catalog`         | 将依赖保存到默认 catalog。                         | 需要包名。                                                                            |
| `-g, --global`           | 全局安装。                                         | 需要全局 CLI。使用[全局包存储](/guide/package-management/global-packages)。需要包名。 |
| `--node <version>`       | 全局安装使用的 Node.js 版本。                      | 需要 --global。                                                                       |
| `--concurrency <number>` | 并行执行的全局包安装数量。                         | 需要 --global。必须为正整数。                                                         |

## 兼容性

以下命令描述的是项目操作。全局模式参见[选项](#选项)。

- **npm：**`npm install`；带 `--frozen-lockfile` 且不带包名时为 `npm ci`。带包名时：`npm install`。
- **pnpm：**`pnpm install`。带包名时：`pnpm add`。
- **Yarn Classic：**`yarn install`。带包名时：`yarn add`。
- **Yarn Modern：**`yarn install`。带包名时：`yarn add`。
- **Bun：**`bun install`。带包名时：`bun add`。

| 选项                     | npm                       | pnpm               | Yarn Classic | Yarn Modern    | Bun                                | 备注                                          |
| ------------------------ | ------------------------- | ------------------ | ------------ | -------------- | ---------------------------------- | --------------------------------------------- |
| `-P, --prod`             | 是                        | 是                 | 是           | 带包名时       | 是                                 | Yarn Modern 在 install 模式下仅发出警告。     |
| `-D, --dev`              | 是                        | 是                 | 是           | 带包名时       | 是                                 |                                               |
| `--no-optional`          | 是                        | 是                 | 是           | 否             | 是                                 |                                               |
| `--frozen-lockfile`      | 不带包名时                | 不带包名时         | 是           | 不带包名时     | 是                                 |                                               |
| `--no-frozen-lockfile`   | 不带包名时                | 不带包名时         | 不带包名时   | 不带包名时     | 是                                 |                                               |
| `--lockfile-only`        | 不带 --frozen-lockfile 时 | 是                 | 否           | 3 或更高版本   | 是                                 | npm 在 CI 模式下会忽略此选项。                |
| `--prefer-offline`       | 是                        | 是                 | 是           | 否             | 1.4.1 或更高版本                   |                                               |
| `--offline`              | 是                        | 是                 | 是           | 否             | 1.4.1 或更高版本                   |                                               |
| `-f, --force`            | 不带 --frozen-lockfile 时 | 是                 | 是           | 否             | 是                                 | npm 在 CI 模式下会忽略此选项。                |
| `--ignore-scripts`       | 是                        | 是                 | 是           | 2.4 或更高版本 | 是                                 | 在 Yarn Modern 上，--lockfile-only 模式优先。 |
| `--no-lockfile`          | 不带 --frozen-lockfile 时 | 是                 | 是           | 否             | 否                                 | npm 在 CI 模式下会忽略此选项。                |
| `--fix-lockfile`         | 否                        | 是                 | 否           | 4 或更高版本   | 否                                 |                                               |
| `--shamefully-hoist`     | 否                        | 是                 | 否           | 否             | 否                                 |                                               |
| `--resolution-only`      | 否                        | 是                 | 否           | 否             | 否                                 |                                               |
| `--silent`               | 是                        | 是                 | 是           | 否             | 是                                 |                                               |
| `--filter <pattern>`     | 7.14.0 或更高版本         | 是                 | 否           | 是             | Install：是。Add：1.4 或更高版本。 |                                               |
| `-w, --workspace-root`   | 8.1.0 或更高版本          | 是                 | 带包名时     | 否             | 否                                 |                                               |
| `-E, --save-exact`       | 是                        | 是                 | 是           | 是             | 是                                 |                                               |
| `--save-peer`            | 是                        | 是                 | 是           | 是             | 是                                 |                                               |
| `-O, --save-optional`    | 是                        | 是                 | 是           | 是             | 是                                 |                                               |
| `--save-catalog`         | 否                        | 10.12.0 或更高版本 | 否           | 否             | 1.4 或更高版本                     |                                               |
| `-g, --global`           | 是                        | 是                 | 是           | 是             | 是                                 |                                               |
| `--node <version>`       | 是                        | 是                 | 是           | 是             | 是                                 |                                               |
| `--concurrency <number>` | 是                        | 是                 | 是           | 是             | 是                                 |                                               |

带包名时，适用 [add](/guide/package-management/add) 的兼容性规则。

### Git 与远程 tarball 依赖

npm 12 默认不再解析 Git 依赖与远程 tarball URL；此类安装会以 `EALLOWGIT` 或 `EALLOWREMOTE` 失败。仅当确实需要这些来源时，才通过 npm 的 `allow-git` / `allow-remote` 配置按项目重新启用。

依赖构建脚本的批准参见 [approve-builds](/guide/package-management/approve-builds)。

## 原生选项

原生选项参见 [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install)、[pnpm install](https://pnpm.io/cli/install)、[Yarn install](https://yarnpkg.com/cli/install)、[Yarn Classic install](https://classic.yarnpkg.com/en/docs/cli/install)、[Bun install](https://bun.com/docs/pm/cli/install)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
