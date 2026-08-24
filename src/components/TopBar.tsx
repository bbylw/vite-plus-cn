import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { topNav } from '../content/docs';
import { useTheme } from '../hooks/useTheme';
import { GithubIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from './icons';
import { SearchModal } from './SearchModal';

function LogoMark() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-tr from-accent-strong via-accent to-emerald-400 font-display text-[15px] font-bold text-accent-ink shadow-[0_0_20px_-3px_rgba(45,212,191,0.5)] transition-transform duration-300 group-hover:scale-105">
      <span className="relative z-10 font-black tracking-tight">V+</span>
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)]"
      />
    </span>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
      className="press inline-flex h-9 w-9 items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg dark:hover:bg-white/10"
    >
      {theme === 'dark' ? (
        <SunIcon size={18} className="text-amber-400" />
      ) : (
        <MoonIcon size={18} className="text-slate-700" />
      )}
    </button>
  );
}

export function TopBar({ onMenu }: { onMenu?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // 全局快捷键 Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-edge/80 bg-bg/85 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 max-w-350 items-center justify-between gap-4 px-4 sm:px-6">
          {/* 左侧 Logo 与菜单触发 */}
          <div className="flex items-center gap-3">
            {onMenu && (
              <button
                type="button"
                onClick={onMenu}
                aria-label="打开文档导航"
                className="press inline-flex h-9 w-9 items-center justify-center rounded-xl text-fg-muted hover:bg-fg/5 lg:hidden"
              >
                <MenuIcon size={20} />
              </button>
            )}
            <Link to="/" className="group flex items-center gap-2.5">
              <LogoMark />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-lg font-bold tracking-tight text-fg">
                    Vite+
                  </span>
                  <span className="rounded-full bg-accent-soft px-1.5 py-0.2 font-mono text-[10px] font-semibold text-accent">
                    CN
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* 中间快捷搜索框 */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-edge bg-bg-elev/80 px-3.5 py-2 text-sm text-fg-muted/80 shadow-xs transition-all hover:border-accent/40 hover:bg-bg-elev hover:text-fg"
            >
              <span className="flex items-center gap-2">
                <SearchIcon size={16} className="text-fg-muted" />
                <span>搜索文档与 API...</span>
              </span>
              <kbd className="inline-flex items-center gap-0.5 rounded-md border border-edge bg-bg px-1.5 py-0.5 font-mono text-[11px] text-fg-muted shadow-2xs">
                <span>⌘</span>K
              </kbd>
            </button>
          </div>

          {/* 桌面主导航与外链 */}
          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
              {topNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent-soft font-semibold text-accent'
                        : 'text-fg-muted hover:bg-fg/5 hover:text-fg dark:hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="h-4 w-px bg-edge hidden md:block mx-1" />

            {/* 移动端搜索图标按钮 */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="搜索文档"
              className="press inline-flex h-9 w-9 items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg sm:hidden"
            >
              <SearchIcon size={18} />
            </button>

            <ThemeToggle />

            <a
              href="https://github.com/voidzero-dev/vite-plus"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub 仓库"
              className="press inline-flex h-9 w-9 items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg dark:hover:bg-white/10"
            >
              <GithubIcon size={19} />
            </a>
          </div>
        </div>

        {/* 移动端下拉导航 */}
        {mobileOpen && (
          <div className="border-t border-edge bg-bg px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="主导航（移动端）">
              {topNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-accent-soft font-semibold text-accent' : 'text-fg-muted'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* 全局搜索弹窗 */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
