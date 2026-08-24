import { Children, isValidElement, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from './icons';

function getLanguage(children: React.ReactNode): string {
  const arr = Children.toArray(children);
  for (const child of arr) {
    if (isValidElement(child)) {
      const cls = (child.props as { className?: unknown }).className;
      if (typeof cls === 'string') {
        const m = cls.match(/language-([\w-]+)/);
        if (m) return m[1];
      }
    }
  }
  return '';
}

/** 自定义渲染 `<pre>`：为代码块加入现代窗口修饰、语言标签与动画复制按钮 */
export function PreBlock({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const lang = getLanguage(children);

  const copy = async () => {
    const text = ref.current?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(text.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 静默降级
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-2xl border border-edge-strong/60 bg-[#080c0e] shadow-lg dark:border-white/10 dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
      {/* 顶部控制栏 */}
      <div className="flex h-10 items-center justify-between border-b border-white/8 bg-white/3 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="ml-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
            {lang || 'bash'}
          </span>
        </div>

        {/* 复制操作按钮 */}
        <button
          type="button"
          onClick={copy}
          aria-label="复制代码"
          className={`press inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
              : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'
          }`}
        >
          {copied ? (
            <CheckIcon size={12} className="text-emerald-400 animate-scale" />
          ) : (
            <CopyIcon size={12} />
          )}
          <span>{copied ? '已复制' : '复制'}</span>
        </button>
      </div>

      {/* 代码内容区域 */}
      <pre
        ref={ref}
        className="overflow-x-auto p-4.5 font-mono text-[13.5px] leading-relaxed text-slate-200"
      >
        {children}
      </pre>
    </div>
  );
}
