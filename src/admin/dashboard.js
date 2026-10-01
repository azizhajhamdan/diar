// =============================================
// لوحة التحكم - Dashboard
// =============================================

import { el } from '../utils/helpers.js';
import { logout } from './auth.js';
import { getOrders } from '../data/orders.js';
import { buildOrdersContent } from './orders.js';

let currentTab = 'overview';

export function buildAdminDashboard() {
  const page = el('div', { class: 'admin-page' });
  page.appendChild(buildTopBar());
  page.appendChild(buildTabs());
  
  const container = el('div', { class: 'admin-container' });
  
  if (currentTab === 'orders') {
    container.appendChild(buildOrdersContent());
  } else {
    container.appendChild(buildOverview());
  }
  
  page.appendChild(container);
  return page;
}

// =============================================
// Tabs
// =============================================

function buildTabs() {
  const tabs = el('div', { class: 'admin-tabs' });
  
  const tabsList = [
    { key: 'overview', label: 'نظرة عامة', icon: 'overview' },
    { key: 'orders', label: 'الطلبات', icon: 'orders' }
  ];
  
  tabsList.forEach(tab => {
    const btn = el('button', {
      class: `admin-tab ${currentTab === tab.key ? 'active' : ''}`,
      onclick: () => {
        currentTab = tab.key;
        rebuild();
      }
    });
    
    const iconSpan = el('span', { class: `admin-tab-icon icon-${tab.icon}` });
    btn.appendChild(iconSpan);
    btn.appendChild(document.createTextNode(tab.label));
    
    tabs.appendChild(btn);
  });
  
  return tabs;
}

function rebuild() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = '';
  app.appendChild(buildAdminDashboard());
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
    { num: orders.length, label: 'إجمالي الطلبات', variant: 'default' },
    { num: orders.filter(o => (o.status || 1) === 1).length, label: 'طلبات جديدة', variant: 'new' },
    { num: orders.filter(o => (o.status || 1) > 1 && o.statusLabel !== 'جاهز للاستلام').length, label: 'قيد التنفيذ', variant: 'progress' },
    { num: orders.filter(o => o.statusLabel === 'جاهز للاستلام').length, label: 'جاهزة للتسليم', variant: 'ready' }
  ];
  
  statsData.forEach(stat => {
    const card = el('div', { class: `admin-stat-card ${stat.variant}` });
    
    const numBox = el('div', { class: 'admin-stat-num' }, [String(stat.num)]);
    card.appendChild(numBox);
    
    card.appendChild(el('div', { class: 'admin-stat-label' }, [stat.label]));
    stats.appendChild(card);
  });
  
  wrap.appendChild(stats);
  
  const info = el('div', { class: 'admin-info-box' });
  info.innerHTML = `
    <h3>مرحباً بك في لوحة التحكم</h3>
    <p>انتقل إلى تبويب "الطلبات" لإدارة طلبات العملاء، تحديث المراحل، وطباعة الفواتير.</p>
  `;
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
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    }
  }, ['عرض الموقع']);
  actions.appendChild(viewBtn);
  
  const logoutBtn = el('button', {
    class: 'admin-btn admin-btn-danger',
    onclick: () => {
      if (confirm('تسجيل الخروج؟')) {
        logout();
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'admin' }));
      }
    }
  }, ['خروج']);
  actions.appendChild(logoutBtn);
  
  bar.appendChild(actions);
  return bar;
}

console.log('✓ admin/dashboard.js محمّل');