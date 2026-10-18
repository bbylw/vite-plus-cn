# 环境管理

`vp env` 管理完整的 JavaScript 环境：一个 Node.js 运行时和一个选定的包管理器。npm、pnpm、Yarn 和 Bun 是并列的包管理器家族。它属于[全局 CLI](/guide/global-cli)，不包含在项目本地的 `vite-plus` 包中。

## 概览

把项目环境看作两个独立选择的组件：

- **Node.js** 是用于执行 JavaScript 工具和脚本的运行时。每个项目都可以声明所需的 Node.js 版本。
- **包管理器** 负责安装和管理项目依赖。每个项目都可以选择 npm、pnpm、Yarn 或 Bun，并声明其版本。

例如，一个项目可以使用 Node.js 24 搭配 pnpm 10。更改 Node.js 版本不会改变包管理器的选择，从 pnpm 切换到 Yarn 也不会改变 Node.js 版本。运行命令时，Vite+ 会解析这两个组件，因此你可以在不同项目之间切换，而无需手动切换工具。

Vite+ 通过 **shim** 将这些选择连接到你的 shell：名为 `node`、`npm`、`pnpm`、`yarn` 和 `bun` 的小型启动器及其别名。在受管模式下，shim 会为当前项目解析并启动合适的工具。`vp install` 等命令使用项目选定的包管理器；直接调用 `pnpm` 则始终运行 pnpm，即使项目选择了其他管理器。

受管模式默认开启，因此 Node.js 和已配置的包管理器 shim 会通过 Vite+ 解析，并为当前项目选择正确的版本。全新安装在用户启用环境管理后，会为 npm、pnpm、Yarn 和 Bun 记录受管模式。

