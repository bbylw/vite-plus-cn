# 全局包

全局包操作需要[全局 CLI](/guide/global-cli)。使用 `-g` 管理独立于项目依赖的工具：

```bash
vp install -g typescript
vp install -g --node 22 typescript
vp uninstall -g typescript
vp update -g
vp list -g
vp outdated -g
```

## 存储与 Node.js

Vite+ 把全局包存储在解析得到的数据目录下的 `packages/` 中，而不是底层包管理器的全局安装目录。

未指定 `--node` 时，全局安装使用为当前目录解析的 Node.js 版本，因此项目的固定版本优先于 `vp env default`。参见 [Node.js 选择](/guide/env)。

`vp link` 使用原生包管理器链接。它不会修改 Vite+ 的全局包存储，这些链接也不会出现在 `vp list -g` 中。

## 更新包

更新会保留安装时记录的版本 spec。通过 `some-pkg@nightly` 安装的包会更新到该 tag 的最新版本，版本范围则仍停留在该范围内。

```bash
vp update -g some-pkg
vp update -g some-pkg@latest
vp update -g --latest
```

使用 `--latest` 后，后续更新会跟随 latest tag，而不是原来的 tag 或版本范围。
