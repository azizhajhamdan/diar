// =============================================
// إدارة المحتوى (CMS)
// =============================================

import { el, svg } from '../utils/helpers.js';
import { readData, writeData } from '../data/firebase.js';
import { processUploadedImage, withCacheBuster } from '../utils/image.js';

let cmsData = null;
let hasChanges = false;
let currentSection = 'hero';

// =============================================
// أيقونات SVG
// =============================================

const ICONS = {
  hero: 'M3 3h18v18H3zM3 12h18M12 3v18',
  features: 'M12 2 15 8.5 22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9L9 8.5z',
  categories: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  toppicks: 'M12 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM15.5 13 17 22l-5-3-5 3 1.5-9',
  about: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 16v-4M12 8h.01',
  gallery: 'M3 3h18v18H3zM8.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM21 15l-5-5L5 21',
  contact: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z',
  social: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'
};

// =============================================
// تحميل CMS
// =============================================

async function loadCMS() {
  try {
    const data = await readData('cms');
    cmsData = data || {};
    return cmsData;
  } catch (error) {
    console.error('خطأ في تحميل CMS:', error);
    return {};
  }
}

// =============================================
// الصفحة الرئيسية
// =============================================

export async function buildCMSContent() {
  const wrap = el('div', { class: 'cms-content' });
  
  if (!cmsData) {
    await loadCMS();
  }
  
  // Header مع زر الحفظ
  const header = el('div', { class: 'cms-header' });
  
  const headerTop = el('div', { class: 'cms-header-top' });
  
  const titleWrap = el('div');
  titleWrap.appendChild(el('h1', { class: 'admin-title' }, ['إدارة المحتوى']));
  titleWrap.appendChild(el('p', { class: 'admin-subtitle' }, ['عدّل نصوص وصور الموقع من هنا']));
  headerTop.appendChild(titleWrap);
  
  // زر الحفظ في الأعلى
  const headerSaveBtn = el('button', {
    class: 'cms-save-btn cms-save-btn-top',
    onclick: saveCMS
  }, ['حفظ التغييرات']);
  headerTop.appendChild(headerSaveBtn);
  
  header.appendChild(headerTop);
  wrap.appendChild(header);
  
  const layout = el('div', { class: 'cms-layout' });
  layout.appendChild(buildSidebar());
  
  const contentArea = el('div', { class: 'cms-area', id: 'cms-area' });
  contentArea.appendChild(buildSectionContent());
  layout.appendChild(contentArea);
  
  wrap.appendChild(layout);
  wrap.appendChild(buildSaveBar());
  
  return wrap;
}
// =============================================
// Sidebar
// =============================================

function buildSidebar() {
  const side = el('aside', { class: 'cms-sidebar' });
  
 const sections = [
  { key: 'hero', label: 'القسم الرئيسي', icon: ICONS.hero },
  { key: 'features', label: 'المزايا', icon: ICONS.features },
  { key: 'categories', label: 'الأقسام', icon: ICONS.categories },
  { key: 'toppicks', label: 'الأكثر طلباً', icon: ICONS.toppicks },
  { key: 'about', label: 'عن ديّار', icon: ICONS.about },
  { key: 'gallery', label: 'المعرض', icon: ICONS.gallery },
  { key: 'contact', label: 'التواصل', icon: ICONS.contact },
  { key: 'social', label: 'السوشيال', icon: ICONS.social },
  { key: 'fonts', label: 'الخطوط', icon: ICONS.features }
];
  
  sections.forEach(sec => {
    const btn = el('button', {
      class: `cms-nav-btn ${currentSection === sec.key ? 'active' : ''}`,
      onclick: () => {
        currentSection = sec.key;
        refreshContent();
      }
    });
    
    const iconSpan = el('span', { class: 'cms-nav-icon' });
    iconSpan.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${sec.icon}"/></svg>`;
    btn.appendChild(iconSpan);
    btn.appendChild(el('span', { class: 'cms-nav-label' }, [sec.label]));
    side.appendChild(btn);
  });
  
  return side;
}

