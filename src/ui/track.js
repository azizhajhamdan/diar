// =============================================
// صفحة التتبع
// =============================================

import { el } from '../utils/helpers.js';
import { buildHeader } from './header.js';
import { getOrders, ORDER_STAGES } from '../data/orders.js';

// =============================================
// بناء صفحة التتبع
// =============================================

export async function buildTrackPage(cms) {
  const page = el('div', { class: 'page-track' });
  page.appendChild(buildHeader());
  
  const main = el('main', { class: 'page' });
  const container = el('div', { class: 'container' });
  
  // زر الرجوع
  const backBtn = el('button', {
    class: 'back-btn',
    onclick: () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    }
  });
  backBtn.innerHTML = '← العودة للرئيسية';
  container.appendChild(backBtn);
  
  // البطاقة
  const card = el('div', { class: 'book-card fade-up', style: 'max-width: 820px;' });
  card.appendChild(el('h1', { class: 'book-title' }, ['تتبع طلبك']));
  card.appendChild(el('p', { class: 'book-subtitle' }, ['أدخل رقم طلبك لمعرفة حالة مشروعك.']));
  
  // حقل البحث
  const searchBox = el('div', { class: 'track-search-pro' });
  const input = el('input', {
    type: 'text',
    id: 'track-input',
    placeholder: 'DR-1234',
    dir: 'ltr'
  });
  searchBox.appendChild(input);
  
  const searchBtn = el('button', {
    class: 'btn btn-primary',
    onclick: () => doTrack(input.value)
  }, ['تتبع']);
  searchBox.appendChild(searchBtn);
  card.appendChild(searchBox);
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doTrack(input.value);
  });
  
  // منطقة النتيجة
  const resultBox = el('div', { id: 'track-result' });
  card.appendChild(resultBox);
  
  container.appendChild(card);
  main.appendChild(container);
  page.appendChild(main);
  
  // ⭐ قراءة رقم الطلب من URL أو pendingTrackId
  setTimeout(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackParam = urlParams.get('track');
    const pendingId = window.__pendingTrackId || trackParam;
    const inputEl = document.getElementById('track-input');
    
    if (pendingId && inputEl) {
      inputEl.value = pendingId;
      doTrack(pendingId);
      window.__pendingTrackId = null;
    } else if (inputEl) {
      inputEl.focus();
    }
  }, 250);
  
  return page;
}

// =============================================
// البحث
// =============================================

function doTrack(value) {
  let input = (value || '').trim().toUpperCase();
  const resultBox = document.getElementById('track-result');
  if (!resultBox) return;
  
  resultBox.innerHTML = '';
  
  if (!input) {
    resultBox.innerHTML = `
      <div class="track-error">
        <div class="track-error-icon">📝</div>
        <h3>أدخل رقم الطلب</h3>
        <p>الرجاء إدخال رقم الطلب للمتابعة.</p>
      </div>
    `;
    return;
  }
  
  // تصحيح الصيغة
  if (input.indexOf('DR') !== 0) {
    input = 'DR-' + input;
  }
  if (input.indexOf('DR') === 0 && input.indexOf('DR-') !== 0) {
    input = 'DR-' + input.substring(2);
  }
  
  const orders = getOrders();
  const order = orders.find(o => o.id && o.id.toUpperCase() === input);
  
  if (!order) {
    resultBox.innerHTML = `
      <div class="track-error">
        <div class="track-error-icon">🔍</div>
        <h3>لم يتم العثور على الطلب</h3>
        <p>تأكد من رقم الطلب: <strong dir="ltr">${input}</strong></p>
      </div>
    `;
    return;
  }
  
  renderOrderDetails(order, resultBox);
}

// =============================================
// عرض التفاصيل
// =============================================

