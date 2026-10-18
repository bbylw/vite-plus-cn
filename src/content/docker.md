# Docker

Vite+ 发布了一个预装 `vp` CLI 的官方 Docker 镜像：

```bash
ghcr.io/voidzero-dev/vite-plus
```

将其用于构建、CI 和开发容器。它不打算作为生产运行时镜像。

`vp` 会从你的项目（`.node-version`、`devEngines.runtime` 或 `engines.node`）解析 Node.js 版本，并在安装/构建期间下载该确切版本。这意味着镜像不需要特定于 Node 版本的标签。

对于生产环境，请使用多阶段构建：用 Vite+ 镜像构建应用，然后仅将解析后的 Node.js 二进制、构建产物和生产依赖复制到更小的运行时镜像中。

## 镜像标签

标签跟踪 `vp` 版本：

| 标签                                                     | 含义       |
| -------------------------------------------------------- | ---------- |
| `ghcr.io/voidzero-dev/vite-plus:latest`                  | 最新发行版 |
| `ghcr.io/voidzero-dev/vite-plus:<major>`                 | 最新主版本 |
| `ghcr.io/voidzero-dev/vite-plus:<major>.<minor>`         | 最新次版本 |
| `ghcr.io/voidzero-dev/vite-plus:<major>.<minor>.<patch>` | 确切版本   |

示例使用 `:latest` 跟踪最新发行版；如果需要可复现构建，请固定确切标签或摘要。镜像发布用于 `linux/amd64` 和 `linux/arm64`，默认以非 root 的 `vp` 用户运行。该用户拥有免密码 `sudo`，因此需要 root 的构建/CI 步骤（额外 apt 包、`playwright install --with-deps`）无需更改镜像用户即可工作。

