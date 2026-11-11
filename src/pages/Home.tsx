import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from 'react';
import { Reveal } from '../components/Reveal';
import { TopBar } from '../components/TopBar';
import {
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
    desc: '全局 vp 与项目本地 vite-plus 双 CLI，统领开发、检查、测试、构建与 Monorepo 缓存。',
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
    title: '运行时与包管理',
    desc: '统一管理 Node.js 与多包版本，自动侦测并包装 Bun、pnpm、npm 或 Yarn。',
    tag: 'Runtime & PM',
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
    cmd: 'curl -fsSL https://vite.plus | bash',
    outputs: [
      { text: '✓ 安装全局 vp 1.6.0', color: 'text-emerald-400' },
      { text: '✓ Node.js 与包管理器受管模式已启用', color: 'text-slate-400' },
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
      { text: '  VITE+ v1.6.0  ready in 18 ms', color: 'text-emerald-400 font-bold' },
      { text: '  ➜  Local:   http://localhost:5173/', color: 'text-cyan-300' },
      { text: '  ➜  Network: use --host to expose', color: 'text-slate-400' },
      { text: '  ➜  press h + enter to show help', color: 'text-slate-400' },
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

function CommandCopyButton({ command }: { command: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const attempt = useRef(0);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      attempt.current++;
    },
    [],
  );

  const handleCopy = async () => {
    const currentAttempt = ++attempt.current;
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(command);
      if (currentAttempt !== attempt.current) return;
      setStatus('copied');
      timer.current = setTimeout(() => setStatus('idle'), 2000);
    } catch {
      if (currentAttempt === attempt.current) setStatus('error');
    }
  };

  const label = status === 'copied' ? '已复制' : status === 'error' ? '重试' : '复制';
  const message =
    status === 'copied'
      ? '命令已复制'
      : status === 'error'
        ? '复制失败，请手动选择命令，或点击重试。'
        : '';

  return (
    <span className="command-copy shrink-0">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={status === 'idle' ? '复制当前命令' : message}
        title={message || '复制当前命令'}
        className="home-control inline-flex min-h-9 w-19 items-center justify-center gap-1.5 rounded-lg bg-white/5 px-2 font-mono text-xs text-slate-300 transition-colors duration-150 hover:bg-white/10 hover:text-white"
      >
        <span className="relative size-3.5" aria-hidden="true">
          <CopyIcon
            size={14}
            className={`copy-glyph absolute inset-0 ${status === 'copied' ? 'opacity-0' : 'opacity-100'}`}
          />
          <CheckIcon
            size={14}
            className={`copy-glyph absolute inset-0 text-emerald-400 ${status === 'copied' ? 'opacity-100' : 'opacity-0'}`}
          />
        </span>
        <span
          className={
            status === 'copied' ? 'text-emerald-400' : status === 'error' ? 'text-amber-300' : ''
          }
        >
          {label}
        </span>
      </button>
      <span role="status" className="sr-only">
        {message}
      </span>
    </span>
  );
}

