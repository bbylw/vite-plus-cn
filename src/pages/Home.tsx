import { Link } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { Reveal } from '../components/Reveal';
import { TopBar } from '../components/TopBar';
import {
  ArrowRightIcon,
  BoltIcon,
  BoxIcon,
  CheckIcon,
  CopyIcon,
  FlameIcon,
  GaugeIcon,
  LayersIcon,
  MonitorIcon,
  RocketIcon,
  SparklesIcon,
  TargetIcon,
} from '../components/icons';

// 特性卡片定义
const features = [
  {
    icon: BoxIcon,
    title: '统一工具链入口',
    desc: '单个 vp 统领开发服务器、代码检查、格式化、单元测试、打包与 Monorepo 缓存。',
    tag: 'All-in-One',
  },
  {
    icon: BoltIcon,
    title: '开箱即用零配置',
    desc: '在单一 vite.config.ts 中跨开发、测试与检查共享类型安全的全局默认配置。',
    tag: 'Zero Config',
  },
  {
    icon: RocketIcon,
    title: 'Rust 级极致性能',
    desc: '全面基于 Rolldown 与 Oxc 原生引擎构建，高频任务提速 10× 至 100×。',
    tag: 'Rust Native',
  },
  {
    icon: LayersIcon,
    title: '深度兼容 Vite 生态',
    desc: '天然兼容 React 19、Vue、Svelte 等所有现存 Vite 官方与社区插件。',
    tag: 'Vite Ecosystem',
  },
  {
    icon: MonitorIcon,
    title: '智能多包管理',
    desc: '自动侦测并包装 Bun、pnpm、npm 或 Yarn，统一项目执行环境无缝协同。',
    tag: 'Package Manager',
  },
  {
    icon: TargetIcon,
    title: 'Monorepo 任务缓存',
    desc: '内置依赖图拓扑感知调度与精准任务级增量哈希缓存，大幅削减 CI 时间。',
    tag: 'Smart Cache',
  },
];

// 底层引擎矩阵
const toolchain = [
  { name: 'Vite', role: '极速开发服务器' },
  { name: 'Rolldown', role: 'Rust 打包核心' },
  { name: 'Vitest', role: '现代单元测试' },
  { name: 'Oxlint', role: '毫秒级代码检查' },
  { name: 'Oxfmt', role: '极速代码格式化' },
  { name: 'tsdown', role: '库极速打包' },
  { name: 'Vite Task', role: 'Monorepo 任务编排' },
];

// 交互式终端命令与输出模拟
const terminalTabs = [
  {
    id: 'install',
    label: '1. 安装',
    cmd: 'bun add -d vite-plus',
    outputs: [
      { text: '+ vite-plus@0.3.0', color: 'text-emerald-400' },
      { text: '✓ 1 package installed [42ms]', color: 'text-slate-400' },
    ],
  },
  {
    id: 'create',
    label: '2. 创建',
    cmd: 'vp create my-app --template react-ts',
    outputs: [
      { text: '✦ Creating project in ./my-app...', color: 'text-cyan-400' },
      { text: '✓ Template copied and dependencies locked', color: 'text-slate-300' },
      { text: '➜ Ready to run: cd my-app && vp dev', color: 'text-emerald-400' },
    ],
  },
  {
    id: 'dev',
    label: '3. 开发',
    cmd: 'vp dev',
    outputs: [
      { text: '  VITE+ v0.3.0  ready in 18 ms', color: 'text-emerald-400 font-bold' },
      { text: '  ➜  Local:   http://localhost:5173/', color: 'text-cyan-300' },
      { text: '  ➜  Network: use --host to expose', color: 'text-slate-400' },
      { text: '  ➜  press h + enter to show help', color: 'text-slate-500' },
    ],
  },
  {
    id: 'check',
    label: '4. 检查',
    cmd: 'vp check',
    outputs: [
      { text: '✓ Oxfmt: 34 files formatted [12ms]', color: 'text-emerald-400' },
      { text: '✓ Oxlint: 0 errors, 0 warnings in 34 files [8ms]', color: 'text-emerald-400' },
      { text: '✓ TypeScript: No type errors found [140ms]', color: 'text-emerald-400' },
      { text: '⚡ All checks passed in 160ms', color: 'text-cyan-300 font-bold' },
    ],
  },
  {
    id: 'build',
    label: '5. 构建',
    cmd: 'vp build',
    outputs: [
      { text: 'vite+ building for production...', color: 'text-slate-400' },
      { text: '✓ 42 modules transformed by Rolldown', color: 'text-slate-300' },
      { text: 'dist/assets/index-D7h2q.js   48.2 kB │ gzip: 14.1 kB', color: 'text-emerald-300' },
      { text: 'dist/assets/index-Ci18s.css   12.4 kB │ gzip:  3.2 kB', color: 'text-emerald-300' },
      { text: '✓ Built in 38ms', color: 'text-emerald-400 font-bold' },
    ],
  },
];

