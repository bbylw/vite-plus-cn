import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'highlight.js/styles/github-dark.css';
import './index.css';
import App from './App';
import { applyStoredTheme } from './hooks/useTheme';

// 在 React 渲染前应用已存储的主题，避免闪烁
applyStoredTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
