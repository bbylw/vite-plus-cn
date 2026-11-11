# vp pm publish

将包发布到 registry。支持的目标与预览选项取决于包管理器：

```bash
vp pm publish --dry-run
vp pm publish --access public --tag next
vp pm publish ./package.tgz
```

## 选项

| 选项                            | 说明                         | 备注                  |
| ------------------------------- | ---------------------------- | --------------------- |
| `--dry-run`                     | 预览而不实际发布。           |                       |
| `--tag <tag>`                   | 选择 dist-tag。              |                       |
| `--access <public\|restricted>` | 请求公开或受限的包访问权限。 |                       |
| `--otp <otp>`                   | 提供一次性密码。             |                       |
| `--no-git-checks`               | 跳过 git 检查。              |                       |
| `--publish-branch <branch>`     | 设置发布所用的分支名。       |                       |
| `--report-summary`              | 保存发布摘要。               |                       |
| `--provenance`                  | 携带 provenance 发布。       | 需要兼容的发布环境。  |
| `--force`                       | 请求原生强制发布。           |                       |
| `--json`                        | 请求原生 JSON 输出。         | 输出保留原生 schema。 |
| `-r, --recursive`               | 发布所有工作区包。           |                       |
| `--filter <pattern>`            | 按模式选择工作区。           | 可重复使用。          |

## 兼容性

- **npm：** `npm publish`。
- **pnpm：** `pnpm publish`。
- **Yarn Classic：** `yarn publish`。
- **Yarn Modern：** 对当前活动工作区使用 `yarn npm publish`。显式的 tarball 或文件夹目标会被拒绝。
- **Bun：** `bun publish`。

| 选项                            | npm               | pnpm                              | Yarn Classic      | Yarn Modern      | Bun | 备注 |
| ------------------------------- | ----------------- | --------------------------------- | ----------------- | ---------------- | --- | ---- |
| `--dry-run`                     | 5.10.0 或更高版本 | 是                                | 否                | 4.9.3 或更高版本 | 是  |      |
| `--tag <tag>`                   | 是                | 是                                | 是                | 是               | 是  |      |
| `--access <public\|restricted>` | 是                | 是                                | 是                | 是               | 是  |      |
| `--otp <otp>`                   | 是                | 是                                | 1.12.1 或更高版本 | 3.2.0 或更高版本 | 是  |      |
| `--no-git-checks`               | 否                | 是                                | 否                | 否               | 否  |      |
| `--publish-branch <branch>`     | 否                | 是                                | 否                | 否               | 否  |      |
| `--report-summary`              | 否                | 是                                | 否                | 否               | 否  |      |
| `--provenance`                  | 9.5.0 或更高版本  | 是                                | 否                | 4.9.0 或更高版本 | 否  |      |
| `--force`                       | 是                | 是                                | 否                | 否               | 否  |      |
| `--json`                        | 是                | 11.0.0 之前，或 11.0.7 及更高版本 | 是                | 4.9.3 或更高版本 | 否  |      |
| `-r, --recursive`               | 7.13.0 或更高版本 | 是                                | 否                | 否               | 否  |      |
| `--filter <pattern>`            | 7.13.0 或更高版本 | 是                                | 否                | 否               | 否  |      |

Yarn 发布使用 Yarn 的 registry 配置与凭据。不支持的目标与工作区选择会报错，而不会回退到 npm。原生发布失败不会通过 npm 重试。

Vite+ 会在原生发布命令运行之前拒绝不支持的选项。Yarn Classic 可能忽略 `--dry-run` 而真实发布，或接受 `--provenance` 却不生成 attestation。Vite+ 在 Yarn Classic 上会拒绝这两个选项。

`--` 之后的参数会直接传给原生命令，不经过这些检查。以这种方式传入不支持的安全选项，可能导致真实发布，或发布时不带 provenance。

若需要把 CI 上传与维护者批准分开的工作流，请使用 [stage](/guide/package-management/stage)。

## 原生选项

原生选项参见 [npm publish](https://docs.npmjs.com/cli/v11/commands/npm-publish)、[pnpm publish](https://pnpm.io/cli/publish)、[Yarn Classic publish](https://classic.yarnpkg.com/en/docs/cli/publish)、[Yarn npm publish](https://yarnpkg.com/cli/npm/publish) 与 [Bun publish](https://bun.com/docs/pm/cli/publish)。要通过 Vite+ 透传这些选项，参见[原生参数](/guide/package-management)。