// =============================================
// المحتوى
// =============================================

function buildSectionContent() {
  const area = el('div', { class: 'cms-section-content' });
  
 switch (currentSection) {
  case 'hero': area.appendChild(buildHeroEditor()); break;
  case 'features': area.appendChild(buildFeaturesEditor()); break;
  case 'categories': area.appendChild(buildCategoriesEditor()); break;
  case 'toppicks': area.appendChild(buildToppicksEditor()); break;
  case 'about': area.appendChild(buildAboutEditor()); break;
  case 'gallery': area.appendChild(buildGalleryEditor()); break;
  case 'contact': area.appendChild(buildContactEditor()); break;
  case 'social': area.appendChild(buildSocialEditor()); break;
  case 'fonts': area.appendChild(buildFontsEditor()); break;
  default: area.appendChild(buildHeroEditor());
}
  
  return area;
}

function refreshContent() {
  const sidebar = document.querySelector('.cms-sidebar');
  if (sidebar) {
    sidebar.innerHTML = '';
    const newSidebar = buildSidebar();
    while (newSidebar.firstChild) {
      sidebar.appendChild(newSidebar.firstChild);
    }
  }
  
  const area = document.getElementById('cms-area');
  if (area) {
    area.innerHTML = '';
    area.appendChild(buildSectionContent());
  }
}

// =============================================
// Hero Editor
// =============================================

function buildHeroEditor() {
  const wrap = el('div');
  wrap.appendChild(el('h2', { class: 'cms-section-title' }, ['القسم الرئيسي']));
  wrap.appendChild(el('p', { class: 'cms-section-desc' }, ['العنوان والصورة الرئيسية في أعلى الصفحة']));
  
  if (!cmsData.hero) cmsData.hero = {};
  
  wrap.appendChild(buildField('اسم العلامة', cmsData.hero.brand, (v) => {
    cmsData.hero.brand = v;
  }));
  
  wrap.appendChild(buildField('الشعار - البداية', cmsData.hero.tagline, (v) => {
    cmsData.hero.tagline = v;
  }));
  
  wrap.appendChild(buildField('الشعار - الكلمة المميزة', cmsData.hero.taglineAccent, (v) => {
    cmsData.hero.taglineAccent = v;
  }));
  
  wrap.appendChild(buildField('الوصف', cmsData.hero.subtitle, (v) => {
    cmsData.hero.subtitle = v;
  }, { multiline: true }));
  
  wrap.appendChild(buildField('زر أول', cmsData.hero.cta1, (v) => {
    cmsData.hero.cta1 = v;
  }));
  
  wrap.appendChild(buildField('زر ثاني', cmsData.hero.cta2, (v) => {
    cmsData.hero.cta2 = v;
  }));
  
  wrap.appendChild(buildImageField('صورة الخلفية', cmsData.hero.image, (v) => {
    cmsData.hero.image = v;
  }));
  
  return wrap;
}

// =============================================
// Features Editor
// =============================================

function buildFeaturesEditor() {
  const wrap = el('div');
  wrap.appendChild(el('h2', { class: 'cms-section-title' }, ['المزايا']));
  wrap.appendChild(el('p', { class: 'cms-section-desc' }, ['شريط المزايا تحت الهيرو']));
  
  if (!cmsData.features) cmsData.features = [];
  
  cmsData.features.forEach((feature, i) => {
    const box = el('div', { class: 'cms-item-box' });
    box.appendChild(el('h4', { class: 'cms-item-title' }, ['ميزة رقم ' + (i + 1)]));
    
    box.appendChild(buildField('العنوان', feature.title, (v) => {
      cmsData.features[i].title = v;
    }));
    
    box.appendChild(buildField('الوصف', feature.desc, (v) => {
      cmsData.features[i].desc = v;
    }));
    
    wrap.appendChild(box);
  });
  
  return wrap;
}

