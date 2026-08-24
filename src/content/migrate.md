# 迁移现有项目

把现有项目迁移到 Vite+，通常只需要一条命令：`vp migrate`。它会把工具相关的独立配置文件（如 `.oxlintrc*`、`.oxfmtrc*`、lint-staged 配置）合并进 `vite.config.ts`。

## 一键迁移

```bash
vp migrate
```

迁移后，原先分散在多个配置文件里的设置集中到单一的 `vite.config.ts`，类型安全且共享默认值。

## 手动迁移

如果你更喜欢手动迁移，先安装开发依赖：

```bash
vp install -D vite-plus
```

然后添加包管理器 overrides，让其他包使用 Vite+ 的版本。把 `vite` 别名为 `@voidzero-dev/vite-plus-core`；固定 `vitest` 到 `vp toolchain vitest` 所显示的版本：

```json
"overrides": {
  "vite": "npm:@voidzero-dev/vite-plus-core@latest",
  "vitest": "4.1.11"
}
```

若使用 `pnpm`，在 `pnpm-workspace.yaml` 中添加：

```yaml
overrides:
  vite: npm:@voidzero-dev/vite-plus-core@latest
  vitest: 4.1.11
```

若使用 Yarn：

```json
"resolutions": {
  "vite": "npm:@voidzero-dev/vite-plus-core@latest",
  "vitest": "4.1.11"
}
```

> ⚠️ **为什么固定 vitest 版本**：若不固定，某个依赖或工作区包可能安装不同的 Vitest 版本。两个版本可能会使用彼此独立的 mock、`expect` 函数与 runner 状态。

## 迁移提示

如果你使用 AI 编程代理，可以直接把以下提示粘贴给它，让代理为你完成迁移：

```text
请把此项目迁移到 Vite+：
1. 安装 vite-plus 作为 devDependency。
2. 把 vite 别名为 @voidzero-dev/vite-plus-core，并固定 vitest 版本。
3. 迁移 .oxlintrc*、.oxfmtrc*、lint-staged 等配置到 vite.config.ts。
4. 用 vp check 验证 lint 与类型检查，用 vp build 验证构建。
```

迁移完成后，用 `vp check` 与 `vp build` 验证一切正常。
