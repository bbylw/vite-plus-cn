import { useEffect, useState } from 'react';
import { extractHeadings } from '../lib/headings';
import { ArrowUpIcon } from './icons';

export function RightToc({ markdown }: { markdown: string }) {
  const headings = extractHeadings(markdown);
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);
  const [progress, setProgress] = useState(0);

  // 监听大纲相交与阅读进度
  useEffect(() => {
    setActive(headings[0]?.id ?? null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.getAttribute('data-slug'));
          }
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 },
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) {
        el.setAttribute('data-slug', h.id);
        observer.observe(el);
      }
    }

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const current = Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)));
        setProgress(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (headings.length === 0) return null;

  return (
    <nav className="flex flex-col justify-between text-sm" aria-label="本页目录">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-fg-muted">
            本页大纲
          </span>
          <span className="font-mono text-[11px] text-accent font-semibold">{progress}%</span>
        </div>

        {/* 目录列表 */}
        <ul className="space-y-1 border-l border-edge text-[13px]">
          {headings.map((h) => {
            const isActive = active === h.id;
            return (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(h.id);
                    const y = el ? el.getBoundingClientRect().top + window.scrollY - 78 : 0;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }}
                  className={`block border-l-2 py-1.5 leading-snug transition-all ${
                    h.level === 3 ? 'pl-5' : 'pl-3'
                  } ${
                    isActive
                      ? '-ml-px border-accent font-semibold text-accent'
                      : 'border-transparent text-fg-muted hover:border-edge-strong hover:text-fg'
                  }`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 底部回到顶部按钮 */}
      <div className="mt-8 border-t border-edge/60 pt-4">
        <button
          type="button"
          onClick={scrollToTop}
          className="press inline-flex items-center gap-2 text-xs font-medium text-fg-muted transition-colors hover:text-accent"
        >
          <ArrowUpIcon size={14} />
          <span>回到顶部</span>
        </button>
      </div>
    </nav>
  );
}
