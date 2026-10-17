// =============================================
// نقطة الدخول الرئيسية — نسخة سريعة
// =============================================

import './styles/main.css';
import './styles/admin.css';
import './styles/invoice.css';
import { fetchREST } from './data/rest.js';
import { DEFAULT_CMS } from './data/cms.js';
import { initRouter } from './ui/router.js';

console.log('🚀 ديّار - بدء التطبيق');

// =============================================
// تطبيق الخطوط
// =============================================

function applyFonts(fonts) {
  if (!fonts) return;
  
  const heading = fonts.heading || 'GE SS Unique';
  const body = fonts.body || 'IBM Plex Sans Arabic';
  
  document.documentElement.style.setProperty('--font-heading', `'${heading}', 'Cairo', sans-serif`);
  document.documentElement.style.setProperty('--font-body', `'${body}', 'Cairo', sans-serif`);
  
  console.log(`✓ تم تطبيق الخطوط: ${heading} / ${body}`);
}

// =============================================
// دمج عميق
// =============================================

function deepMerge(target, source) {
  const output = { ...target };
  Object.keys(source || {}).forEach(key => {
    const sourceVal = source[key];
    const targetVal = target[key];
    if (sourceVal && typeof sourceVal === 'object' && !Array.isArray(sourceVal)) {
      output[key] = deepMerge(targetVal || {}, sourceVal);
    } else {
      output[key] = sourceVal;
    }
  });
  return output;
}

// =============================================
// الأنترو السريع
// =============================================

function showIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;
  
  setTimeout(() => intro.classList.add('phase-1'), 50);
  setTimeout(() => intro.classList.add('phase-2'), 200);
  setTimeout(() => intro.classList.add('phase-3'), 500);
  setTimeout(() => intro.classList.add('hide'), 1000);  // ← أسرع (كان 1600)
  setTimeout(() => {
    if (intro) intro.style.display = 'none';
  }, 1500);
  
  console.log('⚡ الأنترو');
}

// =============================================
// 🚀 ابدأ فوراً — اعرض الواجهة فوراً
// =============================================

// 1) ابدأ الأنترو
showIntro();

// 2) طبّق الخطوط الافتراضية فوراً
applyFonts(DEFAULT_CMS.fonts);

// 3) اعرض الموقع مباشرة (بدون انتظار Firebase)
console.log('⚡ عرض الموقع فوراً بالقيم الافتراضية');
initRouter(DEFAULT_CMS);

// 4) بعد الأنترو — حمّل Firebase في الخلفية
setTimeout(async () => {
  try {
    console.log('📥 جلب البيانات من Firebase (خلفية)...');
    const cmsData = await fetchREST('cms');
    
    if (cmsData) {
      const mergedCMS = deepMerge(DEFAULT_CMS, cmsData);
      console.log('✓ CMS وصل — تحديث المحتوى');
      
      // حدّث الخطوط إذا تغيّرت
      if (mergedCMS.fonts) applyFonts(mergedCMS.fonts);
      
      // أعد بناء الصفحة بالبيانات الجديدة
      initRouter(mergedCMS);
    }
  } catch (error) {
    console.warn('⚠️ فشل Firebase — الموقع يعمل بالقيم الافتراضية:', error.message);
  }
  
  // 5) تحميل Firebase SDK (مستقل)
  try {
    const { initFirebase } = await import('./data/firebase.js');
    const { loadOrders } = await import('./data/orders.js');
    
    initFirebase();
    await loadOrders();
    
    console.log('✓ Firebase SDK جاهز');
  } catch (error) {
    console.warn('⚠️ Firebase SDK فشل:', error.message);
  }
}, 1200);  // ← بعد 1.2 ثانية (بعد الأنترو)

// =============================================
// معالجة ?track=DR-XXXX من QR
// =============================================

function handleTrackQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const trackId = urlParams.get('track');
  
  if (!trackId) return;
  
  console.log('🎯 QR Scan detected:', trackId);
  
  let attempts = 0;
  const maxAttempts = 30;
  
  const tryNavigate = () => {
    attempts++;
    
    if (window.__diarRouterReady) {
      window.__pendingTrackId = trackId;
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'track' }));
      console.log('✓ تم الانتقال لصفحة التتبع');
      
      setTimeout(() => {
        window.history.replaceState({}, '', '/#track');
      }, 500);
      
      return;
    }
    
    if (attempts < maxAttempts) {
      setTimeout(tryNavigate, 200);
    } else {
      console.warn('⚠️ الراوتر لم يجهز بعد');
    }
  };
  
  setTimeout(tryNavigate, 500);
}

handleTrackQuery();
