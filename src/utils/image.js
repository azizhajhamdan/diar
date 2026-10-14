// =============================================
// معالجة الصور - ضغط، رفع، معاينة
// =============================================

// =============================================
// ضغط الصورة
// =============================================

/**
 * ضغط صورة من dataURL
 * @param {string} dataUrl - الصورة الأصلية
 * @param {number} maxWidth - العرض الأقصى
 * @param {number} quality - الجودة (0-1)
 * @returns {Promise<string>} - الصورة المضغوطة
 */
export function compressImage(dataUrl, maxWidth = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    
    img.onerror = () => reject(new Error('فشل تحميل الصورة'));
    img.src = dataUrl;
  });
}

// =============================================
// قراءة ملف كـ dataURL
// =============================================

/**
 * قراءة ملف صورة وتحويله لـ dataURL
 * @param {File} file - ملف الصورة
 * @returns {Promise<string>} - dataURL
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('فشل قراءة الملف'));
    
    reader.readAsDataURL(file);
  });
}

// =============================================
// معالجة صورة مرفوعة
// =============================================

/**
 * معالجة صورة مرفوعة (قراءة + ضغط)
 * @param {File} file - ملف الصورة
 * @param {object} options - خيارات
 * @returns {Promise<string>} - الصورة المضغوطة
 */
export async function processUploadedImage(file, options = {}) {
  const { maxWidth = 1200, quality = 0.75 } = options;
  
  // تحقق من النوع
  if (!file.type.startsWith('image/')) {
    throw new Error('الملف ليس صورة');
  }
  
  // تحقق من الحجم (10MB كحد أقصى للصورة الأصلية)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('الصورة كبيرة جداً (الحد الأقصى 10MB)');
  }
  
  // اقرأ الملف
  const dataUrl = await readFileAsDataURL(file);
  
  // اضغط
  const compressed = await compressImage(dataUrl, maxWidth, quality);
  
  return compressed;
}

// =============================================
// Cache Buster
// =============================================

/**
 * إضافة cache buster للرابط
 * @param {string} url - رابط الصورة
 * @returns {string} - الرابط مع cache buster
 */
export function withCacheBuster(url) {
  if (!url) return '';
  
  // إذا كان dataURL — لا نضيف
  if (url.startsWith('data:')) return url;
  
  // إذا كان رابط خارجي — نضيف timestamp
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
}

console.log('✓ utils/image.js محمّل');