# 依赖管理

Vite+ 会根据 `packageManager` 与锁文件，**自动包装**你的包管理器（pnpm、npm、Yarn 或 Bun）。因此你不必记住不同包管理器之间的细微差异 —— `vp` 只暴露一套简洁而一致的命令。

## 安装依赖

```bash
vp install    # 别名：vp i
```

Vite+ 会自动检测应该在当前项目中使用的包管理器并执行安装。常见做法是创建项目后直接运行：

```bash
vp create
vp install
```

## 增删改查

```bash
vp add react                 # 添加包
vp add -D typescript         # 作为开发依赖添加
vp remove lodash             # 移除包（别名：rm / un / uninstall）
vp update                    # 更新到最新（别名：up）
vp dedupe                    # 依赖去重
vp outdated                  # 检查过期依赖
vp list                      # 列出已安装包（别名：ls）
vp why react                 # 显示为何安装了 react
vp info react                # 查看包元数据（别名：view / show）
```

## 链接与原生模块

```bash
vp link ../my-package        # 本地包链接（别名：ln）
vp unlink ../my-package      # 取消链接
vp rebuild                   # 重建原生模块
```

## 使用指定的包管理器

想把命令转发给底层的包管理器，直接使用 `vp pm`：

```bash
vp pm exec tsc
```

## 在 GitHub Actions 中安装

在 CI 里，使用官方 [setup-vp](https://github.com/voidzero-dev/setup-vp) Action 来安装 Vite+：

```yaml
- uses: voidzero-dev/setup-vp@<setup-vp-version>
  with:
    node-version: '22'
    cache: true
```

把 `<setup-vp-version>` 替换为 [setup-vp 发布页](https://github.com/voidzero-dev/setup-vp/releases) 中的确切实例版本。你也可以使用 commit SHA。请不要使用 `v1` 标签，它已不再更新。

::: tip 手动迁移
手动迁移项目时，先安装开发依赖：`vp install -D vite-plus`，然后在 `package.json` 中添加 overrides 把 `vite` 别名为 `@voidzero-dev/vite-plus-core`，并固定 `vitest` 版本，使项目与 `vp test` 使用同一份 Vitest。
:::
