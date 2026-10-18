# 项目本地 CLI

与[全局 `vp` CLI](/guide/global-cli)不同，`vite-plus` 是一个 npm 包，包含项目本地的 `vp` CLI 与集成的前端工具链。如果你希望把工具链版本记录在项目的清单文件与锁文件中，或者不想安装独立的全局 CLI，请将其安装为开发依赖。

本地包包含 Vite、Rolldown、Vitest、Oxlint、Oxfmt、tsdown、Vite+ 任务运行器以及包管理器命令。它需要已有的 Node.js 运行时与包管理器。

## 安装

在大多数场景下，我们推荐使用 Vite+ CLI 在项目中安装或创建新项目。更多信息请参阅[创建项目](/guide/create)与[迁移到 Vite+](/guide/migrate)。

**pnpm**

```bash
pnpm create vite-plus
```

**npm**

```bash
npm create vite-plus@latest
```

**Yarn**

```bash
yarn create vite-plus
```

**Bun**

```bash
bun create vite-plus
```

通过包管理器运行它的二进制文件。例如：

```bash
./node_modules/.bin/vp migrate --help
./node_modules/.bin/vp check
```

为了便于阅读，文档中使用不带前缀的 `vp` 命令。如果没有全局 CLI，请在交互式命令前加上包管理器的本地二进制执行器，例如 `pnpm exec`。

### 手动安装

如果你要手动将项目迁移到 Vite+，请把 `vite-plus` 安装为开发依赖：

**npm**

```bash
npm install -D vite-plus
```

**Yarn**

```bash
yarn add -D vite-plus
```

**pnpm**

```bash
pnpm add -D vite-plus
```

**Bun**

```bash
bun add -D vite-plus
```

为包管理器添加 overrides，使其他包解析到 Vite+ 的版本。把 `vite` 别名指向 `@voidzero-dev/vite-plus-core`，并将 `<vite-plus-version>` 设为已安装的 `vite-plus` 版本。把 `vitest` 固定到 `<vitest-version>`，使用 `vp toolchain vitest` 显示的随附版本，从而让整个项目与 `vp test` 共享同一份 Vitest。如果不固定 `vitest`，某个依赖或工作区包可能拉入与随附运行器不同的 Vitest，导致 Vitest 的内部机制（mock、`expect`、运行器状态）被割裂：

**pnpm-workspace.yaml**

```yaml
overrides:
  vite@*: npm:@voidzero-dev/vite-plus-core@<vite-plus-version> # 与已安装的 vite-plus 版本一致
  vitest@*: <vitest-version> # 与 vp toolchain vitest 显示的版本一致
```

**npm / Bun package.json**

```json
"overrides": {
  "vite": "npm:@voidzero-dev/vite-plus-core@<vite-plus-version>",
  "vitest": "<vitest-version>"
}
```

**Yarn package.json**

```json
"resolutions": {
  "vite": "npm:@voidzero-dev/vite-plus-core@<vite-plus-version>",
  "vitest": "<vitest-version>"
}
```

**为什么需要这些设置？**

依赖与插件可能会直接导入 `vite` 或 `vitest`，即使你自己的代码是从 `vite-plus` 导入的。这些 overrides 会让它们的依赖与 Vite+ 使用的工具链保持一致：

- `vite` 别名把这些导入指向 Vite+ 的核心包。多个 Vite 实例会破坏运行时的身份检查：[issue #1391](https://github.com/voidzero-dev/vite-plus/issues/1391) 报告 TanStack Start 返回 404，原因是一次 `instanceof` 检查跨越了两份副本。[PR #2617](https://github.com/voidzero-dev/vite-plus/pull/2617) 通过同一别名共享 Vite，解决了 CLI 侧的问题。
- 精确固定 `vitest` 可让依赖与 `vp test` 使用同一 Vitest 版本，避免出现彼此分离的 mock、`expect` 实例与运行器状态。[PR #2365](https://github.com/voidzero-dev/vite-plus/pull/2365) 记录了手动安装时的这一要求。

请让核心别名与已安装的 `vite-plus` 版本保持一致，并在升级时把 Vitest 固定值更新为与随附版本匹配。[Issue #2356](https://github.com/voidzero-dev/vite-plus/issues/2356) 描述了依赖机器人如何独立更新这些包，从而把不兼容的版本留在一起安装。

## 最佳实践

我们建议把[全局 CLI](/guide/global-cli)与项目本地 CLI 搭配使用。全局 CLI 让 `vp` 可以直接在终端中使用，并把 `vp dev`、`vp build` 与 `vp test` 等开发命令委托给项目安装的 `vite-plus` 包。这样既能方便地使用工具链，又能让工具链版本由项目控制。如果你愿意，也可以只使用项目本地 CLI。

对于开源项目或任何有协作者的项目，无论你使用两个 CLI 还是只用项目本地 CLI，我们都建议添加调用 `vp` 的 `package.json` 脚本。在脚本内部，`vp` 会从 `node_modules/.bin` 自动解析：

**package.json**

```json
{
  "scripts": {
    "dev": "vp dev",
    "check": "vp check",
    "test": "vp test",
    "build": "vp build"
  }
}
```

在安装项目依赖后，协作者可以通过自己的包管理器运行这些脚本，例如 `pnpm run dev` 或 `npm run dev`，而无需安装全局 CLI。

## 包含内容

项目本地 CLI 可以独立用于：

- [`vp dev`](/guide/dev)、[`vp build`](/guide/build) 与 [`vp preview`](/guide/build)：基于 Vite 与 Rolldown
- [`vp check`](/guide/check)、[`vp lint`](/guide/lint) 与 [`vp fmt`](/guide/fmt)：基于 Oxc
- [`vp test`](/guide/test)：基于 Vitest
- [`vp pack`](/guide/pack)：基于 tsdown
- [`vp toolchain`](/guide/upgrade)：查看项目本地包随附的版本
- [`vp run`](/guide/run) 与跨工作区的任务缓存
- [包管理器命令](/guide/package-management)：使用 shell 中已激活的 Node.js 运行时
- [`vp create`](/guide/create)、[`vp migrate`](/guide/migrate) 与项目配置命令

本地包无法管理机器级的 Vite+ 安装。`vp env`、`vp upgrade` 与 `vp implode` 命令需要[全局 CLI](/guide/global-cli)。仅本地安装的升级或移除请通过包管理器完成。

## 稍后添加全局 CLI

你可以随时安装全局 CLI，而无需更改项目的依赖。`vp dev`、`vp build` 与 `vp test` 等命令会继续使用项目安装的 `vite-plus` 版本。

选择规则请参阅[同时使用两个 CLI](/guide/global-cli)。
