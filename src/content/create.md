# 创建项目

`vp create` 以交互方式搭建新的 Vite+ 项目、monorepo，以及现有工作区中的应用。

## 概览

`create` 是开始使用 Vite+ 的最快方式。它有以下几种用法：

- 开启一个新的 Vite+ **monorepo**
- 创建一个新的**独立应用或库**
- 在现有项目内**新增一个应用或库**

该命令可以使用内置模板、社区模板或远程 GitHub 模板。

## 用法

```bash
vp create                       # 交互式创建
vp create <template>            # 使用指定模板
vp create <template> -- <模板选项>
```

## 内置模板

- `vite:monorepo` —— 创建新 monorepo
- `vite:application` —— 创建新应用
- `vite:library` —— 创建新库
- `vite:generator` —— 创建新的代码生成器（仅 monorepo）

## 模板来源

`vp create` 不限于内置模板：

- 使用简写模板：`vite`、`@tanstack/start`、`svelte`、`next-app`、`nuxt`、`react-router`、`vue`
- 使用完整包名：`create-vite`、`create-next-app`
- 使用 `create.templates` 中声明的本地 monorepo 模板
- 使用远程模板：`github:user/repo` 或 `https://github.com/user/template-repo`

运行 `vp create --list` 查看内置模板与 Vite+ 识别的常用简写模板。

## 选项

- `--directory <dir>` —— 写入到指定目标目录
- `--agent <name>` —— 搭建时生成代理指令文件
- `--no-agent` —— 跳过代理指令
- `--editor <name>` —— 写入编辑器配置
- `--no-editor` —— 跳过编辑器配置
- `--git` / `--no-git` —— 是否初始化 Git 仓库
- `--package-manager <name>` —— 使用指定包管理器（`pnpm`、`npm`、`yarn`、`bun`）
- `--approve-builds` —— 直接批准并运行受控的依赖构建脚本
- `--no-interactive` —— 无交互运行
- `--verbose` —— 显示详细搭建输出
- `--list` —— 打印可用的内置与常用模板
- `--hooks` / `--no-hooks` —— 是否启用提交钩子

## 例子

```bash
# 交互模式
vp create

# 创建 Vite+ monorepo、应用、库或生成器
vp create vite:monorepo
vp create vite:application
vp create vite:library
vp create vite:generator

# 简写社区模板
vp create vite
vp create @tanstack/start
vp create svelte

# 完整包名
vp create create-vite
vp create create-next-app

# 远程模板
vp create github:user/repo
vp create https://github.com/user/template-repo
```

## 传递模板选项

`--` 之后的参数会直接传给所选模板：

```bash
vp create vite -- --template react-ts
```

## 组织模板

一个组织可以在单个 npm scope 下发布一套模板。发布带 `createConfig.templates` 清单的 `@org/create` 包后，`vp create @org` 会打开交互式选择器：

```bash
# 在 @your-org/create 的清单上打开选择器
vp create @your-org

# 直接运行某个清单项
vp create @your-org:web

# 固定到精确版本或 dist-tag
vp create @your-org@1.2.3
```

`vp create @org` 实际上映射到 `@org/create`（遵循现有 npm `create-*` 约定）。如果该包没有 `createConfig.templates` 字段，Vite+ 会回退为正常运行该包。私有仓库也会正常工作 —— Vite+ 会读取项目根目录与 `~/` 下的 `.npmrc`，并遵循 scope 映射与认证凭据。
