// =============================================
// نظام التنقل بين الصفحات
// =============================================

import { buildHomePage } from './home.js';
import { buildBookingPage } from './booking.js';
import { buildTrackPage } from './track.js';
import { DEFAULT_CMS } from '../data/cms.js';

let currentRoute = 'home';
let currentCMS = null;

/**
 * تهيئة الـRouter
 */
export function initRouter(cms) {
  currentCMS = cms;
  
  // الاستماع لنقرات التنقل
  window.addEventListener('navigate', (e) => {
    navigateTo(e.detail);
  });
  
  // دعم زر الرجوع في المتصفح
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash, false);
  });
  
  // الصفحة الأولية
  const initialHash = window.location.hash.replace('#', '') || 'home';
  navigateTo(initialHash, false);
}

/**
 * الانتقال إلى صفحة
 */
export async function navigateTo(route, updateHistory = true) {
  if (!route) route = 'home';
  
  console.log('🧭 التنقل إلى:', route);
  currentRoute = route;
  
  const app = document.getElementById('app');
  if (!app) return;
  
  // تحديث URL (بدون إعادة تحميل)
  if (updateHistory) {
    const newHash = route === 'home' ? '' : `#${route}`;
    history.pushState({ route }, '', newHash || window.location.pathname);
  }
  
  // مسح الصفحة الحالية
  app.innerHTML = '';
  
  // بناء الصفحة الجديدة
  const cms = currentCMS || DEFAULT_CMS;
  
  try {
    if (route === 'booking') {
      app.appendChild(await buildBookingPage(cms));
    } else if (route === 'track') {
      app.appendChild(await buildTrackPage(cms));
    } else {
      app.appendChild(buildHomePage(cms));
    }
  } catch (error) {
    console.error('✗ خطأ في التنقل:', error);
    app.appendChild(buildHomePage(cms));
  }
  
  // تحديث الـCMS عند التغيير
  window.scrollTo({ top: 0, behavior: 'auto' });
  
  // تشغيل الـanimations
  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach(el => {
      el.classList.add('vis');
    });
  }, 100);
}

/**
 * الحصول على الصفحة الحالية
 */
export function getCurrentRoute() {
  return currentRoute;
}

console.log('✓ router.js محمّل');