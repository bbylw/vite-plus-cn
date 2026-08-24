# 构建

`vp build` 使用 **Vite + Rolldown** 为生产环境构建应用。

## 用法

```bash
vp build                      # 生产构建
vp build --watch              # 监听模式，模块变化时重建
vp build --sourcemap          # 输出 source map
```

构建配置与标准 Vite 一致，可直接利用 `vite.config.ts` 中的所有 Vite 选项（包括插件与环境变量）。

## 常用选项

| 选项                           | 说明                                                             |
| ------------------------------ | ---------------------------------------------------------------- |
| `--target <target>`            | 编译目标（默认 `baseline-widely-available`）                     |
| `--outDir <dir>`               | 输出目录（默认 `dist`）                                          |
| `--assetsInlineLimit <number>` | 静态资源 base64 内联阈值（默认 4096）                            |
| `--ssr [entry]`                | 为服务端渲染构建指定入口                                         |
| `--sourcemap [output]`         | 输出 source map                                                  |
| `--minify [minifier]`          | 启用/停用压缩，或指定 `oxc` / `terser` / `esbuild`（默认 `oxc`） |
| `--manifest [name]`            | 输出构建清单 JSON                                                |
| `-w, --watch`                  | 模块变更时重建                                                   |
| `--emptyOutDir`                | 输出目录在 root 之外时强制清空                                   |

## 预览生产构建

```bash
vp preview                    # 本地预览
vp preview --port 4173
```

## 基于 Rolldown 的打包

`vp build` 使用 [Rolldown](https://rolldown.rs/) —— 一套用 Rust 编写的次世代打包器，与 Vite 架构深度集成，带来显著的速度与更小的体积。
