# 创建项目

`vp create` 以交互方式搭建新的 Vite+ 项目、monorepo，以及现有工作区中的应用。

## 概览

`create` 命令是使用 Vite+ 的最快起步方式。它有以下几种用法：

- 开启一个新的 Vite+ monorepo
- 创建一个新的独立应用或库
- 在现有项目内新增一个应用或库

该命令既可使用内置模板、社区模板，也可使用远程 GitHub 模板。

## 用法

```bash
vp create
vp create <template>
vp create <template> -- <template-options>
```

### 不安装全局 CLI

如果你还没有安装[全局 `vp`](/guide/global-cli)，Vite+ 提供了 `create-vite-plus` 包，可通过你的包管理器运行 `vp create`。

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

新项目会使用执行该命令的包管理器，除非你传入 `--package-manager`，或者在现有工作区内创建它。参数会原样转发给 `vp create`，因此第一个参数是模板，而不是目标目录：

```bash
pnpm create vite-plus vite:application --directory my-app
```

如果你使用 npm，传给 `vp create` 的选项前需要加 `--`，例如 `npm create vite-plus@latest -- vite:application --directory my-app`。

创建项目后，通过你的包管理器运行 `vp`，例如 `pnpm exec vp run`。

## 内置模板

Vite+ 附带以下内置模板：

