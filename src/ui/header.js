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

console.log('✓ header.js محمّل');