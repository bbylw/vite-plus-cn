# 包管理

`vp` 会检测并调用当前工作区的包管理器。这些命令在[全局 CLI](/guide/global-cli)与[项目本地 CLI](/guide/local-cli)中均可使用。

## 概览

使用 Vite+ 可以跨 pnpm、npm、Yarn 与 Bun 管理依赖。你无需在 `pnpm install`、`npm install`、`yarn install` 与 `bun install` 之间来回切换，可以继续使用 `vp install`、`vp add`、`vp remove` 以及 Vite+ 包管理命令族的其他命令。

Vite+ 会按以下顺序从工作区根目录检测包管理器：

1. `package.json` 中的 `packageManager`
2. `package.json` 中的 `devEngines.packageManager`
3. `pnpm-workspace.yaml`
4. `pnpm-lock.yaml`
5. `yarn.lock` 或 `.yarnrc.yml`
6. `package-lock.json`
7. `bun.lock` 或 `bun.lockb`
8. `.pnpmfile.cjs` 或 `pnpmfile.cjs`
9. `bunfig.toml`
10. `yarn.config.cjs`

如果上述文件都不存在，`vp` 默认回退到 `pnpm`。Vite+ 会自动下载匹配的包管理器，并将其用于你运行的命令，但包管理器检测永远不会改写 `package.json`。当项目需要显式声明确切版本时，请使用 `vp env pin <package-manager>@<version>`。

[`devEngines.packageManager`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines) 字段接受单个对象或对象数组，其 `version` 可以是 semver 范围：

```json
{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "^11.0.0",
      "onFail": "download"
    }
  }
}
```

范围会尽可能解析为已下载且满足条件的版本，否则解析为 npm registry 中满足条件的最新版本。范围本身始终是唯一依据；Vite+ 绝不会将其固化为确切的 `packageManager` 固定版本。当同时声明了 `packageManager` 与 `devEngines.packageManager` 时，由 `packageManager` 字段决定选择；如果它不满足 devEngines 约束，Vite+ 会给出警告（`vp env doctor` 会显示详细信息）。

Vite+ 目前会下载声明的包管理器（即 `onFail: "download"` 行为）；其他 `onFail` 值会被接受，但尚未作区分处理。

显式的 `packageManager` 字段（或 `devEngines.packageManager` 声明）也会影响与之匹配的包管理器 shim。如果项目声明了 `packageManager: "npm@10.9.4"`，则 `npm` 与 `npx` 会使用 npm 10.9.4。其他生成的别名行为相同：`pnpm`/`pnpx`/`pn`/`pnx`、`yarn`/`yarnpkg` 以及 `bun`/`bunx`。不匹配的工具不会被转换；在 `pnpm` 项目中使用 `npm` 仍按 npm 解析。

## 用法

```bash
vp install
```

常见安装流程：

```bash
vp install
vp install --frozen-lockfile
vp install --lockfile-only
vp install --filter web
vp install -w
```

`vp install` 会针对所检测的包管理器映射到正确的底层安装行为，包括为 pnpm、npm、Yarn 与 Bun 使用正确的锁文件标志。

## 全局包

> [!NOTE]
> 使用 `-g` 进行全局包操作需要[全局 CLI](/guide/global-cli)。

使用 `-g` 标志安装、更新或移除全局安装的包：

- `vp install -g <pkg>` 全局安装包
- `vp install -g --node <version> <pkg>` 使用指定的 Node.js 版本全局安装包
- `vp uninstall -g <pkg>` 移除全局包
- `vp update -g [pkg]` 更新一个全局包或所有全局包
- `vp list -g [pkg]` 列出全局包
- `vp outdated -g [pkg]` 打印过期的包

未指定 `--node` 时，`vp install -g` 使用为当前目录解析的 Node.js 版本，因此项目的固定版本优先于 `vp env default`。请参阅 [Node.js 选择](/guide/env)。

更新会保留包安装时使用的版本 spec：通过 dist-tag 安装的包（例如 `vp install -g some-pkg@nightly`）会更新到该 tag 的最新版本，而版本范围仍会停留在该范围内。要切换，请使用不同的 spec 重新安装（例如 `vp update -g some-pkg@latest`），或向 `vp update -g` 传入 `--latest`，将包移动到 `latest` tag 并清除其记录的 spec。`vp outdated -g` 会同时报告匹配已记录 spec 的最新版本（`Wanted`）与 `latest` tag 上的最新版本。

> [!WARNING]
> 这些命令**不会**与底层包管理器的全局安装目录交互。
>
> 相反，Vite+ 会把全局包存储在解析得到的数据目录下的 `packages/` 中。这些包在不同 Node.js 版本之间保持可用。
>
> 因此，诸如 `vp link` 之类的命令不会影响 Vite+ 的全局包，也不会出现在 `vp list -g` 中。

