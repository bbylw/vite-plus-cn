# vp pm dist-tag

管理把 `my-package@next` 这类包名映射到某个已发布版本的 tag。

```bash
vp pm dist-tag list my-package
vp pm dist-tag add my-package@2.0.0 next
vp pm dist-tag rm my-package next
```

## 选项

- `list [package]` 列出 tag。别名：`ls`。
- `add <package@version> <tag>` 分配一个 tag。
- `rm <package> <tag>` 移除一个 tag。

这些子命令没有额外的 Vite+ 选项，也不接受原生透传参数。修改 tag 会改变今后安装该 tag 时解析到的版本；它不会删除已发布的版本。

### `list`

没有命令专属选项。

### `add`

没有命令专属选项。

### `rm`

没有命令专属选项。

## 兼容性

### `list`

- **npm：** `npm dist-tag list`。
- **pnpm：** 11 或更高版本：`pnpm dist-tag list`。更早的版本回退到 `npm dist-tag list`。
- **Yarn Classic：** `yarn tag list`。
- **Yarn Modern：** `yarn npm tag list`。
- **Bun：** 回退：`npm dist-tag list`。

### `add`

- **npm：** `npm dist-tag add`。
- **pnpm：** 11 或更高版本：`pnpm dist-tag add`。更早的版本回退到 `npm dist-tag add`。
- **Yarn Classic：** `yarn tag add`。
- **Yarn Modern：** `yarn npm tag add`。
- **Bun：** 回退：`npm dist-tag add`。

### `rm`

- **npm：** `npm dist-tag rm`。
- **pnpm：** 11 或更高版本：`pnpm dist-tag rm`。更早的版本回退到 `npm dist-tag rm`。
- **Yarn Classic：** `yarn tag rm`。
- **Yarn Modern：** `yarn npm tag rm`。
- **Bun：** 回退：`npm dist-tag rm`。

在原生 pnpm 路径上，Vite+ 不会为 `list` 补全缺失的包名，不会为 `add` 解析版本范围，也不会绕过移除 `latest` 的限制。pnpm 会校验这些请求并返回它自己的错误。

## 原生选项

原生选项参见 [npm dist-tag](https://docs.npmjs.com/cli/v11/commands/npm-dist-tag)、[pnpm dist-tag](https://pnpm.io/cli/dist-tag)、[Yarn npm tag list](https://yarnpkg.com/cli/npm/tag/list)、[Yarn npm tag add](https://yarnpkg.com/cli/npm/tag/add)、[Yarn npm tag remove](https://yarnpkg.com/cli/npm/tag/remove) 与 [Yarn Classic tag](https://classic.yarnpkg.com/en/docs/cli/tag)。上游命令可能提供此 Vite+ 接口不接受的额外选项。