在 [GitHub 包页面](https://github.com/voidzero-dev/vite-plus/pkgs/container/vite-plus)浏览所有已发布的版本和摘要。

## 生产环境：SSR / Node.js 服务端应用

对于在生产环境中运行 Node.js 的应用（SvelteKit、Nuxt、自定义 Vite SSR 服务器等），请使用工具链镜像构建，然后将解析后的 Node.js 和构建后的应用复制到精简的运行时阶段：

```dockerfile [Dockerfile]
# syntax=docker/dockerfile:1

# --- 构建阶段：官方 Vite+ 工具链镜像 ---
FROM ghcr.io/voidzero-dev/vite-plus:latest AS build
WORKDIR /app

# 先安装依赖，以便该层在源代码更改时仍可缓存。
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version* ./
RUN vp install --frozen-lockfile

# 构建。vp 会读取 .node-version 并自动准备该确切版本的 Node.js。
COPY --chown=vp:vp . .
RUN vp build

# 为运行时阶段导出解析后的确切 Node.js 二进制。
RUN cp "$(vp env which node | head -1)" /tmp/node

# --- 依赖阶段：仅生产依赖 ---
# 单独进行一次全新的 `--prod` 安装，以排除 devDependencies（包括 vite-plus
# 工具链）。在上方完整安装之上运行 `--prod` 不会裁剪已安装的 devDependencies。
FROM ghcr.io/voidzero-dev/vite-plus:latest AS deps
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version* ./
RUN vp install --frozen-lockfile --prod

# --- 运行时阶段：小巧、glibc、不含 vp ---
FROM debian:bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# 来自 .node-version 的确切 Node.js（官方、经过签名验证的构建）。
COPY --from=build /tmp/node /usr/local/bin/node

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

USER nobody
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

部署的镜像仅包含 Node.js 以及你的应用和生产依赖，并与 `.node-version` 完全匹配。它比默认的 `node:*` 镜像小得多；最小结果请参阅下方的 distroless 提示。

> [!WARNING]
> **在单独阶段裁剪生产依赖**
>
> 如所示，在各自的 `deps` 阶段安装生产依赖。在同一阶段中，先执行完整的 `vp install` 再运行 `vp install --prod` 不会移除已安装的 devDependencies，因此 `vite-plus` 工具链会被复制到运行时镜像中。如果你的服务器包完全自包含（没有未打包的运行时依赖），可以完全跳过复制 `node_modules`。

> [!TIP]
> **进一步缩小**
>
> 对于无 shell、最小 CVE 的运行时，请将运行时基础镜像替换为 distroless（`gcr.io/distroless/cc`），并保留向量形式的 `ENTRYPOINT`。它基于 glibc，因此复制的 Node.js 二进制仍然兼容。

## 生产环境：静态 SPA / SSG

静态站点在运行时不需要 Node.js；用任何静态服务器提供构建输出即可：

```dockerfile [Dockerfile]
FROM ghcr.io/voidzero-dev/vite-plus:latest AS build
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version* ./
RUN vp install --frozen-lockfile
COPY --chown=vp:vp . .
RUN vp build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
```

## 持续集成

在基于容器的 CI（GitLab CI、Buildkite、CircleCI、Jenkins 等）中直接使用该镜像：

```yaml [.gitlab-ci.yml]
build:
  image: ghcr.io/voidzero-dev/vite-plus:latest
  script:
    - vp install --frozen-lockfile
    - vp check
    - vp test
    - vp build
```

在 GitHub Actions 上，优先使用 [`setup-vp`](/guide/ci) 而不是镜像。

## 浏览器模式测试（Vitest / Playwright）

以非 root 的 `vp` 用户运行正是浏览器所需：Chromium 会保留其沙箱（以 root 运行浏览器会禁用它）。在作业中安装浏览器及其系统库。`playwright install --with-deps` 需要 root 来 `apt-get install` 这些库。`vp` 用户拥有免密码 `sudo`，因此 Playwright 会使用它安装这些库，而无需更改镜像用户：

```yaml [.gitlab-ci.yml]
test:
  image: ghcr.io/voidzero-dev/vite-plus:latest
  script:
    - vp install --frozen-lockfile
    - vp exec playwright install --with-deps chromium
    - vp test
```

`vp exec` 运行项目自己的 Playwright（来自你的锁文件），因此它会安装测试所期望的浏览器修订版。优先使用它而不是 `vpx playwright install`，后者会下载最新的 Playwright，并可能获取不同的浏览器修订版。

如果要将浏览器及其库烘焙到派生镜像中，而不是每次运行都安装，请先安装项目依赖，使烘焙的浏览器与锁文件匹配，然后使用项目的 Playwright 安装（可通过 `sudo` 获得 root）：

```dockerfile [Dockerfile]
FROM ghcr.io/voidzero-dev/vite-plus:latest
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version* ./
RUN vp install --frozen-lockfile
RUN vp exec playwright install --with-deps chromium
```

如果 Chromium 在 CI 中高负载下崩溃，请使用 `--ipc=host` 为容器提供更多共享内存；请参阅 [Playwright Docker 文档](https://playwright.dev/docs/docker)。

## 开发容器

将镜像用作预装工具链的即用型开发容器：

```jsonc [.devcontainer/devcontainer.json]
{
  "image": "ghcr.io/voidzero-dev/vite-plus:latest",
}
```

## 临时使用

无需在机器上安装 vp，即可对项目运行任何 `vp` 命令：

```bash
docker run --rm -it -v "$PWD:/app" -w /app ghcr.io/voidzero-dev/vite-plus vp build
```

## 说明

- **Node.js 版本**：在构建时从 `.node-version`、`engines.node` 或 `devEngines.runtime` 提供，因此没有特定于 Node.js 的镜像标签。依赖 `COPY` 使用 `.node-version*` 通配符，因此该文件是可选的：通过 `engines.node`/`devEngines.runtime` 固定的项目不需要 `.node-version`，而使用它的项目在每个阶段都能获得该文件。
- **非 root 用户**：镜像以非 root 的 `vp` 用户运行，因此请如所示使用 `COPY --chown=vp:vp ...` 复制源代码。否则，`COPY` 会写入 root 拥有的文件，`vp install` 无法更新它们（权限被拒绝）。`vp` 用户拥有免密码 `sudo`，用于偶尔需要 root 的步骤（安装额外 apt 包或 `playwright install --with-deps`），因此你很少需要切换镜像用户。生产运行时阶段是独立的、不含 vp 的基础镜像，因此这种便利不会延伸到部署的镜像中。
- **原生插件**：镜像包含 C/C++ 构建工具链（`build-essential`、`python3`），因此诸如 `better-sqlite3` 的原生依赖会在 `vp install` 期间编译。
- **glibc**：镜像基于 glibc，因此使用官方的、经过签名验证的 Node.js 构建。
- **自定义基础镜像**：要将 `vp` 添加到自己的基础镜像，请运行安装程序：`curl -fsSL https://vite.plus | bash`（设置 `VP_VERSION` 以固定版本）。
