# 打包库

`vp pack` 基于 [tsdown](https://tsdown.dev/) 构建库，用于 npm 发布，或打包成独立的应用二进制。

## 用法

```bash
vp pack                       # 默认读取 tsdown 配置 / tsconfig
vp pack src/index.ts --dts    # 构建入口并生成类型声明
vp pack --watch               # 监听模式
vp pack --exe                 # 打包为可执行文件
```

## 常用选项

| 选项                     | 说明                                  |
| ------------------------ | ------------------------------------- |
| `--dts`                  | 生成 `.d.ts` 类型声明                 |
| `--watch`                | 监听并重新构建                        |
| `--exe`                  | 打包为可执行文件                      |
| `--unbundle`             | 不打包（unbundle）模式                |
| `--format <fmt>`         | 输出格式（`esm` / `cjs` / `iife` 等） |
| `--platform <p>`         | 目标平台                              |
| `--tsconfig <tsconfig>`  | 设置 tsconfig 路径                    |
| `-W, --workspace [dir]`  | 启用工作区模式                        |
| `-F, --filter <pattern>` | 按名称/目录过滤配置                   |
| `-h, --help`             | 显示帮助                              |

## 配置

`vp pack` 读取项目中的 `tsdown.config.ts`，如下所示：

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
});
```

`:rocket:` 这样一条命令就能完成库的构建与类型声明输出，省去拼接打包器的繁琐。