// =============================================
// Categories Editor
// =============================================

function buildCategoriesEditor() {
  const wrap = el('div');
  wrap.appendChild(el('h2', { class: 'cms-section-title' }, ['الأقسام']));
  wrap.appendChild(el('p', { class: 'cms-section-desc' }, ['4 أقسام مع صورها']));
  
  if (!cmsData.categories) cmsData.categories = [];
  
  cmsData.categories.forEach((cat, i) => {
    const box = el('div', { class: 'cms-item-box' });
    box.appendChild(el('h4', { class: 'cms-item-title' }, [`القسم ${i + 1}: ${cat.title || ''}`]));
    
    box.appendChild(buildField('العنوان', cat.title, (v) => {
      cmsData.categories[i].title = v;
    }));
    
    box.appendChild(buildField('الاسم بالإنجليزية', cat.en, (v) => {
      cmsData.categories[i].en = v;
    }));
    
    box.appendChild(buildField('الوصف', cat.desc, (v) => {
      cmsData.categories[i].desc = v;
    }, { multiline: true }));
    
    box.appendChild(buildImageField('صورة الغلاف', cat.cover, (v) => {
      cmsData.categories[i].cover = v;
    }));
    
    box.appendChild(buildImageListField('صور المعرض', cat.images || [], (list) => {
      cmsData.categories[i].images = list;
    }));
    
    wrap.appendChild(box);
  });
  
  return wrap;
}

// =============================================
// Toppicks Editor
// =============================================

function buildToppicksEditor() {
  const wrap = el('div');
  wrap.appendChild(el('h2', { class: 'cms-section-title' }, ['الأكثر طلباً']));
  wrap.appendChild(el('p', { class: 'cms-section-desc' }, ['3 بطاقات مميزة']));
  
  if (!cmsData.toppicks) cmsData.toppicks = [];
  
  cmsData.toppicks.forEach((item, i) => {
    const box = el('div', { class: 'cms-item-box' });
    box.appendChild(el('h4', { class: 'cms-item-title' }, ['عنصر رقم ' + (i + 1)]));
    
    box.appendChild(buildField('الاسم', item.name, (v) => {
      cmsData.toppicks[i].name = v;
    }));
    
    box.appendChild(buildField('التصنيف', item.catLabel, (v) => {
      cmsData.toppicks[i].catLabel = v;
    }));
    
    box.appendChild(buildField('الوصف', item.desc, (v) => {
      cmsData.toppicks[i].desc = v;
    }, { multiline: true }));
    
    box.appendChild(buildImageField('الصورة', item.image, (v) => {
      cmsData.toppicks[i].image = v;
    }));
    
    wrap.appendChild(box);
  });
  
  return wrap;
}

// =============================================
// About Editor
// =============================================

function buildAboutEditor() {
  const wrap = el('div');
  wrap.appendChild(el('h2', { class: 'cms-section-title' }, ['عن ديّار']));
  wrap.appendChild(el('p', { class: 'cms-section-desc' }, ['قسم عن ديّار']));
  
  if (!cmsData.about) cmsData.about = {};
  
  wrap.appendChild(buildField('الشارة', cmsData.about.kicker, (v) => {
    cmsData.about.kicker = v;
  }));
  
  wrap.appendChild(buildField('العنوان', cmsData.about.title, (v) => {
    cmsData.about.title = v;
  }));
  
  wrap.appendChild(buildField('الفقرة الأولى', cmsData.about.paragraphs?.[0], (v) => {
    if (!cmsData.about.paragraphs) cmsData.about.paragraphs = ['', ''];
    cmsData.about.paragraphs[0] = v;
  }, { multiline: true }));
  
  wrap.appendChild(buildField('الفقرة الثانية', cmsData.about.paragraphs?.[1], (v) => {
    if (!cmsData.about.paragraphs) cmsData.about.paragraphs = ['', ''];
    cmsData.about.paragraphs[1] = v;
  }, { multiline: true }));
  
  wrap.appendChild(buildImageField('الصورة', cmsData.about.image, (v) => {
    cmsData.about.image = v;
  }));
  
  return wrap;
}

