// =============================================
// دوال مساعدة عامة
// =============================================

// =============================================
// Query Selectors
// =============================================

export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return Array.from(document.querySelectorAll(selector));
}

// =============================================
// إنشاء عناصر HTML
// =============================================

/**
 * إنشاء عنصر HTML
 * @param {string} tag - نوع العنصر
 * @param {object} attrs - الخصائص
 * @param {array|string} children - الأبناء
 */
export function el(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key === 'style' && typeof value === 'string') {
      element.setAttribute('style', value);
    } else if (key === 'html') {
      element.innerHTML = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value !== null && value !== undefined && value !== false) {
      element.setAttribute(key, value);
    }
  });
  
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

// =============================================
// التواريخ
// =============================================

export function formatDate(date, format = 'ar') {
  const d = date instanceof Date ? date : new Date(date);
  
  const options = format === 'ar'
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' };
  
  return d.toLocaleDateString(format === 'ar' ? 'ar-LY' : 'en-US', options);
}

// =============================================
// توليد رقم طلب
// =============================================

export function generateOrderId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DR-${random}`;
}

// =============================================
// التأخير
// =============================================

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================
// النسخ للحافظة
// =============================================

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

// =============================================
// Debounce
// =============================================

export function debounce(fn, ms = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// =============================================
// Throttle
// =============================================

export function throttle(fn, ms = 300) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// =============================================
// التحقق من رقم الهاتف الليبي
// =============================================

export function isValidLibyanPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+?218|0)?9[1-6]\d{7}$/.test(cleaned);
}

// =============================================
// تنظيف رقم الهاتف
// =============================================

export function cleanPhone(phone) {
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('0')) cleaned = '218' + cleaned.slice(1);
  if (!cleaned.startsWith('218')) cleaned = '218' + cleaned;
  return cleaned;
}

// =============================================
// تنسيق المبالغ
// =============================================

export function formatMoney(amount) {
  const num = parseFloat(amount) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }) + ' د.ل';
}

// =============================================
// الانحدار (Fade Up)
// =============================================

export function revealElements(selector = '.fade-up') {
  const elements = document.querySelectorAll(selector + ':not(.vis)');
  
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('vis'));
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
}

// =============================================
// Scroll إلى عنصر
// =============================================

export function scrollToId(id, offset = 80) {
  const target = document.getElementById(id);
  if (target) {
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    return true;
  }
  return false;
}

// =============================================
// Escape HTML
// =============================================

export function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

console.log('✓ helpers.js محمّل');