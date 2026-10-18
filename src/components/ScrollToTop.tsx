import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    // Markdown 组件为懒加载，需等待目标标题渲染后再定位
    const id = decodeURIComponent(hash.slice(1));
    let frame = 0;
    let attempts = 0;
    const scrollToTarget = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ block: 'start' });
      } else if (attempts++ < 60) {
        frame = requestAnimationFrame(scrollToTarget);
      }
    };
    scrollToTarget();

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
