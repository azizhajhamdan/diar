// =============================================
// الهيدر (الشريط العلوي)
// =============================================

import { el, svg } from '../utils/helpers.js';

export function buildHeader() {
  const header = el('header', { class: 'header', id: 'header' });
  const container = el('div', { class: 'container' });
  const inner = el('div', { class: 'header-inner' });

  // الشعار
  const logo = el('a', {
    class: 'logo',
    href: '#',
    onclick: (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  logo.innerHTML = 'ديّار<span>.</span><span class="logo-sub">للمفروشات</span>';

  // روابط التنقل
  const nav = el('nav', { class: 'nav-links' });
  [
    { label: 'الأقسام', target: 'categories' },
    { label: 'الأكثر طلباً', target: 'toppicks' },
    { label: 'عن ديّار', target: 'about' },
    { label: 'أعمالنا', target: 'gallery' },
    { label: 'احجز الآن', target: 'booking' },
    { label: 'تتبع طلبك', target: 'track' }
  ].forEach(item => {
    const a = el('a', {
      href: '#',
      onclick: (e) => {
        e.preventDefault();
        handleNavClick(item.target);
      }
    }, [item.label]);
    nav.appendChild(a);
  });

  // أزرار الإجراءات
  const actions = el('div', { class: 'nav-actions' });
  
  // زر الوضع النهاري/الليلي
  const themeBtn = el('button', {
    class: 'icon-btn',
    'aria-label': 'تبديل الوضع',
    onclick: toggleTheme
  });
  themeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  `;
  actions.appendChild(themeBtn);

  // زر الحجز
  const bookBtn = el('button', {
    class: 'icon-btn',
    'aria-label': 'احجز',
    title: 'احجز',
    onclick: () => handleNavClick('booking')
  });
  bookBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  `;
  actions.appendChild(bookBtn);

  // تجميع
  inner.appendChild(logo);
  inner.appendChild(nav);
  inner.appendChild(actions);
  container.appendChild(inner);
  header.appendChild(container);

  // الاستماع للتمرير (لتفعيل الوضع المضغوط)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  return header;
}

// =============================================
// التنقل
// =============================================

function handleNavClick(target) {
  // للصفحات الرئيسية
  if (['booking', 'track'].includes(target)) {
    // سنضيف نظام Routes لاحقاً
    console.log('Navigate to:', target);
    window.dispatchEvent(new CustomEvent('navigate', { detail: target }));
    return;
  }
  
  // للأقسام في نفس الصفحة
  const element = document.getElementById(target);
  if (element) {
    const offset = 80;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// =============================================
// تبديل الوضع
// =============================================

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  
  try {
    localStorage.setItem('diar_theme', newTheme);
  } catch (e) {}
  
  console.log('🎨 الوضع:', newTheme === 'dark' ? 'داكن' : 'نهاري');
}

// =============================================
// استرجاع الوضع المحفوظ
// =============================================

export function loadSavedTheme() {
  try {
    const saved = localStorage.getItem('diar_theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {}
}

console.log('✓ header.js محمّل');