// =============================================
// Gallery Editor
// =============================================

function buildGalleryEditor() {
  const wrap = el('div');
  wrap.appendChild(el('h2', { class: 'cms-section-title' }, ['المعرض']));
  wrap.appendChild(el('p', { class: 'cms-section-desc' }, ['صور المعرض']));
  
  if (!cmsData.gallery) cmsData.gallery = { items: [] };
  if (!cmsData.gallery.items) cmsData.gallery.items = [];
  
  wrap.appendChild(buildField('الشارة', cmsData.gallery.kicker, (v) => {
    cmsData.gallery.kicker = v;
  }));
  
  wrap.appendChild(buildField('العنوان', cmsData.gallery.title, (v) => {
    cmsData.gallery.title = v;
  }));
  
  wrap.appendChild(buildField('الوصف', cmsData.gallery.desc, (v) => {
    cmsData.gallery.desc = v;
  }));
  
  cmsData.gallery.items.forEach((item, i) => {
    const box = el('div', { class: 'cms-item-box' });
    box.appendChild(el('h4', { class: 'cms-item-title' }, ['صورة رقم ' + (i + 1)]));
    
    box.appendChild(buildField('العنوان', item.title, (v) => {
      cmsData.gallery.items[i].title = v;
    }));
    
    box.appendChild(buildImageField('الصورة', item.src, (v) => {
      cmsData.gallery.items[i].src = v;
    }));
    
    wrap.appendChild(box);
  });
  
  return wrap;
}

// =============================================
// Contact Editor
// =============================================

function buildContactEditor() {
  const wrap = el('div');
  wrap.appendChild(el('h2', { class: 'cms-section-title' }, ['معلومات التواصل']));
  wrap.appendChild(el('p', { class: 'cms-section-desc' }, ['تظهر في الفوتر والفاتورة']));
  
  if (!cmsData.contact) cmsData.contact = {};
  
  wrap.appendChild(buildField('الهاتف', cmsData.contact.phone, (v) => {
    cmsData.contact.phone = v;
  }));
  
  wrap.appendChild(buildField('البريد الإلكتروني', cmsData.contact.email, (v) => {
    cmsData.contact.email = v;
  }));
  
  wrap.appendChild(buildField('العنوان', cmsData.contact.address, (v) => {
    cmsData.contact.address = v;
  }));
  
  wrap.appendChild(buildField('نبذة', cmsData.contact.about, (v) => {
    cmsData.contact.about = v;
  }, { multiline: true }));
  
  return wrap;
}

// =============================================
// Social Editor
// =============================================

function buildSocialEditor() {
  const wrap = el('div');
  wrap.appendChild(el('h2', { class: 'cms-section-title' }, ['منصات التواصل']));
  wrap.appendChild(el('p', { class: 'cms-section-desc' }, ['اترك الحقل فارغاً لإخفاء المنصة']));
  
  if (!cmsData.social) cmsData.social = {};
  
  ['instagram', 'facebook', 'tiktok', 'whatsapp', 'snapchat'].forEach(key => {
    wrap.appendChild(buildField(
      key.charAt(0).toUpperCase() + key.slice(1),
      cmsData.social[key],
      (v) => { cmsData.social[key] = v; },
      { placeholder: 'https://...', dir: 'ltr' }
    ));
  });
  
  return wrap;
}

// =============================================
// Build Field
// =============================================

