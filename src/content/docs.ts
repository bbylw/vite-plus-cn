import why from './why.md?raw';
import gettingStarted from './getting-started.md?raw';
import globalCli from './global-cli.md?raw';
import localCli from './local-cli.md?raw';
import cli from './cli.md?raw';
import env from './env.md?raw';
import packageManagement from './package-management.md?raw';
import dev from './dev.md?raw';
import check from './check.md?raw';
import lint from './lint.md?raw';
import fmt from './fmt.md?raw';
import test from './test.md?raw';
import run from './run.md?raw';
import build from './build.md?raw';
import pack from './pack.md?raw';
import create from './create.md?raw';
import migrate from './migrate.md?raw';
import migrateRules from './migrate-rules.md?raw';
import vitestV5 from './vitest-v5.md?raw';
import upgradeProject from './upgrade-project.md?raw';
import monorepo from './monorepo.md?raw';
import ci from './ci.md?raw';
import cache from './cache.md?raw';
import automaticDataTracking from './automatic-data-tracking.md?raw';
import githubActionsCache from './github-actions-cache.md?raw';
import vpx from './vpx.md?raw';
import commitHooks from './commit-hooks.md?raw';
import ideIntegration from './ide-integration.md?raw';
import docker from './docker.md?raw';
import troubleshooting from './troubleshooting.md?raw';
import upgrade from './upgrade.md?raw';
import implode from './implode.md?raw';
import resources from './resources.md?raw';
import configIndex from './config/index.md?raw';
import configCreate from './config/create.md?raw';
import configRun from './config/run.md?raw';
import configFmt from './config/fmt.md?raw';
import configLint from './config/lint.md?raw';
import configCheck from './config/check.md?raw';
import configTest from './config/test.md?raw';
import configBuild from './config/build.md?raw';
import configPack from './config/pack.md?raw';
import configStaged from './config/staged.md?raw';

export interface DocMeta {
  /** 页面标题 */
  title: string;
  /** 一句话描述，用于导航与 SEO */
  description: string;
  /** Markdown 正文 */
  markdown: string;
  /** 所属分组 id */
  group: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: { path: string; label: string }[];
}

