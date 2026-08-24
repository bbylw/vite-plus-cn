import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { TopBar } from './TopBar';
import { SidebarContent } from './Sidebar';
import { RightToc } from './RightToc';
import { docs } from '../content/docs';
import { CloseIcon } from './icons';

export function DocLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const markdown = docs[pathname]?.markdown;

  return (
    <div className="min-h-screen bg-bg">
      <TopBar onMenu={() => setMobileOpen(true)} />

      <div className="mx-auto grid max-w-350 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_14rem]">
        {/* 桌面端侧边栏 */}
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto border-r border-edge/80 bg-bg/50 backdrop-blur-xs lg:block">
          <SidebarContent />
        </aside>

        {/* 主内容 */}
        <main id="main" className="min-w-0 px-4 py-10 sm:px-8 sm:py-12 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        </main>

        {/* 右侧本页目录（仅大屏） */}
        {markdown && (
          <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto py-8 pl-6 pr-4 xl:block">
            <RightToc markdown={markdown} />
          </aside>
        )}
      </div>

      {/* 移动端抽屉导航 */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 overscroll-contain lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-edge bg-bg-elev p-2 shadow-2xl transition-transform">
            <div className="flex items-center justify-between border-b border-edge px-3 py-3">
              <span className="font-display text-sm font-bold text-fg">文档目录</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="关闭文档导航"
                className="press rounded-lg p-1.5 text-fg-muted hover:bg-fg/5 hover:text-fg"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
