// =============================================
// الصفحة الرئيسية
// =============================================

import { el, svg } from '../utils/helpers.js';
import { withCacheBuster } from '../utils/image.js';
import { buildHeader } from './header.js';

/**
 * بناء الصفحة الرئيسية كاملة
 */
export function buildHomePage(cms) {
  const page = el('div', { class: 'page-home' });
  
  // الهيدر
  page.appendChild(buildHeader());
  
  // المحتوى
  const main = el('main');
  main.appendChild(buildHero(cms.hero));
  
  if (cms.visibility?.features !== false) {
    main.appendChild(buildFeatures(cms.features));
  }
  
  if (cms.visibility?.categories !== false) {
    main.appendChild(buildCategories(cms.categories));
  }
  
  if (cms.visibility?.toppicks !== false) {
    main.appendChild(buildToppicks(cms.toppicks));
  }
  
  if (cms.visibility?.about !== false) {
    main.appendChild(buildAbout(cms.about));
  }
  
  if (cms.visibility?.gallery !== false) {
    main.appendChild(buildGallery(cms.gallery));
  }
  
  if (cms.visibility?.cta !== false) {
    main.appendChild(buildCTA(cms.cta));
  }
  
  page.appendChild(main);
  
  // الفوتر الكامل
  page.appendChild(buildFooter(cms));
  
  return page;
}

// =============================================
// قسم الهيرو
// =============================================

function buildHero(heroData) {
  const section = el('section', { class: 'hero', id: 'home' });
  
  const bg = el('div', { class: 'hero-bg' });
  if (heroData.image) {
    const img = el('img', {
      src: withCacheBuster(heroData.image),
      alt: heroData.brand
    });
    bg.appendChild(img);
  }
  section.appendChild(bg);
  
  const inner = el('div', { class: 'hero-inner' });
  
  const name = el('h1', { class: 'hero-name' });
  name.innerHTML = `${heroData.brand}<span class="accent">.</span>`;
  inner.appendChild(name);
  
  const tagline = el('div', { class: 'hero-tagline' });
  tagline.innerHTML = `${heroData.tagline} <span class="accent">${heroData.taglineAccent}</span>`;
  inner.appendChild(tagline);
  
  inner.appendChild(el('p', { class: 'hero-sub' }, [heroData.subtitle]));
  
  const cta = el('div', { class: 'hero-cta' });
  cta.appendChild(el('button', {
    class: 'btn btn-primary btn-lg',
    onclick: () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'booking' }));
    }
  }, [heroData.cta1]));
  
 const cta2Btn = el('button', {
  class: 'btn btn-outline btn-lg hero-cta-secondary',
  onclick: () => {
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}, [heroData.cta2]);
cta.appendChild(cta2Btn);
  
  inner.appendChild(cta);
  section.appendChild(inner);
  
  return section;
}

// =============================================
// شريط المزايا
// =============================================