## 管理依赖

Vite+ 提供所有熟悉的包管理命令：

- `vp install` 安装项目当前的依赖图
- `vp add <pkg>` 将包添加到 `dependencies`，使用 `-D` 添加到 `devDependencies`
- `vp remove <pkg>` 移除包
- `vp update` 更新依赖
- `vp dedupe` 在包管理器支持时减少重复的依赖条目
- `vp outdated` 显示可用的更新
- `vp list` 显示已安装的包
- `vp why <pkg>` 解释为什么存在某个包
- `vp info <pkg>` 显示包的 registry 元数据
- `vp rebuild` 重建原生模块（例如在切换 Node.js 版本之后）
- `vp link` 与 `vp unlink` 管理本地包链接
- `vp dlx <pkg>` 运行包二进制文件而不将其添加到项目
- `vp pm <command>` 提供适应所检测包管理器的额外包管理命令

> [!NOTE]
> `vp list` 与 `vp rebuild` 快捷方式仅在全局 CLI 中可用。使用[项目本地 CLI](/guide/local-cli)时，请改用 `vp pm list` 与 `vp pm rebuild`。

### 命令指南

#### 安装

当你需要严格按照当前 `package.json` 与锁文件的描述进行安装时，请使用 `vp install`。

- `vp install` 是标准安装命令
- `vp install --frozen-lockfile` 在锁文件需要变更时失败
- `vp install --no-frozen-lockfile` 显式允许更新锁文件
- `vp install --lockfile-only` 仅更新锁文件，不执行完整安装
- `vp install --prefer-offline` 与 `vp install --offline` 优先使用或要求使用缓存的包
- `vp install --ignore-scripts` 跳过生命周期脚本
- `vp install --filter <pattern>` 在 monorepo 中限定安装工作的范围
- `vp install -w` 在工作区根目录安装

> [!NOTE]
> 选项支持取决于所检测的包管理器及其版本。遇到不支持的选项时，`vp` 会在运行包管理器命令之前报错退出。

##### Git 与远程 tarball 依赖（npm v12+）

npm v12 默认不再解析 Git 依赖（`github:`、`git+https:`）与远程 tarball URL；此类安装会以 `EALLOWGIT` / `EALLOWREMOTE` 失败。可通过 npm 的 `allow-git` / `allow-remote` 配置按项目重新启用。

#### 全局安装

当你希望由包管理器管理的工具在单个项目之外也可用时，请使用这些命令。

- `vp install -g typescript`
- `vp uninstall -g typescript`
- `vp update -g`
- `vp list -g`
- `vp outdated -g`

#### 添加与移除

日常的依赖编辑请使用 `vp add` 与 `vp remove`，而不是手动编辑 `package.json`。

- `vp add react`
- `vp add -D typescript vitest`
- `vp add -O fsevents`
- `vp add --save-peer react`
- `vp add react --ignore-scripts`
- `vp remove react`
- `vp remove --filter web react`

#### 更新、去重与过期检查

使用这些命令长期维护依赖图。

- `vp update` 将包刷新到更新的版本
- `vp outdated` 显示哪些包有更新版本可用
- `vp dedupe` 请求包管理器在可能的情况下合并重复项

#### 查看信息

当你需要了解依赖的当前状态时，请使用这些命令。

- `vp list` 显示已安装的包
- `vp why react` 解释为什么安装了 `react`
- `vp info react` 显示 registry 元数据，例如版本与 dist-tag

这些命令显示的是包管理器安装的包，不会显示 Vite+ 捆绑或编译的工具。运行 `vp toolchain [tool]` 可显示这些工具，包括 Vite、Rolldown 与 Oxc。为便于阅读，当 Vite+ 也提供某个包时，`vp why` 会给出提示。

#### 重建

当原生模块需要重新编译时（例如切换 Node.js 版本后，或 C/C++ 插件加载失败时），请使用 `vp rebuild`。

- `vp rebuild` 重建所有原生模块
- `vp rebuild <package...>` 仅重建列出的包
- `vp rebuild -- <args>` 将额外参数传递给底层包管理器

```bash
vp rebuild
vp rebuild better-sqlite3 sharp
vp rebuild -- --update-binary
```

`vp rebuild` 是 `vp pm rebuild` 的简写。

在 pnpm v10+ 中，直接运行 `vp rebuild` 只会重建那些构建脚本列在 `onlyBuiltDependencies` 中（或已通过 `pnpm approve-builds` 批准）的包；请显式指定包名，以强制执行绕过批准环节的重建。

#### 依赖构建脚本（npm v12+）

除非 `package.json` 中的 `allowScripts` 字段涵盖这些脚本，否则 npm v12 会跳过依赖安装脚本（`preinstall` / `install` / `postinstall`，包括隐式的 `node-gyp` 构建）；安装会成功完成，npm 会针对被跳过的内容发出警告。`vp pm approve-builds` 用于管理该允许列表：

