# vp pm cache

查看或清理包管理器的下载缓存或 store。它与[`vp cache`](/guide/cache)不同，后者管理的是任务结果。

```bash
vp pm cache dir
vp pm cache clean
```

## 选项

- `dir` 与 `path` 打印缓存或 store 的位置。
- `clean` 请求原生缓存清理。

其他子命令会发出警告并成功退出，不运行任何命令。没有额外的 Vite+ 选项。

### `dir`

打印缓存或 store 的位置。别名：`path`。没有命令专属选项。

### `clean`

请求原生缓存清理。没有命令专属选项。

## 兼容性

### `dir`

- **npm：** `npm config get cache`。
- **pnpm：** `pnpm store path`。
- **Yarn Classic：** `yarn cache dir`。
- **Yarn Modern：** `yarn config get cacheFolder`。
- **Bun：** `bun pm cache`。

### `clean`

- **npm：** `npm cache clean`。
- **pnpm：** `pnpm store prune`。修剪 store，而不是删除全部内容。
- **Yarn Classic：** `yarn cache clean`。
- **Yarn Modern：** `yarn cache clean`。
- **Bun：** `bun pm cache rm`。

npm 通常需要显式的原生 `--force` 才能删除缓存：

```bash
vp pm cache clean -- --force
```

该示例仅适用于 npm。Vite+ 不提供单独的 `vp pm store` 命令。

## 原生选项

原生选项参见 [npm config](https://docs.npmjs.com/cli/v11/commands/npm-config)、[npm cache](https://docs.npmjs.com/cli/v11/commands/npm-cache)、[pnpm store](https://pnpm.io/cli/store)、[Yarn config get](https://yarnpkg.com/cli/config/get)、[Yarn cache clean](https://yarnpkg.com/cli/cache/clean)、[Yarn Classic cache](https://classic.yarnpkg.com/en/docs/cli/cache) 与 [Bun pm cache](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
