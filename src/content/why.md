# 为什么选择 Vite+？

今天，在 JavaScript 生态中开发，开发者需要一整套工具：运行时（Node.js）、包管理器（如 pnpm）、开发服务器、代码检查器、格式化器、测试运行器、打包器、任务运行器，以及越来越多、越来越零散的配置文件。

[Vite](https://vite.dev/) 证明了前端工具链可以通过**重新思考架构**而非接受现状，从而实现数量级的提速。Vite+ 将同样的思路应用到其余的本地开发流程中，并把它们全部统一进**一个包**，从而加快并简化开发。

## Vite+ 正在解决的问题

JavaScript 工具生态经历了大量的碎片化与动荡。Web 应用越来越大，随之而来的是工具性能、复杂度与不一致性成为项目扩展时的真实瓶颈。

这些瓶颈在组织中被进一步放大：多团队使用不同的工具栈，依赖管理、构建基础设施与代码质量变成被拆散的责任，逐团队推进，往往无人真正负责。结果就是：依赖逐渐不同步、构建越来越慢、代码质量持续下滑。事后修复这些问题需要付出数倍的精力，拖慢所有人，也让团队偏离交付产品本身。

## Vite+ 内含什么

Vite+ 把现代 Web 开发所需的工具整合进一个**一体化工具链**，而不是让人去组装和运维一套定制工具。它提供一致的入口，在同一个地方管理运行时、依赖、开发服务器、代码质量检查、测试与构建。

- **[Vite](https://vite.dev/)** 与 **[Rolldown](https://rolldown.rs/)** —— 开发服务器与应用生产构建
- **[Vitest](https://vitest.dev/)** —— 测试
- **[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)** 与 **[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)** —— 代码检查与格式化
- **[tsdown](https://tsdown.dev/)** —— 库构建或独立可执行文件
- **[Vite Task](https://github.com/voidzero-dev/vite-task)** —— 任务编排

因此，开发者只需要与**一套一致的工作流**交互：`vp dev`、`vp check`、`vp test`、`vp build`。

## 默认就快，且可扩展

Vite+ 构建在一系列现代工具之上（Vite、Rolldown、Oxc、Vitest、Vite Task），让项目在代码库增长时依旧又快又可扩展。借助 Rust，常见任务可以[快 10 倍甚至 100 倍](https://voidzero.dev/posts/announcing-vite-plus-alpha#performance-scale)。

但许多基于 Rust 的工具链与现有工具不兼容，或者无法用 JavaScript 扩展。Vite+ 通过 [NAPI-RS](https://napi.rs/) 把 Rust 桥接到 JavaScript，从而提供一种熟悉、易配置、可扩展的 JavaScript 接口，并拥有出色的生态兼容开发体验。

统一工具链带来的性能收益远不止“用更快工具”本身。例如，很多开发者会给 lint 配置「类型感知」规则，需要在 lint 阶段跑一次完整类型检查。而使用 `vp check`，你可以**一次遍历**就完成格式化、代码检查与类型检查，把静态检查提速至分别运行类型感知 lint 规则与类型检查的 **2 倍**。

## 完全开源

Vite+ 完全开源，它不是新的框架，也不是锁定的平台。Vite+ 与现有 Vite 生态以及建立在它之上的框架（React、Vue、Svelte 等）无缝集成。它可以使用 pnpm、npm、yarn 或 Bun 作为包管理器，并替你管理 Node.js 运行时。

我们始终欢迎社区的贡献。欢迎查阅我们的[贡献指南](https://github.com/voidzero-dev/vite-plus/blob/main/CONTRIBUTING.md)加入进来。