- `vp pm approve-builds <pkg...>` 批准指定的包（`npm approve-scripts`）
- `vp pm approve-builds !<pkg...>` 拒绝指定的包（`npm deny-scripts`）
- `vp pm approve-builds --all` 批准当前所有待处理的包
- `vp pm approve-builds` 列出脚本尚未被涵盖的包

批准只会记录允许列表：先前安装跳过的脚本，在你运行 `vp rebuild <pkg>` 之前不会执行。在 npm 11.16 - 11.x 中，这些命令同样可用，但 npm 会将允许列表视为建议性的，仍会运行脚本。

#### 高级用法

当你需要更底层的包管理器行为时，请使用这些命令。

- `vp link` 与 `vp unlink` 管理本地开发链接
- `vp dlx create-vite` 运行包二进制文件而不将其保存为依赖
- `vp pm <command>` 提供适应所检测包管理器的额外包管理命令。

  - **依赖**：`ci`、`prune`、`list`、`rebuild`、`approve-builds`
  - **打补丁**：`patch`、`patch-commit`
  - **打包与发布**：`pack`、`version`、`publish`、`stage`、`dist-tag`、`deprecate`
  - **查看**：`view`、`search`、`licenses`、`audit`、`fund`、`ping`
  - **认证与访问**：`login`、`logout`、`whoami`、`token`、`owner`、`team`
  - **配置**：`config`、`cache`
  - **包清单**：`pkg get`、`pkg set`、`pkg delete`、`pkg fix`

  命令支持情况取决于包管理器及其版本。运行 `vp pm --help` 可列出命令，运行 `vp pm <command> --help` 可查看可用选项。

示例：

```bash
vp pm config get registry
vp pm cache clean -- --force
vp pm audit --json
```

#### 包清单

`vp pm pkg` 使用所检测的包管理器读取并更新 `package.json` 中的字段。

```bash
vp pm pkg get name
vp pm pkg set scripts.build="vite build"
vp pm pkg set private=true --json
vp pm pkg delete scripts.build
vp pm pkg fix
```

npm 从 7.20.0 起支持 `get`、`set` 与 `delete`，从 9.8.0 起支持 `fix`。pnpm 从 11.3.0 起支持全部四个命令，Bun 从 1.2.19 起通过 `bun pm pkg` 支持它们。Yarn 及不支持的版本会输出警告并成功退出，且不修改清单，行为与 `vp pm patch` 一致。

原生行为得以保留。例如，npm 的 `get` 返回 JSON，而 pnpm 默认打印不带引号的单个字符串值。使用 `--json` 请求 JSON 输出，或将传给 `set` 的值按 JSON 解析。额外的原生选项可在 `--` 之后传入。`fix` 所做的修正取决于包管理器。

#### 暂存发布

`vp pm stage` 提供 [npm 的暂存发布](https://docs.npmjs.com/staged-publishing)工作流：构建产物先上传到暂存区（无需 2FA，适合 CI），然后由维护者在可信设备上批准或拒绝（2FA）。它会适配所检测的包管理器。

```bash
vp pm stage publish              # 将包上传到暂存区（无需 2FA）
vp pm stage list                 # 列出已暂存的版本
vp pm stage view <stage-id>      # 查看已暂存的版本
vp pm stage download <stage-id>  # 下载已暂存的 tarball
vp pm stage approve <stage-id>   # 提升到线上 registry（2FA）
vp pm stage reject <stage-id>    # 丢弃已暂存的版本（2FA）
```

- pnpm（`pnpm stage`，要求 pnpm ≥ 11.3）与 npm（`npm stage`，要求 npm ≥ 11.15 且 Node ≥ 22.14）会直接透传。
- Yarn 4.16.0 及更高版本使用其 npm 插件（`yarn npm publish --staged`、`yarn npm stage …`）。`view` 与 `download` 子命令，以及带显式 tarball 或文件夹目标的 `publish`，会回退到 `npm stage`。
- 早于 4.16.0 的 Yarn 版本与 Bun 会回退到 `npm stage`。

## 包管理器完整性校验

`packageManager` 固定版本可以携带完整性哈希（`yarn@4.17.1+sha512.…`）。`corepack use` 会写入该哈希。Vite+ 会对与 Corepack 相同的产物计算哈希：

- Yarn 2 及更高版本的解压后 CLI 二进制文件（`bin/yarn.js`）
- npm、pnpm 与 Yarn Classic 的 npm 包 tarball

Vite+ 仅在安装 Yarn 时对 CLI 计算一次哈希，并记录其校验过的固定版本。之后的命令会将自身的固定版本与该记录比较。与记录不匹配的固定版本会导致校验失败，命令随之停止。Corepack 也会为其自身缓存保留同类记录。
