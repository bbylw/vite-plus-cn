import why from './why.md?raw';
import gettingStarted from './getting-started.md?raw';
import cli from './cli.md?raw';
import config from './config.md?raw';
import env from './env.md?raw';
import install from './install.md?raw';
import dev from './dev.md?raw';
import check from './check.md?raw';
import test from './test.md?raw';
import run from './run.md?raw';
import build from './build.md?raw';
import pack from './pack.md?raw';
import create from './create.md?raw';
import migrate from './migrate.md?raw';
import monorepo from './monorepo.md?raw';
import ci from './ci.md?raw';
import cache from './cache.md?raw';
import upgrade from './upgrade.md?raw';
import resources from './resources.md?raw';

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
  '/guide/why': {
    title: '为什么选择 Vite+？',
    description: '统一工具链解决 JavaScript 生态的碎片化与性能瓶颈。',
    markdown: why,
    group: 'start',
  },
  '/guide/getting-started': {
    title: '快速上手',
    description: '安装 vp、创建项目并运行核心命令。',
    markdown: gettingStarted,
    group: 'start',
  },
  '/guide/dev': {
    title: '开发服务器',
    description: '由 Vite 驱动的快速原生 ESM 开发服务器与 HMR。',
    markdown: dev,
    group: 'guide',
  },
  '/guide/check': {
    title: '代码检查',
    description: 'vp check 一键完成格式化、代码检查与类型检查。',
    markdown: check,
    group: 'guide',
  },
  '/guide/test': {
    title: '测试',
    description: '通过内置 Vitest 运行测试。',
    markdown: test,
    group: 'guide',
  },
  '/guide/run': {
    title: '任务编排',
    description: '运行脚本与 monorepo 任务，带缓存与依赖感知调度。',
    markdown: run,
    group: 'guide',
  },
  '/guide/build': {
    title: '构建',
    description: '使用 Vite + Rolldown 进行生产构建。',
    markdown: build,
    group: 'guide',
  },
  '/guide/pack': {
    title: '打包库',
    description: '通过 tsdown 构建库与独立可执行文件。',
    markdown: pack,
    group: 'guide',
  },
  '/guide/create': {
    title: '创建项目',
    description: 'vp create 搭建项目、monorepo 与应用。',
    markdown: create,
    group: 'workflow',
  },
  '/guide/migrate': {
    title: '迁移现有项目',
    description: 'vp migrate 一键迁移到 Vite+。',
    markdown: migrate,
    group: 'workflow',
  },
  '/guide/monorepo': {
    title: 'Monorepo',
    description: '在单个工具链下管理多包仓库。',
    markdown: monorepo,
    group: 'workflow',
  },
  '/guide/env': {
    title: '环境管理',
    description: 'vp env 管理 Node.js 版本（全局与按项目）。',
    markdown: env,
    group: 'workflow',
  },
  '/guide/install': {
    title: '依赖管理',
    description: 'vp 自动包装 pnpm/npm/Yarn/Bun 的依赖命令。',
    markdown: install,
    group: 'workflow',
  },
  '/guide/cache': {
    title: '任务缓存',
    description: '复用任务结果，加速干净检出与 CI。',
    markdown: cache,
    group: 'workflow',
  },
  '/guide/ci': {
    title: 'CI / 持续集成',
    description: '在 GitHub Actions 中集成 Vite+。',
    markdown: ci,
    group: 'workflow',
  },
  '/guide/cli': {
    title: '命令行参考',
    description: 'vp 的完整命令与别名。',
    markdown: cli,
    group: 'reference',
  },
  '/guide/config': {
    title: '配置',
    description: '用单个 vite.config.ts 配置一切。',
    markdown: config,
    group: 'reference',
  },
  '/guide/upgrade': {
    title: '升级与维护',
    description: '查看工具链、升级 vp 与彻底移除。',
    markdown: upgrade,
    group: 'reference',
  },
  '/resources': {
    title: '资源与社区',
    description: '官方链接、核心组件与赞助。',
    markdown: resources,
    group: 'resources',
  },
};

/** 侧边栏分组顺序与标签 */
export const navGroups: NavGroup[] = [
  {
    id: 'start',
    label: '开始',
    items: [
      { path: '/guide/getting-started', label: '快速上手' },
      { path: '/guide/why', label: '为什么选择 Vite+？' },
    ],
  },
  {
    id: 'guide',
    label: '指南',
    items: [
      { path: '/guide/dev', label: '开发服务器' },
      { path: '/guide/check', label: '代码检查' },
      { path: '/guide/test', label: '测试' },
      { path: '/guide/run', label: '任务编排' },
      { path: '/guide/build', label: '构建' },
      { path: '/guide/pack', label: '打包库' },
    ],
  },
  {
    id: 'workflow',
    label: '工程化',
    items: [
      { path: '/guide/create', label: '创建项目' },
      { path: '/guide/migrate', label: '迁移现有项目' },
      { path: '/guide/monorepo', label: 'Monorepo' },
      { path: '/guide/env', label: '环境管理' },
      { path: '/guide/install', label: '依赖管理' },
      { path: '/guide/cache', label: '任务缓存' },
      { path: '/guide/ci', label: 'CI / 持续集成' },
    ],
  },
  {
    id: 'reference',
    label: '参考',
    items: [
      { path: '/guide/cli', label: '命令行参考' },
      { path: '/guide/config', label: '配置' },
      { path: '/guide/upgrade', label: '升级与维护' },
    ],
  },
  {
    id: 'resources',
    label: '社区',
    items: [{ path: '/resources', label: '资源与社区' }],
  },
];

/** 站点主导航（顶部） */
export const topNav: { path: string; label: string }[] = [
  { path: '/', label: '首页' },
  { path: '/guide/getting-started', label: '指南' },
  { path: '/guide/cli', label: '命令行' },
  { path: '/guide/config', label: '配置' },
  { path: '/resources', label: '社区' },
];
