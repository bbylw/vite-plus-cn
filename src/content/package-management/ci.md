# vp pm ci

使用冻结的锁文件安装依赖，适用于 CI。

```bash
vp pm ci
vp pm ci -- --ignore-scripts
```

## 选项

此命令没有额外的 Vite+ 选项。如需使用由 Vite+ 转换的选项，请使用 [`vp install --frozen-lockfile`](/guide/package-management/install)。

没有命令专属选项。

## 兼容性

- **npm：**`npm ci`。
- **pnpm：**`pnpm install --frozen-lockfile`。
- **Yarn Classic：**`yarn install --frozen-lockfile`。
- **Yarn Modern：**`yarn install --immutable`。
- **Bun：**`bun install --frozen-lockfile`。

安装清理与锁文件校验由原生包管理器决定。除了冻结锁文件这一要求外，此命令不会让所有包管理器都表现得像 `npm ci`。

## 原生选项

原生选项参见 [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)、[pnpm install](https://pnpm.io/cli/install)、[Yarn install](https://yarnpkg.com/cli/install)、[Yarn Classic install](https://classic.yarnpkg.com/en/docs/cli/install) 与 [Bun install](https://bun.com/docs/pm/cli/install)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。CI 环境配置参见 [CI 指南](/guide/ci)。
