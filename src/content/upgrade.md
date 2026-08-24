# 升级与维护

Vite+ 提供一组维护命令，用于查看工具链、升级自身，以及在需要时彻底移除。

## 查看工具链

`vp toolchain` 显示当前活跃 Vite+ 工具链中 Vite+、Vite、Rolldown、Oxc 及其他工具的版本及其关系：

```bash
vp toolchain
```

## 升级 `vp`

```bash
vp upgrade
```

使用 `vite-plus` 本地包的项目在升级全局 `vp` 后，通常也会升级项目内的版本。保持两者同步可获得一致的体验。

## 移除 `vp`

如果确定不再使用 Vite+：

```bash
vp implode
```

这会移除 `vp` 与所有相关的 Vite+ 数据。如果你只是不想让 Vite+ 管理 Node.js 运行时，可以改用更轻量的方式：

```bash
vp env off
```

## 版本与安装位置

- 预构建二进制面向主流平台发布（Linux/Windows/macOS 的 x64 与 arm64）。
- 数据与可执行文件存储在：Unix 下 `~/.local/share/vite-plus`，Windows 下 `%LOCALAPPDATA%\vite-plus`。
- `VP_HOME` 可把所有类别放到一个自定义根目录。

## 反馈

Vite+ 始终欢迎社区反馈与贡献。如果有任何问题或想法，欢迎加入 [Discord](https://discord.gg/cAnsqHh5PX) 讨论，或查看[贡献指南](https://github.com/voidzero-dev/vite-plus/blob/main/CONTRIBUTING.md)。
