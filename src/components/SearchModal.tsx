import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { docs, navGroups } from '../content/docs';
import { CloseIcon, FileTextIcon, SearchIcon, SparklesIcon } from './icons';

interface SearchResult {
  path: string;
  title: string;
  groupLabel: string;
  snippet: string;
  anchor?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 构建搜索索引
  const searchIndex = useMemo(() => {
    const groupMap = new Map<string, string>();
    navGroups.forEach((g) => {
      g.items.forEach((item) => {
        groupMap.set(item.path, g.label);
      });
    });

    const indexItems: {
      path: string;
      title: string;
      groupLabel: string;
      description: string;
      sections: { heading: string; id: string; content: string }[];
    }[] = [];

    Object.entries(docs).forEach(([path, doc]) => {
      // 提取 Markdown 中的章节标题
      const sections: { heading: string; id: string; content: string }[] = [];
      const lines = doc.markdown.split('\n');
      let currentHeading = doc.title;
      let currentId = '';
      let buffer: string[] = [];

      for (const line of lines) {
        const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
        if (headingMatch) {
          if (buffer.length > 0) {
            sections.push({
              heading: currentHeading,
              id: currentId,
              content: buffer.join(' ').replace(/[#*`_[\]]/g, ''),
            });
            buffer = [];
          }
          currentHeading = headingMatch[2].trim();
          currentId = currentHeading
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u4e00-\u9fa5-]/g, '');
        } else {
          buffer.push(line);
        }
      }

      if (buffer.length > 0) {
        sections.push({
          heading: currentHeading,
          id: currentId,
          content: buffer.join(' ').replace(/[#*`_[\]]/g, ''),
        });
      }

      indexItems.push({
        path,
        title: doc.title,
        groupLabel: groupMap.get(path) || '文档',
        description: doc.description,
        sections,
      });
    });

    return indexItems;
  }, []);

  // 实时搜索过滤
  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // 默认推荐几个热门/核心章节
      return searchIndex.slice(0, 6).map((item) => ({
        path: item.path,
        title: item.title,
        groupLabel: item.groupLabel,
        snippet: item.description,
      }));
    }

    const matched: SearchResult[] = [];

    for (const item of searchIndex) {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);

      if (titleMatch || descMatch) {
        matched.push({
          path: item.path,
          title: item.title,
          groupLabel: item.groupLabel,
          snippet: item.description,
        });
      }

      // 匹配小章节
      for (const sec of item.sections) {
        if (matched.length >= 12) break;
        const headMatch = sec.heading.toLowerCase().includes(q);
        const textMatch = sec.content.toLowerCase().includes(q);

        if (headMatch || textMatch) {
          if (sec.heading !== item.title) {
            const idx = sec.content.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 25);
            const end = Math.min(sec.content.length, idx + 45);
            const snippet =
              idx !== -1 ? `...${sec.content.slice(start, end)}...` : sec.content.slice(0, 60);

            matched.push({
              path: sec.id ? `${item.path}#${sec.id}` : item.path,
              title: `${item.title} › ${sec.heading}`,
              groupLabel: item.groupLabel,
              snippet: snippet.trim() || item.description,
            });
          }
        }
      }
    }

    return matched.slice(0, 10);
  }, [query, searchIndex]);

  // 打开时自动聚焦输入框
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // 快捷键支持（ArrowUp, ArrowDown, Enter, Esc）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          onClose(); // 若父级有 toggle 逻辑
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        const target = results[selectedIndex].path;
        onClose();
        navigate(target);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, navigate]);

  // 保持高亮项在视口内
  useEffect(() => {
    if (resultsRef.current) {
      const activeEl = resultsRef.current.children[selectedIndex] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      {/* 模态框主体 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="搜索文档"
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-edge-strong bg-bg-elev shadow-2xl transition-all dark:border-white/10 dark:shadow-[0_25px_70px_rgba(0,0,0,0.8)]"
      >
        {/* 顶部搜索输入条 */}
        <div className="relative flex items-center border-b border-edge px-4 py-3.5">
          <SearchIcon size={20} className="text-accent shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="搜索文档、CLI 命令、配置项或概念..."
            className="ml-3.5 w-full bg-transparent text-[15px] text-fg placeholder:text-fg-muted/70 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-2 rounded p-1 text-fg-muted hover:text-fg"
              aria-label="清空输入"
            >
              <CloseIcon size={14} />
            </button>
          )}
          <kbd className="hidden rounded-md border border-edge bg-bg px-2 py-0.5 font-mono text-[11px] text-fg-muted sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* 搜索结果列表 */}
        <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto p-2" role="listbox">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-fg-muted">没有找到与 “{query}” 相关的文档</p>
              <p className="mt-1 text-xs text-fg-muted/60">
                尝试输入更通用的关键字，如 dev、build、oxlint 等
              </p>
            </div>
          ) : (
            results.map((res, i) => {
              const isSelected = i === selectedIndex;
              return (
                <div
                  key={`${res.path}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => {
                    onClose();
                    navigate(res.path);
                  }}
                  className={`group flex cursor-pointer items-start gap-3.5 rounded-xl p-3 text-left transition-all ${
                    isSelected
                      ? 'bg-accent-soft text-accent ring-1 ring-accent/30 dark:bg-accent-soft'
                      : 'hover:bg-fg/5 text-fg'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isSelected
                        ? 'bg-accent text-accent-ink'
                        : 'bg-edge text-fg-muted dark:bg-white/5'
                    }`}
                  >
                    {res.title.includes('›') ? (
                      <SparklesIcon size={16} />
                    ) : (
                      <FileTextIcon size={16} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold tracking-tight ${isSelected ? 'text-accent' : 'text-fg'}`}
                      >
                        {res.title}
                      </span>
                      <span className="rounded bg-edge/60 px-1.5 py-0.5 text-[10px] font-medium text-fg-muted dark:bg-white/5">
                        {res.groupLabel}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-fg-muted group-hover:text-fg/80">
                      {res.snippet}
                    </p>
                  </div>

                  <span className="hidden font-mono text-[11px] text-fg-muted/60 sm:block">↵</span>
                </div>
              );
            })
          )}
        </div>

        {/* 底部快捷键提示 */}
        <div className="flex items-center justify-between border-t border-edge bg-bg/50 px-4 py-2.5 text-[11px] text-fg-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-edge bg-bg-elev px-1.5 py-0.5 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-edge bg-bg-elev px-1.5 py-0.5 font-mono text-[10px]">
                ↓
              </kbd>
              切换
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-edge bg-bg-elev px-1.5 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              选择
            </span>
          </div>
          <span>Vite+ 中文文档快速检索</span>
        </div>
      </div>
    </div>
  );
}
