# CI / 持续集成

Vite+ 开箱即用地支持 CI。在 GitHub Actions 中，使用官方 [setup-vp](https://github.com/voidzero-dev/setup-vp) Action 安装 Vite+ 即可。

## GitHub Actions

```yaml
- uses: voidzero-dev/setup-vp@<setup-vp-version>
  with:
    node-version: '22'
    cache: true
```

把 `<setup-vp-version>` 替换为 [setup-vp 发布页](https://github.com/voidzero-dev/setup-vp/releases) 中的确切实例版本（或 commit SHA）。**不要使用 `v1` 标签**，它已不再更新。

一个完整的工作流示例：

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: voidzero-dev/setup-vp@<setup-vp-version>
        with:
          node-version: '22'
          cache: true
      - run: vp install
      - run: vp check
      - run: vp test
      - run: vp build
```

## 自动版本更新

配置 [Dependabot](https://docs.github.com/code-security/dependabot/working-with-dependabot/keeping-your-dependencies-updated-automatically) 或 [Renovate](https://docs.renovatebot.com/) 可以自动更新 Vite+ 及其依赖。把 `setup-vp` 的版本更新纳入这些工具即可。

## 无交互运行

在 CI 中，`vp create` 可以通过 `--no-interactive` 运行；需要批准依赖构建脚本时使用 `--approve-builds`，从而在非交互环境下产出可直接使用的项目。

## 环境变量

- `VP_NODE_DIST_MIRROR` —— 使用自定义 Node.js 分发镜像
- `VP_NODE_SKIP_SIGNATURE_VERIFY` —— 临时跳过 PGP 签名校验（仍会校验 SHA-256）
- `VP_HOME` —— 把所有类别放在一个自定义根目录下

## 缓存

`vp cache clean` 用于清理任务缓存；设置 `cache: true` 让 Action 自动缓存依赖，加速后续构建。