/** 路由路径 -> 文档元数据（不含首页，首页单独处理） */
export const docs: Record<string, DocMeta> = {
  '/guide/getting-started': {
    title: '快速上手',
    description: '安装 vp、创建项目并运行核心命令。',
    markdown: gettingStarted,
    group: 'start',
  },
  '/guide/global-cli': {
    title: '全局 CLI',
    description: '独立安装的 vp 二进制，跨项目管理运行时、包管理器与工具链。',
    markdown: globalCli,
    group: 'start',
  },
  '/guide/local-cli': {
    title: '项目本地 CLI',
    description: '把 vite-plus 安装为项目依赖，按项目锁定工具链版本。',
    markdown: localCli,
    group: 'start',
  },
  '/guide/why': {
    title: '为什么选择 Vite+？',
    description: '统一工具链解决 JavaScript 生态的碎片化与性能瓶颈。',
    markdown: why,
    group: 'start',
  },
  '/guide/create': {
    title: '创建项目',
    description: 'vp create 搭建项目、monorepo 与应用。',
    markdown: create,
    group: 'setup',
  },
  '/guide/migrate': {
    title: '迁移到 Vite+',
    description: 'vp migrate 一键迁移到 Vite+。',
    markdown: migrate,
    group: 'setup',
  },
  '/guide/migrate-rules': {
    title: '迁移规则',
    description: 'vp migrate 对配置文件、依赖与脚本所做的具体改动。',
    markdown: migrateRules,
    group: 'setup',
  },
  '/guide/vitest-v5': {
    title: '升级到 Vitest 5',
    description: '从 Vitest 4 升级到 Vitest 5 的兼容性变化与迁移步骤。',
    markdown: vitestV5,
    group: 'setup',
  },
  '/guide/upgrade-project': {
    title: '更新项目中的 Vite+',
    description: '安全地升级项目内安装的 vite-plus 与配套工具链。',
    markdown: upgradeProject,
    group: 'setup',
  },
  '/guide/package-management': {
    title: '包管理',
    description: 'vp 自动包装 pnpm/npm/Yarn/Bun 的依赖命令。',
    markdown: packageManagement,
    group: 'setup',
  },
  '/guide/check': {
    title: '检查（vp check）',
    description: 'vp check 一键完成格式化、代码检查与类型检查。',
    markdown: check,
    group: 'toolchain',
  },
  '/guide/lint': {
    title: '代码检查（Lint）',
    description: '使用 Oxlint 运行代码检查与类型感知规则。',
    markdown: lint,
    group: 'toolchain',
  },
  '/guide/fmt': {
    title: '代码格式化（Format）',
    description: '使用 Oxfmt 按统一规则格式化代码。',
    markdown: fmt,
    group: 'toolchain',
  },
  '/guide/test': {
    title: '测试',
    description: '通过内置 Vitest 运行测试。',
    markdown: test,
    group: 'toolchain',
  },
  '/guide/dev': {
    title: '开发服务器',
    description: '由 Vite 驱动的快速原生 ESM 开发服务器与 HMR。',
    markdown: dev,
    group: 'toolchain',
  },
  '/guide/build': {
    title: '构建',
    description: '使用 Vite + Rolldown 进行生产构建。',
    markdown: build,
    group: 'toolchain',
  },
  '/guide/pack': {
    title: '打包库',
    description: '通过 tsdown 构建库与独立可执行文件。',
    markdown: pack,
    group: 'toolchain',
  },
  '/guide/run': {
    title: '任务编排',
    description: '运行脚本与 monorepo 任务，带缓存与依赖感知调度。',
    markdown: run,
    group: 'toolchain',
  },
  '/guide/cache': {
    title: '任务缓存',
    description: '复用任务结果，加速干净检出与 CI。',
    markdown: cache,
    group: 'toolchain',
  },
  '/guide/automatic-data-tracking': {
    title: '自动数据追踪',
    description: '自动追踪任务的文件依赖与环境输入，提升缓存命中率。',
    markdown: automaticDataTracking,
    group: 'toolchain',
  },
  '/guide/github-actions-cache': {
    title: 'GitHub Actions 缓存',
    description: '在 GitHub Actions 中持久化并复用 Vite Task 缓存。',
    markdown: githubActionsCache,
    group: 'toolchain',
  },
  '/guide/vpx': {
    title: '运行二进制',
    description: '用 vp exec、vp dlx 与 vpx 运行本地或远程包二进制。',
    markdown: vpx,
    group: 'toolchain',
  },
  '/guide/commit-hooks': {
    title: '提交钩子',
    description: '用 vp config、vp hooks 与 vp staged 管理工作流。',
    markdown: commitHooks,
    group: 'toolchain',
  },
  '/guide/monorepo': {
    title: 'Monorepo',
    description: '在单个工具链下管理多包仓库。',
    markdown: monorepo,
    group: 'toolchain',
  },
  '/guide/env': {
    title: '环境管理',
    description: 'vp env 管理 Node.js 与包管理器（全局与按项目）。',
    markdown: env,
    group: 'global-cli',
  },
  '/guide/upgrade': {
    title: '升级 Vite+',
    description: '升级全局 vp 安装并保持工具链同步。',
    markdown: upgrade,
    group: 'global-cli',
  },
  '/guide/implode': {
    title: '移除 Vite+',
    description: '从机器上彻底移除 vp 与相关数据。',
    markdown: implode,
    group: 'global-cli',
  },
  '/guide/ide-integration': {
    title: 'IDE 集成',
    description: '在 VS Code、JetBrains 等编辑器中配置 Vite+。',
    markdown: ideIntegration,
    group: 'workflow',
  },
  '/guide/ci': {
    title: 'CI / 持续集成',
    description: '在 GitHub Actions 等 CI 中集成 Vite+。',
    markdown: ci,
    group: 'workflow',
  },
  '/guide/docker': {
    title: 'Docker',
    description: '在 Docker 镜像中安装并使用 Vite+。',
    markdown: docker,
    group: 'workflow',
  },
  '/config': {
    title: '配置概览',
    description: '用单个 vite.config.ts 配置一切。',
    markdown: configIndex,
    group: 'config',
  },
  '/config/create': {
    title: 'create 配置',
    description: 'create 配置项参考。',
    markdown: configCreate,
    group: 'config',
  },
  '/config/run': {
    title: 'run 配置',
    description: 'Vite Task 任务、缓存与工作流配置参考。',
    markdown: configRun,
    group: 'config',
  },
  '/config/fmt': {
    title: 'fmt 配置',
    description: 'Oxfmt 配置项参考。',
    markdown: configFmt,
    group: 'config',
  },
  '/config/lint': {
    title: 'lint 配置',
    description: 'Oxlint 配置项参考。',
    markdown: configLint,
    group: 'config',
  },
  '/config/check': {
    title: 'check 配置',
    description: 'check 配置项参考。',
    markdown: configCheck,
    group: 'config',
  },
  '/config/test': {
    title: 'test 配置',
    description: 'Vitest 配置项参考。',
    markdown: configTest,
    group: 'config',
  },
  '/config/build': {
    title: 'build 配置',
    description: 'Vite 构建配置项参考。',
    markdown: configBuild,
    group: 'config',
  },
  '/config/pack': {
    title: 'pack 配置',
    description: 'tsdown 打包配置项参考。',
    markdown: configPack,
    group: 'config',
  },
  '/config/staged': {
    title: 'staged 配置',
    description: '暂存文件钩子配置参考。',
    markdown: configStaged,
    group: 'config',
  },
  '/guide/cli': {
    title: '命令行参考',
    description: 'vp 的完整命令、别名与常用选项。',
    markdown: cli,
    group: 'reference',
  },
  '/guide/troubleshooting': {
    title: '故障排查',
    description: '常见命令、配置与集成问题及解决办法。',
    markdown: troubleshooting,
    group: 'reference',
  },
  '/resources': {
    title: '资源与社区',
    description: '官方链接、核心组件与赞助。',
    markdown: resources,
    group: 'reference',
  },
};