function InteractiveTerminal() {
  const [activeTab, setActiveTab] = useState(2);
  const current = terminalTabs[activeTab];

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % terminalTabs.length;
    else if (event.key === 'ArrowLeft')
      next = (index - 1 + terminalTabs.length) % terminalTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = terminalTabs.length - 1;
    else return;
    event.preventDefault();
    setActiveTab(next);
    document.getElementById(`terminal-tab-${terminalTabs[next].id}`)?.focus();
  };

  return (
    <div className="relative min-w-0 group">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-3xl bg-linear-to-tr from-accent/20 via-emerald-500/10 to-teal-800/20 blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-80"
      />
      <div className="terminal-shell relative overflow-hidden rounded-2xl border border-white/15 bg-[#080c0e] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
        <div className="terminal-toolbar border-b border-white/8 bg-white/3">
          <div className="terminal-lights flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f56]" />
            <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="size-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="terminal-tabs" role="tablist" aria-label="工具链工作流">
            {terminalTabs.map((tab, idx) => (
              <button
                key={tab.id}
                id={`terminal-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === idx}
                aria-controls="terminal-panel"
                tabIndex={activeTab === idx ? 0 : -1}
                onClick={() => setActiveTab(idx)}
                onKeyDown={(event) => handleTabKeyDown(event, idx)}
                className={`min-h-9 whitespace-nowrap rounded-lg px-0.5 font-mono text-xs transition-colors duration-150 ${
                  activeTab === idx
                    ? 'bg-teal-400/12 text-teal-300 font-semibold ring-1 ring-inset ring-teal-400/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <CommandCopyButton key={current.id} command={current.cmd} />
        </div>
        <div
          id="terminal-panel"
          role="tabpanel"
          aria-labelledby={`terminal-tab-${current.id}`}
          tabIndex={0}
          className="terminal-content min-h-64 overflow-x-auto overscroll-x-contain p-5 font-mono text-[0.8125rem] leading-relaxed"
        >
          <div className="min-w-max">
            <div className="flex items-center gap-2.5 text-slate-100">
              <span aria-hidden="true" className="text-teal-300 font-bold text-base">
                ›
              </span>
              <code className="whitespace-pre font-semibold text-white">{current.cmd}</code>
            </div>
            <div className="mt-4 space-y-1.5 border-t border-white/6 pt-4">
              {current.outputs.map((out, i) => (
                <div key={i} className={`${out.color} whitespace-pre leading-snug`}>
                  {out.text}
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2" aria-hidden="true">
                <span className="text-teal-300">›</span>
                <span className="inline-block h-4 w-2 motion-safe:animate-pulse bg-teal-400/80 rounded-xs" />
              </div>
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
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`spotlight-card home-card group relative rounded-3xl border border-edge bg-bg-elev p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent shadow-xs motion-safe:transition-transform duration-300 motion-safe:group-hover:scale-105">
          <Icon size={24} />
        </div>
        {tag && (
          <span className="whitespace-nowrap rounded-full border border-edge bg-bg px-2.5 py-1 font-mono text-[0.6875rem] font-medium text-fg-muted">
            {tag}
          </span>
        )}
      </div>

      <h3 className="mt-5 font-display text-lg font-bold leading-snug tracking-tight text-fg transition-colors duration-150 group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-2 text-pretty text-sm leading-[2] text-fg-muted">{desc}</p>
    </div>
  );
}

// 性能对比基准看板
function BenchmarkSection() {
  const benchmarks = [
    {
      title: '生产代码打包',
      subtitle: 'Bundle Speed',
      metric: '40x 更快',
      vp: { name: 'Vite+ (Rolldown)', time: '0.12s', width: '10%' },
      comp: { name: 'Webpack / Rollup', time: '4.85s', width: '92%' },
    },
    {
      title: '代码格式化与检查',
      subtitle: 'Lint & Format',
      metric: '42x 更快',
      vp: { name: 'Vite+ (Oxlint+Oxfmt)', time: '0.05s', width: '8%' },
      comp: { name: 'ESLint + Prettier', time: '2.10s', width: '75%' },
    },
    {
      title: '单元测试执行',
      subtitle: 'Unit Tests',
      metric: '9x 更快',
      vp: { name: 'Vite+ (Vitest)', time: '0.35s', width: '18%' },
      comp: { name: 'Jest', time: '3.20s', width: '80%' },
    },
  ];

  return (
    <section
      aria-labelledby="benchmark-title"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
          <GaugeIcon size={14} />
          Rust Native Performance
        </span>
        <h2
          id="benchmark-title"
          className="mt-4 font-display text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl"
        >
          突破性能壁垒，快到不可思议
        </h2>
        <p className="mt-3 text-pretty text-fg-muted text-sm leading-relaxed sm:text-base">
          基于底层 Oxc 与 Rolldown 原生架构，摆脱 Node.js 解释执行的性能瓶颈。
        </p>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3">
        {benchmarks.map((b, idx) => (
          <Reveal key={b.title} delay={idx * 100}>
            <div className="home-card relative rounded-3xl border border-edge bg-bg-elev p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-sm font-bold leading-relaxed text-fg">
                      {b.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-fg-muted">{b.subtitle}</p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-lg bg-accent-soft px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-accent">
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
                    <span className="font-mono text-accent font-bold tabular-nums">
                      {b.vp.time}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-edge/60 overflow-hidden">
                    <div
                      style={{ width: b.vp.width }}
                      className="h-full rounded-full bg-linear-to-r from-accent to-emerald-400"
                    />
                  </div>
                </div>

                {/* 对比条 2: 传统工具 */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-fg-muted">
                    <span>{b.comp.name}</span>
                    <span className="font-mono tabular-nums">{b.comp.time}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-edge/40 overflow-hidden">
                    <div
                      style={{ width: b.comp.width }}
                      className="h-full rounded-full bg-slate-400 dark:bg-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-edge/60 pt-4 flex items-center justify-between gap-2 text-xs text-fg-muted">
                <span>性能对比示意</span>
                <span>耗时越短越好</span>
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
  const [manager, setManager] = useState<'curl' | 'ps' | 'bun' | 'pnpm' | 'npm' | 'yarn'>('curl');

  const installCommands = {
    bun: 'bun add -d vite-plus',
    pnpm: 'pnpm add -D vite-plus',
    npm: 'npm i -D vite-plus',
    yarn: 'yarn add -D vite-plus',
    curl: 'curl -fsSL https://vite.plus | bash',
    ps: 'irm https://viteplus.dev/install.ps1 | iex',
  };

  const activeCmd = installCommands[manager];

  return (
    <section
      aria-labelledby="install-title"
      className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24"
    >
      <Reveal>
        <div className="home-install relative overflow-hidden rounded-3xl border border-edge-strong bg-bg-elev p-6 sm:p-10 lg:p-12">
          {/* 背景流光 */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
          />

          <div className="relative z-10 grid gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-accent">
                <FlameIcon size={15} />
                Quick Installation
              </span>
              <h2
                id="install-title"
                className="mt-3 font-display text-[1.75rem] font-bold leading-tight tracking-tight text-fg sm:text-4xl"
              >
                一键接入，升级现有项目
              </h2>
              <p className="mt-3 text-pretty text-sm sm:text-base leading-relaxed text-fg-muted max-w-xl">
                安装全局 CLI 跨项目管理运行时，或把 vite-plus
                引入项目锁定工具链版本。两种方式都能立即开始。
              </p>

              {/* 标签切换 */}
              <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="选择安装方式">
                {(['curl', 'ps', 'bun', 'pnpm', 'npm', 'yarn'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setManager(m)}
                    aria-pressed={manager === m}
                    aria-controls="install-command"
                    className={`home-control min-h-10 whitespace-nowrap rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold transition-colors duration-150 ${
                      manager === m
                        ? 'border-accent bg-accent text-accent-ink shadow-xs'
                        : 'border-edge bg-bg-elev-2 text-fg-muted hover:border-edge-strong hover:text-fg'
                    }`}
                  >
                    {m === 'curl' ? 'macOS / Linux' : m === 'ps' ? 'Windows' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* 命令行复制框 */}
            <div
              id="install-command"
              className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#080c0e] shadow-lg"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-2.5">
                <span className="font-mono text-xs text-slate-400">
                  {manager === 'ps' ? 'PowerShell' : 'Terminal'}
                </span>
                <CommandCopyButton key={manager} command={activeCmd} />
              </div>
              <div
                className="overflow-x-auto overscroll-x-contain p-5"
                tabIndex={0}
                role="region"
                aria-label="安装命令，可横向滚动"
              >
                <div className="flex min-w-max items-center gap-3">
                  <span aria-hidden="true" className="text-teal-300 font-bold">
                    ›
                  </span>
                  <code className="whitespace-pre font-mono text-[0.8125rem] sm:text-sm font-medium text-white">
                    {activeCmd}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Home() {
  return (
    <div className="home-page min-h-screen bg-bg">
      <TopBar />
      <main id="main" tabIndex={-1}>
        {/* Hero 区域 */}
        <section
          id="hero"
          aria-labelledby="hero-title"
          className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 md:pt-24"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent-soft px-3.5 py-2 font-mono text-[0.6875rem] font-medium tracking-wide text-accent sm:text-xs">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
                  Vite+ 统一 Web 工具链
                  <span className="border-l border-accent/25 pl-2.5 tabular-nums">v1.6</span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1
                  id="hero-title"
                  className="home-hero-title mt-6 font-display font-black tracking-tight"
                >
                  面向现代 Web 的
                  <br />
                  <span className="home-title-accent bg-clip-text text-transparent">
                    极速统一工具链
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-5 max-w-xl text-pretty text-base sm:text-lg leading-[1.75] text-fg-muted">
                  从 Node.js 与包管理、模板创建、HMR 极速开发，到 Lint、代码格式化、Vitest 测试与
                  Rolldown 构建 —— 全部凝聚在一个依赖中。
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-3.5">
                  <Link
                    to="/guide/getting-started"
                    className="home-control home-primary inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 font-display text-sm font-bold sm:px-6 sm:py-3.5 sm:text-base"
                  >
                    <span>快速上手</span>
                  </Link>
                  <Link
                    to="/guide/why"
                    className="home-control inline-flex min-h-12 items-center justify-center rounded-2xl border border-edge-strong bg-bg-elev px-5 py-3 font-display text-sm font-semibold text-fg transition-colors duration-150 hover:border-accent/50 hover:bg-bg-elev-2 sm:px-6 sm:py-3.5 sm:text-base"
                  >
                    <span>为什么选择 Vite+？</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* 交互式 Hero 终端 */}
            <Reveal delay={200} className="min-w-0 lg:pl-4">
              <InteractiveTerminal />
            </Reveal>
          </div>
        </section>

        {/* 驱动引擎矩阵 Chips */}
        <section aria-label="驱动引擎" className="home-engines border-y border-edge bg-bg-elev/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2.5 px-4 py-6 sm:px-6 sm:py-7">
            <span className="w-full text-center font-mono text-xs font-medium tracking-widest text-fg-muted xl:mr-2 xl:w-auto">
              驱动引擎
            </span>
            {toolchain.map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-edge bg-bg-elev px-3 py-2 text-xs font-medium text-fg"
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
        <section
          aria-labelledby="features-title"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16"
        >
          <Reveal className="mb-12 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
              Core Architecture
            </span>
            <h2
              id="features-title"
              className="mt-2 font-display text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl"
            >
              全生命周期统一工程体系
            </h2>
            <p className="mt-3 text-pretty text-fg-muted text-sm leading-relaxed sm:text-base">
              不再需要组装十几个琐碎的开发工具包，Vite+ 提供一致、高效、标准化的现代开发体验。
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 100}>
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
      </main>

      {/* 页脚 */}
      <footer className="border-t border-edge py-8 text-center text-xs leading-relaxed sm:text-sm text-fg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <a
            href="https://www.npmjs.com/package/vite-plus"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-10 items-center rounded-sm"
          >
            <img
              src="https://img.shields.io/npm/v/vite-plus?label=vite-plus&color=0f766e"
              alt="vite-plus 最新 npm 版本"
              width={102}
              height={20}
              loading="lazy"
              className="h-5 w-auto"
            />
          </a>
          <div className="flex items-center gap-4 font-medium">
            <a
              href="https://github.com/voidzero-dev/vite-plus"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-10 items-center underline decoration-edge-strong underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-accent"
            >
              GitHub (官方)
            </a>
            <Link
              to="/guide/getting-started"
              className="inline-flex min-h-10 items-center underline decoration-edge-strong underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-accent"
            >
              文档指南
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
