import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { PreBlock } from './CodeBlock';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  ShieldAlertIcon,
  SparklesIcon,
} from './icons';

// 解析 GitHub Alert 类型的 Callout
function CalloutBlock({ children }: { children: React.ReactNode }) {
  // 递归寻找文本判断 alert 类型
  let rawText = '';
  const extractText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node?.props?.children) return extractText(node.props.children);
    return '';
  };

  rawText = extractText(children).trim();

  // 匹配 [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
  const match = rawText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

  if (match) {
    const type = match[1].toUpperCase();

    // 移除提示标记
    const renderCleanChildren = (node: any): any => {
      if (typeof node === 'string') {
        return node.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '');
      }
      if (Array.isArray(node)) {
        return node.map((child, idx) => (idx === 0 ? renderCleanChildren(child) : child));
      }
      if (node?.props?.children) {
        return {
          ...node,
          props: {
            ...node.props,
            children: renderCleanChildren(node.props.children),
          },
        };
      }
      return node;
    };

    const cleanChildren = renderCleanChildren(children);

    let config = {
      title: '提示',
      icon: InfoIcon,
      border: 'border-teal-500/40',
      bg: 'bg-teal-500/10 dark:bg-teal-500/10',
      text: 'text-teal-900 dark:text-teal-200',
      iconColor: 'text-teal-600 dark:text-teal-400',
    };

    switch (type) {
      case 'TIP':
        config = {
          title: '技巧与建议',
          icon: SparklesIcon,
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
          text: 'text-emerald-950 dark:text-emerald-200',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        };
        break;
      case 'IMPORTANT':
        config = {
          title: '重要信息',
          icon: CheckCircle2Icon,
          border: 'border-cyan-500/40',
          bg: 'bg-cyan-500/10 dark:bg-cyan-500/10',
          text: 'text-cyan-950 dark:text-cyan-200',
          iconColor: 'text-cyan-600 dark:text-cyan-400',
        };
        break;
      case 'WARNING':
        config = {
          title: '注意事项',
          icon: AlertTriangleIcon,
          border: 'border-amber-500/40',
          bg: 'bg-amber-500/10 dark:bg-amber-500/10',
          text: 'text-amber-950 dark:text-amber-200',
          iconColor: 'text-amber-600 dark:text-amber-400',
        };
        break;
      case 'CAUTION':
        config = {
          title: '警告',
          icon: ShieldAlertIcon,
          border: 'border-rose-500/40',
          bg: 'bg-rose-500/10 dark:bg-rose-500/10',
          text: 'text-rose-950 dark:text-rose-200',
          iconColor: 'text-rose-600 dark:text-rose-400',
        };
        break;
    }

    const Icon = config.icon;

    return (
      <div
        className={`my-6 overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-4.5 transition-all shadow-xs`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon size={18} className={config.iconColor} />
          <span className={`text-xs font-bold uppercase tracking-wider ${config.iconColor}`}>
            {config.title}
          </span>
        </div>
        <div className={`text-[14.5px] leading-relaxed ${config.text} [&>p]:my-1`}>
          {cleanChildren}
        </div>
      </div>
    );
  }

  // 普通引用块
  return (
    <blockquote className="my-6 rounded-r-2xl border-l-[3.5px] border-accent bg-accent-soft/50 py-3.5 pl-4.5 pr-4 text-[14.5px] leading-relaxed text-fg/90 dark:bg-accent-soft/30">
      <div className="space-y-1.5 [&>p]:my-1">{children}</div>
    </blockquote>
  );
}

const components: Components = {
  pre: PreBlock,
  code: ({ className, children, ...props }) => {
    const isBlock = /language-|hljs/.test(className ?? '');
    if (isBlock) {
      return (
        <code className={className} translate="no" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        translate="no"
        className="rounded-md border border-edge bg-accent-soft/60 px-1.5 py-0.5 font-mono text-[0.87em] font-medium text-accent transition-colors"
        {...props}
      >
        {children}
      </code>
    );
  },
  h1: ({ children, ...props }) => (
    <h1
      {...props}
      className="mt-2 scroll-mt-28 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl"
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className="group mt-12 scroll-mt-28 border-b border-edge pb-3 font-display text-2xl font-bold tracking-tight text-fg flex items-center justify-between"
    >
      <span>{children}</span>
      <span className="text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100 font-mono font-normal">
        #
      </span>
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      {...props}
      className="mt-9 scroll-mt-28 font-display text-xl font-bold tracking-tight text-fg"
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 {...props} className="mt-7 scroll-mt-28 text-lg font-semibold text-fg">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="my-4 leading-7 text-[15.5px] text-fg/90">{children}</p>,
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer noopener' : undefined}
      className="font-medium text-accent underline decoration-accent/40 decoration-1 underline-offset-4 transition-all hover:decoration-accent hover:text-accent-strong"
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
  ul: ({ children }) => (
    <ul className="my-4 list-disc space-y-2 pl-6 marker:text-accent/80 text-[15px]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 marker:text-accent/80 text-[15px]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-7 text-fg/90">{children}</li>,
  blockquote: ({ children }) => <CalloutBlock>{children}</CalloutBlock>,
  table: ({ children }) => (
    <div className="my-6 overflow-hidden rounded-2xl border border-edge bg-bg-elev shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm tabular-nums">{children}</table>
      </div>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-edge bg-fg/3 dark:bg-white/3">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-fg">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-edge/50 px-4 py-3.5 align-top text-fg/85 leading-relaxed">
      {children}
    </td>
  ),
  hr: () => <hr className="my-10 border-edge" />,
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="min-w-0 max-w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
