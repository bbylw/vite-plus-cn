# vp pm config

读写包管理器配置。别名：`vp pm c`。这不同于 `vp config`，后者用于配置项目工具。

```bash
vp pm config list
vp pm config get registry
vp pm config set registry https://registry.npmjs.org --location project
vp pm config delete registry --location project
```

配置键因包管理器而异。registry 示例使用的是 npm 或 pnpm 的键，而不是 Yarn 2 的配置键。

## 选项

- `list` 显示配置。
- `get <key>` 读取一个值。
- `set <key> <value>` 写入一个值。
- `delete <key>` 移除一个值。

这里的 `--global` 选择的是配置作用域，而不是 Vite+ 的全局包存储。

这些子命令不接受 `--` 之后的额外原生参数。

### `list`

| 选项                                 | 描述                 | 备注                |
| ------------------------------------ | -------------------- | ------------------- |
| `--json`                             | 请求原生 JSON 输出。 | 输出保留原生结构。  |
| `-g, --global`                       | 使用全局配置。       | 覆盖 `--location`。 |
| `--location <project\|user\|global>` | 选择配置作用域。     |                     |

### `get`

| 选项                                 | 描述                 | 备注                |
| ------------------------------------ | -------------------- | ------------------- |
| `--json`                             | 请求原生 JSON 输出。 | 输出保留原生结构。  |
| `-g, --global`                       | 使用全局配置。       | 覆盖 `--location`。 |
| `--location <project\|user\|global>` | 选择配置作用域。     |                     |

### `set`

| 选项                                 | 描述                 | 备注                |
| ------------------------------------ | -------------------- | ------------------- |
| `--json`                             | 请求原生 JSON 输出。 | 输出保留原生结构。  |
| `-g, --global`                       | 使用全局配置。       | 覆盖 `--location`。 |
| `--location <project\|user\|global>` | 选择配置作用域。     |                     |

### `delete`

| 选项                                 | 描述             | 备注                |
| ------------------------------------ | ---------------- | ------------------- |
| `-g, --global`                       | 使用全局配置。   | 覆盖 `--location`。 |
| `--location <project\|user\|global>` | 选择配置作用域。 |                     |

## 兼容性

### `list`

- **npm：**`npm config list`。
- **pnpm：**`pnpm config list`。
- **Yarn Classic：**`yarn config list`。
- **Yarn Modern：**`yarn config`。
- **Bun：**回退：`npm config list`。使用 npm 配置，而不是 `bunfig.toml`。

| 选项                                 | npm                   | pnpm                  | Yarn Classic | Yarn Modern           | Bun                   | 备注                     |
| ------------------------------------ | --------------------- | --------------------- | ------------ | --------------------- | --------------------- | ------------------------ |
| `--json`                             | 是                    | 是                    | 是           | 是                    | 是                    |                          |
| `-g, --global`                       | 是                    | 是                    | 是           | 是                    | 是                    |                          |
| `--location <project\|user\|global>` | project, user, global | project, user, global | user, global | project, user, global | project, user, global | 读取仍使用合并后的配置。 |

### `get`

- **npm：**`npm config get`。
- **pnpm：**`pnpm config get`。
- **Yarn Classic：**`yarn config get`。
- **Yarn Modern：**`yarn config get`。
- **Bun：**回退：`npm config get`。使用 npm 配置，而不是 `bunfig.toml`。

| 选项                                 | npm                   | pnpm                  | Yarn Classic | Yarn Modern           | Bun                   | 备注                     |
| ------------------------------------ | --------------------- | --------------------- | ------------ | --------------------- | --------------------- | ------------------------ |
| `--json`                             | 是                    | 是                    | 是           | 是                    | 是                    |                          |
| `-g, --global`                       | 是                    | 是                    | 是           | 是                    | 是                    |                          |
| `--location <project\|user\|global>` | project, user, global | project, user, global | user, global | project, user, global | project, user, global | 读取仍使用合并后的配置。 |

### `set`

- **npm：**`npm config set`。
- **pnpm：**`pnpm config set`。
- **Yarn Classic：**`yarn config set`。
- **Yarn Modern：**`yarn config set`。
- **Bun：**回退：`npm config set`。使用 npm 配置，而不是 `bunfig.toml`。

| 选项                                 | npm                   | pnpm                  | Yarn Classic | Yarn Modern           | Bun                   | 备注 |
| ------------------------------------ | --------------------- | --------------------- | ------------ | --------------------- | --------------------- | ---- |
| `--json`                             | 是                    | 是                    | 是           | 是                    | 是                    |      |
| `-g, --global`                       | 是                    | 是                    | 是           | 是                    | 是                    |      |
| `--location <project\|user\|global>` | project, user, global | project, user, global | user, global | project, user, global | project, user, global |      |

### `delete`

- **npm：**`npm config delete`。
- **pnpm：**`pnpm config delete`。
- **Yarn Classic：**`yarn config delete`。
- **Yarn Modern：**`yarn config unset`。
- **Bun：**回退：`npm config delete`。使用 npm 配置，而不是 `bunfig.toml`。

| 选项                                 | npm                   | pnpm                  | Yarn Classic | Yarn Modern           | Bun                   | 备注 |
| ------------------------------------ | --------------------- | --------------------- | ------------ | --------------------- | --------------------- | ---- |
| `-g, --global`                       | 是                    | 是                    | 是           | 是                    | 是                    |      |
| `--location <project\|user\|global>` | project, user, global | project, user, global | user, global | project, user, global | project, user, global |      |

Yarn Classic 在 user 作用域的写入使用原生默认值。

## 原生选项

原生选项参见 [npm config](https://docs.npmjs.com/cli/v11/commands/npm-config)、[pnpm config](https://pnpm.io/cli/config)、[Yarn config](https://yarnpkg.com/cli/config)、[Yarn config get](https://yarnpkg.com/cli/config/get)、[Yarn config set](https://yarnpkg.com/cli/config/set)、[Yarn config unset](https://yarnpkg.com/cli/config/unset) 与 [Yarn Classic config](https://classic.yarnpkg.com/en/docs/cli/config)。此接口之外的原生选项需要直接使用原生命令。

`bunfig.toml` 设置参见 [Bun 配置](https://bun.com/docs/runtime/bunfig)。
