// =============================================
// صفحة التتبع
// =============================================

import { el } from '../utils/helpers.js';
import { buildHeader } from './header.js';
import { getOrders, ORDER_STAGES } from '../data/orders.js';

export async function buildTrackPage(cms) {
  const page = el('div', { class: 'page-track' });
  page.appendChild(buildHeader());
  
  const main = el('main', { class: 'page' });
  const container = el('div', { class: 'container' });
  
  const backBtn = el('button', {
    class: 'back-btn',
    onclick: () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    }
  });
  backBtn.innerHTML = '← العودة للرئيسية';
  container.appendChild(backBtn);
  
  const card = el('div', { class: 'book-card fade-up' });
  card.appendChild(el('h1', { class: 'book-title' }, ['تتبع طلبك']));
  card.appendChild(el('p', { class: 'book-subtitle' }, ['أدخل رقم طلبك لمعرفة حالة مشروعك.']));
  
  // حقل البحث
  const searchBox = el('div', { class: 'track-search' });
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
  
  // ✅ تمرير رقم الطلب تلقائياً — مع تأخير أطول لضمان الجهوزية
  const pendingId = window.__pendingTrackId;
  if (pendingId) {
    // املأ الحقل فوراً
    input.value = pendingId;
    
    // انتظر قليلاً ثم ابحث
    setTimeout(() => {
      doTrack(pendingId);
      window.__pendingTrackId = null;
    }, 400);
  } else {
    setTimeout(() => input.focus(), 200);
  }
  
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
    // إذا كان الرقم قادم من pendingId، نعطي فرصة إضافية
    if (window.__retryCount === undefined) window.__retryCount = 0;
    
    if (window.__retryCount < 3) {
      window.__retryCount++;
      setTimeout(() => {
        const orders = getOrders();
        const found = orders.find(o => o.id && o.id.toUpperCase() === input);
        if (found) {
          window.__retryCount = 0;
          renderOrderDetails(found, resultBox);
        } else if (window.__retryCount >= 3) {
          showNotFound(input, resultBox);
          window.__retryCount = 0;
        } else {
          doTrack(input);
        }
      }, 500);
      return;
    }
    
    showNotFound(input, resultBox);
    return;
  }
  
  window.__retryCount = 0;
  renderOrderDetails(order, resultBox);
}

function showNotFound(input, resultBox) {
  resultBox.innerHTML = `
    <div class="track-error">
      <div class="track-error-icon">🔍</div>
      <h3>لم يتم العثور على الطلب</h3>
      <p>تأكد من رقم الطلب: <strong dir="ltr">${input}</strong></p>
    </div>
  `;
}

// =============================================
// عرض التفاصيل
// =============================================

function renderOrderDetails(order, container) {
  const stages = ORDER_STAGES[order.type] || ORDER_STAGES['خدمة أخرى'];
  const currentStage = Math.min(Math.max(order.status || 1, 1), stages.length);
  const progress = Math.round((currentStage / stages.length) * 100);
  
  container.innerHTML = '';
  
  const card = el('div', { class: 'track-result' });
  
  // Header
  const header = el('div', { class: 'track-header' });
  
  const headerInfo = el('div', { class: 'track-header-info' });
  headerInfo.appendChild(el('div', { class: 'track-label' }, ['رقم الطلب']));
  headerInfo.appendChild(el('div', { class: 'track-order-id' }, [order.id]));
  header.appendChild(headerInfo);
  
  header.appendChild(el('div', { class: 'track-status-pill' }, [stages[currentStage - 1].label]));
  card.appendChild(header);
  
  // Progress
  const progressWrap = el('div', { class: 'track-progress-wrap' });
  const progressHeader = el('div', { class: 'track-progress-header' });
  progressHeader.appendChild(el('span', {}, ['تقدم الطلب']));
  progressHeader.appendChild(el('span', { class: 'track-progress-pct' }, [progress + '%']));
  progressWrap.appendChild(progressHeader);
  
  const progressBar = el('div', { class: 'track-progress-bar' });
  const progressFill = el('div', { class: 'track-progress-fill', style: 'width: 0%;' });
  progressBar.appendChild(progressFill);
  progressWrap.appendChild(progressBar);
  card.appendChild(progressWrap);
  
  setTimeout(() => {
    progressFill.style.width = progress + '%';
  }, 200);
  
  // Timeline
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
      dot.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    } else {
      dot.textContent = stageNum;
    }
    step.appendChild(dot);
    
    step.appendChild(el('div', { class: 'step-label' }, [stage.label]));
    step.appendChild(el('div', { class: 'step-desc' }, [stage.desc]));
    
    timeline.appendChild(step);
  });
  
  card.appendChild(timeline);
  
  // معلومات الطلب
  const infoCard = el('div', { class: 'track-info-card' });
  infoCard.appendChild(el('div', { class: 'track-info-title' }, ['معلومات الطلب']));
  
  const infoGrid = el('div', { class: 'track-info-grid' });
  
  const infoItems = [
    { label: 'الاسم', value: order.customer, ltr: false },
    { label: 'الهاتف', value: order.phone, ltr: true },
    { label: 'المدينة', value: order.city, ltr: false },
    { label: 'النوع', value: order.type, ltr: false },
    { label: 'تاريخ الطلب', value: order.date, ltr: false }
  ];
  
  infoItems.forEach(item => {
    const box = el('div', { class: 'track-info-item' });
    box.appendChild(el('div', { class: 'info-label' }, [item.label]));
    box.appendChild(el('div', { 
      class: 'info-value' + (item.ltr ? ' ltr' : '') 
    }, [item.value || '—']));
    infoGrid.appendChild(box);
  });
  
  infoCard.appendChild(infoGrid);
  card.appendChild(infoCard);
  
  container.appendChild(card);
}

console.log('✓ track.js محمّل');