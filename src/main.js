// =============================================
// نقطة الدخول الرئيسية
// =============================================

import './styles/main.css';

import { initFirebase } from './data/firebase.js';
import { loadCMS, getCMS } from './data/cms.js';
import { loadOrders } from './data/orders.js';
import { initRouter } from './ui/router.js';

// =============================================
// State
// =============================================

let cmsLoaded = false;

// =============================================
// أنترو
// =============================================

function showIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;
  
  setTimeout(() => intro.classList.add('phase-1'), 100);
  setTimeout(() => intro.classList.add('phase-2'), 400);
  setTimeout(() => intro.classList.add('phase-3'), 800);
  setTimeout(() => intro.classList.add('hide'), 1600);
  setTimeout(() => {
    if (intro) intro.style.display = 'none';
  }, 2200);
  
  console.log('⚡ الأنترو');
}

// =============================================
// تطبيق الثيم
// =============================================

function applyTheme(theme) {
  const themeName = theme || 'gold';
  document.documentElement.setAttribute('data-theme', themeName);
  console.log('🎨 الثيم:', themeName);
}

// =============================================
// تطبيق الخطوط
// =============================================

function applyFonts(fonts) {
  if (!fonts) return;
  const heading = fonts.heading || 'Reem Kufi';
  const body = fonts.body || 'Cairo';
  
  document.documentElement.style.setProperty('--font-heading', `'${heading}', 'Cairo', sans-serif`);
  document.documentElement.style.setProperty('--font-body', `'${body}', 'Cairo', sans-serif`);
  
  console.log(`✓ الخطوط: ${heading} / ${body}`);
}

// =============================================
// Deep Merge
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
// عرض فوري + أنترو
// =============================================

function showInstant() {
  showIntro();
}

// =============================================
// تحميل من Firebase
// =============================================

async function updateFromFirebase() {
  try {
    console.log('📥 تحميل البيانات...');
    
    // تهيئة Firebase
    initFirebase();
    
    // ⏳ انتظر الأنترو
    setTimeout(async () => {
      try {
        // تحميل CMS
        const cms = await loadCMS();
        cmsLoaded = true;
        
        // تطبيق الثيم
        const theme = cms.appearance?.theme || 'gold';
        applyTheme(theme);
        
        // تطبيق الخطوط
        applyFonts(cms.fonts);
        
        // تحميل الطلبات
        await loadOrders();
        
        // تهيئة الراوتر
        initRouter(cms);
        
        // دعم QR Tracking (?track=DR-XXXX)
        const urlParams = new URLSearchParams(window.location.search);
        const trackId = urlParams.get('track');
        if (trackId) {
          console.log('🎯 QR Tracking:', trackId);
          window.__pendingTrackId = trackId;
          // الراوتر سيتعامل معه
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'track' }));
          }, 500);
        }
        
        console.log('✓ الموقع جاهز');
        
      } catch (error) {
        console.error('✗ خطأ في التحميل:', error);
        showError();
      }
    }, 1800);
    
  } catch (error) {
    console.error('✗ خطأ:', error);
    setTimeout(showError, 2000);
  }
}

// =============================================
// عرض خطأ
// =============================================

function showError() {
  const app = document.getElementById('app');
  if (!app) return;
  
  app.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px;text-align:center;">
      <div>
        <h2 style="margin-bottom:12px;font-family:var(--font-heading);">تعذر تحميل الموقع</h2>
        <p style="color:var(--text-muted);margin-bottom:24px;">تحقق من الاتصال ثم أعد المحاولة.</p>
        <button class="btn btn-primary" onclick="location.reload()">إعادة المحاولة</button>
      </div>
    </div>
  `;
}

// =============================================
// Firebase SDK (Live updates)
// =============================================

async function loadFirebaseSDK() {
  try {
    console.log('✓ Firebase SDK جاهز');
  } catch (error) {
    console.warn('⚠️ Firebase SDK:', error.message);
  }
}

// =============================================
// 🚀 ابدأ!
// =============================================

showInstant();
updateFromFirebase();

console.log('🚀 ديّار - بدء التطبيق');