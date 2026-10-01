// =============================================
// دوال مساعدة عامة
// =============================================

/**
 * اختصار querySelector
 */
export function $(selector) {
  return document.querySelector(selector);
}

/**
 * اختصار querySelectorAll (يرجع Array)
 */
export function $$(selector) {
  return Array.from(document.querySelectorAll(selector));
}

/**
 * إنشاء عنصر HTML
 * @param {string} tag - نوع العنصر (div, span, etc)
 * @param {object} attrs - الخصائص (class, id, onclick, etc)
 * @param {array|string} children - الأبناء (نصوص أو عناصر)
 */
export function el(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  
  // إضافة الخصائص
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key === 'html') {
      element.innerHTML = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value !== null && value !== undefined) {
      element.setAttribute(key, value);
    }
  });
  
  // إضافة الأبناء
  if (!Array.isArray(children)) children = [children];
  children.forEach(child => {
    if (child === null || child === undefined || child === false) return;
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * إنشاء أيقونة SVG
 * @param {string} path - مسار SVG (d attribute)
 * @param {object} opts - خيارات (width, height, stroke)
 */
export function svg(path, opts = {}) {
  const ns = 'http://www.w3.org/2000/svg';
  const s = document.createElementNS(ns, 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', opts.width || '1.7');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.setAttribute('class', opts.class || 'icon');
  
  if (opts.size) {
    s.style.width = opts.size + 'px';
    s.style.height = opts.size + 'px';
  }
  
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', path);
  s.appendChild(p);
  
  return s;
}

/**
 * تنسيق التاريخ
 */
export function formatDate(date, format = 'ar') {
  const d = date instanceof Date ? date : new Date(date);
  
  const options = format === 'ar' 
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' };
  
  return d.toLocaleDateString(format === 'ar' ? 'ar-LY' : 'en-US', options);
}

/**
 * توليد رقم طلب فريد
 */
export function generateOrderId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DR-${random}`;
}

/**
 * تأخير (Promise)
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * نسخ نص للحافظة
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
}

/**
 * Debounce - تأخير تنفيذ دالة
 */
export function debounce(fn, ms = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Throttle - تحديد معدل التنفيذ
 */
export function throttle(fn, ms = 300) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * التحقق من رقم الهاتف الليبي
 */
export function isValidLibyanPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+?218|0)?9[1-6]\d{7}$/.test(cleaned);
}

/**
 * تنظيف رقم الهاتف (للـWhatsApp)
 */
export function cleanPhone(phone) {
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('0')) cleaned = '218' + cleaned.slice(1);
  if (!cleaned.startsWith('218')) cleaned = '218' + cleaned;
  return cleaned;
}

console.log('✓ helpers.js محمّل');