function buildField(label, value, onChange, opts = {}) {
  const field = el('div', { class: 'cms-field' });
  field.appendChild(el('label', { class: 'cms-field-label' }, [label]));
  
  let input;
  if (opts.multiline) {
    input = el('textarea', {
      class: 'cms-field-input',
      rows: 3
    });
    input.value = value || '';
  } else {
    input = el('input', {
      type: 'text',
      class: 'cms-field-input',
      placeholder: opts.placeholder || ''
    });
    input.value = value || '';
    if (opts.dir === 'ltr') input.style.direction = 'ltr';
  }
  
  input.addEventListener('input', () => {
    onChange(input.value);
    markChanged();
  });
  
  field.appendChild(input);
  return field;
}

// =============================================
// Build Image Field
// =============================================

function buildImageField(label, value, onChange) {
  const field = el('div', { class: 'cms-field' });
  field.appendChild(el('label', { class: 'cms-field-label' }, [label]));
  
  const row = el('div', { class: 'cms-image-row' });
  const input = el('input', {
    type: 'text',
    class: 'cms-field-input',
    placeholder: 'رابط الصورة أو ارفع من جهازك',
    style: 'direction: ltr;'
  });
  input.value = value || '';
  row.appendChild(input);
  
  const uploadBtn = el('button', {
    class: 'cms-upload-btn',
    onclick: () => fileInput.click()
  }, ['رفع صورة']);
  row.appendChild(uploadBtn);
  
  const fileInput = el('input', {
    type: 'file',
    accept: 'image/*',
    style: 'display: none;'
  });
  row.appendChild(fileInput);
  field.appendChild(row);
  
  const preview = el('div', { class: 'cms-image-preview' });
  if (value) {
    preview.appendChild(el('img', { src: withCacheBuster(value), alt: 'معاينة' }));
  }
  field.appendChild(preview);
  
  input.addEventListener('input', () => {
    onChange(input.value);
    updatePreview(input.value);
    markChanged();
  });
  
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      preview.innerHTML = '<div class="cms-loading">جاري الرفع...</div>';
      
      const dataUrl = await processUploadedImage(file, {
        maxWidth: 1200,
        quality: 0.8
      });
      
      input.value = dataUrl;
      onChange(dataUrl);
      updatePreview(dataUrl);
      markChanged();
      
    } catch (error) {
      alert('خطأ في رفع الصورة: ' + error.message);
      updatePreview(input.value);
    }
    
    fileInput.value = '';
  });
  
  function updatePreview(src) {
    preview.innerHTML = '';
    if (src) {
      preview.appendChild(el('img', { src: withCacheBuster(src), alt: 'معاينة' }));
    }
  }
  
  return field;
}

// =============================================
// Build Image List Field
// =============================================

