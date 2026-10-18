# 为什么选择 Vite+？

如今在 JavaScript 生态中开发，开发者需要一个运行时（如 Node.js）、一个包管理器（如 pnpm）、一个开发服务器、一个代码检查器、一个格式化工具、一个测试运行器、一个打包器、一个任务运行器，以及越来越多的配置文件。

Vite 表明，前端工具不必接受现状：只要重新思考架构，就能获得大幅提速。Vite+ 把同样的思路应用到本地开发工作流的其余环节，并将它们统一到一个包中，让开发更快、更简单。

## Vite+ 要解决的问题

JavaScript 工具生态也经历了相当程度的碎片化与反复变动。Web 应用不断变大，因此随着项目增长，工具的性能、复杂度与不一致性已经成为真正的瓶颈。

在拥有多个团队、且每个团队使用不同工具栈的组织中，这些瓶颈会被进一步放大。依赖管理、构建基础设施与代码质量成为被割裂的职责，由各团队分别处理，往往没有人把它当作优先事项来负责。结果是依赖逐渐失去同步、构建变慢、代码质量下降。等到之后再去修复这些问题，需要付出多得多的精力，拖慢所有人，也让团队无法专注于交付产品。

## Vite+ 包含什么

Vite+ 将现代 Web 开发所需的工具汇集到一个集成的工具链中。你无需自行组装并维护一套定制工具链：Vite+ 提供一致的入口，在一个地方管理运行时、依赖、开发服务器、代码质量检查、测试与构建。

- **[Vite](https://vite.dev/)** 与 **[Rolldown](https://rolldown.rs/)**：用于开发与应用程序构建
- **[Vitest](https://vitest.dev/)**：用于测试
- **[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)** 与 **[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)**：用于代码检查与格式化
- **[tsdown](https://tsdown.dev/)**：用于库构建或独立可执行文件
- **[Vite Task](https://github.com/voidzero-dev/vite-task)**：用于任务编排

在实践中，这意味着开发者只需与一套一致的工作流打交道：`vp dev`、`vp check`、`vp test` 与 `vp build`。

这套统一的工具链减少了配置开销，提升了性能，也让团队更容易在各个项目中维持一致的工具链。

## 默认快速且可扩展

Vite+ 构建在 Vite、Rolldown、Oxc、Vitest 与 Vite Task 等现代工具之上，使你的项目在代码库增长时依然保持快速与可扩展。借助 Rust，我们可以让常见任务[快 10 倍，有时甚至 100 倍](https://voidzero.dev/posts/announcing-vite-plus-alpha#performance-scale)。然而，许多基于 Rust 的工具链与现有工具不兼容，或者无法使用 JavaScript 进行扩展。

Vite+ 通过 [NAPI-RS](https://napi.rs/) 在 Rust 与 JavaScript 之间架起桥梁，从而在 JavaScript 中提供熟悉、易于配置且可扩展的接口，并带来与生态良好兼容的开发体验。

统一工具链除了让你用上更快的工具，本身也带来额外的性能收益。例如，许多开发者为代码检查器配置了「类型感知」工具，这要求在代码检查阶段执行一次完整的类型检查。使用 `vp check`，你可以在一次遍历中同时完成格式化、代码检查与类型检查，与分别运行类型感知的检查规则和类型检查相比，静态检查速度提升 2 倍。

## 完全开源

Vite+ 完全开源，它不是新的框架，也不是封闭的平台。Vite+ 与现有 Vite 生态以及构建在其上的框架（包括 React、Vue、Svelte 等）集成。它可以使用 pnpm、npm、yarn 或 Bun 作为包管理器，并为你管理 Node.js 运行时。

我们始终欢迎社区贡献。请参阅我们的[贡献指南](https://github.com/voidzero-dev/vite-plus/blob/main/CONTRIBUTING.md)以参与其中。