- `vite:monorepo` 创建新的 monorepo
- `vite:application` 创建新的应用
- `vite:library` 创建新的库
- `vite:generator` 创建新的代码生成器（仅限 monorepo，参见[代码生成器](#代码生成器)）

## 模板来源

`vp create` 并不局限于内置模板。

- 使用简写模板，如 `vite`、`@tanstack/start`、`svelte`、`next-app`、`nuxt`、`react-router` 和 `vue`
- 使用完整包名，如 `create-vite` 或 `create-next-app`
- 使用在 [`create.templates`](#代码生成器) 中声明的本地 monorepo 模板（例如内部的组件或服务生成器）
- 使用远程模板，如 `github:user/repo` 或 `https://github.com/user/template-repo`

运行 `vp create --list` 查看内置模板以及 Vite+ 识别的常用简写模板。

## 选项

- `--directory <dir>` 将生成的项目写入指定的目标目录。只有内置模板和随附的 `@org` 模板支持该选项。
- `--agent <name>` 在搭建过程中创建代理指令文件
- `--no-agent` 跳过代理指令设置
- `--editor <name>` 写入编辑器配置文件
- `--no-editor` 跳过编辑器配置设置
- `--git` 初始化 git 仓库
- `--no-git` 跳过 git 仓库初始化
- `--package-manager <name>` 使用指定的包管理器（`pnpm`、`npm`、`yarn` 或 `bun`）
- `--approve-builds` 无需询问即可批准并运行需审批的依赖构建脚本
- `--no-interactive` 无提示运行
- `--verbose` 显示详细的搭建输出
- `--list` 打印可用的内置模板与常用模板
- `--hooks` 启用提交钩子设置（分发器 + `.vite-hooks` + `staged` 配置）
- `--no-hooks` 跳过钩子设置

> [!NOTE]
> 在现有 monorepo 中添加包时，`--git` 和 `--no-git` 不可用。

创建完成后，可用 `vp hooks status`、`vp hooks disable` 和 `vp hooks enable` 管理该分发器。参见[提交钩子指南](/guide/commit-hooks)。

### 依赖构建脚本

出于安全考虑，pnpm、bun、yarn（Berry）和 npm（v12+）在你批准之前不会运行依赖的构建脚本（`install` / `postinstall`，例如 `better-sqlite3` 这类原生构建）。当模板直接添加了此类依赖时，`vp create` 会在安装后提示它们，而不是让项目停留在半构建状态：

- 交互模式：询问你要批准并构建其中的哪些依赖（默认不选中任何项）。
- 非交互模式：以提示列出它们，并指向 `vp pm approve-builds`。
- `--approve-builds`：自动批准并构建它们，因此非交互运行（CI）也能产出可直接使用的项目。

批准结果会按各包管理器期望的方式记录：pnpm 的 `allowBuilds`、bun 的 `trustedDependencies`、npm 的 `allowScripts`，或 yarn 的 `dependenciesMeta.<pkg>.built`（记录在工作区根清单中）。你未选择的传递构建脚本（例如 Vite 引入的 `esbuild`）保持包管理器的默认值，不会被提示。npm 11 及更早版本会在安装时运行构建脚本，因此那里没有需要批准的内容。

## 模板选项

`--` 之后的参数会直接传给所选模板。

当模板本身接受标志时，这一点很重要。例如，你可以这样转发 Vite 模板选择：

```bash
vp create vite -- --template react-ts
```

## 示例

```bash
# 交互模式
vp create

# 创建 Vite+ monorepo、应用、库或生成器
vp create vite:monorepo
vp create vite:application
vp create vite:library
vp create vite:generator

# 使用简写社区模板
vp create vite
vp create @tanstack/start
vp create svelte

# 使用完整包名
vp create create-vite
vp create create-next-app

# 使用远程模板
vp create github:user/repo
vp create https://github.com/user/template-repo
```

## 代码生成器

monorepo 往往需要搭建自己的构建单元：一个 UI 组件、一个服务，或一个遵循团队约定的内部包。Vite+ 通过由 [Bingo](https://www.create.bingo/) 模板驱动的生成器包来支持这一点。

### 搭建生成器

在 Vite+ monorepo 内运行：

```bash
vp create vite:generator
```

这需要一个 monorepo 工作区。如果还没有，请先用 `vp create vite:monorepo` 创建。

搭建出的生成器包包含：

- `src/template.ts` 使用 `bingo` 的 `createTemplate` 定义模板：一个用 [Zod](https://zod.dev/) 构建的选项 schema，以及一个返回要生成文件的 `produce()` 函数
- `bin/index.ts` 是 CLI 入口，由 Bingo 的 `runTemplateCLI` 驱动

如果该 monorepo 在父级目录中有名为 `generators` 或 `tools` 的目录，新包默认会放在那里。

### 注册

本地生成器在 monorepo 的 `vite.config.ts` 中的 [`create.templates`](/config/create) 里声明。这是唯一事实来源：只有已注册的模板才会出现在 `vp create` 选择器中。

`vp create vite:generator` 会为你注册该生成器，在根 `vite.config.ts` 的 `create.templates` 中添加一个条目。

例如，在 `generators/my-generator` 中创建名为 `my-generator` 的生成器，注册结果如下：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  create: {
    templates: [
      {
        name: 'my-generator',
        description: 'A starter for creating a Vite+ code generator.',
        template: './generators/my-generator',
      },
    ],
  },
});
```

重复运行是幂等的（不会产生重复条目），并且会保留已有的 `create.defaultTemplate`。你也可以手动添加条目，例如注册一个并非通过这种方式搭建的模板。`template` 的值是生成器的工作区包名，或指向它的相对 `./path`。

### 运行生成器

在 monorepo 内运行 `vp create` 并从模板列表中选择该生成器，或直接传入它的条目 `name`：

```bash
# 交互模式会在内置模板旁列出已注册的本地模板
vp create

# 按名称运行已注册的模板
vp create component

# 在 -- 之后向生成器传选项
vp create component -- --name @your-org/button
```

当生成器依赖 `bingo` 时，Vite+ 会自动追加 `--skip-requests`，以跳过 Bingo 的外发网络请求（例如 GitHub API 调用）。

生成器运行后，创建的包会经过常规的 monorepo 集成：工作区注册、依赖安装和格式化。

### 自定义生成器

编辑 `src/template.ts`，定义选项与要生成的文件：

```ts
import { createTemplate } from 'bingo';
import { z } from 'zod';

export default createTemplate({
  options: {
    name: z.string().describe('Package name'),
  },
  async produce({ options }) {
    return {
      files: {
        'package.json': JSON.stringify({ name: options.name, version: '0.0.0' }, null, 2),
        src: {
          'index.ts': `export const name = '${options.name}';\n`,
        },
      },
    };
  },
});
```

- `options` 使用 Zod schema 定义生成器的提示与标志
- `produce()` 返回要创建的[文件](https://www.create.bingo/build/concepts/creations#files)，以及可选的生成后[脚本](https://www.create.bingo/build/concepts/creations#scripts)和向用户打印的[建议](https://www.create.bingo/build/concepts/creations#suggestions)

参见 [Bingo 文档](https://www.create.bingo/) 了解完整的模板 API。

## 组织模板

组织可以通过发布一个 `@org/create` 包（其 `package.json` 带有 `createConfig.templates` 清单），在单个 npm scope 下提供一套精选模板。发布后，`vp create @org` 会在这些模板上打开交互式选择器。

### 从组织中选择

```bash
# 在 @your-org/create 的清单上打开交互式选择器
vp create @your-org

# 直接运行某个清单条目
vp create @your-org:web

# 固定到精确版本或 dist-tag
vp create @your-org@1.2.3
vp create @your-org:web@next

# 把该组织设为仓库的默认值（参见 create.defaultTemplate 配置）
vp create
```

在幕后，`vp create @org` 映射到 `@org/create`（即现有的 npm `create-*` 约定）。如果该包没有 `createConfig.templates` 字段，Vite+ 会回退为正常运行该包——因此对于已经发布 `@org/create` 的组织来说，采用该清单是零风险的。

私有仓库会自动可用：Vite+ 会读取项目根目录与 `~/` 下的 `.npmrc` 文件，遵循 `@your-org:registry=...` scope 映射与 `//host/:_authToken=...` 凭据。

### 编写 `@org/create`

有两种常见布局。请选择与组织的模板数量和发布节奏相匹配的一种。

**打包式（推荐给大多数组织）。** 所有模板都作为 `@org/create` 自身的子目录存在。清单条目使用相对 `./path` 值。一个仓库、一次发布、一套版本策略——这与 `create-vite` 和 `create-next-app` 使用的模式相同。

```
@your-org/create/
├── package.json              # "createConfig": { "templates": [{ "template": "./templates/web" }, ...] }
├── templates/
│   ├── web/
│   │   ├── package.json
│   │   └── src/...
│   └── library/...
└── README.md
```

**仅清单式。** 当组织已经发布独立的 `@org/template-*` 包（或把它们托管在 GitHub 上）时，`@org/create` 只作为一层轻量索引。

```
@your-org/create/
├── package.json              # "createConfig": { "templates": [{ "template": "@your-org/template-web" }, ...] }
└── README.md
```

这两种布局可以混用——清单可以把大部分条目指向外部包，同时保留少数几个作为打包子目录。

可选地，提供一个 `bin` 脚本，使 `npm create @org`（旧有路径）对非 Vite+ 用户继续可用。`vp create @org` 直接读取清单，从不运行 `bin`。

### 清单 schema

清单位于 `@org/create` 的 `package.json` 中的 `createConfig.templates`：

```json
{
  "name": "@your-org/create",
  "version": "1.0.0",
  "createConfig": {
    "templates": [
      {
        "name": "monorepo",
        "description": "Monorepo",
        "template": "@your-org/template-monorepo",
        "monorepo": true
      },
      {
        "name": "web",
        "description": "Web app template (Vite + React)",
        "template": "@your-org/template-web"
      },
      {
        "name": "demo",
        "description": "Bundled demo template",
        "template": "./templates/demo"
      }
    ]
  }
}
```

每个条目支持：

| 字段          | 是否必填 | 说明                                                                                                                                                                                                           |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | 是       | Kebab-case 标识符。`vp create @org:<name>` 用它直接选择。必须在数组内唯一。                                                                                                                                    |
| `description` | 是       | 在选择器中显示的单行描述。                                                                                                                                                                                     |
| `template`    | 是       | 一个 npm 说明符（`@org/template-foo`，可选带 `@version`）、一个 GitHub URL（`github:user/repo`）、一个 `vite:*` 内置模板、一个本地工作区包名，或相对 `@org/create` 根目录解析的相对路径（`./templates/foo`）。 |
| `monorepo`    | 否       | 若为 `true`，将该条目标记为创建 monorepo 的模板。在现有 monorepo 内运行 `vp create` 时从选择器中隐藏，与内置 `vite:monorepo` 的过滤行为一致。                                                                  |

无效清单是硬错误，而不是静默回退——发布清单的维护者应当得知出错的字段，例如 `@your-org/create: createConfig.templates[2].template must be a non-empty string`。

### 打包子目录模板

相对 `./...` 路径相对于外层 `@org/create` 包的根目录解析——**而不是**用户的当前工作目录。引用的目录会原样复制到目标项目中（不做模板引擎处理）；唯一的例外是一小组以下划线开头的脚手架文件（`_gitignore`、`_npmrc`、`_yarnrc.yml`）会被重命名为对应的点文件。超出包根目录的路径会被拒绝。

### 在仓库中把组织设为默认

在项目根目录的 `vite.config.ts` 中提交以下内容：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  create: { defaultTemplate: '@your-org' },
});
```

现在 `vp create`（不带参数）会直接进入 `@your-org` 选择器。详见 [`create.defaultTemplate`](/config/create)。

选择器始终会在末尾追加一个 **Vite+ 内置模板**条目，使 `vite:monorepo` / `vite:application` / `vite:library` / `vite:generator` 仍可从选择器访问——选择它会进入标准的内置流程。对于脚本和 CI，显式说明符（`vp create vite:library`）会绕过配置的默认值。

### 非交互式查看

`vp create @org --no-interactive` 会以表格形式打印清单并以状态码 1 退出：

```
A template name is required when running `vp create @your-org` in non-interactive mode.

Available templates in @your-org/create:

  NAME     DESCRIPTION                          TEMPLATE
  web      Web app template (Vite + React)      @your-org/template-web
  library  TypeScript library template          @your-org/template-library
  demo     Bundled demo template                ./templates/demo

Examples:
  # Scaffold a specific template from the org
  vp create @your-org:web --no-interactive

  # Or use a Vite+ built-in template
  vp create vite:application --no-interactive
```

### 发布清单

1. 如果还没有 `@org/create`（scoped npm 包），先创建它。
2. 在 `package.json` 中添加 `createConfig.templates` 数组。（把模板打包在 `./templates/...` 下，或指向外部包。）
3. （可选）提供一个 `bin` 启动器，以兼容 `npm create @org`。
4. 发布。
5. 验证：`vp create @org --no-interactive` 打印清单表格；`vp create @org` 打开选择器。
6. （可选）在你内部的模板仓库中提交 `create: { defaultTemplate: '@org' }`。
