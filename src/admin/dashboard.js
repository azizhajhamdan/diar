// =============================================
// لوحة التحكم - Dashboard
// =============================================

import { el } from '../utils/helpers.js';
import { logout } from './auth.js';
import { getOrders } from '../data/orders.js';
import { buildOrdersContent } from './orders.js';
import { buildCMSContent } from './cms.js';
import { buildAppearanceContent } from './appearance.js';

// =============================================
// State
// =============================================

let currentTab = 'overview';

// =============================================
// أيقونات التبويبات
// =============================================

const TAB_ICONS = {
  overview: 'M3 3v18h18M7 15l4-4 4 4 5-6',
  orders: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
  cms: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  appearance: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 2v20'
};

// =============================================
// Main
// =============================================

export async function buildAdminDashboard() {
  const page = el('div', { class: 'admin-page', id: 'admin-page' });
  page.appendChild(buildTopBar());
  page.appendChild(buildTabs());
  
  const container = el('div', { class: 'admin-container', id: 'admin-content' });
  page.appendChild(container);
  
  // ابني المحتوى بعد إضافة الصفحة
  setTimeout(() => switchTab(currentTab), 0);
  
  return page;
}

// =============================================
// Tabs
// =============================================

function buildTabs() {
  const tabs = el('div', { class: 'admin-tabs' });
  
  const tabsList = [
    { key: 'overview', label: 'نظرة عامة' },
    { key: 'orders', label: 'الطلبات' },
    { key: 'cms', label: 'المحتوى' },
    { key: 'appearance', label: 'المظهر' }
  ];
  
  tabsList.forEach(tab => {
    const btn = el('button', {
      class: `admin-tab ${currentTab === tab.key ? 'active' : ''}`,
      'data-tab': tab.key,
      onclick: () => switchTab(tab.key)
    });
    
    const icon = el('span', { class: 'admin-tab-icon' });
    icon.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${TAB_ICONS[tab.key]}"/></svg>`;
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(tab.label));
    
    tabs.appendChild(btn);
  });
  
  return tabs;
}

// =============================================
// التبديل السريع بين التبويبات
// =============================================

async function switchTab(tabKey) {
  currentTab = tabKey;
  
  // حدّث الـ active
  document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
  });
  
  const container = document.getElementById('admin-content');
  if (!container) return;
  
  // امسح المحتوى فقط
  container.innerHTML = '';
  
  // Spinner
  const spinner = el('div', { class: 'admin-loading' });
  spinner.innerHTML = '<div class="admin-spinner"></div>';
  container.appendChild(spinner);
  
  // انتظر إطار واحد
  await new Promise(r => requestAnimationFrame(r));
  
  // ابنِ المحتوى
  let content;
  try {
    if (tabKey === 'orders') {
      content = buildOrdersContent();
    } else if (tabKey === 'cms') {
      content = await buildCMSContent();
    } else if (tabKey === 'appearance') {
      content = await buildAppearanceContent();
    } else {
      content = buildOverview();
    }
  } catch (error) {
    console.error('خطأ:', error);
    content = el('div', { class: 'admin-error' }, ['حدث خطأ في التحميل']);
  }
  
  container.innerHTML = '';
  container.appendChild(content);
  
  // Animations
  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('vis'));
  }, 50);
}

// =============================================
// Overview
// =============================================

function buildOverview() {
  const wrap = el('div');
  
  const header = el('div', { class: 'admin-header-block' });
  header.appendChild(el('h1', { class: 'admin-title' }, ['نظرة عامة']));
  header.appendChild(el('p', { class: 'admin-subtitle' }, ['ملخص سريع لحركة الطلبات']));
  wrap.appendChild(header);
  
  const orders = getOrders();
  const stats = el('div', { class: 'admin-stats' });
  
  const statsData = [
    { num: orders.length, label: 'إجمالي الطلبات' },
    { num: orders.filter(o => (o.status || 1) === 1).length, label: 'طلبات جديدة' },
    { num: orders.filter(o => (o.status || 1) > 1 && o.statusLabel !== 'جاهز للاستلام').length, label: 'قيد التنفيذ' },
    { num: orders.filter(o => o.statusLabel === 'جاهز للاستلام').length, label: 'جاهزة للتسليم' }
  ];
  
  statsData.forEach(stat => {
    const card = el('div', { class: 'admin-stat-card' });
    card.appendChild(el('div', { class: 'admin-stat-num' }, [String(stat.num)]));
    card.appendChild(el('div', { class: 'admin-stat-label' }, [stat.label]));
    stats.appendChild(card);
  });
  
  wrap.appendChild(stats);
  
  const info = el('div', { class: 'admin-info-box' });
  info.innerHTML = '<h3>مرحباً بك في لوحة التحكم</h3><p>انتقل إلى تبويب "الطلبات" لإدارة الطلبات، أو "المحتوى" لتعديل نصوص وصور الموقع، أو "المظهر" لتغيير ثيم الموقع.</p>';
  wrap.appendChild(info);
  
  return wrap;
}

// =============================================
// Top Bar
// =============================================

function buildTopBar() {
  const bar = el('div', { class: 'admin-topbar' });
  
  const logo = el('div', { class: 'admin-logo' });
  logo.innerHTML = 'ديّار<span>.</span>';
  bar.appendChild(logo);
  
  const actions = el('div', { class: 'admin-actions' });
  
  const viewBtn = el('button', {
    class: 'admin-btn',
    onclick: () => {
      window.location.hash = '';
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    }
  }, ['عرض الموقع']);
  actions.appendChild(viewBtn);
  
  const logoutBtn = el('button', {
    class: 'admin-btn admin-btn-danger',
    onclick: () => {
      if (confirm('تسجيل الخروج؟')) {
        logout();
        window.location.hash = '';
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'admin' }));
      }
    }
  }, ['خروج']);
  actions.appendChild(logoutBtn);
  
  bar.appendChild(actions);
  return bar;
}

console.log('✓ admin/dashboard.js محمّل');