使用 `vp env off` 可关闭 Node.js 和包管理器的受管模式。详情以及如何切换到系统工具，请参阅下文的[环境模式](#环境模式)。

未指定选择器时，大多数命令会同时作用于两个组件。添加 `node`、`pm`、`npm`、`pnpm`、`yarn` 或 `bun` 可缩小命令范围。`pm` 在列出和清理时表示全部四个家族，但在项目操作中表示唯一选定的包管理器。

不带限定符的版本仍为 Node.js 版本，以保持兼容性：

```bash
vp env pin 22.0.0               # 仅 Node.js
vp env pin pnpm@10.18.0         # 仅 pnpm
vp env pin node@24 pnpm@12      # 两个组件
vp env pin 22.0.0 pnpm@10.18.0  # 同样是两个组件
```

使用 `vp env pin` 保存项目的版本，`vp env default` 设置回退版本，`vp env use` 为当前 shell 覆盖版本。运行 `vp env current` 查看解析后的环境。

## Node.js 版本选择

为选择项目的 Node.js 版本，Vite+ 先检查当前目录，然后逐级向上检查父目录。最近的、带有受支持声明的目录胜出。在每个目录内，按以下顺序检查来源：

1. `.node-version` 文件
2. `package.json` 中的 `devEngines.runtime`（[devEngines 标准](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines)）
3. `package.json` 中的 `engines.node`
4. `.nvmrc` 文件

如果没有任何目录声明版本，Vite+ 使用全局默认值（`vp env default`），然后使用最新的 LTS。

`devEngines.runtime` 的优先级高于 `engines.node`，因为它声明的是开发环境需求，而 `engines.node` 是面向使用者的支持范围。当声明的来源冲突时，`vp env doctor` 会发出警告。

> [!TIP]
> **在 Vite+ 运行时管理下使用 pnpm**
>
> pnpm 也可以管理 `devEngines.runtime` 中声明的运行时。当 pnpm 和 Vite+ 同时管理 Node.js 时，它们可能各自下载相同的版本，或选择不同的版本，导致命令之间的行为不一致。
>
> 如果你的项目使用 Vite+ 管理 Node.js 和 pnpm 版本，请将以下设置添加到项目的 `pnpm-workspace.yaml`（pnpm 11+）：
>
> ```yaml
> runtimeOnFail: ignore
> pmOnFail: ignore
> ```
>
> [`runtimeOnFail`](https://pnpm.io/settings/cli#runtimeonfail) 会禁用 pnpm 对已声明运行时的自动管理。[`pmOnFail`](https://pnpm.io/settings/cli#pmonfail) 会阻止 pnpm 切换到 `package.json` 中声明的包管理器版本。请提交这些设置，以便项目共享相同的策略。
>
> `runtimeOnFail: ignore` 也会影响其他已声明的运行时，包括 Bun 和 Deno。如果项目依赖 pnpm 管理它们，请在启用此设置之前加以考虑。将现有项目切换到此策略可能会在下一次安装时改变 `pnpm-lock.yaml` 中的运行时条目；请审阅这些更改并连同配置一起提交。

## 包管理器选择

包管理器的选择使用以下优先级：

1. 显式命令覆盖
2. `VP_PACKAGE_MANAGER`
3. 顶层 `packageManager`
4. `devEngines.packageManager`
5. 锁文件或管理器专用配置
6. 具名包管理器的全局默认版本
7. 具名 shim 的最新版本（`npm` 使用 Node.js 捆绑的版本）

`VP_PACKAGE_MANAGER` 为 `vp install` 等命令选择管理器和版本。直接调用包管理器 shim 时会忽略此变量，并使用独立的版本覆盖：

| 变量              | Shim                        |
| ----------------- | --------------------------- |
| `VP_NPM_VERSION`  | `npm`、`npx`                |
| `VP_PNPM_VERSION` | `pnpm`、`pnpx`、`pn`、`pnx` |
| `VP_YARN_VERSION` | `yarn`、`yarnpkg`           |
| `VP_BUN_VERSION`  | `bun`、`bunx`               |

这些变量接受版本、范围或 npm dist-tag，例如 `10.18.0`、`10`、`latest` 或 `latest-10`，并覆盖匹配 shim 的项目版本和默认版本。它们不会改变 `vp install` 选择的管理器或版本。

`vp env use pnpm@10.20.0` 会为当前 shell 设置 `VP_PNPM_VERSION`，正如 `vp env use node@22` 会设置 `VP_NODE_VERSION`。每个包管理器都有自己的覆盖，因此切换 Yarn 不会清除 pnpm 的覆盖。`vp env use` 不会设置或清除 `VP_PACKAGE_MANAGER`。

直接调用 shim 时，版本按以下顺序解析：匹配的环境变量；没有 shell 包装器时使用匹配的会话文件；然后是项目配置和家族默认值。`vp env current pnpm` 和 `vp env which pnpm` 检查这种 shim 选择；`vp env current pm` 报告为 vp 命令选定的管理器。

```bash
VP_PACKAGE_MANAGER=pnpm@10.18.0 vp install
VP_PNPM_VERSION=10.20.0 pnpm --version
```

这些覆盖在受管模式下生效。包管理器在 Vite+ 启动它之后也可能执行自己的版本切换；例如 pnpm 11+ 的 [`pmOnFail`](https://pnpm.io/settings/cli#pmonfail) 默认为 `download`，可能会切回 `package.json` 中的版本。要让 Vite+ 控制 pnpm 版本，请在项目的 `pnpm-workspace.yaml` 中设置 `pmOnFail: ignore`。在 pnpm 10 中，对应的设置是 `managePackageManagerVersions`。

项目选择只作用于匹配的 shim。例如，pnpm 控制 `pnpm`、`pnpx`、`pn` 和 `pnx`；调用 `npm` 仍会独立解析 npm。没有匹配的项目选择时，具名 shim 使用其配置的默认版本，否则使用最新版本且不会提示。npm shim 会回退到 Node 捆绑的 npm。当没有配置项目版本或全局默认值时，`vp env use npm` 会为当前 shell 选择独立 npm 的最新版本。

包管理器规格遵循 npm 的顺序：精确版本，然后是 semver 范围，最后是 dist-tag。`default` 是 `latest` 的别名，但对 npm 而言，它选择 `PATH` 上的 npm。

**Dist-tag 缓存**

当解析包管理器的 dist-tag（如 `latest` 或 `latest-10`）时，包括具名 shim 回退到最新版本的情况，解析出的版本会缓存一小时。当无法访问注册表时，过期的缓存仍然可用。

`pn` 运行与 `pnpm` 相同的受管二进制，`pnx` 运行与 `pnpx` 相同的受管二进制（`pnpm dlx`）。这些别名也适用于 v11 之前的受管 pnpm 版本。

## 环境模式

受管模式默认开启，因此 Node.js 和已配置的包管理器 shim 会通过 Vite+ 解析，并为当前项目选择正确的版本。全新安装在用户启用环境管理后，会为 npm、pnpm、Yarn 和 Bun 记录受管模式。

要启用受管模式，请运行：

```bash
vp env on
```

这会为两个组件启用受管模式。它们的模式也可以单独更改，包括单独某个包管理器家族：

```bash
vp env on node
vp env off pm
vp env off pnpm
vp env on bun
```

如果你不希望 Vite+ 首先管理 Node.js，请运行：

```bash
vp env off
```

这会将两个组件切换为系统优先模式。Vite+ 优先使用系统工具，回退到受管安装。混合配置可以组合：通过 PATH 查找 Node.js 的包管理器启动器会获得 Node 模式选定的运行时。

使用 `pm` 会为当前支持的所有包管理器记录所选模式，并替换它们各自的选项。不带选择器的 `on` 或 `off` 会做同样的事，同时还会更改 Node.js。

## 命令

### 设置

- `vp env setup` 创建工具 shim 并写入 shell 设置脚本。
- `vp env setup --refresh` 使用你保存的偏好重新创建 Vite+ shim 并重新生成 shell 设置脚本。
- `vp env on` / `vp env off` 在 Vite+ 受管模式和系统优先模式之间切换；追加 `node`、`pm`、`npm`、`pnpm`、`yarn` 或 `bun` 可缩小更改范围。
- `vp env print` 打印两个组件的 PATH 设置；追加选择器可只打印一个。

升级会自动刷新设置。之后请打开新终端或重新加载 shell 设置脚本。

PowerShell 需要在当前 shell 中点源（dot-source）生成的设置脚本，`vp env use` 才能只影响该 shell 会话：

```powershell
. "$env:APPDATA\vite-plus\env.ps1"
```

如果较旧的 Vite+ 安装使用 `%USERPROFILE%\.vite-plus`，请改为加载该目录中的 `env.ps1` 文件。

将那行添加到 PowerShell `$PROFILE` 的末尾，即可在新 shell 中自动应用。它不需要提升权限。

如果配置文件尚不存在，请创建它：

```powershell
if (-not (Test-Path $PROFILE)) { New-Item $PROFILE -Force }
```

打开配置文件进行编辑：

```powershell
Invoke-Item $PROFILE
```

Windows 命令提示符（`cmd.exe`）无法定义 `vp env use` 更新当前 shell 会话所需的包装函数。请改用生成的 `vp-use.cmd` 命令：

```batch
vp-use 20
node --version
vp-use --unset
```

只有 `vp env use` 需要这个替代命令。其他 `vp env` 命令在命令提示符中正常工作。在 Windows 上，`vp env setup` 会在 bin 目录中创建 `vp-use.cmd`。

在 CI 中，`vp env use` 可以在没有 shell 初始化的情况下运行。它会在解析后的状态目录中为每个运行时或包管理器写入一个临时会话文件，例如 `.session-node-version` 或 `.session-pnpm-version`。同一作业中后续的 shim 调用会使用这些文件解析相同的环境。

#### Shell 补全

全局 CLI 支持在 Bash、Zsh、Fish、Nushell 和 PowerShell 中使用 Tab 补全。运行 `vp env setup` 并按它打印的 shell 设置说明启用。按 Tab 补全命令，或在 `vp run` 和 `vpr` 之后补全项目任务名称。

- **Zsh**：如果你的 shell 尚未初始化补全，请在加载设置脚本之前运行 `autoload -Uz compinit; compinit`。
- **Nushell**：补全需要 `PATH` 中有 `fish`。

### 管理

- `vp env default` 显示全局 Node.js 默认版本以及每个已配置的包管理器版本。裸版本设置 Node.js；带限定符的规格（如 `pnpm@10.18.0`）设置该包管理器的 shim 默认值，而不会替换 Bun、Yarn 或 npm 的默认值。`--unset` 清除所有默认值，除非指定了范围。
- `vp env default <lts|latest>` 和包管理器 dist-tag（如 `pnpm@latest` 或 `pnpm@latest-10`）会在每次使用时重新解析，因此默认值会跟随标签变化，包括 `latest` 的新主版本。其他版本和范围（如 `24` 或 `pnpm@10`）在设置时会解析为确切版本。
- `vp env pin` 显示或写入项目固定版本。现有的 `.node-version` 和顶层 `packageManager` 字段会继续更新以保持兼容性。当现有 `.nvmrc` 是当前目录中生效的 Node 来源时，它会被更新；其注释和其他非版本内容会保留。否则 Vite+ 会写入匹配的 `devEngines` 条目。使用 `--target node-version`、`--target nvmrc`、`--target dev-engines` 或 `--target package-manager` 显式选择。在子目录中固定不会修改继承的 `.nvmrc`。
- `vp env unpin` 默认移除两个生效的固定版本；追加选择器可只移除一个。优先级较低的声明不会被删除。
- `vp env use` 激活完整的项目环境。显式规格会覆盖选定的组件；`--unset` 会清除两者，除非指定了范围。
- `vp env install` 安装完整解析后的环境、选定的组件或显式规格。
- `vp env uninstall` 移除由显式版本或选择器（如 `22` 或 `lts`）解析出的 Node.js 版本。包管理器需要带限定符的精确版本，例如 `pnpm@10.18.0`。
- `vp env clean` 移除未使用的安装。使用 `clean node`、`clean pm` 或具体的包管理器。当前版本和配置的默认版本会保留。
- `vp env exec` 在解析后的环境中运行命令。使用 `--node` 和 `--package-manager`；`--npm` 是 `--package-manager npm@…` 的别名。
- `vp node` 使用解析后的 Node.js 运行时，并向子进程暴露选定的包管理器路径。

### 检查

- `vp env current` 显示当前解析后的环境
- `vp env doctor` 运行环境诊断。追加 `node` 聚焦 Node.js，`pm` 表示所有包管理器，或 `npm`、`pnpm`、`yarn`、`bun` 表示特定包管理器。
- `vp env which` 显示将使用哪个工具路径
- `vp env list` 分别显示 Node.js、npm、pnpm、Yarn 和 Bun 部分；选择器可缩小输出
- `vp env list-remote` 并发获取 Node.js 和全部四个包管理器注册表；选择器可缩小网络请求。`--lts` 隐式选择 Node.js。

## 项目设置

- 使用 `vp env pin` 固定项目版本
- 正常使用 `vp install`、`vp dev` 和 `vp build`
- 让 Vite+ 为项目选择正确的运行时

## 示例

```bash
# 设置
vp env setup                  # 创建 Node.js 和包管理器 shim
vp env on                     # 管理 Node.js 和包管理器
vp env off pm                 # 仅优先使用系统包管理器
vp env off pnpm               # 仅优先使用系统 pnpm
vp env print                  # 打印两个组件的 PATH 设置

# 管理
vp env pin lts                # 仅将 Node.js 固定到确切版本
vp env pin node@26            # 将 Node.js 26 固定到确切版本
vp env pin lts pnpm@10        # 将两个项目组件固定到确切版本
vp env pin pnpm@latest-10     # 将 pnpm 固定到其 latest-10 dist-tag 的版本
vp env install                # 安装完整解析后的环境
vp env use 20 pnpm@10         # 为此 shell 覆盖两个组件
vp env use --unset pnpm       # 仅移除 pnpm 会话版本
vp env use --unset pm         # 移除所有包管理器会话版本

# 管理（全局）
vp env default lts            # 始终使用最新 LTS，包括新的主版本
vp env default node@24        # 将 Node.js 默认值固定到确切版本
vp env default pnpm@10        # 将 pnpm 默认值固定到确切版本
vp env clean                  # 移除未使用的受管 Node.js 和包管理器版本

# 检查
vp env current                # 显示当前解析后的环境
vp env current --json         # 供自动化使用的 JSON 输出
vp env which node             # 显示将使用哪个 node 二进制
vp env which npx              # 当 packageManager 匹配时显示固定的包管理器别名
vp env list                   # 显示每个本地安装的组件
vp env list node              # 仅显示 Node.js 安装
vp env list-remote --lts      # 仅列出 Node.js LTS 版本

# 执行
vp env exec --node lts --package-manager pnpm@10 pnpm install
vp env exec node -v           # 使用 shim 模式并自动解析版本
vp node script.js             # 简写：用解析后的版本运行 Node.js 脚本
vp node -e "console.log(1+1)" # 简写：转发任何 node 标志或参数
```

## JSON 输出

`current`、`list` 和 `list-remote` 的 JSON 输出按组件组织。`current --json` 返回同级的 `node` 和 `package_manager` 对象：

```json
{
  "node": {
    "version": "22.0.0",
    "source": "devEngines.runtime",
    "source_path": "/project/package.json",
    "project_root": "/project",
    "bin_path": "/home/.local/share/vite-plus/js_runtime/node/22.0.0/bin/node",
    "installed": true,
    "mode": "managed"
  },
  "package_manager": {
    "name": "pnpm",
    "version": "10.18.0",
    "source": "packageManager",
    "source_path": "/project/package.json",
    "project_root": "/project",
    "bin_paths": {
      "pnpm": "/home/.local/share/vite-plus/package_manager/pnpm/10.18.0/pnpm/bin/pnpm",
      "pnpx": "/home/.local/share/vite-plus/package_manager/pnpm/10.18.0/pnpm/bin/pnpx"
    },
    "installed": true,
    "mode": "managed"
  }
}
```

`list --json` 和 `list-remote --json` 按组件分组数组：

```json
{
  "node": [],
  "package_managers": {
    "npm": [],
    "pnpm": [],
    "yarn": [],
    "bun": []
  }
}
```

选择器会省略未选中的顶层字段或包管理器家族。注册表列表是全有或全无：任何选定的注册表请求失败时，Vite+ 不会打印部分人类可读或 JSON 结果。

## 自定义 Node.js 镜像

默认情况下，Vite+ 从 `https://nodejs.org/dist` 下载 Node.js。如果你位于企业代理之后，或需要使用内部镜像（例如 Artifactory），请设置 `VP_NODE_DIST_MIRROR` 环境变量：

```bash
# 从自定义镜像安装特定版本
VP_NODE_DIST_MIRROR=https://my-mirror.example.com/nodejs/dist vp env install 22

# 使用自定义镜像设置全局默认版本
VP_NODE_DIST_MIRROR=https://my-mirror.example.com/nodejs/dist vp env default lts

# 在 shell 配置文件（.bashrc、.zshrc 等）中永久设置
echo 'export VP_NODE_DIST_MIRROR=https://my-mirror.example.com/nodejs/dist' >> ~/.zshrc
```

## Node.js 签名校验

从官方 `nodejs.org` 分发安装 Node.js 时，Vite+ 会下载 PGP 签名的 `SHASUMS256.txt.asc`，并在信任任何校验和之前用内置的 Node.js 发布密钥验证它。这可以防止被篡改的 `SHASUMS256.txt` 与匹配的恶意归档配对。下载归档的 SHA-256 校验和始终会在之后验证。

仅发布纯 `SHASUMS256.txt` 的自定义镜像（`VP_NODE_DIST_MIRROR`）会回退到仅校验和验证。确实发布了 `.asc` 的镜像仍会验证其签名，无效签名是硬错误。

如果未来的密钥环或证书问题阻止下载，请设置 `VP_NODE_SKIP_SIGNATURE_VERIFY` 临时绕过 PGP 验证。SHA-256 校验和仍会验证，并且 Vite+ 在跳过签名检查时会打印警告：

```bash
VP_NODE_SKIP_SIGNATURE_VERIFY=1 vp env install 22
```
