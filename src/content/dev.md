# 开发服务器

`vp dev` 启动由 **Vite** 驱动的快速原生 ESM 开发服务器，自带即时热更新（HMR）。

## 用法

```bash
vp dev                  # 启动开发服务器
vp dev --open           # 启动时自动打开浏览器
vp dev --host localhost --port 5173
```

该命令会读取项目根目录下的 `vite.config.ts`，并兼容所有标准的 Vite 配置选项，因此已有的 Vite 项目几乎无需改动即可运行。

## 常用选项

| 选项                     | 说明                                 |
| ------------------------ | ------------------------------------ |
| `--host <host>`          | 指定主机名                           |
| `--port <port>`          | 指定端口                             |
| `--open [path]`          | 启动时打开浏览器                     |
| `--strictPort`           | 若端口被占用则直接退出               |
| `--force`                | 让优化器忽略缓存并重新打包           |
| `--mode <mode>`          | 设置环境模式                         |
| `-l, --logLevel <level>` | `info` / `warn` / `error` / `silent` |
| `-m, --mode <mode>`      | 设置环境模式                         |

::: info
Vite+ 内置了大量预定义命令，`vp dev` 内置且不可更改。若要运行 `package.json` 脚本，请使用 `vp run <command>`。
:::

## 在受管的运行时下运行

结合 [`vp env`](/guide/env) 使用，Vite+ 会为当前项目挑选正确的 Node.js 版本，然后启动开发服务器。你只需要：

```bash
vp env pin lts
vp dev
```
