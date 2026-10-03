// =============================================
// نقطة الدخول الرئيسية
// =============================================

import './styles/main.css';
import './styles/admin.css';
import { fetchREST } from './data/rest.js';
import { DEFAULT_CMS } from './data/cms.js';
import { loadSavedTheme } from './ui/header.js';
import { initRouter } from './ui/router.js';

console.log('🚀 ديّار - بدء التطبيق');

loadSavedTheme();

// =============================================
// تطبيق الخطوط
// =============================================

function applyFonts(fonts) {
  if (!fonts) return;
  
  const heading = fonts.heading || 'Reem Kufi';
  const body = fonts.body || 'Cairo';
  
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
// 1. عرض فوري
// =============================================

function showInstant() {
  const intro = document.getElementById('intro');
  if (intro) {
    setTimeout(() => intro.classList.add('phase-1'), 100);
    setTimeout(() => intro.classList.add('phase-2'), 400);
    setTimeout(() => intro.classList.add('phase-3'), 800);
    
    // ابدأ الإخفاء في نفس لحظة بناء الموقع
    setTimeout(() => intro.classList.add('hide'), 1600);
    
    // إزالة من DOM بعد انتهاء الإخفاء
    setTimeout(() => {
      if (intro) intro.style.display = 'none';
    }, 2200);
    
    console.log('⚡ الأنترو');
  }
}
// =============================================
// 2. تحديث من Firebase
// =============================================

async function updateFromFirebase() {
  try {
    console.log('📥 جلب البيانات من Firebase...');
    
    const [cmsData] = await Promise.all([
      fetchREST('cms'),
      fetchREST('orders')
    ]);
    
   
        // ⏳ انتظر انتهاء الأنترو (1.6 ثانية)
    setTimeout(() => {
      if (cmsData) {
        const mergedCMS = deepMerge(DEFAULT_CMS, cmsData);
        console.log('✓ CMS وصل');
        if (mergedCMS.fonts) applyFonts(mergedCMS.fonts);
        initRouter(mergedCMS);
      } else {
        initRouter(DEFAULT_CMS);
      }
    }, 1600);
    
    // Firebase SDK في الخلفية (لا يوقف)
    loadFirebaseSDK();
    
  } catch (error) {
    console.warn('⚠️ فشل جلب Firebase:', error.message);
    // حتى في الفشل — انتظر الأنترو
    setTimeout(() => initRouter(DEFAULT_CMS), 1800);
  }
}

// =============================================
// 3. Firebase SDK في الخلفية
// =============================================

async function loadFirebaseSDK() {
  try {
    const { initFirebase } = await import('./data/firebase.js');
    const { loadOrders } = await import('./data/orders.js');
    
    initFirebase();
    await loadOrders();
    
    console.log('✓ Firebase SDK جاهز');
  } catch (error) {
    console.warn('⚠️ Firebase SDK فشل:', error.message);
  }
}

// 🚀 ابدأ!
showInstant();
updateFromFirebase();