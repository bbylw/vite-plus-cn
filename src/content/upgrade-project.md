# 更新项目中的 Vite+

更新 `vite-plus` 及其相关的项目依赖。若要升级全局 `vp` 二进制，请参阅[升级 Vite+](/guide/upgrade)。

## 使用迁移更新

更新项目的推荐方式是使用 `vp migrate`，它会让工具链依赖保持版本一致。

在更新项目依赖之前，请先[通过包管理器运行目标版本的迁移工具](/guide/migrate)。

如果全局 CLI 比项目版本更新，运行 `vp migrate` 会把项目升级到该全局版本：

```bash
vp migrate
```

对于已经使用 Vite+ 的项目，migrate 只执行工具链版本升级：它会在每个工作区包中，把 `vite-plus`、`vite` -> `@voidzero-dev/vite-plus-core` 别名以及 `vitest` 的固定版本重新锁定到运行迁移的 CLI 所捆绑的版本。它会跳过首次设置步骤（Git 钩子、编辑器与代理文件、代码检查迁移），因此版本升级不会重新触碰你已经配置好的内容。传入 `--full` 可同时运行这些设置。

## 手动更新

一起更新 `vite-plus` 与指向 `@voidzero-dev/vite-plus-core` 的 `vite` 别名，使 core 版本与 `vite-plus` 保持一致。无论这些条目在工作区的何处声明（包括 overrides 或 catalogs），都要更新它们，然后安装依赖以刷新锁文件。同时[更新 Vitest 固定版本](#更新-vitest-固定版本)，使其与捆绑版本匹配。

如果没有全局 CLI，请通过包管理器运行本页中的 `vp` 命令，例如 `pnpm exec vp toolchain vitest`。

### 更新 Vitest 固定版本

如果你使用 `vp migrate` 完成了迁移，项目会把 `vitest` 固定到确切版本，使整个项目与捆绑的 `vp test` 运行器共享同一份 Vitest 副本。该固定版本位于包管理器的 override 配置块中：

- **npm / Bun：** `package.json` 中 `overrides` 下的 `vitest` 条目
- **Yarn：** `package.json` 中 `resolutions` 下的 `vitest` 条目
- **pnpm：** `pnpm-workspace.yaml` 中 `overrides` 下的 `vitest@*` 条目。如果 `package.json` 已包含 `pnpm` 字段，则该条目位于 `package.json` 的 `pnpm.overrides` 下。当 `package.json` 定义了 `pnpm.overrides` 时，pnpm 会忽略 `pnpm-workspace.yaml` 中的 overrides。

Vite+ 的某个版本可能升级其捆绑的 Vitest。由于该固定版本同样作用于 `vite-plus` 自身的 `vitest` 依赖，过期的固定版本会让你在升级 `vite-plus` 之后仍安装旧的运行器，从而使 Vitest 的内部实现（mock、`expect`、运行器状态）分裂在固定副本与 `vp test` 加载的副本之间。

升级 `vite-plus` 后，请将 `vitest` 重新固定到 Vite+ 当前捆绑的版本。可用以下命令查看该版本：

```bash
vp toolchain vitest
```

然后将 `vitest` override 设置为该确切版本，并重新安装依赖。

**为什么 pnpm 的 overrides 使用 `@*`**

在 pnpm 下，受管理的键使用显式的 `@*` 范围（`vite@*`、`vitest@*`）。pnpm 应用 override 时会替换每个 manifest 上声明的 spec，包括 importer manifest。裸键会匹配任意 spec，包括 `catalog:`。`@*` 范围使 override 只作用于传递依赖与 peer 声明所使用的 semver 范围，并保留 `catalog:` 引用。因此 `vp up` 不再把它们改写为具体版本。

## 预览构建

在[安装全局 CLI 的预览构建](/guide/upgrade)后，在项目中运行 migrate，把项目的本地 `vite-plus` 切换到同一构建：

```bash
vp migrate
```

migrate 会把桥接 registry 写入 `.npmrc`。对于 Yarn Berry，它会将 registry 写入 `.yarnrc.yml`。它会把 `vite-plus` 与 `vite` 别名固定到匹配的 `0.0.0-commit.<sha>` 版本。`vite` 别名指向 `@voidzero-dev/vite-plus-core`。如果项目 CI 必须测试该预览版本，请提交 registry 行。

安装完成后，运行 `vp toolchain` 查看所选版本。测试完成后，在所有声明位置将 `vite-plus` 设为 `latest`，并将 `vite` 别名设为 `npm:@voidzero-dev/vite-plus-core@latest`。从 `.npmrc` 或 `.yarnrc.yml` 中移除预览桥接设置，恢复之前的 registry。然后运行 `vp install`。
