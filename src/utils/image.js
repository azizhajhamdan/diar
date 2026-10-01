// =============================================
// إدارة الصور — الحل الجذري لمشكلة الكاش
// =============================================

/**
 * إضافة cache buster لرابط الصورة
 * 
 * الفكرة:
 * - الصور المرفوعة (Base64) لا تحتاج أي إضافة
 * - الصور الخارجية (http) تحتاج ?v=timestamp
 * - الصور المحلية (/images/) تحتاج ?v=hash
 * 
 * @param {string} url - رابط الصورة
 * @returns {string} - الرابط مع cache buster
 */
export function withCacheBuster(url) {
  if (!url) return '';
  
  // 1. Base64 → لا نحتاج أي إضافة
  if (url.startsWith('data:image')) {
    return url;
  }
  
  // 2. روابط Firebase Storage → نضيف timestamp
  if (url.includes('firebasestorage.googleapis.com')) {
    return addTimestamp(url);
  }
  
  // 3. روابط خارجية (Unsplash, etc) → نضيف timestamp
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // إذا عنده ?v= بالفعل، نستبدله
    if (url.includes('?v=')) {
      return url.replace(/\?v=[^&]*/, '?v=' + Date.now());
    }
    // إذا عنده params أخرى
    if (url.includes('?')) {
      return url + '&v=' + Date.now();
    }
    // رابط نظيف
    return url + '?v=' + Date.now();
  }
  
  // 4. روابط محلية نسبية
  if (url.startsWith('/') || url.startsWith('./')) {
    return addTimestamp(url);
  }
  
  return url;
}

/**
 * إضافة ?v=timestamp لرابط
 */
function addTimestamp(url) {
  const separator = url.includes('?') ? '&' : '?';
  return url + separator + 'v=' + Date.now();
}

/**
 * إضافة cache buster لكل الصور في عنصر HTML
 * @param {HTMLElement} container - العنصر الجذر
 */
export function bustCacheInContainer(container) {
  if (!container) return;
  
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    const originalSrc = img.getAttribute('data-src') || img.src;
    if (originalSrc && !originalSrc.includes('?v=')) {
      img.src = withCacheBuster(originalSrc);
    }
  });
  
  // أيضاً نعالج background-image في CSS
  const elements = container.querySelectorAll('[data-bg]');
  elements.forEach(el => {
    const bg = el.getAttribute('data-bg');
    if (bg) {
      el.style.backgroundImage = `url('${withCacheBuster(bg)}')`;
    }
  });
}

/**
 * ضغط صورة (للاستخدام من لوحة التحكم)
 * @param {string} dataUrl - البيانات الأصلية
 * @param {number} maxWidth - العرض الأقصى
 * @param {number} quality - الجودة (0-1)
 * @returns {Promise<string>} - الصورة المضغوطة
 */
export function compressImage(dataUrl, maxWidth = 1400, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // تصغير إذا كان كبيراً
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // ضغط
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('فشل تحميل الصورة'));
    img.src = dataUrl;
  });
}

/**
 * التحقق من صحة الصورة
 * @param {File} file - الملف المرفوع
 * @returns {Object} - { valid: boolean, error: string }
 */
export function validateImageFile(file) {
  // الحد الأقصى: 5MB
  const MAX_SIZE = 5 * 1024 * 1024;
  
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'الملف ليس صورة' };
  }
  
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'حجم الصورة يجب أن يكون أقل من 5MB' };
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'نوع الصورة غير مدعوم (استخدم JPG, PNG, WebP, أو GIF)' };
  }
  
  return { valid: true, error: '' };
}

/**
 * قراءة ملف كـ Data URL
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * معالجة صورة مرفوعة: قراءة + ضغط
 */
export async function processUploadedImage(file, options = {}) {
  const { maxWidth = 1400, quality = 0.85 } = options;
  
  // التحقق
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // قراءة
  const dataUrl = await readFileAsDataURL(file);
  
  // ضغط
  const compressed = await compressImage(dataUrl, maxWidth, quality);
  
  return compressed;
}

/**
 * الحصول على الصورة المصغرة
 */
export function getThumbnail(url, size = 400) {
  if (!url) return '';
  
  // Firebase Storage يدعم معاملات الحجم
  if (url.includes('firebasestorage.googleapis.com')) {
    const base = url.split('?')[0];
    return `${base}?alt=media&w=${size}`;
  }
  
  // Unsplash يدعم ?w=
  if (url.includes('images.unsplash.com')) {
    return url.replace(/w=\d+/, `w=${size}`).split('&v=')[0];
  }
  
  return url;
}

console.log('✓ image.js محمّل');