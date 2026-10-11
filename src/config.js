// =============================================
// إعدادات Firebase + الموقع
// =============================================

// =============================================
// Firebase Configuration
// =============================================
// ⚠️ هذه المفاتيح عامة وآمنة للنشر
// الحماية الحقيقية عبر Firebase Rules

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCIIWNMZ70ku1qgXbKa-PSg623ToAO7K5Q",
  authDomain: "diar-80d21.firebaseapp.com",
  databaseURL: "https://diar-80d21-default-rtdb.firebaseio.com",
  projectId: "diar-80d21",
  storageBucket: "diar-80d21.firebasestorage.app",
  messagingSenderId: "484403770891",
  appId: "1:484403770891:web:aff3bfe9ab1a5569e4790e",
  measurementId: "G-6KB05WDX94"
};

// =============================================
// إعدادات الموقع
// =============================================

export const SITE_CONFIG = {
  name: 'ديّار',
  nameEn: 'DIAR',
  tagline: 'نصنع من المكان حكاية',
  
  // رقم الواتساب (بدون + وبدون مسافات)
  whatsapp: '218929411451',
  
  // كلمة مرور لوحة التحكم
  adminKey: 'diar2024',
  
  // مسار لوحة التحكم
  adminRoute: 'admin',
  
  // عنوان الموقع
  url: 'https://diar.homee.workers.dev'
};

// =============================================
// API Endpoints
// =============================================

export const API = {
  restUrl: FIREBASE_CONFIG.databaseURL,
  cmsEndpoint: `${FIREBASE_CONFIG.databaseURL}/cms.json`,
  ordersEndpoint: `${FIREBASE_CONFIG.databaseURL}/orders.json`
};

// =============================================
// الثيمات المتاحة
// =============================================

export const THEMES = [
  { key: 'gold', label: 'الذهبي', desc: 'أسود + ذهبي كلاسيكي' },
  { key: 'olive', label: 'الزيتي', desc: 'أبيض + زيتي فاخر' },
  { key: 'burgundy', label: 'البرقندي', desc: 'نبيتي داكن راقٍ' },
  { key: 'royal', label: 'الأزرق الملكي', desc: 'كحلي فاخر' },
  { key: 'yagouri', label: 'الياجوري', desc: 'قرميدي محروق' }
];

// =============================================
// طرق الدفع
// =============================================

export const PAYMENT_METHODS = {
  cash: { id: 'cash', label: 'كاش' },
  card: { id: 'card', label: 'بطاقة' },
  transfer: { id: 'transfer', label: 'حوالة بنكية' }
};

console.log('✓ config.js محمّل');