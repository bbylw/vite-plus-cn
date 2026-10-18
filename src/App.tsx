import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { DocLayout } from './components/DocLayout';
import { DocPage } from './components/DocPage';
import { ScrollToTop } from './components/ScrollToTop';
import { legacyRedirects } from './content/docs';

export default function App() {
  return (
    <>
      {/* 无障碍：跳到主要内容 */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        跳到主要内容
      </a>
      <ScrollToTop />
      <Routes>
        {/* 首页 */}
        <Route path="/" element={<Home />} />

        {/* 文档页（带侧边栏布局） */}
        <Route element={<DocLayout />}>
          {Object.entries(legacyRedirects).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="/guide/*" element={<DocPage />} />
          <Route path="/config/*" element={<DocPage />} />
          <Route path="/resources" element={<DocPage />} />
          {/* 兜底 */}
          <Route path="*" element={<DocPage />} />
        </Route>
      </Routes>
    </>
  );
}
