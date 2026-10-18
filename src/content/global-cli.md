# 全局 CLI

全局 CLI 是一个独立的 `vp` 二进制文件，用于机器级的运行时与包管理。它内置 Vite+ 工具链，无需预先安装 Node.js，也无需在项目中添加 `vite-plus` 即可使用。

如果你希望用一条命令跨项目完成以下任意组合的任务，请选择全局 CLI：

- 管理 Node.js 与包管理器版本
- 选择并下载包管理器
- 安装依赖并运行包二进制文件
- 运行 `package.json` 脚本与带缓存的工作区任务
- 使用 Vite+ 前端工具链，而无需在每个项目中固定它

安装全局 CLI 并不要求你采用项目本地包。如果你只需要运行时管理、包管理与任务运行器，也可以只使用它。

## 安装

**macOS / Linux**

```bash
curl -fsSL https://vite.plus | bash
```

**Windows**

```powershell
irm https://vite.plus/ps1 | iex
```

在 Windows 上，你也可以下载并运行 [`vp-setup.exe`](https://setup.viteplus.dev)。

安装完成后，打开新的 shell 并运行：

```bash
vp help
```

如果在安装过程中启用了环境管理，Vite+ 会为 Node.js 以及 npm、pnpm、Yarn 和 Bun 的 shim 记录受管模式。运行 `vp env off` 可改为优先使用系统工具，也可以通过 `vp env off node` 或 `vp env off pm` 将更改限定在特定范围。

**安装器环境变量与选项**

Vite+ 安装器（`vp-setup.exe`、`install.ps1` 与 `install.sh`）以及安装后的 `vp` CLI 会读取下列环境变量。

### 安装变量

这些变量控制安装脚本与独立的 Windows 安装器（`vp-setup.exe`）。

#### `VP_VERSION`

- **用途**：要安装的版本
- **默认值**：`latest`
- **CLI 等价项**：`--version`
- **说明**：Vite+ 0.2.x 及更早版本不支持分离式目录布局。安装器始终把这些版本放在单一根目录（`VP_HOME` 或 `~/.vite-plus`）中。此规则同样适用于全新机器。安装器会检查下载的二进制文件并打印提示。
- **示例**：

  ```bash
  # Unix
  curl -fsSL https://vite.plus | VP_VERSION=1.2.3 bash
  ```

  ```powershell
  # PowerShell
  $env:VP_VERSION = "1.2.3"; irm https://vite.plus/ps1 | iex
  ```

#### `VP_HOME`

- **用途**：为单一根目录布局可选地固定路径。将其设置为绝对路径后，Vite+ 会把 bin、data、cache、config 与 state 放在该目录下。安装后的 CLI 也会读取同一变量。参见[环境管理](/guide/env)。
- **默认值**：未设置。Vite+ 会复用 Unix 上 `~/.vite-plus` 或 Windows 上 `%USERPROFILE%\.vite-plus` 中的现有安装。该目录必须包含一个 `current` 链接。否则，全新安装会使用下文所示的分离式平台布局。
- **示例**：

  ```bash
  # Unix
  curl -fsSL https://vite.plus | VP_HOME=/opt/vite-plus bash
  ```

  ```powershell
  # PowerShell
  $env:VP_HOME = "D:\vite-plus"; irm https://vite.plus/ps1 | iex
  ```

全新的分离式布局安装使用以下默认值：

| 目录              | macOS 与 Linux             | Windows                          |
| ----------------- | -------------------------- | -------------------------------- |
| 数据（Data）      | `~/.local/share/vite-plus` | `%LOCALAPPDATA%\vite-plus\data`  |
| 可执行文件（Bin） | `<DATA>/bin`               | `%LOCALAPPDATA%\vite-plus\bin`   |
| 缓存（Cache）     | `~/.cache/vite-plus`       | `%LOCALAPPDATA%\vite-plus\cache` |
| 配置（Config）    | `~/.config/vite-plus`      | `%APPDATA%\vite-plus`            |
| 状态（State）     | `~/.local/state/vite-plus` | `%LOCALAPPDATA%\vite-plus\state` |

在 macOS 与 Linux 上，绝对的 `XDG_DATA_HOME`、`XDG_CACHE_HOME`、`XDG_CONFIG_HOME` 与 `XDG_STATE_HOME` 值会覆盖对应的基础目录。bin 目录跟随数据目录。

低优先级的受管 shim 位于 `<DATA>/fallback-bin`，其中 `<DATA>` 是解析后的数据目录。

#### `VP_BIN_DIR` / `VP_DATA_DIR` / `VP_CACHE_DIR`

- **用途**：供必须固定分离式安装的集成使用的内部绝对目录覆盖项。请同时设置这三个变量。安装器会拒绝不完整的一组。当设置了 `VP_HOME`，或 Vite+ 复用现有的 `~/.vite-plus` 安装时，会忽略这组变量。
- **默认值**：未设置（使用 XDG / 平台默认值）
- **持久化**：生成的环境文件不会导出这些变量。使用这些变量的集成必须在每次调用 Vite+ 进程时提供完整的一组。
- **示例**：

  ```bash
  export VP_DATA_DIR=$HOME/vite-plus-data
  export VP_BIN_DIR=$VP_DATA_DIR/bin
  export VP_CACHE_DIR=$HOME/.cache/vite-plus
  curl -fsSL https://vite.plus | bash
  ```

#### `NPM_CONFIG_REGISTRY`

- **用途**：自定义 npm registry URL
- **默认值**：`https://registry.npmjs.org`
- **CLI 等价项**：`--registry`
- **受管包管理器**：当 Vite+ 下载固定版本的 npm、pnpm、Yarn 或 Bun 时，它也会读取工作区根目录与用户 `.npmrc`。包级 registry 以及 registry 级的 `_authToken`、`_auth` 或 `username`/`_password` 凭据都会生效。请将密钥保存在环境变量中，并在 `.npmrc` 中引用它们，例如：

  ```ini
  registry=https://npm.corp.example/repository/npm/
  //npm.corp.example/repository/npm/:_authToken=${NPM_TOKEN}
  ```

- **示例**：

  ```bash
  curl -fsSL https://vite.plus | NPM_CONFIG_REGISTRY=https://registry.npmmirror.com bash
  ```

#### `VP_NODE_MANAGER`

- **用途**：控制安装期间的 Node.js 版本管理器设置。
- **取值**：`yes` 或 `no`
- **默认值**：自动检测
- **CLI 等价项**：`--no-node-manager`（取反）
- **示例**：

  ```bash
  # 在 CI 中跳过 Node.js 管理器设置
  curl -fsSL https://vite.plus | VP_NODE_MANAGER=no bash
  ```

#### `VP_PM_MANAGER`

- **用途**：为全部四个包管理器系列设置管理偏好：npm、pnpm、Yarn 与 Bun。
- **取值**：`yes` 使用 Vite+ 管理；`no` 优先使用系统工具，在系统工具不可用时回退到受管工具。
- **默认值**：未设置。安装器对 Node.js 与包管理器的组合选择保持为默认。使用脚本安装器时，只设置 `VP_NODE_MANAGER` 会保留现有的包管理器偏好。

#### `VP_NPM_MANAGER` / `VP_PNPM_MANAGER` / `VP_YARN_MANAGER` / `VP_BUN_MANAGER`

- **用途**：为单个包管理器系列设置管理偏好。每个变量都会覆盖该系列对应的 `VP_PM_MANAGER`。
- **取值**：`yes` 或 `no`，含义与 `VP_PM_MANAGER` 相同。
- **默认值**：未设置（使用 `VP_PM_MANAGER`，然后使用安装器的组合选择，或保留现有偏好）。
- **示例**：

  ```bash
  # 保留系统 Node.js 与包管理器，但让 Vite+ 管理 pnpm。
  curl -fsSL https://vite.plus | VP_NODE_MANAGER=no VP_PM_MANAGER=no VP_PNPM_MANAGER=yes bash
  ```

这些管理变量是安装时的选择，会保存在 Vite+ 的配置中。交互式提示仍然同时控制 Node.js 与包管理器；显式设置的包管理器变量会覆盖该组合选择。独立的 `vp-setup` 安装器在交互式与静默安装中，都会把它现有的组合选项作为这两个变量的默认值。就地升级会保留已保存的选择。无法识别的值会被忽略。这些变量选择的是管理行为，而不是包管理器版本，也不会阻止安装器创建 shim。通过旧版安装器安装的旧版本会保留其原有行为。

#### `VP_PR_VERSION`

- **用途**：从拉取请求或提交 SHA 安装预览构建
- **取值**：PR 编号或提交 SHA
- **默认值**：无
- **详情**：[全局 `vp` 预览](/guide/upgrade)

#### 开发变量

在开发 Vite+ 本身时，请使用 `VP_LOCAL_TGZ` 与 `VP_LOCAL_BINARY`。`VP_LOCAL_TGZ` 指定本地的 `vite-plus.tgz` 文件，`VP_LOCAL_BINARY` 指定本地的 `vp` 二进制文件。安装器会使用这些文件进行本地构建。

### 运行时变量

这些变量用于配置已安装的 Vite+ CLI。上文介绍的 `VP_HOME` 在运行时同样适用。

#### `VP_NODE_DIST_MIRROR`

- **用途**：Node.js 分发镜像 URL
- **默认值**：`https://nodejs.org/dist`
- **详情**：[自定义 Node.js 镜像](/guide/env)

#### `VP_NODE_VERSION`

- **用途**：覆盖 Node.js 版本
- **默认值**：无（自动检测）
- **示例**：

  ```bash
  # 使用指定的 Node.js 版本运行命令
  VP_NODE_VERSION=22 vp env exec node -v
  ```

#### `VP_PACKAGE_MANAGER`

- **用途**：覆盖选定的包管理器与版本
- **默认值**：无（从项目或全局默认值解析）
- **格式**：`npm|pnpm|yarn|bun@<version>`
- **示例**：

  ```bash
  VP_PACKAGE_MANAGER=pnpm@10.18.0 vp install
  ```

#### `VP_NODE_SKIP_SIGNATURE_VERIFY`

- **用途**：跳过对 Node.js 下载的 PGP 签名校验
- **取值**：任意非空值
- **默认值**：无（启用校验）
- **详情**：[Node.js 签名校验](/guide/env)

#### `VP_DOWNLOAD_TIMEOUT`

- **用途**：大型下载（如 Node.js 运行时与包管理器 tarball）的单次请求超时，单位为秒
- **取值**：正整数，最大为 `86400`（24 小时）；无效值会被忽略并给出警告
- **默认值**：`600`（10 分钟）
- **示例**：

  ```bash
  # 在慢速连接下允许每次下载最多 30 分钟
  VP_DOWNLOAD_TIMEOUT=1800 vp env install 22
  ```

#### `VP_SHELL`

- **用途**：指定当前 shell
- **默认值**：自动检测
- **示例**：

  ```bash
  VP_SHELL=bash vp env print
  ```

#### `VP_BYPASS`

- **用途**：绕过 Vite+ shim，改用系统工具
- **取值**：设置该变量（包括设为空字符串）即可启用绕过模式。其值为一个 `PATH` 风格的列表，列出要从搜索中排除的额外目录。Vite+ 的 bin 目录与 Vite+ shim 会被自动跳过。
- **默认值**：未设置
- **示例**：

  ```bash
  # 在 PATH 上查找系统 Node.js，排除 /usr/local/bin。
  VP_BYPASS=/usr/local/bin node -v
  ```

#### 内部变量

Vite+ 在 shim 调度与 shell 集成过程中会设置额外的 `VP_*` 变量（递归保护、活动版本记录、包装器标志）；请勿手动设置它们。

### TLS/CA 配置

#### `SSL_CERT_FILE` / `NODE_EXTRA_CA_CERTS`

- **用途**：额外 CA 证书的 PEM 包路径（`NODE_EXTRA_CA_CERTS` 是 Node.js 的惯例）
- **默认值**：系统信任存储
- **示例**：

  ```bash
  export SSL_CERT_FILE=/path/to/custom-ca.pem
  ```

#### `VP_INSECURE_TLS`

- **用途**：禁用 HTTPS 证书校验
- **取值**：任意非空值（`1`、`true`、`yes`）
- **默认值**：无（启用校验）
- **警告**：仅作为诊断用的应急开关；请勿在生产环境中使用
- **示例**：

  ```bash
  VP_INSECURE_TLS=1 vp env install 22
  ```

### 日志与调试

#### `VP_LOG`

- **用途**：`tracing_subscriber` 的日志过滤字符串
- **默认值**：无
- **示例**：

  ```bash
  VP_LOG=debug vp dev
  VP_LOG=vt=trace vp build
  ```

#### `VP_DEBUG_SHIM`

- **用途**：为 shim 调度启用调试输出
- **取值**：任意非空值
- **默认值**：无
- **示例**：

  ```bash
  VP_DEBUG_SHIM=1 node -v
  ```

### 标准环境变量

Vite+ 还遵循以下标准环境变量：

#### Nushell 与 XDG 目录

如果你自定义了 `XDG_DATA_HOME` 或 `XDG_CONFIG_HOME`，请**在启动 Nushell 之前**通过终端应用、操作系统或父 shell 设置它们。这是 [Nushell 的启动要求](https://www.nushell.sh/book/configuration.html#changing-default-directories)；仅在 `config.nu` 或 `env.nu` 中设置，并不会配置当前会话的启动目录。

这些文件中的赋值仍会影响子进程。Vite+ 安装器会启动一个子 Nushell 来定位其 vendor autoload 目录，因此可能把 `vite-plus.nu` 写入普通新会话不会读取的目录。安装可能成功，但在这些会话中 `vp` 仍然不可用。

如果出现这种情况，请使用 `config nu` 打开 Nushell 配置，并添加一行 `source`，指向已安装的 Vite+ `env.nu` 文件。对于没有自定义 `XDG_CONFIG_HOME` 的默认全新 macOS 或 Linux 安装，请使用：

```nu
source ~/.config/vite-plus/env.nu
```

对于自定义的 `XDG_CONFIG_HOME`，请使用安装时解析得到的 `<XDG_CONFIG_HOME>/vite-plus/env.nu` 绝对路径。对于安装在 `VP_HOME` 下的情况，或现有的 `~/.vite-plus` 安装，请改用 `<VP_HOME>/env.nu` 或 `~/.vite-plus/env.nu`。请把占位符替换为实际路径，并为包含空格的路径加上引号。打开新的 Nushell 会话并运行 `vp help` 以验证配置。

#### `CI`

- **用途**：表示正在 CI 环境中运行
- **效果**：为安装器启用静默模式（`--yes`）

#### `NO_COLOR`

- **用途**：禁用彩色输出
- **效果**：禁用 ANSI 颜色代码

#### `HOME` / `USERPROFILE`

- **用途**：用户主目录
- **效果**：作为现有安装探测（`~/.vite-plus`）与分离式平台默认值的基础

### 优先级

1. CLI 标志（最高优先级）
2. 环境变量
3. 默认值（最低优先级）

例如，`VP_VERSION=1.0.0 vp-setup.exe --version 2.0.0` 会安装 2.0.0 版本。

### Homebrew

对于 Homebrew 安装，第一次运行 `vp` 命令会设置你的 shell、shim 与环境管理偏好。它复用 Homebrew 的二进制文件与随附的 JavaScript。设置过程会把完成状态保存在用户目录中，无需对 Homebrew 前缀拥有写权限。

后续命令会复用该设置，只要已安装的二进制文件保持不变。当 Homebrew 替换某个版本时，生成的 shim 会跟随 Homebrew 的公共 `vp` 入口。设置过程会在替换期间保留你已保存的管理偏好。

如果希望在首次运行时优先使用现有的 Node.js 与包管理器，请使用：

```bash
VP_NODE_MANAGER=no VP_PM_MANAGER=no vp help
```

设置完成后，可使用 `vp env off` 更改此偏好。需要缺失运行时或项目依赖的命令仍然可以下载它们。

使用 Homebrew 来[升级](/guide/upgrade)或[移除](/guide/implode)该包。

`vp env doctor` 会识别 Homebrew 安装及其二进制路径。它会分别检查 `vp` 命令与 `PATH` 上的用户 shim 目录。如果只缺少 shim 目录，请按照它给出的 shell 设置说明启用 shim。

## 不安装项目本地包也能使用

对于运行时、包管理器与任务运行器工作流，全局安装已经足够：

```bash
vp env pin lts       # 为当前项目固定并安装 Node.js
vp install           # 使用项目声明的包管理器
vp run build         # 运行 package.json 脚本或已配置的任务
vp dlx create-vite   # 下载并运行包二进制
```

运行现有的 `package.json` 脚本并不需要本地 `vite-plus` 依赖。如果你希望把前端工具链版本记录在项目的清单文件与锁文件中，请添加[项目本地 CLI](/guide/local-cli)。

## 在其他目录中运行命令

使用 `vp -C <dir> <command>` 可以从另一个工作目录运行任意 `vp` 命令。示例与细节请参阅[使用 `-C` 指定包](/guide/monorepo)。

## 同时使用两个 CLI

全局 CLI 与项目本地的 `vite-plus` 包可以协同工作。你始终使用同一个 `vp` 命令，而每个项目可以选择自己的工具链版本。

对于 `vp dev`、`vp build`、`vp test` 与 `vp run` 等开发命令，全局 CLI 会在可用时委托给项目安装的版本：

| 当前项目                 | `vp` 使用的工具链 |
| ------------------------ | ----------------- |
| 已在本地安装 `vite-plus` | 项目安装的工具链  |
| 未安装 `vite-plus`       | 全局安装的工具链  |

在 monorepo 中，本地安装可以在工作区根目录共享。你无需在每个包中单独安装 `vite-plus`。

例如，如果某个项目安装了 Vite+ 版本 A，而你的全局安装是版本 B，那么 `vp build` 会使用版本 A 的工具链。升级全局安装不会改变该项目已安装的工具链。

`vp install` 与 `vp add` 等包管理器命令使用全局 CLI。用于管理环境或全局安装的命令（如 `vp env`、`vp upgrade` 与 `vp implode`）也始终由全局 CLI 处理，与项目版本无关。

要查看当前项目选用了哪套工具链，请运行 `vp toolchain`。使用 `vp toolchain --global` 可检查全局安装。

## 后续步骤

- [环境管理](/guide/env)涵盖 Node.js 与包管理器的选择、固定、shim 与受管安装。
- [包管理](/guide/package-management)涵盖 pnpm、npm、Yarn 与 Bun 工作流。
- [运行任务](/guide/run)涵盖包脚本与带缓存的工作区任务。
- [升级 Vite+](/guide/upgrade)介绍全局 CLI 的升级。项目本地升级请参阅[更新 Vite+](/guide/upgrade-project)。
- [移除 Vite+](/guide/implode)移除全局二进制文件及其受管数据。

**平台支持**

预构建二进制文件针对以下平台分发：

- 使用 glibc 的 Linux x64 与 arm64
- Windows x64 与 arm64
- macOS x64 与 arm64
- 使用 musl 的 Linux x64 与 arm64

如果你的平台没有可用的预构建二进制文件，安装会失败并报错。在 Alpine Linux 上，使用受管的[非官方 Node.js 构建](https://unofficial-builds.nodejs.org/)之前，请安装 `libstdc++`：

```sh
apk add libstdc++
```