function buildImageListField(label, images, onChange) {
  const field = el('div', { class: 'cms-field' });
  field.appendChild(el('label', { class: 'cms-field-label' }, [label]));
  
  const list = el('div', { class: 'cms-image-list' });
  const currentImages = [...(images || [])];
  
  function renderList() {
    list.innerHTML = '';
    currentImages.forEach((img, i) => {
      const item = el('div', { class: 'cms-image-list-item' });
      
      // الصورة المصغرة
      const thumb = el('div', { class: 'cms-image-thumb' });
      if (img) {
        thumb.appendChild(el('img', { src: withCacheBuster(img), alt: '' }));
      }
      item.appendChild(thumb);
      
      // حقل الرابط
      const input = el('input', {
        type: 'text',
        class: 'cms-field-input',
        placeholder: 'رابط الصورة أو ارفع',
        style: 'direction: ltr;'
      });
      input.value = img || '';
      input.addEventListener('input', () => {
        currentImages[i] = input.value;
        onChange(currentImages);
        updateThumb(input.value);
        markChanged();
      });
      item.appendChild(input);
      
      // زر الرفع
      const uploadBtn = el('button', {
        class: 'cms-upload-mini',
        title: 'رفع صورة',
        onclick: () => fileInput.click()
      });
      uploadBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>';
      item.appendChild(uploadBtn);
      
      // input file مخفي
      const fileInput = el('input', {
        type: 'file',
        accept: 'image/*',
        style: 'display: none;'
      });
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
          thumb.innerHTML = '<div class="cms-loading-mini"></div>';
          
          const dataUrl = await processUploadedImage(file, {
            maxWidth: 1200,
            quality: 0.8
          });
          
          currentImages[i] = dataUrl;
          input.value = dataUrl;
          onChange(currentImages);
          updateThumb(dataUrl);
          markChanged();
          
        } catch (error) {
          alert('خطأ في رفع الصورة: ' + error.message);
          updateThumb(input.value);
        }
        
        fileInput.value = '';
      });
      item.appendChild(fileInput);
      
      // زر الحذف
      const removeBtn = el('button', {
        class: 'cms-remove-btn',
        onclick: () => {
          currentImages.splice(i, 1);
          onChange(currentImages);
          renderList();
          markChanged();
        }
      }, ['×']);
      item.appendChild(removeBtn);
      
      list.appendChild(item);
      
      function updateThumb(src) {
        thumb.innerHTML = '';
        if (src) {
          thumb.appendChild(el('img', { src: withCacheBuster(src), alt: '' }));
        }
      }
    });
  }
  
  renderList();
  field.appendChild(list);
  
  const addBtn = el('button', {
    class: 'cms-add-btn',
    onclick: () => {
      currentImages.push('');
      onChange(currentImages);
      renderList();
      markChanged();
    }
  }, ['+ إضافة صورة']);
  field.appendChild(addBtn);
  
  return field;
}

// =============================================
// Save Bar
// =============================================

function buildSaveBar() {
  const bar = el('div', { class: 'cms-save-bar' });
  
  const status = el('span', { class: 'cms-save-status', id: 'cms-save-status' });
  bar.appendChild(status);
  
  const saveBtn = el('button', {
    class: 'cms-save-btn',
    id: 'cms-save-btn',
    onclick: saveCMS
  }, ['حفظ التغييرات']);
  bar.appendChild(saveBtn);
  
  return bar;
}

function markChanged() {
  hasChanges = true;
  const status = document.getElementById('cms-save-status');
  if (status) {
    status.textContent = 'تغييرات غير محفوظة';
    status.className = 'cms-save-status changed';
  }
}

async function saveCMS() {
  const btn = document.getElementById('cms-save-btn');
  const status = document.getElementById('cms-save-status');
  
  if (!btn) return;
  
  btn.disabled = true;
  btn.textContent = 'جاري الحفظ...';
  
  try {
    await writeData('cms', cmsData);
    
    hasChanges = false;
    
    if (status) {
      status.textContent = 'تم الحفظ';
      status.className = 'cms-save-status saved';
      setTimeout(() => {
        status.textContent = '';
      }, 3000);
    }
    
    btn.textContent = 'تم الحفظ';
    setTimeout(() => {
      btn.textContent = 'حفظ التغييرات';
    }, 2000);
    
    console.log('✓ تم حفظ CMS');
    
  } catch (error) {
    console.error('خطأ في الحفظ:', error);
    alert('خطأ في حفظ التغييرات');
    btn.textContent = 'حفظ التغييرات';
  } finally {
    btn.disabled = false;
  }
}
// =============================================
// Fonts Editor
// =============================================

