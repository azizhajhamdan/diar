// =============================================
// إدارة المظهر - اختيار الثيم
// =============================================

import { el } from '../utils/helpers.js';
import { readData, writeData } from '../data/firebase.js';
import { THEMES } from '../config.js';

// =============================================
// State
// =============================================

let cmsData = null;

// =============================================
// Load CMS
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
// Main Content
// =============================================

export async function buildAppearanceContent() {
  const wrap = el('div');
  
  if (!cmsData) {
    await loadCMS();
  }
  
  // Header
  wrap.appendChild(el('h1', { class: 'admin-title' }, ['مظهر الموقع']));
  wrap.appendChild(el('p', { class: 'admin-subtitle' }, ['اختر ثيم الموقع. سيتم تطبيقه على جميع الزوار تلقائياً.']));
  
  // Current theme
  if (!cmsData.appearance) cmsData.appearance = {};
  const currentTheme = cmsData.appearance.theme || 'gold';
  
  // Themes Data
  const themesList = [
    {
      key: 'gold',
      label: 'الذهبي',
      desc: 'أسود + ذهبي كلاسيكي',
      colors: ['#0a0805', '#f0c674', '#fcf8ee']
    },
    {
      key: 'olive',
      label: 'الزيتي',
      desc: 'أبيض + زيتي فاخر',
      colors: ['#f8f6f0', '#2d3d28', '#1a2018']
    },
    {
      key: 'burgundy',
      label: 'البرقندي',
      desc: 'نبيتي داكن راقٍ',
      colors: ['#0f0808', '#d4a0a0', '#fcf0f0']
    },
    {
      key: 'royal',
      label: 'الأزرق الملكي',
      desc: 'كحلي فاخر',
      colors: ['#080a0f', '#a0b8d4', '#f0f4fc']
    },
    {
      key: 'yagouri',
      label: 'الياجوري',
      desc: 'قرميدي محروق',
      colors: ['#1a0f0a', '#c98878', '#fcf5f0']
    }
  ];
  
  // Grid
  const grid = el('div', { class: 'theme-grid' });
  
  themesList.forEach(theme => {
    const isActive = currentTheme === theme.key;
    const card = el('div', {
      class: 'theme-card' + (isActive ? ' active' : ''),
      'data-theme-key': theme.key,
      onclick: () => selectTheme(theme.key)
    });
    
    // Preview colors
    const preview = el('div', { class: 'theme-preview' });
    theme.colors.forEach(color => {
      preview.appendChild(el('div', {
        class: 'theme-swatch',
        style: `background: ${color};`
      }));
    });
    card.appendChild(preview);
    
    // Name
    card.appendChild(el('div', { class: 'theme-name' }, [theme.label]));
    card.appendChild(el('div', { class: 'theme-desc' }, [theme.desc]));
    
    // Check mark
    if (isActive) {
      card.appendChild(el('div', { class: 'theme-check' }, ['✓']));
    }
    
    grid.appendChild(card);
  });
  
  wrap.appendChild(grid);
  
  // Info box
  const info = el('div', { class: 'admin-info-box', style: 'margin-top:24px;' });
  info.innerHTML = '<h3>كيف يعمل؟</h3><p>عند اختيار أي ثيم، سيتم تطبيقه على الموقع بالكامل. عند الضغط على "حفظ التغييرات" سيُحفظ الثيم ويظهر لجميع الزوار.</p>';
  wrap.appendChild(info);
  
  // Save button
  const saveBtn = el('button', {
    class: 'cms-save-btn',
    style: 'margin-top:20px;width:100%;',
    onclick: saveAppearance
  }, ['💾 حفظ المظهر']);
  wrap.appendChild(saveBtn);
  
  return wrap;
}

// =============================================
// Select Theme
// =============================================

function selectTheme(themeKey) {
  // Update CMS data
  if (!cmsData.appearance) cmsData.appearance = {};
  cmsData.appearance.theme = themeKey;
  
  // Apply immediately
  document.documentElement.setAttribute('data-theme', themeKey);
  console.log('🎨 الثيم المختار:', themeKey);
  
  // Update cards
  document.querySelectorAll('.theme-card').forEach(card => {
    const isActive = card.getAttribute('data-theme-key') === themeKey;
    card.classList.toggle('active', isActive);
    
    // Remove old check
    const oldCheck = card.querySelector('.theme-check');
    if (oldCheck) oldCheck.remove();
    
    // Add new check
    if (isActive) {
      card.appendChild(el('div', { class: 'theme-check' }, ['✓']));
    }
  });
}

// =============================================
// Save Appearance
// =============================================

async function saveAppearance() {
  const btn = document.querySelector('.cms-save-btn');
  if (!btn) return;
  
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'جاري الحفظ...';
  
  try {
    await writeData('cms', cmsData);
    
    btn.textContent = '✓ تم الحفظ';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
    
    console.log('✓ تم حفظ المظهر');
    
  } catch (error) {
    console.error('خطأ في الحفظ:', error);
    alert('خطأ في حفظ المظهر');
    btn.textContent = originalText;
  } finally {
    btn.disabled = false;
  }
}

console.log('✓ admin/appearance.js محمّل');