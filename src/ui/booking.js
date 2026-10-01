// =============================================
// صفحة الحجز
// =============================================

import { el } from '../utils/helpers.js';
import { buildHeader } from './header.js';
import { createOrder } from '../data/orders.js';
import { SITE_CONFIG } from '../config.js';

export async function buildBookingPage(cms) {
  const page = el('div', { class: 'page-booking' });
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
  card.appendChild(el('h1', { class: 'book-title' }, ['احجز طلبك']));
  card.appendChild(el('p', { class: 'book-subtitle' }, ['أخبرنا عن طلبك وسنتواصل معك خلال 24 ساعة.']));
  
  const form = el('form', { class: 'book-form' });
  form.onsubmit = (e) => {
    e.preventDefault();
    submitBooking();
  };
  
  const serviceField = el('div', { class: 'af-field' });
  serviceField.appendChild(el('label', {}, ['نوع الطلب *']));
  const serviceSelect = el('select', { id: 'bk-service' });
  serviceSelect.appendChild(el('option', { value: '' }, ['اختر النوع...']));
  (cms.categories || []).forEach(cat => {
    serviceSelect.appendChild(el('option', { value: cat.title }, [cat.title]));
  });
  serviceSelect.appendChild(el('option', { value: 'خدمة أخرى' }, ['خدمة أخرى']));
  serviceField.appendChild(serviceSelect);
  form.appendChild(serviceField);
  
  const row1 = el('div', { class: 'af-row cols-2' });
  
  const nameField = el('div', { class: 'af-field' });
  nameField.appendChild(el('label', {}, ['الاسم *']));
  nameField.appendChild(el('input', { 
    type: 'text', id: 'bk-name', placeholder: 'اسمك الكامل', required: true
  }));
  row1.appendChild(nameField);
  
  const phoneField = el('div', { class: 'af-field' });
  phoneField.appendChild(el('label', {}, ['الهاتف *']));
  phoneField.appendChild(el('input', { 
    type: 'tel', id: 'bk-phone', placeholder: '+218 91 1234567', dir: 'ltr', required: true
  }));
  row1.appendChild(phoneField);
  
  form.appendChild(row1);
  
  const cityField = el('div', { class: 'af-field' });
  cityField.appendChild(el('label', {}, ['المدينة *']));
  cityField.appendChild(el('input', { 
    type: 'text', id: 'bk-city', placeholder: 'طرابلس', required: true
  }));
  form.appendChild(cityField);
  
  const detailsField = el('div', { class: 'af-field' });
  detailsField.appendChild(el('label', {}, ['تفاصيل الطلب']));
  detailsField.appendChild(el('textarea', { 
    id: 'bk-details', placeholder: 'أخبرنا عن طلبك...', rows: 4
  }));
  form.appendChild(detailsField);
  
  const submitBtn = el('button', {
    type: 'submit',
    class: 'btn btn-primary btn-lg',
    id: 'bk-submit',
    style: 'width: 100%; margin-top: 10px;'
  }, ['إرسال الطلب']);
  form.appendChild(submitBtn);
  
  card.appendChild(form);
  container.appendChild(card);
  main.appendChild(container);
  page.appendChild(main);
  
  return page;
}

