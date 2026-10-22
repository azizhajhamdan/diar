// =============================================
// نقطة الدخول الرئيسية — نسخة محسّنة للسرعة
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
  const heading = fonts.heading || 'Reem Kufi';
  const body = fonts.body || 'IBM Plex Sans Arabic';
  document.documentElement.style.setProperty('--font-heading', `'${heading}', 'Cairo', sans-serif`);
  document.documentElement.style.setProperty('--font-body', `'${body}', 'Cairo', sans-serif`);
  console.log(`✓ الخطوط: ${heading} / ${body}`);
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
// الأنترو (مرة واحدة فقط)
// =============================================
function showIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;
  
  setTimeout(() => intro.classList.add('phase-1'), 50);
  setTimeout(() => intro.classList.add('phase-2'), 200);
  setTimeout(() => intro.classList.add('phase-3'), 500);
  setTimeout(() => intro.classList.add('hide'), 900);
  setTimeout(() => {
    intro.style.display = 'none';
    document.body.classList.add('intro-done');
  }, 1300);
  
  console.log('⚡ الأنترو');
}

// =============================================
// 🚀 ابدأ فوراً
// =============================================

// 1. الأنترو
showIntro();

// 2. الخطوط الافتراضية
applyFonts(DEFAULT_CMS.fonts);

// 3. عرض الموقع فوراً (بدون انتظار Firebase)
initRouter(DEFAULT_CMS);

// 4. جلب البيانات من Firebase (مرة واحدة فقط، بعد ثانية)
setTimeout(async () => {
  try {
    console.log('📥 جلب البيانات من Firebase...');
    const cmsData = await fetchREST('cms');
    
    if (cmsData) {
      const mergedCMS = deepMerge(DEFAULT_CMS, cmsData);
      console.log('✓ CMS وصل');
      if (mergedCMS.fonts) applyFonts(mergedCMS.fonts);
      
      // إعادة بناء الصفحة بالبيانات الجديدة
      initRouter(mergedCMS);
    }
  } catch (error) {
    console.warn('⚠️ فشل Firebase — الموقع يعمل بالقيم الافتراضية');
  }
}, 1000); // ← تأخير ثانية واحدة فقط لضمان ظهور الواجهة أولاً