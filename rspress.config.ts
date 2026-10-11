import path from 'node:path';
import { defineConfig } from 'rspress/config';
import { defaultSidebar } from './.rspress/defaultSidebar';

const nav = defaultSidebar.slice(1, 10);

export default defineConfig({
  root: 'docs',
  base: '/',
  title: 'Kevin Woo剑指Offer',
  description: '深入前端技术栈，探索工程化实践，记录成长历程',
  icon: '/favicon.svg',
  logo: '/logo.svg',
  logoText: '剑指Offer',
  globalStyles: path.join(__dirname, 'styles/index.css'),
  markdown: {
    showLineNumbers: true,
  },
  themeConfig: {
    nav,
    sidebar: {
      '/': defaultSidebar,
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/moxiaonai',
      },
    ],
    outlineTitle: '目录',
    lastUpdated: true,
    lastUpdatedText: 'Last Updated',
    footer: {
      message: 'Copyright © 2026 Kevin Woo',
    },
  },
  builderConfig: {
    html: {
      tags: [
        {
          tag: 'script',
          children: "(() => { const p = window.location.pathname; if (p === '/' || p === '/index.html') window.location.replace('/blog/'); })();",
        },
        {
          tag: 'script',
          children: `(() => {
  const root = document.documentElement;
  const maxDistance = 120;
  let ticking = false;

  const updateNavOpacity = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || (document.body && document.body.scrollTop) || 0;
    const alpha = Math.min(1, Math.max(0, scrollTop / maxDistance));
    root.style.setProperty('--rspress-nav-bg-alpha', alpha.toFixed(3));
    root.style.setProperty('--rspress-nav-border-alpha', (alpha * 0.72).toFixed(3));
    root.style.setProperty('--rspress-nav-shadow-alpha', (alpha * 0.08).toFixed(3));
    root.style.setProperty('--rspress-nav-blur', Math.round(alpha * 14) + 'px');
    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateNavOpacity);
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', requestUpdate);
  document.addEventListener('click', () => window.setTimeout(requestUpdate, 80), true);
  updateNavOpacity();
})();`,
        },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#3b82f6' } },
        { tag: 'meta', attrs: { property: 'og:title', content: "Kevin Woo剑指Offer - 前端历险记" } },
        { tag: 'meta', attrs: { property: 'og:description', content: '深入前端技术栈，探索工程化实践' } },
      ],
    },
  },
});