function buildFontsEditor() {
  const wrap = el('div');
  wrap.appendChild(el('h2', { class: 'cms-section-title' }, ['الخطوط']));
  wrap.appendChild(el('p', { class: 'cms-section-desc' }, ['اختر خط العناوين وخط النصوص']));
  
  if (!cmsData.fonts) cmsData.fonts = { heading: 'Reem Kufi', body: 'Cairo' };
  
  const headingFonts = [
    { id: 'Reem Kufi', label: 'ريم كوفي', preview: 'ديّار للمفروشات' },
    { id: 'Cairo', label: 'القاهرة', preview: 'ديّار للمفروشات' },
    { id: 'Tajawal', label: 'تجوال', preview: 'ديّار للمفروشات' },
    { id: 'IBM Plex Sans Arabic', label: 'IBM بلكس', preview: 'ديّار للمفروشات' },
    { id: 'Almarai', label: 'المراعي', preview: 'ديّار للمفروشات' },
    { id: 'Noto Kufi Arabic', label: 'نوتو كوفي', preview: 'ديّار للمفروشات' },
    { id: 'Amiri', label: 'أميري', preview: 'ديّار للمفروشات' },
    { id: 'Changa', label: 'شنغا', preview: 'ديّار للمفروشات' }
  ];
  
  const bodyFonts = headingFonts.filter(f => f.id !== 'Amiri' && f.id !== 'Changa');
  
  // قسم خط العناوين
  const headingSection = el('div', { class: 'cms-fonts-section' });
  headingSection.appendChild(el('h3', { class: 'cms-fonts-title' }, ['خط العناوين']));
  
  const headingGrid = el('div', { class: 'cms-fonts-grid' });
  headingFonts.forEach(font => {
    const card = buildFontCard(font, cmsData.fonts.heading === font.id, () => {
      cmsData.fonts.heading = font.id;
      applyFonts(cmsData.fonts);
      refreshFontCards();
      markChanged();
    });
    headingGrid.appendChild(card);
  });
  headingSection.appendChild(headingGrid);
  wrap.appendChild(headingSection);
  
  // قسم خط النصوص
  const bodySection = el('div', { class: 'cms-fonts-section' });
  bodySection.appendChild(el('h3', { class: 'cms-fonts-title' }, ['خط النصوص']));
  
  const bodyGrid = el('div', { class: 'cms-fonts-grid' });
  bodyFonts.forEach(font => {
    const card = buildFontCard(font, cmsData.fonts.body === font.id, () => {
      cmsData.fonts.body = font.id;
      applyFonts(cmsData.fonts);
      refreshFontCards();
      markChanged();
    }, true);
    bodyGrid.appendChild(card);
  });
  bodySection.appendChild(bodyGrid);
  wrap.appendChild(bodySection);
  
  return wrap;
}

function buildFontCard(font, isActive, onClick, isBody = false) {
  const card = el('div', {
    class: `cms-font-card ${isActive ? 'active' : ''}`,
    onclick: onClick
  });
  
  const preview = el('div', { class: 'cms-font-preview' });
  preview.style.fontFamily = `'${font.id}', sans-serif`;
  preview.textContent = isBody ? 'نصنع من المكان حكاية' : font.preview;
  card.appendChild(preview);
  
  const info = el('div', { class: 'cms-font-info' });
  info.appendChild(el('span', { class: 'cms-font-label' }, [font.label]));
  info.appendChild(el('span', { class: 'cms-font-name' }, [font.id]));
  card.appendChild(info);
  
  if (isActive) {
    const check = el('div', { class: 'cms-font-check' });
    check.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    card.appendChild(check);
  }
  
  return card;
}

function refreshFontCards() {
  const area = document.getElementById('cms-area');
  if (!area) return;
  area.innerHTML = '';
  area.appendChild(buildSectionContent());
}

function applyFonts(fonts) {
  if (!fonts) return;
  
  const heading = fonts.heading || 'Reem Kufi';
  const body = fonts.body || 'Cairo';
  
  document.documentElement.style.setProperty('--font-heading', `'${heading}', 'Cairo', sans-serif`);
  document.documentElement.style.setProperty('--font-body', `'${body}', 'Cairo', sans-serif`);
  
  console.log(`✓ تم تطبيق الخطوط: ${heading} (عناوين) / ${body} (نصوص)`);
}

console.log('✓ admin/cms.js محمّل');