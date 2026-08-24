import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'vplus-theme';
const META_COLOR = { light: '#f8faf9', dark: '#07090a' };

export type Theme = 'light' | 'dark';

/** 在渲染前应用已存储的主题（默认 dark），并同步 theme-color */
export function applyStoredTheme(): void {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  const theme = stored ?? 'dark';
  document.documentElement.classList.toggle('dark', theme === 'dark');
  syncMetaColor(theme);
}

function syncMetaColor(theme: Theme): void {
  const meta = document.getElementById('theme-color') as HTMLMetaElement | null;
  if (meta) meta.setAttribute('content', META_COLOR[theme]);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored ?? 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
    syncMetaColor(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
