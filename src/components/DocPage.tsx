import { lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { docs, navGroups } from '../content/docs';

// 将 markdown 渲染器拆分为独立 chunk
const Markdown = lazy(() => import('./Markdown').then((m) => ({ default: m.Markdown })));

/** 展平导航顺序，用于上/下页 */
const orderedPaths = navGroups.flatMap((g) => g.items.map((i) => i.path));

export function DocPage() {
  const { pathname } = useLocation();
  const doc = docs[pathname];

  if (!doc) {
    return (
      <div className="py-24 text-center">
        <span className="font-mono text-6xl font-black text-accent">404</span>
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-fg">
          未找到该页面
        </h2>
        <p className="mt-2 text-sm text-fg-muted">该文档可能已被移动或尚未建立。</p>
        <Link
          to="/"
          className="press mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-transform hover:opacity-95 shadow-md shadow-accent/20"
        >
          返回首页
        </Link>
      </div>
    );
  }

  const index = orderedPaths.indexOf(pathname);
  const prev = index > 0 ? orderedPaths[index - 1] : undefined;
  const next = index >= 0 && index < orderedPaths.length - 1 ? orderedPaths[index + 1] : undefined;

  return (
    <article className="pb-16">
      {/* 顶部面包屑与分类 */}
      <div className="mb-4 flex items-center gap-2 text-xs font-medium text-fg-muted">
        <Link to="/" className="hover:text-fg transition-colors">
          文档
        </Link>
        <span>/</span>
        <span className="text-accent">{doc.title}</span>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4 py-8 animate-pulse">
            <div className="h-10 w-2/3 rounded-xl bg-edge/60" />
            <div className="h-5 w-full rounded-lg bg-edge/40" />
            <div className="h-5 w-4/5 rounded-lg bg-edge/40" />
            <div className="h-48 w-full rounded-2xl bg-edge/30 mt-6" />
          </div>
        }
      >
        <Markdown>{doc.markdown}</Markdown>
      </Suspense>

      {/* 上一页 / 下一页导引卡片 */}
      {(prev || next) && (
        <nav
          className="mt-16 grid gap-4 border-t border-edge pt-8 sm:grid-cols-2"
          aria-label="上下篇导航"
        >
          {prev ? (
            <Link
              to={prev}
              className="group flex flex-col justify-between rounded-2xl border border-edge bg-bg-elev p-5 transition-all hover:border-accent/50 hover:bg-accent-soft/30 hover:shadow-md"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-fg-muted group-hover:text-accent">
                <span className="transition-transform group-hover:-translate-x-1">←</span>
                <span>上一篇</span>
              </div>
              <div className="mt-2 font-display text-base font-bold text-fg group-hover:text-accent">
                {docs[prev]?.title}
              </div>
              <div className="mt-1 line-clamp-1 text-xs text-fg-muted">
                {docs[prev]?.description}
              </div>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              to={next}
              className="group flex flex-col justify-between rounded-2xl border border-edge bg-bg-elev p-5 text-right transition-all hover:border-accent/50 hover:bg-accent-soft/30 hover:shadow-md"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-wider text-fg-muted group-hover:text-accent">
                <span>下一篇</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
              <div className="mt-2 font-display text-base font-bold text-fg group-hover:text-accent">
                {docs[next]?.title}
              </div>
              <div className="mt-1 line-clamp-1 text-xs text-fg-muted">
                {docs[next]?.description}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      )}
    </article>
  );
}
