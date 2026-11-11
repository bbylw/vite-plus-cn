# 包管理

Vite+ 为 npm、pnpm、Yarn 与 Bun 提供统一的命令界面。`vp` 会检测工作区的包管理器，在需要时下载所选版本，并为它翻译命令与受支持的选项。

```bash
vp install
vp add react
vp add -D typescript
vp remove react
vp update
```

## 开始使用

- [包管理器选择](/guide/package-management/package-manager-selection)介绍检测、版本范围与包管理器 shim。
- [全局包](/guide/package-management/global-packages)介绍 Vite+ 独立的全局包存储。

## 命令

`vp add` 这类核心命令直接在 `vp` 下运行。转发命令使用 `vp pm` 把操作委托给所检测的包管理器，并像核心命令一样翻译命令与受支持的选项。`vp pm` 前缀让 `pack` 这类名称仍可供 Vite+ 命令使用。例如，`vp pm pack` 创建包 tarball，而 [`vp pack`](/guide/pack) 构建库。

## 原生参数

把原生参数放在 `--` 之后，即可不经翻译直接透传：

```bash
vp install -- --registry=https://registry.npmjs.org
```

## 核心命令

- [install](/guide/package-management/install)
- [add](/guide/package-management/add)
- [remove](/guide/package-management/remove)
- [update](/guide/package-management/update)
- [dedupe](/guide/package-management/dedupe)
- [outdated](/guide/package-management/outdated)
- [list](/guide/package-management/list)
- [why](/guide/package-management/why)
- [info](/guide/package-management/info)
- [link](/guide/package-management/link)
- [unlink](/guide/package-management/unlink)
- [rebuild](/guide/package-management/rebuild)
- [dlx](/guide/package-management/dlx)

## 转发命令

- **安装与清理**
  - [pm ci](/guide/package-management/ci)
  - [pm prune](/guide/package-management/prune)
- **查看与诊断**
  - [pm licenses](/guide/package-management/licenses)
  - [pm search](/guide/package-management/search)
  - [pm audit](/guide/package-management/audit)
  - [pm fund](/guide/package-management/fund)
  - [pm ping](/guide/package-management/ping)
- **本地开发**
  - [pm approve-builds](/guide/package-management/approve-builds)
  - [pm patch](/guide/package-management/patch)
  - [pm patch-commit](/guide/package-management/patch-commit)
- **发布**
  - [pm pack](/guide/package-management/pack)
  - [pm version](/guide/package-management/version)
  - [pm publish](/guide/package-management/publish)
  - [pm stage](/guide/package-management/stage)
  - [pm dist-tag](/guide/package-management/dist-tag)
  - [pm deprecate](/guide/package-management/deprecate)
- **Registry 与账户**
  - [pm login](/guide/package-management/login)
  - [pm logout](/guide/package-management/logout)
  - [pm whoami](/guide/package-management/whoami)
  - [pm token](/guide/package-management/token)
  - [pm owner](/guide/package-management/owner)
  - [pm team](/guide/package-management/team)
- **配置与维护**
  - [pm config](/guide/package-management/config)
  - [pm pkg](/guide/package-management/pkg)
  - [pm cache](/guide/package-management/cache)
