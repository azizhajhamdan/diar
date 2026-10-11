// =============================================
// إدارة الصور - الحل الجذري لمشكلة الكاش
// =============================================

// =============================================
// Cache Buster
// =============================================

/**
 * إضافة cache buster لرابط الصورة
 * يحل مشكلة الصور القديمة في المتصفح
 */
export function withCacheBuster(url) {
  if (!url) return '';
  
  // Base64 → لا نحتاج
  if (url.startsWith('data:image')) {
    return url;
  }
  
  // روابط Firebase Storage
  if (url.includes('firebasestorage.googleapis.com')) {
    return addTimestamp(url);
  }
  
  // روابط خارجية (Unsplash, إلخ)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.includes('?v=')) {
      return url.replace(/\?v=[^&]*/, '?v=' + Date.now());
    }
    if (url.includes('?')) {
      return url + '&v=' + Date.now();
    }
    return url + '?v=' + Date.now();
  }
  
  // روابط محلية نسبية
  if (url.startsWith('/') || url.startsWith('./')) {
    return addTimestamp(url);
  }
  
  return url;
}

function addTimestamp(url) {
  const separator = url.includes('?') ? '&' : '?';
  return url + separator + 'v=' + Date.now();
}

// =============================================
// Compression
// =============================================

/**
 * ضغط صورة (data URL)
 */
export function compressImage(dataUrl, maxWidth = 1400, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
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

// =============================================
// Validation
// =============================================

/**
 * التحقق من صحة ملف الصورة
 */
export function validateImageFile(file) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  
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

// =============================================
// Read File
// =============================================

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// =============================================
// Process Upload
// =============================================

/**
 * معالجة صورة مرفوعة: قراءة + ضغط
 */
export async function processUploadedImage(file, options = {}) {
  const { maxWidth = 1400, quality = 0.85 } = options;
  
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const dataUrl = await readFileAsDataURL(file);
  const compressed = await compressImage(dataUrl, maxWidth, quality);
  
  return compressed;
}

// =============================================
// Thumbnail
// =============================================

export function getThumbnail(url, size = 400) {
  if (!url) return '';
  
  if (url.includes('firebasestorage.googleapis.com')) {
    const base = url.split('?')[0];
    return `${base}?alt=media&w=${size}`;
  }
  
  if (url.includes('images.unsplash.com')) {
    return url.replace(/w=\d+/, `w=${size}`).split('&v=')[0];
  }
  
  return url;
}

// =============================================
// Optimize URL
// =============================================

/**
 * تحسين رابط Unsplash حسب الاستخدام
 */
export function optimizeImage(url, size = 'card') {
  if (!url) return '';
  
  if (url.includes('images.unsplash.com')) {
    const sizes = {
      hero: 'w=1920&q=80',
      banner: 'w=1200&q=80',
      card: 'w=800&q=75',
      small: 'w=500&q=70',
      thumb: 'w=300&q=65'
    };
    
    const params = sizes[size] || sizes.card;
    const base = url.split('?')[0];
    return `${base}?${params}`;
  }
  
  if (url.startsWith('data:')) return url;
  
  return url;
}

// =============================================
// Srcset
// =============================================

/**
 * توليد srcset للصورة
 */
export function buildSrcset(url) {
  if (!url || !url.includes('images.unsplash.com')) return '';
  
  const base = url.split('?')[0];
  return [
    `${base}?w=400&q=70 400w`,
    `${base}?w=800&q=75 800w`,
    `${base}?w=1200&q=80 1200w`,
    `${base}?w=1920&q=80 1920w`
  ].join(', ');
}

console.log('✓ image.js محمّل');