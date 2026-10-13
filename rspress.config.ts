import path from 'node:path';
import { defineConfig } from 'rspress/config';
import { defaultSidebar } from './.rspress/defaultSidebar';

const nav = defaultSidebar.slice(1, 10);

const siteTitle = 'Kevin Woo剑指Offer';
const siteDescription = '深入前端技术栈，探索工程化实践，记录成长历程';
const themeColor = '#3b82f6';
const isBuild = process.argv.includes('build');

const navScrollScript = [
  '(() => {',
  '  const root = document.documentElement;',
  '  const maxDistance = 120;',
  '  let ticking = false;',
  '',
  '  const updateNavOpacity = () => {',
  '    const scrollTop = window.scrollY || document.documentElement.scrollTop || (document.body && document.body.scrollTop) || 0;',
  '    const alpha = Math.min(1, Math.max(0, scrollTop / maxDistance));',
  "    root.style.setProperty('--rspress-nav-bg-alpha', alpha.toFixed(3));",
  "    root.style.setProperty('--rspress-nav-border-alpha', (alpha * 0.72).toFixed(3));",
  "    root.style.setProperty('--rspress-nav-shadow-alpha', (alpha * 0.08).toFixed(3));",
  "    root.style.setProperty('--rspress-nav-blur', Math.round(alpha * 14) + 'px');",
  '    ticking = false;',
  '  };',
  '',
  '  const requestUpdate = () => {',
  '    if (!ticking) {',
  '      ticking = true;',
  '      window.requestAnimationFrame(updateNavOpacity);',
  '    }',
  '  };',
  '',
  "  window.addEventListener('scroll', requestUpdate, { passive: true });",
  "  window.addEventListener('resize', requestUpdate);",
  "  window.addEventListener('load', requestUpdate);",
  "  document.addEventListener('click', () => window.setTimeout(requestUpdate, 80), true);",
  '  updateNavOpacity();',
  '})();',
].join('\n');

const pwaRegisterScript = [
  '(() => {',
  "  if (!('serviceWorker' in navigator)) {",
  '    return;',
  '  }',
  '',
  "  const isLocalhost = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(window.location.hostname);",
  "  const isSecureOrigin = window.location.protocol === 'https:' || isLocalhost;",
  '',
  '  if (!isSecureOrigin) {',
  "    console.info('[PWA] Service worker registration requires HTTPS, except on localhost.');",
  '    return;',
  '  }',
  '',
  "  window.addEventListener('load', () => {",
  '    navigator.serviceWorker',
  "      .register('/sw.js', { scope: '/', updateViaCache: 'none' })",
  '      .then((registration) => {',
  '        registration.update();',
  '      })',
  '      .catch((error) => {',
  "        console.warn('[PWA] Service worker registration failed:', error);",
  '      });',
  '  });',
  '})();',
].join('\n');

export default defineConfig({
  root: 'docs',
  base: '/',
  title: siteTitle,
  description: siteDescription,
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
        { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.webmanifest' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/pwa-180.png' } },
        { tag: 'meta', attrs: { name: 'application-name', content: siteTitle } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-title', content: siteTitle } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'default' } },
        { tag: 'meta', attrs: { name: 'mobile-web-app-capable', content: 'yes' } },
        { tag: 'meta', attrs: { name: 'msapplication-TileColor', content: themeColor } },
        { tag: 'meta', attrs: { name: 'theme-color', content: themeColor } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:title', content: siteTitle + ' - 前端历险记' } },
        { tag: 'meta', attrs: { property: 'og:description', content: siteDescription } },
        { tag: 'meta', attrs: { property: 'og:image', content: '/pwa-512.png' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
        { tag: 'script', children: navScrollScript },
        ...(isBuild ? [{ tag: 'script', children: pwaRegisterScript }] : []),
      ],
    },
  },
});
