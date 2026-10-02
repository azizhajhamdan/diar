// =============================================
// إدارة الطلبات الكاملة
// =============================================

import { el, svg, ICONS } from '../utils/helpers.js';
import { getOrders, updateOrder, removeOrder, ORDER_STAGES } from '../data/orders.js';
import { printInvoice } from '../utils/invoice.js';

let currentFilter = 'all';
let currentSearch = '';

export function buildOrdersContent() {
  const wrap = el('div', { class: 'admin-orders-content' });
  
  wrap.appendChild(el('h1', { class: 'admin-title' }, ['إدارة الطلبات']));
  wrap.appendChild(el('p', { class: 'admin-subtitle' }, ['عرض وتعديل طلبات العملاء']));
  
  wrap.appendChild(buildSearchBar());
  wrap.appendChild(buildOrdersTable());
  
  return wrap;
}

function buildSearchBar() {
  const box = el('div', { class: 'admin-search-box' });
  
  const searchInput = el('input', {
    type: 'text',
    placeholder: 'ابحث برقم الطلب أو اسم العميل أو الهاتف...',
    class: 'admin-search-input',
    value: currentSearch
  });
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    refreshTable();
  });
  box.appendChild(searchInput);
  
  const filters = el('div', { class: 'admin-filters' });
  
  const filtersList = [
    { key: 'all', label: 'الكل' },
    { key: 'new', label: 'جديدة' },
    { key: 'progress', label: 'قيد التنفيذ' },
    { key: 'ready', label: 'جاهزة' }
  ];
  
  filtersList.forEach(f => {
    const btn = el('button', {
      class: `admin-filter-btn ${currentFilter === f.key ? 'active' : ''}`,
      onclick: () => {
        currentFilter = f.key;
        document.querySelectorAll('.admin-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        refreshTable();
      }
    }, [f.label]);
    filters.appendChild(btn);
  });
  
  box.appendChild(filters);
  return box;
}

function buildOrdersTable() {
  const wrap = el('div', { class: 'admin-table-wrap', id: 'orders-table-wrap' });
  wrap.appendChild(buildTable());
  return wrap;
}

