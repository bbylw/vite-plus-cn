import { NavLink } from 'react-router-dom';
import { navGroups } from '../content/docs';

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-6 px-3 py-6" aria-label="文档目录">
      {navGroups.map((group) => (
        <div key={group.id} className="space-y-1">
          {/* 分组标题 */}
          <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-fg-muted/90">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent/70" />
            <span>{group.label}</span>
          </div>

          {/* 章节链接 */}
          <ul className="space-y-0.5 pt-0.5">
            {group.items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent-soft text-accent font-semibold shadow-xs ring-1 ring-accent/20'
                        : 'text-fg-muted hover:bg-fg/5 hover:text-fg dark:hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