function buildFeatures(featuresData) {
  const section = el('section', { class: 'features-strip' });
  const container = el('div', { class: 'container' });
  const grid = el('div', { class: 'features-grid' });
  
  featuresData.forEach((feature, i) => {
    const card = el('div', { class: `feature fade-up delay-${Math.min(i + 1, 3)}` });
    
    const iconBox = el('div', { class: 'ic' });
    iconBox.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${feature.icon}"/></svg>`;
    card.appendChild(iconBox);
    
    const text = el('div');
    text.appendChild(el('h4', {}, [feature.title]));
    text.appendChild(el('p', {}, [feature.desc]));
    card.appendChild(text);
    
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
  section.appendChild(container);
  return section;
}

// =============================================
// الأقسام
// =============================================

function buildCategories(categoriesData) {
  const section = el('section', { class: 'categories', id: 'categories' });
  const container = el('div', { class: 'container' });
  
  container.appendChild(el('div', { class: 'section-head fade-up' }, [
    el('span', { class: 'kicker' }, ['أقسامنا']),
    el('h2', {}, ['تصنيع متكامل لكل ركن']),
    el('p', {}, ['اختر القسم لعرض المنتجات والتصاميم.'])
  ]));
  
  const grid = el('div', { class: 'categories-grid fade-up' });
  
  categoriesData.forEach((cat) => {
    const card = el('div', {
      class: 'category-card',
     onclick: () => openCategoryModal(cat)
      
    });
    
    if (cat.cover) {
      card.appendChild(el('img', {
        src: withCacheBuster(cat.cover),
        alt: cat.title,
        loading: 'lazy'
      }));
    }
    
    const content = el('div', { class: 'content' });
    content.appendChild(el('div', { class: 'en' }, [cat.en]));
    content.appendChild(el('h3', {}, [cat.title]));
    content.appendChild(el('p', { class: 'desc' }, [cat.desc]));
    
    const viewMore = el('div', { class: 'view-more' });
    viewMore.innerHTML = 'استعرض <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
    content.appendChild(viewMore);
    
    card.appendChild(content);
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
  section.appendChild(container);
  return section;
}

// =============================================
// الأكثر طلباً
// =============================================

function buildToppicks(toppicksData) {
  const section = el('section', { class: 'featured', id: 'toppicks' });
  const container = el('div', { class: 'container' });
  
  container.appendChild(el('div', { class: 'section-head fade-up' }, [
    el('span', { class: 'kicker' }, ['الأكثر طلباً']),
    el('h2', {}, ['اختيارات عملائنا']),
    el('p', {}, ['أكثر ما يطلبه عملاؤنا هذا الموسم.'])
  ]));
  
  const grid = el('div', { class: 'featured-grid fade-up' });
  
  toppicksData.forEach(item => {
    const card = el('article', { class: 'feature-card' });
    
    if (item.image) {
      card.appendChild(el('img', {
        src: withCacheBuster(item.image),
        alt: item.name,
        loading: 'lazy'
      }));
    }
    
    card.appendChild(el('div', { class: 'rank' }, [item.rank]));
    
    const info = el('div', { class: 'info' });
    info.appendChild(el('div', { class: 'cat' }, [item.catLabel]));
    info.appendChild(el('h3', {}, [item.name]));
    info.appendChild(el('p', {}, [item.desc]));
    card.appendChild(info);
    
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
  section.appendChild(container);
  return section;
}

// =============================================
// عن ديّار
// =============================================

function buildAbout(aboutData) {
  const section = el('section', { class: 'about', id: 'about' });
  const container = el('div', { class: 'container' });
  const inner = el('div', { class: 'about-inner' });
  
  const text = el('div', { class: 'about-text fade-up' });
  text.appendChild(el('span', { class: 'kicker' }, [aboutData.kicker]));
  text.appendChild(el('h2', {}, [aboutData.title]));
  
  (aboutData.paragraphs || []).forEach(p => {
    text.appendChild(el('p', {}, [p]));
  });
  
  // مزايا صغيرة
  const featuresBox = el('div', { class: 'about-features' });
  [
    { icon: 'M20 6 9 17l-5-5', txt: 'تصنيع يدوي دقيق' },
    { icon: 'M12 2 15 8.5 22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9L9 8.5z', txt: 'خامات فاخرة' },
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14', txt: 'ضمان شامل' },
    { icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', txt: 'دعم مستمر' }
  ].forEach(f => {
    const item = el('div', { class: 'about-feature' });
    const dot = el('div', { class: 'dot' });
    dot.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${f.icon}"/></svg>`;
    item.appendChild(dot);
    item.appendChild(el('span', {}, [f.txt]));
    featuresBox.appendChild(item);
  });
  
  text.appendChild(featuresBox);
  inner.appendChild(text);
  
  if (aboutData.image) {
    const imgBox = el('div', { class: 'about-img fade-up delay-2' });
    imgBox.appendChild(el('img', {
      src: withCacheBuster(aboutData.image),
      alt: aboutData.title,
      loading: 'lazy'
    }));
    inner.appendChild(imgBox);
  }
  
  container.appendChild(inner);
  section.appendChild(container);
  return section;
}

// =============================================
// المعرض
// =============================================

function buildGallery(galleryData) {
  const section = el('section', { class: 'gallery-preview', id: 'gallery' });
  const container = el('div', { class: 'container' });
  
  container.appendChild(el('div', { class: 'section-head fade-up' }, [
    el('span', { class: 'kicker' }, [galleryData.kicker || 'معرضنا']),
    el('h2', {}, [galleryData.title || 'من أعمالنا']),
    el('p', {}, [galleryData.desc || 'صور مختارة من مشاريعنا.'])
  ]));
  
  const items = (galleryData.items || []).slice(0, 6);
  
  // إذا فارغ → نعرض صور افتراضية
  const defaultImages = [
    { src: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=85', title: 'صالون فاخر' },
    { src: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=85', title: 'ستائر حديثة' },
    { src: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=85', title: 'جلسة أرضية' },
    { src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=85', title: 'جلسة عائلية' },
    { src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=85', title: 'ستائر حريرية' },
    { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85', title: 'مجلس ضيافة' }
  ];
  
  const imagesToShow = items.length > 0 ? items : defaultImages;
  
  const grid = el('div', { class: 'gallery-grid fade-up' });
  
  imagesToShow.forEach((item, i) => {
    const card = el('div', { class: 'gallery-item' });
    card.appendChild(el('img', {
      src: withCacheBuster(item.src),
      alt: item.title,
      loading: 'lazy'
    }));
    
    const overlay = el('div', { class: 'overlay' });
    overlay.appendChild(document.createTextNode(item.title));
    card.appendChild(overlay);
    
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
  section.appendChild(container);
  return section;
}

// =============================================
// CTA
// =============================================

function buildCTA(ctaData) {
  const section = el('section', { class: 'cta' });
  const container = el('div', { class: 'container fade-up' });
  
  container.appendChild(el('span', { class: 'kicker' }, [ctaData.kicker || 'ابدأ الآن']));
  
  const h2 = el('h2');
  h2.innerHTML = `${ctaData.title || 'جاهز لتصنيع'} <span class="accent">${ctaData.accent || 'طلبك؟'}</span>`;
  container.appendChild(h2);
  
  container.appendChild(el('p', {}, [ctaData.desc || 'تواصل معنا الآن.']));
  
  const btns = el('div', { class: 'cta-buttons' });
  
  btns.appendChild(el('button', {
    class: 'btn btn-primary btn-lg',
    onclick: () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'booking' }));
    }
  }, ['احجز طلبك']));
  
  btns.appendChild(el('button', {
    class: 'btn btn-outline btn-lg',
    onclick: () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'track' }));
    }
  }, ['تتبع طلبك']));
  
  container.appendChild(btns);
  section.appendChild(container);
  return section;
}

// =============================================
// الفوتر الكامل
// =============================================

function buildFooter(cms) {
  const footer = el('footer', { class: 'footer' });
  const container = el('div', { class: 'container' });
  const wrap = el('div', { class: 'footer-wrap' });
  
  // الشبكة الرئيسية
  const grid = el('div', { class: 'footer-grid' });
  
  // العمود 1: العلامة
  const col1 = el('div', { class: 'f-brand-col' });
  const logo = el('div', { class: 'f-logo' });
  logo.innerHTML = `${cms.hero.brand}<span class="dot">.</span>`;
  col1.appendChild(logo);
  col1.appendChild(el('div', { class: 'f-tagline' }, ['للمفروشات · ' + cms.hero.tagline + ' ' + cms.hero.taglineAccent]));
  col1.appendChild(el('p', { class: 'f-about' }, [cms.contact.about]));
  grid.appendChild(col1);
  
  // العمود 2: روابط سريعة
  const col2 = el('div');
  col2.appendChild(el('h4', { class: 'f-col-title' }, ['روابط سريعة']));
  const links = el('div', { class: 'f-links' });
  [
    { label: 'الأقسام', target: 'categories' },
    { label: 'الأكثر طلباً', target: 'toppicks' },
    { label: 'عن ديّار', target: 'about' },
    { label: 'معرض الأعمال', target: 'gallery' }
  ].forEach(item => {
    const a = el('a', {
      href: '#',
      onclick: (e) => {
        e.preventDefault();
        const targetEl = document.getElementById(item.target);
        if (targetEl) {
          const offset = 80;
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }, [item.label]);
    links.appendChild(a);
  });
  col2.appendChild(links);
  grid.appendChild(col2);
  
  // العمود 3: تواصل
  const col3 = el('div');
  col3.appendChild(el('h4', { class: 'f-col-title' }, ['تواصل معنا']));
  const contact = el('div', { class: 'f-contact' });
  
  // الهاتف
  const phoneItem = el('div', { class: 'f-contact-item' });
  const phoneIc = el('div', { class: 'f-ic' });
  phoneIc.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>';
  phoneItem.appendChild(phoneIc);
  const phoneInfo = el('div', { class: 'f-info' });
  phoneInfo.appendChild(el('span', { class: 'f-label' }, ['اتصل بنا']));
  phoneInfo.appendChild(el('span', { class: 'f-value ltr' }, [cms.contact.phone]));
  phoneItem.appendChild(phoneInfo);
  contact.appendChild(phoneItem);
  
  // البريد
  const emailItem = el('div', { class: 'f-contact-item' });
  const emailIc = el('div', { class: 'f-ic' });
  emailIc.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>';
  emailItem.appendChild(emailIc);
  const emailInfo = el('div', { class: 'f-info' });
  emailInfo.appendChild(el('span', { class: 'f-label' }, ['البريد']));
  emailInfo.appendChild(el('span', { class: 'f-value ltr' }, [cms.contact.email]));
  emailItem.appendChild(emailInfo);
  contact.appendChild(emailItem);
  
  // الموقع
  const locItem = el('div', { class: 'f-contact-item' });
  const locIc = el('div', { class: 'f-ic' });
  locIc.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  locItem.appendChild(locIc);
  const locInfo = el('div', { class: 'f-info' });
  locInfo.appendChild(el('span', { class: 'f-label' }, ['الموقع']));
  locInfo.appendChild(el('span', { class: 'f-value' }, [cms.contact.address]));
  locItem.appendChild(locInfo);
  contact.appendChild(locItem);
  
  col3.appendChild(contact);
  grid.appendChild(col3);
  
  // العمود 4: التواصل الاجتماعي
  const col4 = el('div');
  col4.appendChild(el('h4', { class: 'f-col-title' }, ['تابعنا']));
  const socialGrid = el('div', { class: 'f-social-grid' });
  
  const socials = [
    { key: 'instagram', label: 'Instagram', icon: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>' },
    { key: 'facebook', label: 'Facebook', icon: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>' },
    { key: 'tiktok', label: 'TikTok', icon: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>' },
    { key: 'whatsapp', label: 'WhatsApp', icon: '<path d="M21 11.5a8.4 8.4 0 0 1-1.2 4.4A8.5 8.5 0 0 1 3.5 19l1-4.5a8.4 8.4 0 0 1-1-4 8.5 8.5 0 0 1 17 0 8.4 8.4 0 0 1 .5 1z"/><path d="M8 9a2 2 0 0 1 2 2v1a4 4 0 0 0 4 4h1a2 2 0 0 1 2-2"/>' },
    { key: 'snapchat', label: 'Snapchat', icon: '<path d="M12 2a5 5 0 0 0-5 5v3c-1 .5-2 .8-3 1 .7 1.5 2 2.5 3 3 0 1.5-.8 2.5-2 3 2 .8 3.5 1 4 1s1 .5 3 .5 2-.5 3-.5 2-.2 4-1c-1.2-.5-2-1.5-2-3 1-.5 2.3-1.5 3-3-1-.2-2-.5-3-1V7a5 5 0 0 0-5-5z"/>' }
  ];
  
  socials.forEach(s => {
    if (!cms.social[s.key]) return;
    
    const a = el('a', {
      href: cms.social[s.key],
      target: '_blank',
      rel: 'noopener',
      class: `f-social-btn ${s.key}`
    });
    a.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${s.icon}</svg>${s.label}`;
    socialGrid.appendChild(a);
  });
  
  col4.appendChild(socialGrid);
  grid.appendChild(col4);
  
  wrap.appendChild(grid);
  
  // الشريط السفلي
  const bottom = el('div', { class: 'f-bottom' });
  const copy = el('div', { class: 'f-copy' });
  copy.innerHTML = `© ${new Date().getFullYear()} <strong>${cms.hero.brand} للمفروشات</strong> — جميع الحقوق محفوظة`;
  bottom.appendChild(copy);
  wrap.appendChild(bottom);
  
  container.appendChild(wrap);
  footer.appendChild(container);
  
  return footer;
}
// =============================================
// Modal عرض صور القسم
// =============================================

function openCategoryModal(category) {
  // احذف أي modal موجود
  const old = document.getElementById('category-modal');
  if (old) old.remove();
  
  const modal = el('div', {
    class: 'category-modal',
    id: 'category-modal',
    onclick: (e) => {
      if (e.target === modal) closeCategoryModal();
    }
  });
  
  const inner = el('div', { class: 'category-modal-inner' });
  
  // زر الإغلاق
  const closeBtn = el('button', {
    class: 'category-modal-close',
    onclick: closeCategoryModal,
    'aria-label': 'إغلاق'
  });
  closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  inner.appendChild(closeBtn);
  
  // Header
  const header = el('div', { class: 'category-modal-header' });
  header.appendChild(el('span', { class: 'category-modal-en' }, [category.en || '']));
  header.appendChild(el('h2', { class: 'category-modal-title' }, [category.title || '']));
  header.appendChild(el('p', { class: 'category-modal-desc' }, [category.desc || '']));
  inner.appendChild(header);
  
  // Gallery
  const images = category.images || [];
  
  if (images.length > 0) {
    const gallery = el('div', { class: 'category-modal-gallery' });
    
    images.forEach((imgSrc, i) => {
      if (!imgSrc) return;
      
      const item = el('div', { 
        class: 'category-modal-item',
        onclick: () => openLightbox(imgSrc, category.title)
      });
      
      item.appendChild(el('img', {
        src: withCacheBuster(imgSrc),
        alt: category.title + ' ' + (i + 1),
        loading: 'lazy'
      }));
      
      gallery.appendChild(item);
    });
    
    inner.appendChild(gallery);
  } else {
    inner.appendChild(el('div', { 
      class: 'category-modal-empty',
      style: 'text-align: center; padding: 60px 20px; color: #8a8070;'
    }, ['لا توجد صور في هذا القسم بعد']));
  }
  
  // زر الحجز
  const cta = el('div', { class: 'category-modal-cta' });
  const bookBtn = el('button', {
    class: 'btn btn-primary btn-lg',
    onclick: () => {
      closeCategoryModal();
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'booking' }));
    }
  }, ['احجز ' + category.title + ' الآن']);
  bookBtn.innerHTML += '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-inline-start:8px"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
  cta.appendChild(bookBtn);
  inner.appendChild(cta);
  
  modal.appendChild(inner);
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
}

function closeCategoryModal() {
  const modal = document.getElementById('category-modal');
  if (modal) modal.remove();
  document.body.style.overflow = '';
}

// =============================================
// Lightbox (عرض صورة كاملة)
// =============================================

function openLightbox(src, title) {
  const old = document.getElementById('lightbox');
  if (old) old.remove();
  
  const lightbox = el('div', {
    class: 'lightbox',
    id: 'lightbox',
    onclick: (e) => {
      if (e.target === lightbox) closeLightbox();
    }
  });
  
  const img = el('img', {
    src: withCacheBuster(src),
    alt: title,
    class: 'lightbox-img'
  });
  lightbox.appendChild(img);
  
  const closeBtn = el('button', {
    class: 'lightbox-close',
    onclick: closeLightbox
  });
  closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  lightbox.appendChild(closeBtn);
  
  document.body.appendChild(lightbox);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.remove();
}

// إغلاق بـ ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCategoryModal();
    closeLightbox();
  }
});

console.log('✓ home.js محمّل');