// =============================================
// الهيدر (الشريط العلوي)
// =============================================

import { el, svg } from '../utils/helpers.js';

export function buildHeader() {
  const header = el('header', { class: 'header', id: 'header' });
  const container = el('div', { class: 'container' });
  const inner = el('div', { class: 'header-inner' });

  // ═══ الشعار ═══
  const logo = el('a', {
    class: 'logo',
    href: '#',
    onclick: (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  logo.innerHTML = 'ديّار<span>.</span><span class="logo-sub">للمفروشات</span>';

  // ═══ روابط التنقل — سطح المكتب ═══
  const nav = el('nav', { class: 'nav-links' });
  const navItems = [
    { label: 'الأقسام', target: 'categories' },
    { label: 'الأكثر طلباً', target: 'toppicks' },
    { label: 'عن ديّار', target: 'about' },
    { label: 'أعمالنا', target: 'gallery' },
    { label: 'احجز الآن', target: 'booking' },
    { label: 'تتبع طلبك', target: 'track' }
  ];
  
  navItems.forEach(item => {
    const a = el('a', {
      href: '#',
      onclick: (e) => {
        e.preventDefault();
        handleNavClick(item.target);
      }
    }, [item.label]);
    nav.appendChild(a);
  });

  // ═══ زر Hamburger — موبايل ═══
  const hamburger = el('button', {
    class: 'hamburger',
    'aria-label': 'القائمة',
    'aria-expanded': 'false',
    onclick: () => toggleMobileMenu()
  });
  hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  // ═══ تجميع ═══
  inner.appendChild(logo);
  inner.appendChild(nav);
  inner.appendChild(hamburger);
  container.appendChild(inner);
  header.appendChild(container);

  // ═══ قائمة الموبايل — خلفية معتمة ═══
  const mobileMenu = el('div', { 
    class: 'mobile-menu', 
    id: 'mobile-menu',
    'aria-hidden': 'true'
  });
  
  const mobileMenuInner = el('nav', { class: 'mobile-menu-nav' });
  navItems.forEach(item => {
    const a = el('a', {
      href: '#',
      onclick: (e) => {
        e.preventDefault();
        closeMobileMenu();
        setTimeout(() => handleNavClick(item.target), 300);
      }
    }, [item.label]);
    mobileMenuInner.appendChild(a);
  });
  
  mobileMenu.appendChild(mobileMenuInner);
  header.appendChild(mobileMenu);

  // ═══ تفعيل الوضع المضغوط عند التمرير ═══
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
// فتح/إغلاق قائمة الموبايل
// =============================================

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.querySelector('.hamburger');
  const header = document.getElementById('header');
  
  if (!menu) return;
  
  const isOpen = menu.classList.contains('open');
  
  if (isOpen) {
    closeMobileMenu();
  } else {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    hamburger?.classList.add('active');
    hamburger?.setAttribute('aria-expanded', 'true');
    header?.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.querySelector('.hamburger');
  const header = document.getElementById('header');
  
  if (!menu) return;
  
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  hamburger?.classList.remove('active');
  hamburger?.setAttribute('aria-expanded', 'false');
  header?.classList.remove('menu-open');
  document.body.style.overflow = '';
}

// =============================================
// التنقل
// =============================================

function handleNavClick(target) {
  // للصفحات الرئيسية
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
  }
}

console.log('✓ header.js محمّل');