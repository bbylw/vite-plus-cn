# IDE 集成

Vite+ 通过编辑器专用设置支持 VS Code、Zed 和 JetBrains IDE，`vp create` 和 `vp migrate` 可以自动将这些设置写入你的项目。

## VS Code

要获得最佳的 Vite+ VS Code 体验，请安装 [Vite Plus Extension Pack](https://marketplace.visualstudio.com/items?itemName=VoidZero.vite-plus-extension-pack)。它目前包含：

- `Oxc`，通过 `vp check` 提供格式化和代码检查
- `Vitest`，通过 `vp test` 运行测试

当你创建或迁移项目时，Vite+ 会询问是否要为 VS Code 写入编辑器配置。`vp create` 还会将 `npm.scriptRunner` 设置为 `vp`，以便 VS Code 的 NPM Scripts 面板通过 Vite+ 任务运行器运行脚本。对于已迁移或现有项目，你可以手动添加此设置（见下文）。

你也可以手动设置 VS Code 配置：

```json [.vscode/extensions.json]
{
  "recommendations": ["VoidZero.vite-plus-extension-pack"]
}
```

```json [.vscode/settings.json]
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "[javascript]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "[javascriptreact]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "[typescript]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "oxc.disableNestedConfig": true,
  "oxc.fmt.disableNestedConfig": true,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  }
}
```

这为项目提供了共享的默认格式化器，并启用 Oxc 支持的保存时修复操作。语言专用覆盖块（`[javascript]`、`[typescript]` 等）是必需的，因为 VS Code 会优先使用用户级别的 `[language]` 设置，而不是工作区级别的 `editor.defaultFormatter`——没有它们，全局 Prettier 配置会静默接管。设置 `oxc.disableNestedConfig` 和 `oxc.fmt.disableNestedConfig` 可防止嵌套的 Oxlint 和 Oxfmt 配置偏离根 Vite+ 配置。Vite+ 使用 `formatOnSaveMode: "file"`，因为 Oxfmt 不支持部分格式化。

要让 VS Code 的 NPM Scripts 面板通过 `vp` 运行脚本，请将以下内容添加到 `.vscode/settings.json`：

```json [.vscode/settings.json]
{
  "npm.scriptRunner": "vp"
}
```

`vp create` 会自动包含此设置，但 `vp migrate` 不会，因为现有项目可能有成员未在本地安装 `vp`。

## Zed

要获得最佳的 Vite+ Zed 体验，请从 Zed 扩展市场安装 [oxc-zed](https://github.com/oxc-project/oxc-zed) 扩展。它通过 `vp check` 提供格式化和代码检查。

当你创建或迁移项目时，Vite+ 会提示你选择是否为 Zed 写入编辑器配置。

你也可以手动设置 Zed 配置：

```json [.zed/settings.json]
{
  "lsp": {
    "oxlint": {
      "initialization_options": {
        "settings": {
          "run": "onType",
          "fixKind": "safe_fix",
          "typeAware": true,
          "unusedDisableDirectives": "deny"
        }
      }
    },
    "oxfmt": {
      "initialization_options": {
        "settings": {
          "fmt.configPath": "./vite.config.ts",
          "run": "onSave"
        }
      }
    }
  },
  "languages": {
    "JavaScript": {
      "format_on_save": "on",
      "prettier": { "allowed": false },
      "formatter": [
        { "language_server": { "name": "oxfmt" } },
        { "code_action": "source.fixAll.oxc" }
      ]
    },
    "JSX": {
      "format_on_save": "on",
      "prettier": { "allowed": false },
      "formatter": [{ "language_server": { "name": "oxfmt" } }]
    },
    "TypeScript": {
      "format_on_save": "on",
      "prettier": { "allowed": false },
      "formatter": [{ "language_server": { "name": "oxfmt" } }]
    },
    "TSX": {
      "format_on_save": "on",
      "prettier": { "allowed": false },
      "formatter": [{ "language_server": { "name": "oxfmt" } }]
    },
    "Vue.js": {
      "format_on_save": "on",
      "prettier": { "allowed": false },
      "formatter": [{ "language_server": { "name": "oxfmt" } }]
    }
  }
}
```

将 `oxfmt.fmt.configPath` 设置为 `./vite.config.ts`，可使编辑器保存时格式化与 Vite+ 配置中的 `fmt` 块保持一致。完整生成的配置涵盖更多语言（CSS、HTML、JSON、Markdown 等）——运行 `vp create` 或 `vp migrate` 可自动写入完整文件。

## JetBrains（IntelliJ、WebStorm 等）

要获得 JetBrains IDE（如 IntelliJ 和 WebStorm）的最佳 Vite+ 体验，请从 JetBrains 市场安装 [Oxc](https://plugins.jetbrains.com/plugin/27061-oxc) 插件。

当你创建或迁移项目时，Vite+ 会提示你选择是否为 JetBrains IDE 写入编辑器配置。

> [!TIP]
> **Vite+ 不会与现有配置文件合并**
>
> 由于合并 XML 文件存在一些复杂性，如果文件已存在，Vite+ 目前不会合并你当前的配置，而是让你选择替换现有文件。

你也可以手动设置 IDE 配置以匹配你的 Vite+ 设置：

```xml [.idea/externalDependencies.xml]
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="ExternalDependencies">
    <plugin id="com.github.oxc.project.oxcintellijplugin" />
  </component>
</project>
```

```xml [.idea/workspace.xml]
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <!-- other settings... -->
  <component name="PropertiesComponent">
    <![CDATA[{
      "keyToString": {
        // other settings
        "javascript.nodejs.core.library.configured.version": "24.18.0", // Replace with your selected Node.js version
        "javascript.nodejs.core.library.typings.version": "24.13.3", // Replace with the version of @types/node that corresponds to your runtime (or omit if you don't want it)
        "javascript.preferred.runtime.type.id": "node",
        "nodejs_interpreter_path": "$USER_HOME$/.local/share/vite-plus/bin/node",
        "nodejs_package_manager_path": "pnpm" // Replace with your package manager of choice
      }
    }]]>
  </component>
</project>
```

此路径假设使用默认 XDG 目录的全新 Unix 安装。在 Windows 上，请使用 `%LOCALAPPDATA%\vite-plus\bin\node.exe`。运行 `vp env current node` 检查解析后的 Node.js 版本和二进制路径。如果你使用自定义 `VP_HOME` 或 XDG 目录，或较旧的 Vite+ 安装，请将 `nodejs_interpreter_path` 更新为你的 Node.js shim 路径。

```xml [.idea/OxfmtSettings.xml]
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="OxfmtSettings">
    <option name="preferOxfmtCodeStyleSettings" value="true" />
  </component>
</project>
```

通常，项目中的 `.idea` 文件夹会被 gitignore，甚至包括 `externalDependencies.xml` 文件，该文件用于告诉 IDE 工作区应使用哪些插件。

请确保将这一行添加到主 `.gitignore` 文件中，以确保该文件被包含：

```gitignore [.gitignore]
!.idea/externalDependencies.xml
```
