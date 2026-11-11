# 包管理器选择

`vp` 按以下顺序在工作区根目录检测包管理器：

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

如果这些声明或文件都不存在，Vite+ 默认回退到 pnpm。Vite+ 会按需下载匹配的包管理器。检测不会改写 `package.json`。

Yarn Classic 指 Yarn 1。Yarn Modern 指 Yarn 2 及更高版本。

## 固定版本

使用 [`vp env pin`](/guide/env) 声明确切的包管理器版本：

```bash
vp env pin pnpm@11.3.0
```

`packageManager` 固定版本可以携带完整性哈希，例如 `yarn@4.17.1+sha512.…`。Vite+ 支持 Corepack 兼容的完整性哈希，校验失败时会停止。

## 版本范围

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

Vite+ 会尽可能使用已下载且满足条件的版本，否则解析 npm registry 中满足条件的最新版本。范围本身始终是唯一依据，不会被替换为确切的 `packageManager` 固定版本。

当两个字段同时存在时，由 `packageManager` 决定选择。如果它不满足 `devEngines.packageManager` 约束，Vite+ 会给出警告。运行 `vp env doctor` 可查看详细信息。

## 包管理器 shim

显式的 `packageManager` 或 `devEngines.packageManager` 声明也会控制与之匹配的包管理器 shim。例如，`packageManager: "npm@10.9.4"` 会让 `npm` 与 `npx` 使用 npm 10.9.4。

各包管理器生成的别名行为相同：

- pnpm：`pnpm`、`pnpx`、`pn` 与 `pnx`。
- Yarn：`yarn` 与 `yarnpkg`。
- Bun：`bun` 与 `bunx`。

不匹配的工具不会被转换。在 pnpm 项目中运行 `npm` 仍按 npm 解析。当你希望 Vite+ 把操作适配到项目的包管理器时，请使用 `vp` 包管理命令。