// 交互式终端组件
function InteractiveTerminal() {
  const [activeTab, setActiveTab] = useState(2); // 默认选中 dev
  const [copied, setCopied] = useState(false);
  const current = terminalTabs[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative group">
      {/* 科技光晕扩散层 */}
      <div
        aria-hidden
        className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-accent/30 via-emerald-500/20 to-teal-800/30 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#080c0e] shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        {/* 顶部标签栏 */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/8 bg-white/3 px-4 py-2.5">
          {/* macOS 红黄绿指示灯 */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>

          {/* 切换 Tab */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {terminalTabs.map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`rounded-lg px-2.5 py-1 font-mono text-xs transition-all ${
                  activeTab === idx
                    ? 'bg-accent/20 text-accent font-semibold ring-1 ring-accent/40'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 复制代码按钮 */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="复制当前命令"
            className="press inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            {copied ? <CheckIcon size={12} className="text-emerald-400" /> : <CopyIcon size={12} />}
            <span className="hidden sm:inline">{copied ? '已复制' : '复制'}</span>
          </button>
        </div>

        {/* 终端内容区 */}
        <div className="p-5 font-mono text-[13.5px] leading-relaxed">
          {/* 执行命令行 */}
          <div className="flex items-center gap-2.5 text-slate-100">
            <span className="text-accent font-bold text-base">›</span>
            <span className="font-semibold text-white">{current.cmd}</span>
          </div>

          {/* 模拟输出 */}
          <div className="mt-3.5 space-y-1.5 border-t border-white/6 pt-3 text-xs sm:text-[13px]">
            {current.outputs.map((out, i) => (
              <div key={i} className={`${out.color} leading-snug`}>
                {out.text}
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-accent">›</span>
              <span className="inline-block h-4 w-2 animate-pulse bg-accent/80 rounded-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 鼠标光晕卡片组件
function SpotlightFeatureCard({
  Icon,
  title,
  desc,
  tag,
  className = '',
}: {
  Icon: (p: { size?: number; className?: string }) => ReactNode;
  title: string;
  desc: string;
  tag?: string;
  className?: string;
}) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={
        {
          '--mouse-x': `${coords.x}px`,
          '--mouse-y': `${coords.y}px`,
        } as React.CSSProperties
      }
      className={`spotlight-card hover-lift group relative rounded-3xl border border-edge bg-bg-elev p-6.5 transition-all ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent shadow-xs transition-transform duration-300 group-hover:scale-110">
          <Icon size={24} />
        </div>
        {tag && (
          <span className="rounded-full border border-edge bg-bg px-2.5 py-0.5 font-mono text-[11px] font-medium text-fg-muted">
            {tag}
          </span>
        )}
      </div>

      <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-fg group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{desc}</p>
    </div>
  );
}

// 性能对比基准看板
function BenchmarkSection() {
  const benchmarks = [
    {
      title: '生产代码打包 (Bundle Speed)',
      metric: '40x 更快',
      vp: { name: 'Vite+ (Rolldown)', time: '0.12s', width: '10%' },
      comp: { name: 'Webpack / Rollup', time: '4.85s', width: '92%' },
    },
    {
      title: '代码格式化与检查 (Lint & Format)',
      metric: '42x 更快',
      vp: { name: 'Vite+ (Oxlint+Oxfmt)', time: '0.05s', width: '8%' },
      comp: { name: 'ESLint + Prettier', time: '2.10s', width: '75%' },
    },
    {
      title: '单元测试执行 (Unit Tests)',
      metric: '9x 更快',
      vp: { name: 'Vite+ (Vitest)', time: '0.35s', width: '18%' },
      comp: { name: 'Jest', time: '3.20s', width: '80%' },
    },
  ];

  return (
    <section className="mx-auto max-w-300 px-4 py-20 sm:px-6">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
          <GaugeIcon size={14} />
          Rust Native Performance
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          突破性能壁垒，快到不可思议
        </h2>
        <p className="mt-3 text-fg-muted text-sm sm:text-base">
          基于底层 Oxc 与 Rolldown 原生架构，摆脱 Node.js 解释执行的性能瓶颈。
        </p>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {benchmarks.map((b, idx) => (
          <Reveal key={b.title} delay={idx * 80}>
            <div className="relative rounded-3xl border border-edge bg-bg-elev p-6 shadow-xs hover-lift flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-fg">{b.title}</h3>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-bold text-emerald-500">
                    {b.metric}
                  </span>
                </div>

                {/* 对比条 1: Vite+ */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-accent font-semibold flex items-center gap-1">
                      <SparklesIcon size={12} />
                      {b.vp.name}
                    </span>
                    <span className="font-mono text-accent font-bold">{b.vp.time}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-edge/60 overflow-hidden">
                    <div
                      style={{ width: b.vp.width }}
                      className="h-full rounded-full bg-linear-to-r from-accent to-emerald-400 transition-all duration-1000"
                    />
                  </div>
                </div>

                {/* 对比条 2: 传统工具 */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-fg-muted">
                    <span>{b.comp.name}</span>
                    <span className="font-mono">{b.comp.time}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-edge/40 overflow-hidden">
                    <div
                      style={{ width: b.comp.width }}
                      className="h-full rounded-full bg-slate-400 dark:bg-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-edge/60 pt-4 flex items-center justify-between text-xs text-fg-muted">
                <span>典型中大型工程基准测试</span>
                <span className="text-accent font-medium">基准数据</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// 安装方式一键切换
function InstallSection() {
  const [manager, setManager] = useState<'bun' | 'pnpm' | 'npm' | 'yarn' | 'curl' | 'ps'>('bun');
  const [copied, setCopied] = useState(false);

  const installCommands = {
    bun: 'bun add -d vite-plus',
    pnpm: 'pnpm add -D vite-plus',
    npm: 'npm i -D vite-plus',
    yarn: 'yarn add -D vite-plus',
    curl: 'curl -fsSL https://vite.plus | bash',
    ps: 'irm https://vite.plus/ps1 | iex',
  };

  const activeCmd = installCommands[manager];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section className="mx-auto max-w-300 px-4 pb-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-edge-strong bg-bg-elev p-8 sm:p-12 shadow-xl">
          {/* 背景流光 */}
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-accent">
                <FlameIcon size={15} />
                Quick Installation
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                一键接入，升级现有项目
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-fg-muted max-w-xl">
                无论是通过包管理器引入工程本地，或是全局安装独立 CLI，Vite+ 都能瞬间完成初始化。
              </p>

              {/* 标签切换 */}
              <div className="mt-6 flex flex-wrap gap-2">
                {(['bun', 'pnpm', 'npm', 'yarn', 'curl', 'ps'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setManager(m)}
                    className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-medium transition-all ${
                      manager === m
                        ? 'bg-accent text-accent-ink font-bold shadow-xs'
                        : 'bg-bg-elev-2 text-fg-muted hover:text-fg'
                    }`}
                  >
                    {m === 'curl' ? 'macOS/Linux (curl)' : m === 'ps' ? 'Windows (PowerShell)' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* 命令行复制框 */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#080c0e] p-4 shadow-lg">
              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="text-accent font-bold">›</span>
                <code className="font-mono text-sm sm:text-[15px] font-semibold text-white">
                  {activeCmd}
                </code>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="复制代码"
                className="press ml-3 shrink-0 rounded-xl bg-white/10 p-2.5 text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
              >
                {copied ? (
                  <CheckIcon size={16} className="text-emerald-400" />
                ) : (
                  <CopyIcon size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <TopBar />

      {/* Hero 区域 */}
      <section id="main" className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent shadow-xs">
                <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                Vite+ 统一 Web 工具链 · 中文站点
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-4xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-[64px]">
                面向现代 Web 的
                <br />
                <span className="bg-linear-to-r from-accent via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  极速统一工具链
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-fg-muted">
                从包管理、模板创建、HMR 极速开发，到 Lint、代码格式化、Vitest 测试与 Rolldown 构建
                —— 全部凝聚在一个依赖中。
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/guide/getting-started"
                  className="press inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-accent to-teal-700 px-6 py-3.5 font-display text-base font-bold text-accent-ink shadow-lg shadow-accent/25 transition-all hover:brightness-110"
                >
                  <span>快速上手</span>
                  <ArrowRightIcon size={18} />
                </Link>
                <Link
                  to="/guide/why"
                  className="press inline-flex items-center gap-2 rounded-2xl border border-edge-strong bg-bg-elev px-6 py-3.5 font-display text-base font-bold text-fg transition-all hover:border-accent hover:bg-bg-elev-2"
                >
                  <span>为什么选择 Vite+？</span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* 交互式 Hero 终端 */}
          <Reveal delay={200} className="lg:pl-4">
            <InteractiveTerminal />
          </Reveal>
        </div>
      </section>

      {/* 驱动引擎矩阵 Chips */}
      <section className="border-y border-edge bg-bg-elev/40 backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-8 sm:px-6">
          <span className="mr-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-fg-muted">
            驱动引擎
          </span>
          {toolchain.map((t) => (
            <span
              key={t.name}
              className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-bg-elev px-3.5 py-1.5 text-xs font-medium text-fg shadow-2xs hover:border-accent/40 transition-colors"
            >
              <span className="font-bold text-accent">{t.name}</span>
              <span className="text-fg-muted">{t.role}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 性能对比看板 */}
      <BenchmarkSection />

      {/* Bento Grid 特性矩阵 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal className="mb-12 max-w-2xl">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
            Core Architecture
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            全生命周期统一工程体系
          </h2>
          <p className="mt-3 text-fg-muted text-sm sm:text-base">
            不再需要组装十几个琐碎的开发工具包，Vite+ 提供一致、高效、标准化的现代开发体验。
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <SpotlightFeatureCard
                Icon={f.icon}
                title={f.title}
                desc={f.desc}
                tag={f.tag}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 快捷安装 CTA */}
      <InstallSection />

      {/* 页脚 */}
      <footer className="border-t border-edge py-12 text-center text-xs sm:text-sm text-fg-muted">
        <div className="mx-auto max-w-300 px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vite+ 中文文档站点 · 基于 React 19 + vite-plus + Bun 构建</p>
          <div className="flex items-center gap-4 font-medium">
            <a
              href="https://github.com/voidzero-dev/vite-plus"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-accent transition-colors"
            >
              GitHub (官方)
            </a>
            <Link to="/guide/getting-started" className="hover:text-accent transition-colors">
              文档指南
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
