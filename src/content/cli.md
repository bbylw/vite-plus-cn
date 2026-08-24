# 命令行参考

`vp` 是 Vite+ 的统一命令行入口。运行 `vp help` 可以随时查看当前可用命令。

## 启动（Start）

- **`vp create`** —— 从模板创建新项目
- **`vp migrate`** —— 把现有项目迁移到 Vite+
- **`vp config`** —— 配置钩子与代理集成
- **`vp hooks`** —— 管理 Git 钩子分发器
- **`vp staged`** —— 对暂存文件运行检查器
- **`vp install`**（别名 `i`）—— 安装依赖
- **`vp env`** —— 管理 Node.js 版本

## 开发（Develop）

- **`vp dev`** —— 运行开发服务器
- **`vp check`** —— 运行格式化、代码检查与类型检查
- **`vp lint`** —— 检查代码
- **`vp fmt`** —— 格式化代码
- **`vp test`** —— 运行测试

## 执行（Execute）

- **`vp run`** —— 运行 monorepo 任务
- **`vp exec`** —— 从本地 `node_modules/.bin` 执行命令
- **`vp node`** —— 用解析到的 Vite+ 环境运行 Node.js 脚本
- **`vp dlx`** —— 下载并运行包二进制，无须安装为依赖
- **`vp cache`** —— 管理任务缓存

## 构建（Build）

- **`vp build`** —— 生产构建
- **`vp pack`** —— 构建库
- **`vp preview`** —— 预览生产构建

## 依赖管理（Manage Dependencies）

Vite+ 会基于 `packageManager` 与锁文件，自动包装你的包管理器（pnpm、npm、Yarn 或 Bun）：

- **`vp add`** —— 添加包到依赖
- **`vp remove`**（`rm`、`un`、`uninstall`）—— 从依赖中移除包
- **`vp update`**（`up`）—— 更新包到最新版本
- **`vp dedupe`** —— 依赖去重
- **`vp outdated`** —— 检查过期依赖
- **`vp list`**（`ls`）—— 列出已安装包
- **`vp why`**（`explain`）—— 显示某包为何被安装
- **`vp info`**（`view`、`show`）—— 查看注册表中的包元数据
- **`vp link`**（`ln`）/ **`vp unlink`** —— 管理本地包链接
- **`vp rebuild`** —— 重建本机模块
- **`vp pm`** —— 把命令转发给包管理器

## 维护（Maintain）

- **`vp toolchain`** —— 显示 Vite+ 各工具版本及其关系
- **`vp upgrade`** —— 将 `vp` 自身更新到最新版本
- **`vp implode`** —— 移除 `vp` 及所有相关数据

## 常用别名

| 命令         | 别名                               |
| ------------ | ---------------------------------- |
| `vp install` | `vp i`                             |
| `vp remove`  | `vp rm` / `vp un` / `vp uninstall` |
| `vp update`  | `vp up`                            |
| `vp list`    | `vp ls`                            |
| `vp why`     | `vp explain`                       |
| `vp info`    | `vp view` / `vp show`              |
| `vp link`    | `vp ln`                            |
| `vp format`  | `vp fmt`                           |