function renderOrderDetails(order, container) {
  const stages = ORDER_STAGES[order.type] || ORDER_STAGES['خدمة أخرى'];
  const currentStage = Math.min(Math.max(order.status || 1, 1), stages.length);
  const progress = Math.round((currentStage / stages.length) * 100);
  
  container.innerHTML = '';
  
  const card = el('div', { class: 'track-result-pro' });
  
  // ═══ Header ═══
  const header = el('div', { class: 'track-header' });
  
  const headerInfo = el('div');
  headerInfo.appendChild(el('div', { class: 'track-order-label' }, ['رقم الطلب']));
  headerInfo.appendChild(el('div', { class: 'track-order-id' }, [order.id]));
  header.appendChild(headerInfo);
  
  header.appendChild(el('div', { class: 'track-status-pill' }, [stages[currentStage - 1].label]));
  card.appendChild(header);
  
  // ═══ Type Badge ═══
  const typeBadge = el('div', { class: 'track-type-badge' });
  typeBadge.textContent = 'النوع: ' + order.type;
  card.appendChild(typeBadge);
  
  // ═══ Progress ═══
  const progressWrap = el('div', { class: 'track-progress-wrap' });
  
  const progressHeader = el('div', { class: 'track-progress-header' });
  progressHeader.appendChild(el('span', {}, ['تقدم الطلب']));
  progressHeader.appendChild(el('span', { class: 'pct' }, [progress + '%']));
  progressWrap.appendChild(progressHeader);
  
  const progressBar = el('div', { class: 'track-progress-bar' });
  const progressFill = el('div', { class: 'track-progress-fill', style: 'width: 0%;' });
  progressBar.appendChild(progressFill);
  progressWrap.appendChild(progressBar);
  card.appendChild(progressWrap);
  
  // Animation
  setTimeout(() => {
    progressFill.style.width = progress + '%';
  }, 200);
  
  // ═══ Timeline ═══
  const timeline = el('div', { class: 'track-timeline' });
  
  stages.forEach((stage, i) => {
    const stageNum = i + 1;
    const isDone = stageNum < currentStage;
    const isCurrent = stageNum === currentStage;
    
    let cls = 'track-step';
    if (isDone) cls += ' done';
    if (isCurrent) cls += ' current';
    
    const step = el('div', { class: cls });
    
    const dot = el('div', { class: 'step-dot' });
    if (isDone) {
      dot.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    } else {
      dot.textContent = stageNum;
    }
    step.appendChild(dot);
    
    step.appendChild(el('div', { class: 'step-label' }, [stage.label]));
    step.appendChild(el('div', { class: 'step-desc' }, [stage.desc]));
    
    timeline.appendChild(step);
  });
  
  card.appendChild(timeline);
  
  // ═══ Customer Info ═══
  const infoCard = el('div', { class: 'customer-info-card' });
  
  const infoTitle = el('h4');
  infoTitle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> معلومات الطلب';
  infoCard.appendChild(infoTitle);
  
  const infoGrid = el('div', { class: 'customer-info-grid' });
  
  const infoItems = [
    { label: 'الاسم', value: order.customer, ltr: false },
    { label: 'الهاتف', value: order.phone, ltr: true },
    { label: 'المدينة', value: order.city, ltr: false },
    { label: 'النوع', value: order.type, ltr: false },
    { label: 'تاريخ الطلب', value: order.date, ltr: false }
  ];
  
  if (order.receiveDate) {
    infoItems.push({ label: 'تاريخ الاستلام', value: order.receiveDate, ltr: false });
  }
  
  infoItems.forEach(item => {
    const box = el('div', { class: 'customer-info-item' });
    box.appendChild(el('div', { class: 'label' }, [item.label]));
    box.appendChild(el('div', {
      class: 'value' + (item.ltr ? ' ltr' : '')
    }, [item.value || '—']));
    infoGrid.appendChild(box);
  });
  
  // الملاحظات
  const notesBox = el('div', { class: 'customer-info-item full' });
  notesBox.appendChild(el('div', { class: 'label' }, ['ملاحظات']));
  notesBox.appendChild(el('div', { class: 'value' }, [order.notes || '—']));
  infoGrid.appendChild(notesBox);
  
  infoCard.appendChild(infoGrid);
  card.appendChild(infoCard);
  
  container.appendChild(card);
}

console.log('✓ track.js محمّل');