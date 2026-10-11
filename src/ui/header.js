// =============================================
// الهيدر (الشريط العلوي)
// =============================================

import { el, svg } from '../utils/helpers.js';

// =============================================
// بناء الهيدر
// =============================================

export function buildHeader() {
  const header = el('header', { class: 'header', id: 'header' });
  const container = el('div', { class: 'container' });
  const inner = el('div', { class: 'header-inner' });

  // ═══ الشعار ═══
  const logo = el('a', {
    class: 'nav-logo',
    href: '#',
    onclick: (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  logo.innerHTML = 'ديّار<span>.</span><span class="logo-sub">للمفروشات</span>';

  // ═══ روابط التنقل ═══
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

  // ═══ أزرار الإجراءات ═══
  const actions = el('div', { class: 'nav-actions' });

  // زر القائمة (الجوال)
  const menuBtn = el('button', {
    class: 'icon-btn mobile-toggle',
    id: 'menu-btn',
    'aria-label': 'القائمة',
    onclick: () => openMenu()
  });
  menuBtn.innerHTML = `
    <svg class="i" viewBox="0 0 24 24">
      <path d="M3 6h18M3 12h18M3 18h18"/>
    </svg>
  `;
  actions.appendChild(menuBtn);

  // تجميع
  inner.appendChild(logo);
  inner.appendChild(nav);
  inner.appendChild(actions);
  container.appendChild(inner);
  header.appendChild(container);

  // ═══ الاستماع للتمرير ═══
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
// القائمة الجوال
// =============================================

export function buildMobileMenu() {
  const menu = el('div', { id: 'mobile-menu' });
  
  const bg = el('div', { class: 'bg' });
  menu.appendChild(bg);
  
  const inner = el('div', { class: 'inner' });
  
  // الأعلى
  const top = el('div', { class: 'top' });
  const logo = el('span', { class: 'logo', style: 'font-size:28px' });
  logo.innerHTML = 'ديّار<span class="dot">.</span>';
  top.appendChild(logo);
  
  const closeBtn = el('button', {
    class: 'icon-btn',
    'aria-label': 'إغلاق',
    onclick: () => closeMenu()
  });
  closeBtn.innerHTML = `
    <svg class="i" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>
  `;
  top.appendChild(closeBtn);
  inner.appendChild(top);
  
  // الروابط
  const nav = el('nav');
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
        closeMenu();
        setTimeout(() => handleNavClick(item.target), 100);
      }
    });
    a.appendChild(document.createTextNode(item.label));
    
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('viewBox', '0 0 24 24');
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke', 'currentColor');
    arrow.setAttribute('stroke-width', '2');
    arrow.setAttribute('stroke-linecap', 'round');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M9 18l6-6-6-6');
    arrow.appendChild(path);
    a.appendChild(arrow);
    
    nav.appendChild(a);
  });
  inner.appendChild(nav);
  
  // الأسفل
  const foot = el('div', { class: 'foot' }, ['ديّار للمفروشات — نصنع من المكان حكاية']);
  inner.appendChild(foot);
  
  menu.appendChild(inner);
  return menu;
}

// =============================================
// فتح/إغلاق القائمة
// =============================================

export function openMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// =============================================
// التنقل
// =============================================

function handleNavClick(target) {
  // للصفحات
  if (['booking', 'track'].includes(target)) {
    window.dispatchEvent(new CustomEvent('navigate', { detail: target }));
    return;
  }
  
  // للأقسام في نفس الصفحة
  const element = document.getElementById(target);
  if (element) {
    const offset = 80;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  } else {
    // إذا لم يوجد العنصر — اذهب للرئيسية أولاً
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    setTimeout(() => {
      const el = document.getElementById(target);
      if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  }
}

console.log('✓ header.js محمّل');