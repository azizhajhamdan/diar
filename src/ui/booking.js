// =============================================
// صفحة الحجز
// =============================================

import { el } from '../utils/helpers.js';
import { buildHeader } from './header.js';
import { createOrder } from '../data/orders.js';
import { SITE_CONFIG } from '../config.js';

// =============================================
// بناء صفحة الحجز
// =============================================

export async function buildBookingPage(cms) {
  const page = el('div', { class: 'page-booking' });
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
  const card = el('div', { class: 'book-card fade-up' });
  card.appendChild(el('h1', { class: 'book-title' }, ['احجز طلبك']));
  card.appendChild(el('p', { class: 'book-subtitle' }, ['أخبرنا عن طلبك وسنتواصل معك خلال 24 ساعة.']));
  
  // النموذج
  const form = el('form', { class: 'book-form' });
  form.onsubmit = (e) => {
    e.preventDefault();
    submitBooking();
  };
  
  // ═══ نوع الطلب - Custom Dropdown ═══
  const serviceField = el('div', { class: 'af-field' });
  serviceField.appendChild(el('label', {}, ['نوع الطلب *']));
  
  const serviceInput = el('input', { type: 'hidden', id: 'bk-service', value: '' });
  
  const dropdown = el('div', { class: 'custom-dropdown', id: 'service-dropdown' });
  
  const dropdownBtn = el('button', {
    type: 'button',
    class: 'dropdown-toggle',
    onclick: (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    }
  });
  dropdownBtn.innerHTML = `
    <span class="dropdown-text">اختر النوع...</span>
    <svg class="dropdown-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  `;
  
  const dropdownMenu = el('div', { class: 'dropdown-menu' });
  
  const fixedOptions = ['صالونات', 'جلسات', 'ستائر'];
  fixedOptions.forEach(title => {
    const item = el('button', {
      type: 'button',
      class: 'dropdown-item',
      onclick: () => {
        serviceInput.value = title;
        dropdownBtn.querySelector('.dropdown-text').textContent = title;
        dropdownBtn.querySelector('.dropdown-text').classList.add('selected');
        dropdown.classList.remove('open');
        
        dropdownMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    }, [title]);
    dropdownMenu.appendChild(item);
  });
  
  dropdown.appendChild(dropdownBtn);
  dropdown.appendChild(dropdownMenu);
  
  serviceField.appendChild(serviceInput);
  serviceField.appendChild(dropdown);
  form.appendChild(serviceField);
  
  // إغلاق عند النقر خارج
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
  
  // ═══ الاسم + الهاتف ═══
  const row1 = el('div', { class: 'af-row cols-2' });
  
  const nameField = el('div', { class: 'af-field' });
  nameField.appendChild(el('label', {}, ['الاسم *']));
  nameField.appendChild(el('input', {
    type: 'text',
    id: 'bk-name',
    placeholder: 'اسمك الكامل',
    required: true
  }));
  row1.appendChild(nameField);
  
  const phoneField = el('div', { class: 'af-field' });
  phoneField.appendChild(el('label', {}, ['الهاتف *']));
  phoneField.appendChild(el('input', {
    type: 'tel',
    id: 'bk-phone',
    placeholder: '+218 91 1234567',
    dir: 'ltr',
    required: true
  }));
  row1.appendChild(phoneField);
  
  form.appendChild(row1);
  
  // ═══ المدينة ═══
  const cityField = el('div', { class: 'af-field' });
  cityField.appendChild(el('label', {}, ['المدينة *']));
  cityField.appendChild(el('input', {
    type: 'text',
    id: 'bk-city',
    placeholder: 'طرابلس',
    required: true
  }));
  form.appendChild(cityField);
  
  // ═══ طريقة الدفع ═══
  form.appendChild(el('div', { class: 'af-section-title' }, ['طريقة الدفع']));
  
  const paymentField = el('div', { class: 'af-field' });
  const paymentOptions = el('div', { class: 'payment-options' });
  
  const paymentMethods = [
    { id: 'cash', label: 'كاش', icon: 'cash' },
    { id: 'card', label: 'بطاقة', icon: 'card' },
    { id: 'transfer', label: 'حوالة بنكية', icon: 'transfer' }
  ];
  
  let selectedPayment = '';
  
  paymentMethods.forEach(method => {
    const btn = el('button', {
      type: 'button',
      class: 'payment-option',
      'data-method': method.id,
      onclick: () => {
        selectedPayment = method.id;
        document.querySelectorAll('.payment-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
    
    btn.innerHTML = getPaymentIcon(method.icon) + '<span>' + method.label + '</span>';
    paymentOptions.appendChild(btn);
  });
  
  paymentField.appendChild(paymentOptions);
  form.appendChild(paymentField);
  
  // ═══ تفاصيل الطلب ═══
  const detailsField = el('div', { class: 'af-field' });
  detailsField.appendChild(el('label', {}, ['تفاصيل الطلب']));
  detailsField.appendChild(el('textarea', {
    id: 'bk-details',
    placeholder: 'أخبرنا عن طلبك...',
    rows: 4
  }));
  form.appendChild(detailsField);
  
  // ═══ زر الإرسال ═══
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

// =============================================
// أيقونات الدفع
// =============================================

function getPaymentIcon(type) {
  const icons = {
    cash: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
    card: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    transfer: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>'
  };
  return icons[type] || icons.cash;
}

// =============================================
// إرسال الحجز
// =============================================

async function submitBooking() {
  const submitBtn = document.getElementById('bk-submit');
  if (!submitBtn || submitBtn.disabled) return;
  
  const service = document.getElementById('bk-service').value;
  const name = document.getElementById('bk-name').value.trim();
  const phone = document.getElementById('bk-phone').value.trim();
  const city = document.getElementById('bk-city').value.trim();
  const details = document.getElementById('bk-details').value.trim();
  
  const activePayment = document.querySelector('.payment-option.active');
  const paymentMethod = activePayment ? activePayment.getAttribute('data-method') : '';
  
  // التحقق
  if (!service || !name || !phone || !city) {
    showToast('أكمل الحقول المطلوبة');
    return;
  }
  
  if (!paymentMethod) {
    showToast('اختر طريقة الدفع');
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
      notes: details || '—',
      paymentMethod: paymentMethod,
      totalAmount: 0,
      paidAmount: 0
    });
    
    console.log('✓ تم إنشاء الطلب:', order.id);
    showSuccessModal(order);
    
  } catch (error) {
    console.error('✗ خطأ:', error);
    showToast('تعذر حفظ الطلب. حاول مرة أخرى.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'إرسال الطلب';
  }
}

// =============================================
// شاشة النجاح
// =============================================

function showSuccessModal(order) {
  const modal = el('div', {
    class: 'success-modal open',
    onclick: (e) => {
      if (e.target === modal) closeSuccessModal();
    }
  });
  
  const card = el('div', { class: 'success-card' });
  
  // أيقونة ✓
  const checkCircle = el('div', { class: 'check-circle' });
  checkCircle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  card.appendChild(checkCircle);
  
  card.appendChild(el('h2', {}, ['تم استلام طلبك!']));
  card.appendChild(el('p', { class: 'success-sub' }, ['شكراً لك. سيتم التواصل معك خلال 24 ساعة.']));
  
  // رقم الطلب
  const orderBox = el('div', { class: 'order-box' });
  orderBox.appendChild(el('div', { class: 'order-label' }, ['رقم طلبك']));
  orderBox.appendChild(el('div', { class: 'order-id' }, [order.id]));
  orderBox.appendChild(el('div', { class: 'order-note' }, ['احتفظ بهذا الرقم لتتبع طلبك']));
  card.appendChild(orderBox);
  
  // الأزرار
  const actions = el('div', { class: 'success-actions' });
  
  // زر واتساب
  const waBtn = el('button', {
    class: 'btn btn-whatsapp',
    onclick: () => openWhatsApp(order)
  });
  waBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-1.2 4.4A8.5 8.5 0 0 1 3.5 19l1-4.5a8.4 8.4 0 0 1-1-4 8.5 8.5 0 0 1 17 0 8.4 8.4 0 0 1 .5 1z"/><path d="M8 9a2 2 0 0 1 2 2v1a4 4 0 0 0 4 4h1a2 2 0 0 1 2-2" fill="none" stroke="currentColor" stroke-width="2"/></svg> إرسال تفاصيل الطلب عبر واتساب';
  actions.appendChild(waBtn);
  
  // زر نسخ
  const copyBtn = el('button', {
    class: 'copy-btn',
    onclick: async () => {
      try {
        await navigator.clipboard.writeText(order.id);
        showToast('✓ تم نسخ رقم الطلب');
      } catch (e) {
        const textarea = document.createElement('textarea');
        textarea.value = order.id;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); showToast('✓ تم النسخ'); } catch (err) {}
        textarea.remove();
      }
    }
  });
  copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> نسخ رقم الطلب';
  actions.appendChild(copyBtn);
  
  // زر تتبع
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

// =============================================
// واتساب
// =============================================

function openWhatsApp(order) {
  const msg = `🔔 *طلب جديد*\n\n` +
    `📋 رقم الطلب: ${order.id}\n` +
    `🛋️ النوع: ${order.type}\n` +
    `👤 الاسم: ${order.customer}\n` +
    `📞 الهاتف: ${order.phone}\n` +
    `🏙️ المدينة: ${order.city}\n` +
    `📝 التفاصيل: ${order.notes}`;
  
  const url = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// =============================================
// Toast
// =============================================

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