async function submitBooking() {
  const submitBtn = document.getElementById('bk-submit');
  if (!submitBtn || submitBtn.disabled) return;
  
  const service = document.getElementById('bk-service').value;
  const name = document.getElementById('bk-name').value.trim();
  const phone = document.getElementById('bk-phone').value.trim();
  const city = document.getElementById('bk-city').value.trim();
  const details = document.getElementById('bk-details').value.trim();
  
  if (!service || !name || !phone || !city) {
    showToast('⚠️ أكمل الحقول المطلوبة');
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'جاري الحفظ...';
  
  try {
    const order = await createOrder({
      type: service,
      customer: name,
      phone: phone,
      city: city,
      notes: details || '—'
    });
    
    console.log('✅ تم إنشاء الطلب:', order.id);
    showSuccessModal(order);
    
  } catch (error) {
    console.error('✗ خطأ:', error);
    showToast('❌ تعذر حفظ الطلب. حاول مرة أخرى.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'إرسال الطلب';
  }
}

function showSuccessModal(order) {
  const modal = el('div', { 
    class: 'success-modal open',
    onclick: (e) => {
      if (e.target === modal) closeSuccessModal();
    }
  });
  
  const card = el('div', { class: 'success-card' });
  
  const checkCircle = el('div', { class: 'check-circle' });
  checkCircle.innerHTML = '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  card.appendChild(checkCircle);
  
  card.appendChild(el('h2', {}, ['تم استلام طلبك!']));
  card.appendChild(el('p', { class: 'success-sub' }, ['شكراً لك. سيتم التواصل معك خلال 24 ساعة.']));
  
  const orderBox = el('div', { class: 'order-box' });
  orderBox.appendChild(el('div', { class: 'order-label' }, ['رقم طلبك']));
  orderBox.appendChild(el('div', { class: 'order-id' }, [order.id]));
  orderBox.appendChild(el('div', { class: 'order-note' }, ['احتفظ بهذا الرقم لتتبع طلبك']));
  card.appendChild(orderBox);
  
  const actions = el('div', { class: 'success-actions' });
  
  const copyBtn = el('button', {
    class: 'btn btn-outline',
    style: 'width: 100%; min-height: 52px; font-size: 14px;',
    onclick: async () => {
      let success = false;
      try {
        await navigator.clipboard.writeText(order.id);
        success = true;
      } catch (error) {
        const textarea = document.createElement('textarea');
        textarea.value = order.id;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          success = true;
        } catch (e) {}
        textarea.remove();
      }
      
      if (success) {
        copyBtn.innerHTML = '✓ تم النسخ!';
        copyBtn.style.borderColor = 'var(--gold)';
        copyBtn.style.color = 'var(--gold)';
        showToast('✓ تم نسخ رقم الطلب');
        
        setTimeout(() => {
          copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-inline-end:8px"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> نسخ رقم الطلب';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2000);
      }
    }
  });
  copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-inline-end:8px"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> نسخ رقم الطلب';
  actions.appendChild(copyBtn);
  
  const waBtn = el('button', {
    class: 'btn btn-whatsapp',
    onclick: () => openWhatsApp(order)
  });
  waBtn.innerHTML = 'إرسال تفاصيل الطلب عبر واتساب';
  actions.appendChild(waBtn);
  
  const trackBtn = el('button', {
    class: 'btn btn-primary',
    onclick: () => {
      closeSuccessModal();
      window.__pendingTrackId = order.id;
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'track' }));
    }
  }, ['تتبع طلبك الآن']);
  actions.appendChild(trackBtn);
  
  card.appendChild(actions);
  modal.appendChild(card);
  document.body.appendChild(modal);
}

function closeSuccessModal() {
  const modal = document.querySelector('.success-modal');
  if (modal) modal.remove();
}

function openWhatsApp(order) {
  const msg = '🔔 *طلب جديد*\n\n' +
    '📋 رقم الطلب: ' + order.id + '\n' +
    '🛋️ النوع: ' + order.type + '\n' +
    '👤 الاسم: ' + order.customer + '\n' +
    '📞 الهاتف: ' + order.phone + '\n' +
    '🏙️ المدينة: ' + order.city + '\n' +
    '📝 التفاصيل: ' + order.notes;
  
  const url = 'https://wa.me/' + SITE_CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
}

function showToast(msg) {
  let toast = document.getElementById('save-toast');
  if (!toast) {
    toast = el('div', { class: 'save-toast', id: 'save-toast' });
    toast.innerHTML = '<span></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = msg;
  toast.classList.add('show');
  
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

console.log('✓ booking.js محمّل');