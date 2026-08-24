# 任务编排

`vp run` 运行 `package.json` 脚本与 monorepo 任务，并带有**缓存**与**依赖感知调度**。

## 用法

```bash
vp run                        # 交互式选择任务（vp run 也可简写为 vpr）
vp run build                  # 运行名为 build 的脚本
vp run pkg#build             # 运行 pkg 包中的 build 脚本
vp run build --watch          # 向任务传递额外参数
```

## 筛选包

`vp run` 支持丰富的筛选器，在多包工作区中精确选择目标：

```bash
vp run --filter <pattern>      # 按包名筛选（如 foo、@scope/*）
vp run --filter ./<dir>        # 选取某目录下的包
vp run --filter <pattern>...   # 选中包及其依赖
vp run --filter ...<pattern>   # 选中包及其依赖者
vp run --filter !<pattern>     # 排除匹配的包
```

## 常用选项

| 选项                      | 说明                                                   |
| ------------------------- | ------------------------------------------------------ |
| `-r, --recursive`         | 选择工作区所有包                                       |
| `-t, --transitive`        | 选择当前包及其传递依赖                                 |
| `-w, --workspace-root`    | 选择工作区根包                                         |
| `--cache` / `--no-cache`  | 强制开启 / 关闭缓存                                    |
| `--log <MODE>`            | 输出模式：`interleaved`（默认）/ `labeled` / `grouped` |
| `--concurrency-limit <N>` | 最大并发任务数（默认 4）                               |
| `--parallel`              | 忽略依赖顺序并行运行                                   |
| `-v, --verbose`           | 执行后显示完整摘要                                     |

## 配置任务

在 `vite.config.ts` 的 `run.tasks` 中配置任务：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      'generate:icons': {
        command: 'node scripts/generate-icons.js',
        envs: ['ICON_THEME'],
      },
    },
  },
});
```

## 任务缓存

Vite Task 会缓存任务执行结果。在干净检出后再次运行相同任务时，命中的缓存会直接返回结果，省去重复劳动。使用 `vp cache clean` 清空缓存，用 `vp cache` 管理缓存。
