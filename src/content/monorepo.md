# Monorepo

Vite+ 在单个项目中集中处理运行时、包管理器与前端工具链，因此非常适合 **monorepo（多包仓库）**。从 `vp create vite:monorepo` 搭建骨架开始，然后用一套一致的工作流管理所有包。

## 创建 monorepo

```bash
vp create vite:monorepo
```

创建后，你可以：

- 用 `vp add` / `vp install` 管理全部工作区依赖
- 用 `vp dev` 启动开发
- 用 `vp run` 以依赖感知的方式运行各包任务
- 用 `vp test` / `vp build` 统一检查、测试与构建

## 依赖感知的任务调度

`vp run` 在工作区中按依赖拓扑排序执行任务，并可带缓存：

```bash
vp run build                    # 运行所有包的 build
vp run app#build --watch        # 只运行 app 包的 build 并监听
vp run --filter 'packages/*' test
```

筛选器让你精确选择目标（按名称、目录或 glob），并支持任意组合，如“某包及其依赖者”。

## 测试与构建

在 monorepo 中，`vp test` 与 `vp build` 会感知工作区，共享同一份配置与依赖图：

```bash
vp test       # 运行整个工作区的测试
vp build      # 构建整个工作区
```

## 生成器

monorepo 常需要按内部约定搭建自己的构建块（组件、服务、内部包）。Vite+ 通过基于 [Bingo](https://www.create.bingo/) 模板的生成器包支持这一点：

```bash
# 在 Vite+ monorepo 内搭建一个生成器
vp create vite:generator

# 运行已注册的生成器
vp create component
vp create component -- --name @your-org/button
```

本地生成器声明在 monorepo 根目录 `vite.config.ts` 的 `create.templates` 中，并自动出现在 `vp create` 选择器里。

## 包管理器

Vite+ 会根据 `packageManager` 与锁文件自动选择 pnpm、npm、Yarn 或 Bun，让整个 monorepo 的依赖管理保持一致。
