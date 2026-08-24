# Vite+ 中文文档站

> 🌐 在线访问：[https://viteplus.ndjp.net](https://viteplus.ndjp.net)  
> 📦 源码仓库：[https://github.com/bbylw/vite-plus-cn](https://github.com/bbylw/vite-plus-cn)

基于 [Vite+（vite-plus）](https://github.com/voidzero-dev/vite-plus) 官方文档构建的中文站点。

本网站采用 **React + vite-plus + Bun** 技术栈构建：

- **React 19** —— 前端框架
- **vite-plus** —— 统一工具链（开发 / 检查 / 测试 / 构建，底层为 Vite + Rolldown）
- **Bun** —— 包管理器与运行时
- **Tailwind CSS v4** —— 样式（设计系统为深色高对比 + 单一 teal 信号色）
- **react-markdown + rehype-highlight + rehype-slug** —— 渲染中文 Markdown 文档、代码高亮与页内目录
- **Space Grotesk / Manrope / JetBrains Mono** —— 展示 / 正文 / 等宽字体

## 快速开始

```bash
bun install   # 安装依赖
vp dev        # 启动开发服务器
vp build      # 生产构建（输出到 dist）
vp preview    # 本地预览生产构建
vp check      # 格式化 + 代码检查 + 类型检查
```

也可以用 Bun 运行脚本：

```bash
bun run dev
bun run build
bun run check
```

## 目录结构

```
src/
  components/   # 布局、顶部导航、侧边栏、Markdown 渲染器等
  content/      # 中文文档（Markdown，通过 Vite ?raw 导入）
  hooks/        # 主题切换（亮 / 暗）
  pages/        # 首页（落地页）等
  App.tsx       # 路由配置
  main.tsx      # 入口
vite.config.ts  # Vite+ 统一配置
```

## 说明

- 内容翻译自 vite-plus 的官方文档，所有命令与配置以 [viteplus.dev](https://viteplus.dev) 为准。
- 使用 `vp` 本地二进制运行工具链（由 `vite-plus` 包提供），无需全局安装 `vp`。
