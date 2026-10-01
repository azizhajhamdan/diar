// =============================================
// نقطة الدخول الرئيسية
// =============================================

import './styles/main.css';
import { fetchREST } from './data/rest.js';
import { DEFAULT_CMS } from './data/cms.js';
import { loadSavedTheme } from './ui/header.js';
import { initRouter } from './ui/router.js';
import './styles/admin.css';

console.log('🚀 ديّار - بدء التطبيق');

loadSavedTheme();

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

function showInstant() {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 200);
  
  console.log('⚡ عرض فوري');
}

async function updateFromFirebase() {
  try {
    console.log('📥 جلب البيانات من Firebase...');
    
    const [cmsData] = await Promise.all([
      fetchREST('cms'),
      fetchREST('orders')
    ]);
    
    if (cmsData) {
      const mergedCMS = deepMerge(DEFAULT_CMS, cmsData);
      console.log('✓ CMS وصل');
      initRouter(mergedCMS);
    } else {
      initRouter(DEFAULT_CMS);
    }
    
    loadFirebaseSDK();
    
  } catch (error) {
    console.warn('⚠️ فشل جلب Firebase:', error.message);
    initRouter(DEFAULT_CMS);
  }
}

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

showInstant();
updateFromFirebase();
