// =============================================
// إدارة محتوى الموقع (CMS)
// =============================================

import { readData, writeData, listenData } from './firebase.js';

// =============================================
// البيانات الافتراضية
// تُستخدم عند أول تشغيل (قبل أي تعديل من اللوحة)
// =============================================

export const DEFAULT_CMS = {
  // الهيرو (القسم الرئيسي)
  hero: {
    brand: 'ديّار',
    tagline: 'نصنع من المكان',
    taglineAccent: 'حكاية',
    subtitle: 'صالونات، جلسات، ستائر وأقمشة فاخرة — جودة عالية وتفاصيل دقيقة تُروي قصة كل بيت.',
    cta1: 'احجز طلبك',
    cta2: 'شاهد أعمالنا',
    image: ''
  },
  
  // الأقسام الرئيسية
  categories: [
    {
      id: 'salon',
      num: '01',
      title: 'صالونات',
      en: 'Living Rooms',
      desc: 'تصاميم صالونات فاخرة بقماش وتنجيد احترافي',
      cover: '',
      images: []
    },
    {
      id: 'jalsa',
      num: '02',
      title: 'جلسات',
      en: 'Floor Seating',
      desc: 'جلسات أرضية عصرية بأقمشة وخامات فاخرة',
      cover: '',
      images: []
    },
    {
      id: 'curtains',
      num: '03',
      title: 'ستائر',
      en: 'Curtains',
      desc: 'ستائر وتفصيلات حديثة بأقمشة مختارة',
      cover: '',
      images: []
    },
    {
      id: 'fabrics',
      num: '04',
      title: 'أقمشة',
      en: 'Fabrics',
      desc: 'خامات وأقمشة فاخرة للتفصيل والتنجيد',
      cover: '',
      images: []
    }
  ],
  
  // المزايا (تحت الهيرو)
  features: [
    { icon: 'M20 6 9 17l-5-5', title: 'جودة استثنائية', desc: 'خامات مختارة بعناية' },
    { icon: 'M12 2v20M2 12h20', title: 'تصنيع مخصص', desc: 'كل طلب حسب مقاسك' },
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14', title: 'تسليم في الوقت', desc: 'التزام دقيق بالمواعيد' },
    { icon: 'M12 2 15 8.5 22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9L9 8.5z', title: 'خدمة راقية', desc: 'تجربة تفوق التوقعات' }
  ],
  
  // الأكثر طلباً
  toppicks: [
    { rank: '1', name: 'صالون الواحة', catLabel: 'صالونات', desc: 'صالون فاخر بتصميم عصري يجمع الدفء والأناقة.', image: '' },
    { rank: '2', name: 'مجلس الأصالة', catLabel: 'جلسات', desc: 'جلسة أرضية عصرية تعيد تفسير الضيافة العربية.', image: '' },
    { rank: '3', name: 'ستائر الحرير', catLabel: 'ستائر', desc: 'ستائر حريرية بتفصيلات حديثة تمنح المساحة فخامة.', image: '' }
  ],
  
  // عن ديّار
  about: {
    kicker: 'عن ديّار',
    title: 'حكاية تُصنع بعناية',
    paragraphs: [
      'ديّار للمفروشات علامة متخصصة في تصنيع الصالونات والجلسات والستائر وتوفير الأقمشة الفاخرة، بجودة عالية وتفاصيل دقيقة تُروي قصة كل بيت.',
      'نعمل على كل طلب بعناية فائقة — من اختيار الخامات، إلى التصميم، إلى التصنيع والتسليم. هدفنا أن نصنع من مكانك حكاية تُروى.'
    ],
    image: ''
  },
  
  // المعرض
  gallery: {
    kicker: 'معرضنا',
    title: 'من أعمالنا',
    desc: 'صور مختارة من مشاريعنا.',
    items: []
  },
  
  // CTA (قبل الفوتر)
  cta: {
    kicker: 'ابدأ الآن',
    title: 'جاهز لتصنيع',
    accent: 'طلبك؟',
    desc: 'تواصل معنا الآن وسنبدأ العمل على طلبك فوراً.'
  },
  
  // معلومات التواصل
  contact: {
    phone: '+218 91 000 0000',
    email: 'hello@diar.ly',
    address: 'صبراته، ليبيا',
    about: 'صالونات، جلسات، ستائر وأقمشة فاخرة. نصنع من المكان حكاية تُروى في كل تفصيلة.'
  },
  
  // التواصل الاجتماعي
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
    whatsapp: 'https://wa.me/218929411451',
    snapchat: ''
  },
  
  // الخطوط
  fonts: {
    heading: 'Reem Kufi',
    body: 'Cairo'
  },
  
  // إظهار/إخفاء الأقسام
  visibility: {
    features: true,
    categories: true,
    toppicks: true,
    about: true,
    gallery: true,
    cta: true
  }
};

// =============================================
// الحالة الحالية (State)
// =============================================

let currentCMS = null;
let listeners = [];

// =============================================
// الدوال الرئيسية
// =============================================

/**
 * تحميل CMS من Firebase
 * إذا لم يوجد، نحفظ الافتراضي
 */
export async function loadCMS() {
  try {
    console.log('📥 جاري تحميل CMS من Firebase...');
    
    const data = await readData('cms');
    
    if (data && typeof data === 'object') {
      // دمج مع الافتراضي (لأي حقل جديد)
      currentCMS = deepMerge(DEFAULT_CMS, data);
      console.log('✓ تم تحميل CMS من Firebase');
    } else {
      // أول مرة — نحفظ الافتراضي
      console.log('📝 أول تشغيل — حفظ CMS الافتراضي');
      currentCMS = { ...DEFAULT_CMS };
      await writeData('cms', currentCMS);
    }
    
    notifyListeners();
    return currentCMS;
    
  } catch (error) {
    console.error('✗ خطأ في تحميل CMS:', error);
    // استخدام الافتراضي عند الفشل
    currentCMS = { ...DEFAULT_CMS };
    return currentCMS;
  }
}

/**
 * الحصول على CMS الحالي
 */
export function getCMS() {
  return currentCMS || { ...DEFAULT_CMS };
}

/**
 * تحديث CMS (جزئي)
 */
export async function updateCMS(partialData) {
  try {
    currentCMS = deepMerge(currentCMS || DEFAULT_CMS, partialData);
    await writeData('cms', currentCMS);
    notifyListeners();
    console.log('✓ تم تحديث CMS');
    return true;
  } catch (error) {
    console.error('✗ خطأ في تحديث CMS:', error);
    throw error;
  }
}

/**
 * الاستماع لتغييرات CMS (Live)
 */
export function onCMSChange(callback) {
  listeners.push(callback);
  
  // استدعاء فوري بالبيانات الحالية
  if (currentCMS) {
    callback(currentCMS);
  }
  
  // إرجاع دالة لإلغاء الاستماع
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
}

// =============================================
// دوال مساعدة داخلية
// =============================================

/**
 * دمج عميق لكائنين
 */
function deepMerge(target, source) {
  const output = { ...target };
  
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  });
  
  return output;
}

/**
 * إبلاغ المستمعين
 */
function notifyListeners() {
  listeners.forEach(callback => {
    try {
      callback(currentCMS);
    } catch (error) {
      console.error('Listener error:', error);
    }
  });
}

console.log('✓ cms.js محمّل');