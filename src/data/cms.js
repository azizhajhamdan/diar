// =============================================
// إدارة محتوى الموقع (CMS)
// =============================================

import { readData, writeData } from './firebase.js';

// =============================================
// البيانات الافتراضية
// =============================================

export const DEFAULT_CMS = {
  hero: {
    brand: 'ديّار',
    tagline: 'نصنع من المكان',
    taglineAccent: 'حكاية',
    subtitle: 'صالونات، جلسات، ستائر وأقمشة فاخرة — جودة عالية وتفاصيل دقيقة تُروي قصة كل بيت.',
    cta1: 'احجز طلبك',
    cta2: 'شاهد أعمالنا',
    image: ''
  },
  
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
  
  features: [
    { icon: 'M20 6 9 17l-5-5', title: 'جودة استثنائية', desc: 'خامات مختارة بعناية' },
    { icon: 'M12 2v20M2 12h20', title: 'تصنيع مخصص', desc: 'كل طلب حسب مقاسك' },
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14', title: 'تسليم في الوقت', desc: 'التزام دقيق بالمواعيد' },
    { icon: 'M12 2 15 8.5 22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9L9 8.5z', title: 'خدمة راقية', desc: 'تجربة تفوق التوقعات' }
  ],
  
  toppicks: [
    { rank: '1', name: 'صالون الواحة', catLabel: 'صالونات', desc: 'صالون فاخر بتصميم عصري يجمع الدفء والأناقة.', image: '' },
    { rank: '2', name: 'مجلس الأصالة', catLabel: 'جلسات', desc: 'جلسة أرضية عصرية تعيد تفسير الضيافة العربية.', image: '' },
    { rank: '3', name: 'ستائر الحرير', catLabel: 'ستائر', desc: 'ستائر حريرية بتفصيلات حديثة تمنح المساحة فخامة.', image: '' }
  ],
  
  about: {
    kicker: 'عن ديّار',
    title: 'حكاية تُصنع بعناية',
    paragraphs: [
      'ديّار للمفروشات علامة متخصصة في تصنيع الصالونات والجلسات والستائر وتوفير الأقمشة الفاخرة، بجودة عالية وتفاصيل دقيقة تُروي قصة كل بيت.',
      'نعمل على كل طلب بعناية فائقة — من اختيار الخامات، إلى التصميم، إلى التصنيع والتسليم. هدفنا أن نصنع من مكانك حكاية تُروى.'
    ],
    image: ''
  },
  
  gallery: {
    kicker: 'معرضنا',
    title: 'من أعمالنا',
    desc: 'صور مختارة من مشاريعنا.',
    items: []
  },
  
  cta: {
    kicker: 'ابدأ الآن',
    title: 'جاهز لتصنيع',
    accent: 'طلبك؟',
    desc: 'تواصل معنا الآن وسنبدأ العمل على طلبك فوراً.'
  },
  
  contact: {
    phone: '+218 91 000 0000',
    email: 'hello@diar.ly',
    address: 'صبراته، ليبيا',
    about: 'صالونات، جلسات، ستائر وأقمشة فاخرة. نصنع من المكان حكاية تُروى في كل تفصيلة.'
  },
  
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
    whatsapp: 'https://wa.me/218929411451',
    snapchat: ''
  },
  
  fonts: {
    heading: 'Reem Kufi',
    body: 'Cairo'
  },
  
  appearance: {
    theme: 'gold'
  },
  
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
// State
// =============================================

let currentCMS = null;
let listeners = [];

// =============================================
// تحميل CMS من Firebase
// =============================================

export async function loadCMS() {
  try {
    console.log('📥 تحميل CMS...');
    
    const data = await readData('cms');
    
    if (data && typeof data === 'object') {
      currentCMS = deepMerge(DEFAULT_CMS, data);
      console.log('✓ تم تحميل CMS من Firebase');
    } else {
      console.log('📝 أول تشغيل — حفظ CMS الافتراضي');
      currentCMS = { ...DEFAULT_CMS };
      await writeData('cms', currentCMS);
    }
    
    notifyListeners();
    return currentCMS;
    
  } catch (error) {
    console.error('✗ خطأ في تحميل CMS:', error);
    currentCMS = { ...DEFAULT_CMS };
    return currentCMS;
  }
}

// =============================================
// الحصول على CMS
// =============================================

export function getCMS() {
  return currentCMS || { ...DEFAULT_CMS };
}

// =============================================
// تحديث CMS
// =============================================

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

// =============================================
// الاستماع للتغييرات
// =============================================

export function onCMSChange(callback) {
  listeners.push(callback);
  
  if (currentCMS) {
    callback(currentCMS);
  }
  
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
}

// =============================================
// Deep Merge
// =============================================

function deepMerge(target, source) {
  const output = { ...target };
  
  Object.keys(source).forEach(key => {
    if (
      source[key] && 
      typeof source[key] === 'object' && 
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  });
  
  return output;
}

// =============================================
// إبلاغ المستمعين
// =============================================

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