/** 旧路径别名 -> 新路径 */
export const legacyRedirects: Record<string, string> = {
  '/guide/install': '/guide/package-management',
  '/guide/config': '/config',
};

/** 侧边栏分组顺序与标签 */
export const navGroups: NavGroup[] = [
  {
    id: 'start',
    label: '开始',
    items: [
      { path: '/guide/getting-started', label: '快速上手' },
      { path: '/guide/global-cli', label: '全局 CLI' },
      { path: '/guide/local-cli', label: '项目本地 CLI' },
      { path: '/guide/why', label: '为什么选择 Vite+？' },
    ],
  },
  {
    id: 'setup',
    label: '项目搭建',
    items: [
      { path: '/guide/create', label: '创建项目' },
      { path: '/guide/migrate', label: '迁移到 Vite+' },
      { path: '/guide/migrate-rules', label: '迁移规则' },
      { path: '/guide/vitest-v5', label: '升级到 Vitest 5' },
      { path: '/guide/upgrade-project', label: '更新项目中的 Vite+' },
      { path: '/guide/package-management', label: '包管理' },
    ],
  },
  {
    id: 'toolchain',
    label: '项目工具链',
    items: [
      { path: '/guide/check', label: '检查（vp check）' },
      { path: '/guide/lint', label: '代码检查（Lint）' },
      { path: '/guide/fmt', label: '代码格式化（Format）' },
      { path: '/guide/test', label: '测试' },
      { path: '/guide/dev', label: '开发服务器' },
      { path: '/guide/build', label: '构建' },
      { path: '/guide/pack', label: '打包库' },
      { path: '/guide/run', label: '任务编排' },
      { path: '/guide/cache', label: '任务缓存' },
      { path: '/guide/automatic-data-tracking', label: '自动数据追踪' },
      { path: '/guide/github-actions-cache', label: 'GitHub Actions 缓存' },
      { path: '/guide/vpx', label: '运行二进制' },
      { path: '/guide/commit-hooks', label: '提交钩子' },
      { path: '/guide/monorepo', label: 'Monorepo' },
    ],
  },
  {
    id: 'global-cli',
    label: '全局 CLI',
    items: [
      { path: '/guide/env', label: '环境管理' },
      { path: '/guide/upgrade', label: '升级 Vite+' },
      { path: '/guide/implode', label: '移除 Vite+' },
    ],
  },
  {
    id: 'workflow',
    label: '工作流',
    items: [
      { path: '/guide/ide-integration', label: 'IDE 集成' },
      { path: '/guide/ci', label: 'CI / 持续集成' },
      { path: '/guide/docker', label: 'Docker' },
    ],
  },
  {
    id: 'config',
    label: '配置',
    items: [
      { path: '/config', label: '配置概览' },
      { path: '/config/create', label: 'create' },
      { path: '/config/run', label: 'run' },
      { path: '/config/fmt', label: 'fmt' },
      { path: '/config/lint', label: 'lint' },
      { path: '/config/check', label: 'check' },
      { path: '/config/test', label: 'test' },
      { path: '/config/build', label: 'build' },
      { path: '/config/pack', label: 'pack' },
      { path: '/config/staged', label: 'staged' },
    ],
  },
  {
    id: 'reference',
    label: '参考',
    items: [
      { path: '/guide/cli', label: '命令行参考' },
      { path: '/guide/troubleshooting', label: '故障排查' },
      { path: '/resources', label: '资源与社区' },
    ],
  },
];

/** 站点主导航（顶部） */
export const topNav: { path: string; label: string }[] = [
  { path: '/', label: '首页' },
  { path: '/guide/getting-started', label: '指南' },
  { path: '/config', label: '配置' },
  { path: '/guide/cli', label: '命令行' },
  { path: '/resources', label: '社区' },
];