function refreshTable() {
  const wrap = document.getElementById('orders-table-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  wrap.appendChild(buildTable());
}

function buildTable() {
  const orders = filterOrders(getOrders());
  
  if (orders.length === 0) {
    const empty = el('div', { class: 'admin-empty' });
    
    const iconBox = el('div', { class: 'admin-empty-icon' });
    iconBox.appendChild(svg(ICONS.orders, { width: '1.5', size: '36' }));
    empty.appendChild(iconBox);
    
    empty.appendChild(el('h3', {}, ['لا توجد طلبات']));
    empty.appendChild(el('p', {}, [
      currentSearch ? 'لم يتم العثور على نتائج' : 'لم تُسجّل أي طلبات بعد'
    ]));
    
    return empty;
  }
  
  const table = el('table', { class: 'admin-table' });
  
  const thead = el('thead');
  const hr = el('tr');
  ['العميل', 'النوع', 'رقم الطلب', 'تاريخ الطلب', 'تاريخ الاستلام', 'الحالة', 'إجراءات'].forEach(h => {
    hr.appendChild(el('th', {}, [h]));
  });
  thead.appendChild(hr);
  table.appendChild(thead);
  
  const tbody = el('tbody');
  orders.forEach(order => {
    const row = el('tr', { onclick: () => openOrderModal(order) });
    
    // العميل
    const customerTd = el('td');
    customerTd.appendChild(el('div', { class: 'admin-customer-name' }, [order.customer]));
    customerTd.appendChild(el('div', { class: 'admin-customer-phone', dir: 'ltr' }, [order.phone]));
    row.appendChild(customerTd);
    
    // النوع
    row.appendChild(el('td', {}, [
      el('span', { class: 'admin-type-badge' }, [order.type])
    ]));
    
    // رقم الطلب
    row.appendChild(el('td', {}, [
      el('span', { class: 'admin-order-id', dir: 'ltr' }, [order.id])
    ]));
    
    // تاريخ الطلب
    row.appendChild(el('td', {}, [
      el('span', { class: 'admin-date' }, [order.date || '—'])
    ]));
    
    // تاريخ الاستلام
    row.appendChild(el('td', {}, [
      el('span', { 
        class: `admin-date ${!order.receiveDate ? 'empty' : ''}` 
      }, [order.receiveDate || 'لم يحدد'])
    ]));
    
    // الحالة
    const stages = ORDER_STAGES[order.type] || ORDER_STAGES['خدمة أخرى'];
    const cs = order.status || 1;
    const isReady = cs === stages.length;
    
    row.appendChild(el('td', {}, [
      el('span', { 
        class: `admin-status ${isReady ? 'ready' : cs === 1 ? 'new' : 'progress'}` 
      }, [order.statusLabel || 'قبول الطلب'])
    ]));
    
    // الإجراءات
    const actionsTd = el('td', { class: 'admin-actions-cell' });

// طباعة
const printBtn = el('button', {
  class: 'admin-icon-btn print',
  title: 'طباعة الفاتورة',
  onclick: (e) => { e.stopPropagation(); printInvoice(order); }
});
printBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>';
actionsTd.appendChild(printBtn);

// نسخ
const copyBtn = el('button', {
  class: 'admin-icon-btn',
  title: 'نسخ الرقم',
  onclick: (e) => { e.stopPropagation(); copyToClipboard(order.id); }
});
copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
actionsTd.appendChild(copyBtn);

// حذف
const delBtn = el('button', {
  class: 'admin-icon-btn danger',
  title: 'حذف',
  onclick: (e) => { e.stopPropagation(); deleteOrder(order); }
});
delBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>';
actionsTd.appendChild(delBtn);

row.appendChild(actionsTd);
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  
  const scroll = el('div', { class: 'admin-table-scroll' });
  scroll.appendChild(table);
  return scroll;
}

function filterOrders(orders) {
  let filtered = orders;
  
  if (currentFilter === 'new') {
    filtered = filtered.filter(o => (o.status || 1) === 1);
  } else if (currentFilter === 'progress') {
    filtered = filtered.filter(o => {
      const stages = ORDER_STAGES[o.type] || ORDER_STAGES['خدمة أخرى'];
      const s = o.status || 1;
      return s > 1 && s < stages.length;
    });
  } else if (currentFilter === 'ready') {
    filtered = filtered.filter(o => {
      const stages = ORDER_STAGES[o.type] || ORDER_STAGES['خدمة أخرى'];
      return (o.status || 1) === stages.length;
    });
  }
  
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    filtered = filtered.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.phone.includes(q)
    );
  }
  
  return filtered;
}

function openOrderModal(order) {
  const modal = el('div', { 
    class: 'admin-modal',
    onclick: (e) => { if (e.target === modal) modal.remove(); }
  });
  
  const card = el('div', { class: 'admin-modal-card' });
  
  // Header
  const header = el('div', { class: 'admin-modal-header' });
  header.appendChild(el('h3', {}, ['تعديل الطلب: ' + order.id]));
  const closeBtn = el('button', { 
    class: 'admin-modal-close',
    onclick: () => modal.remove()
  }, ['×']);
  header.appendChild(closeBtn);
  card.appendChild(header);
  
  // Body
  const body = el('div', { class: 'admin-modal-body' });
  
  const info = el('div', { class: 'admin-order-info' });
  info.innerHTML = `
    <div class="admin-order-info-row">
      <span class="admin-order-info-label">العميل</span>
      <span class="admin-order-info-value">${order.customer}</span>
    </div>
    <div class="admin-order-info-row">
      <span class="admin-order-info-label">الهاتف</span>
      <span class="admin-order-info-value ltr">${order.phone}</span>
    </div>
    <div class="admin-order-info-row">
      <span class="admin-order-info-label">المدينة</span>
      <span class="admin-order-info-value">${order.city}</span>
    </div>
    <div class="admin-order-info-row">
      <span class="admin-order-info-label">النوع</span>
      <span class="admin-order-info-value">${order.type}</span>
    </div>
  `;
  body.appendChild(info);
  
  body.appendChild(el('h4', { class: 'admin-modal-section' }, ['تاريخ الاستلام']));
  const dateInput = el('input', {
    type: 'text',
    class: 'admin-input',
    placeholder: 'مثال: 25 أكتوبر 2026',
    value: order.receiveDate || ''
  });
  body.appendChild(dateInput);
  
  body.appendChild(el('h4', { class: 'admin-modal-section' }, ['المرحلة الحالية']));
  
  const stages = ORDER_STAGES[order.type] || ORDER_STAGES['خدمة أخرى'];
  const stagesList = el('div', { class: 'admin-stages-list' });
  let selectedStage = order.status || 1;
  
  stages.forEach((stage, i) => {
    const stageNum = i + 1;
    const btn = el('button', {
      class: `admin-stage-btn ${stageNum === selectedStage ? 'active' : ''}`,
      onclick: () => {
        selectedStage = stageNum;
        document.querySelectorAll('.admin-stage-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
    
    const num = el('span', { class: 'admin-stage-num' }, [String(stageNum)]);
    btn.appendChild(num);
    
    const label = el('span', { class: 'admin-stage-label' }, [stage.label]);
    btn.appendChild(label);
    
    stagesList.appendChild(btn);
  });
  body.appendChild(stagesList);
  
  body.appendChild(el('h4', { class: 'admin-modal-section' }, ['ملاحظات']));
  const notesInput = el('textarea', {
    class: 'admin-input',
    placeholder: 'ملاحظات داخلية...',
    rows: 3
  });
  notesInput.value = order.notes || '';
  body.appendChild(notesInput);
  
  card.appendChild(body);
  
  // Footer
  const footer = el('div', { class: 'admin-modal-footer' });
  
  const saveBtn = el('button', {
    class: 'admin-btn-primary',
    onclick: async () => {
      try {
        await updateOrder(order.id, {
          status: selectedStage,
          statusLabel: stages[selectedStage - 1].label,
          progress: Math.round((selectedStage / stages.length) * 100),
          receiveDate: dateInput.value.trim(),
          notes: notesInput.value.trim() || '—'
        });
        showAdminToast('تم حفظ التعديلات');
        modal.remove();
        refreshTable();
      } catch (error) {
        console.error(error);
        showAdminToast('خطأ في الحفظ');
      }
    }
  }, ['حفظ التعديلات']);
  footer.appendChild(saveBtn);
  
  const printBtn = el('button', {
    class: 'admin-btn-secondary',
    onclick: () => printInvoice(order)
  }, ['طباعة الفاتورة']);
  footer.appendChild(printBtn);
  
  card.appendChild(footer);
  modal.appendChild(card);
  document.body.appendChild(modal);
}

async function deleteOrder(order) {
  if (!confirm(`حذف الطلب ${order.id}؟\n\nلا يمكن التراجع!`)) return;
  try {
    await removeOrder(order.id);
    showAdminToast('تم حذف الطلب');
    refreshTable();
  } catch (error) {
    console.error(error);
    showAdminToast('خطأ في الحذف');
  }
}

function copyToClipboard(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showAdminToast('تم النسخ: ' + text);
  } catch (e) {
    showAdminToast('تعذر النسخ');
  }
  ta.remove();
}

function showAdminToast(msg) {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = el('div', { class: 'admin-toast', id: 'admin-toast' });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window.__adminToastTimer);
  window.__adminToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

console.log('✓ admin/orders.js محمّل');