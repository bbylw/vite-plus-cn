# create 配置

`vp create` 会读取 `vite.config.ts` 中的 `create` 配置块，以设置每个仓库的默认值。完整的 `@org` 模板工作流请参阅[创建项目指南](/guide/create)。

## `create.defaultTemplate`

当 `vp create` 未传入 `TEMPLATE` 参数时，Vite+ 会使用该值，就像用户手动输入了一样。通常设置为一个 npm scope，其 `@scope/create` 包会发布 `createConfig.templates` 清单，这样直接运行 `vp create` 就会进入组织选择器。

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  create: {
    defaultTemplate: '@your-org',
  },
});
```

`vp create` 作为第一个参数接受的任何值都可以用在这里：`@your-org` 用于组织选择器，`@your-org:web` 用于直接指定清单条目，`vite:application` 用于内置模板，或者本地 `create.templates` 条目的 `name`（见下文）。

## `create.templates`

声明 monorepo 内 `vp create` 可用的本地模板。每个条目都会列在 `vp create` 选择器中，选中它（或将其 `name` 作为模板参数传入）会运行解析后的 `template`。

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  create: {
    templates: [
      {
        name: 'component',
        description: 'Internal UI component',
        template: './tools/create-component',
      },
      { name: 'service', description: 'Backend service', template: 'service-generator' },
    ],
  },
});
```

每个条目包含：

| 字段          | 是否必需 | 说明                                                                                                                                                                       |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | 是       | 在选择器中显示的标识符，也可作为 `vp create <name>` 接受。在数组内必须唯一。`vite:` 前缀保留给内置模板。                                                                   |
| `description` | 是       | 选择器中显示的一行描述。                                                                                                                                                   |
| `template`    | 是       | 工作区包名、指向本地包目录的相对 `./path`（相对于工作区根目录解析）、`vite:*` 内置模板、GitHub URL，或完整的 npm 包名（例如 `create-foo`）。它按原样运行（不会展开简写）。 |

`create.templates` 是本地模板的唯一来源：只有在此列出的条目才会出现在选择器中。Vite+ 不会根据 package.json 的 keywords 字段推断模板。如果某个 `create.templates` 条目的 `template` 不匹配任何工作区包，或解析到没有 `bin` 的本地包，则会报告为错误，而不会退回到一个不相关的 npm 包。

[`vp create vite:generator`](/guide/create) 会自动在此添加一个条目（幂等，并保留 `defaultTemplate`）；你也可以手动编辑该列表。

`create.defaultTemplate` 可以指向本地条目，因此直接运行 `vp create` 会打开它。

## 优先级

CLI 参数 > `create.defaultTemplate` > 标准内置选择器。

显式指定的说明符始终优先，因此脚本和 CI 可以绕过配置的默认值：

```bash
# 使用 create.defaultTemplate
vp create

# 显式忽略默认值
vp create vite:library
```

组织选择器还会在末尾追加一个“Vite+ 内置模板”条目，选中它会进入 `vite:monorepo` / `vite:application` / `vite:library` / `vite:generator` 流程，因此即使配置了默认值，内置模板仍可通过交互方式访问。
