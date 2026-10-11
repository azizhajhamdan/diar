// =============================================
// الصفحة الرئيسية
// =============================================

import { el, svg } from '../utils/helpers.js';
import { withCacheBuster, optimizeImage, buildSrcset } from '../utils/image.js';
import { buildHeader } from './header.js';

// =============================================
// بناء الصفحة الرئيسية كاملة
// =============================================

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
  page.appendChild(buildFooter(cms));
  
  return page;
}

// =============================================
// Hero
// =============================================

function buildHero(heroData) {
  const section = el('section', { class: 'hero', id: 'home' });
  
  const bg = el('div', { class: 'hero-bg' });
  if (heroData.image) {
    bg.appendChild(el('img', {
      src: withCacheBuster(optimizeImage(heroData.image, 'hero')),
      srcset: buildSrcset(heroData.image),
      sizes: '100vw',
      alt: heroData.brand,
      fetchpriority: 'high'
    }));
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
// Features Strip
// =============================================

function buildFeatures(featuresData) {
  const section = el('section', { class: 'features-strip' });
  const container = el('div', { class: 'container' });
  const grid = el('div', { class: 'features-grid' });
  
  featuresData.forEach((feature, i) => {
    const card = el('div', { class: `feature fade-up delay-${Math.min(i + 1, 4)}` });
    
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
// Categories
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
      onclick: () => {
        console.log('Open category:', cat.id);
      }
    });
    
    if (cat.cover) {
      card.appendChild(el('img', {
        src: withCacheBuster(optimizeImage(cat.cover, 'card')),
        srcset: buildSrcset(cat.cover),
        sizes: '(max-width: 640px) 50vw, 25vw',
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
// Toppicks
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
        src: withCacheBuster(optimizeImage(item.image, 'card')),
        srcset: buildSrcset(item.image),
        sizes: '(max-width: 768px) 100vw, 33vw',
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
// About
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
      src: withCacheBuster(optimizeImage(aboutData.image, 'card')),
      srcset: buildSrcset(aboutData.image),
      sizes: '(max-width: 1024px) 100vw, 50vw',
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
// Gallery Preview
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
    { src: '/salon/sal.1.jpg', title: 'صالون فاخر' },
    { src: '/fabric/fat.1.jpeg', title: 'ستائر حديثة' },
    { src: '/orgnal/salon.1.jpg', title: 'جلسة أرضية' },
    { src: '/salon/sal.5.jpg', title: 'جلسة عائلية' },
    { src: '/fabric/fat.5.jpeg', title: 'ستائر حريرية' },
    { src: '/orgnal/salon.5.jpg', title: 'مجلس ضيافة' }
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
// Footer
// =============================================

function buildFooter(cms) {
  const footer = el('footer', { class: 'footer' });
  const container = el('div', { class: 'container' });
  const wrap = el('div', { class: 'footer-wrap' });
  
  // العلامة
  const brand = el('div', { class: 'footer-brand' });
  const logo = el('div', { class: 'footer-logo' });
  logo.innerHTML = `${cms.hero.brand}<span class="dot">.</span>`;
  brand.appendChild(logo);
  
  brand.appendChild(el('p', {}, [cms.contact.about]));
  wrap.appendChild(brand);
  
  // الحقوق
  const copy = el('div', { class: 'footer-copy' });
  copy.textContent = `© ${new Date().getFullYear()} ديّار للمفروشات — جميع الحقوق محفوظة`;
  wrap.appendChild(copy);
  
  container.appendChild(wrap);
  footer.appendChild(container);
  
  return footer;
}

console.log('✓ home.js محمّل');