// =============================================
// نظام الفاتورة + QR Code
// =============================================

import { withCacheBuster } from './image.js';
import { formatMoney } from './helpers.js';

// =============================================
// مكتبة QR Code
// =============================================

function loadQRLibrary() {
  if (window.QRCode) return Promise.resolve();
  if (window.__diarQRPromise) return window.__diarQRPromise;
  
  window.__diarQRPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('QR library failed'));
    document.head.appendChild(script);
  });
  
  return window.__diarQRPromise;
}

// =============================================
// توليد QR
// =============================================

async function generateQR(text) {
  await loadQRLibrary();
  
  return new Promise((resolve, reject) => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.background = '#ffffff';
      document.body.appendChild(tempDiv);
      
      new window.QRCode(tempDiv, {
        text: text,
        width: 400,
        height: 400,
        colorDark: '#5a4820',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      });
      
      setTimeout(() => {
        const canvas = tempDiv.querySelector('canvas');
        const img = tempDiv.querySelector('img');
        let result = '';
        
        if (canvas) {
          try {
            result = canvas.toDataURL('image/png');
          } catch (e) {}
        }
        if (!result && img && img.src) {
          result = img.src;
        }
        
        tempDiv.remove();
        
        if (result) resolve(result);
        else reject(new Error('فشل توليد QR'));
      }, 400);
      
    } catch (e) {
      reject(e);
    }
  });
}

// =============================================
// الدالة الرئيسية
// =============================================

export async function printInvoice(order) {
  console.log('🖨️ تحضير الفاتورة:', order.id);
  
  const trackUrl = window.location.origin + '/?track=' + order.id;
  
  let qrDataUrl = '';
  try {
    qrDataUrl = await generateQR(trackUrl);
  } catch (error) {
    console.error('QR Error:', error);
    alert('تعذر توليد QR: ' + error.message);
    return;
  }
  
  const invoiceHTML = buildInvoiceHTML(order, qrDataUrl);
  showPreview(invoiceHTML, order.id);
}

// =============================================
// HTML الفاتورة
// =============================================

function buildInvoiceHTML(order, qrDataUrl) {
  const date = new Date().toLocaleDateString('ar-LY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const total = parseFloat(order.totalAmount) || 0;
  const paid = parseFloat(order.paidAmount) || 0;
  const remaining = Math.max(0, total - paid);
  
  const paymentLabels = {
    'cash': 'كاش',
    'card': 'بطاقة',
    'transfer': 'حوالة بنكية'
  };
  const paymentLabel = paymentLabels[order.paymentMethod] || 'لم تحدد';
  
  return `
    <div class="inv2">
      
      <!-- الرأس -->
      <div class="inv2-head">
        <div class="inv2-logo">ديّار<span>.</span></div>
        <div class="inv2-tagline">للمفروشات · نصنع من المكان حكاية</div>
        
        <div class="inv2-meta">
          <div class="inv2-meta-item">
            <span class="inv2-meta-label">رقم الفاتورة</span>
            <span class="inv2-meta-value" dir="ltr">${order.id}</span>
          </div>
          <div class="inv2-meta-divider"></div>
          <div class="inv2-meta-item">
            <span class="inv2-meta-label">التاريخ</span>
            <span class="inv2-meta-value">${date}</span>
          </div>
        </div>
        
        <div class="inv2-page-title">فاتورة طلب</div>
      </div>

      <!-- بيانات العميل -->
      <div class="inv2-section">
        <div class="inv2-section-title">
          <span class="inv2-bullet">◆</span>
          بيانات العميل
        </div>
        <div class="inv2-client-row">
          <div class="inv2-client-item">
            <span class="inv2-client-label">الاسم</span>
            <span class="inv2-client-value">${order.customer || '—'}</span>
          </div>
          <div class="inv2-client-sep">·</div>
          <div class="inv2-client-item">
            <span class="inv2-client-label">المدينة</span>
            <span class="inv2-client-value">${order.city || '—'}</span>
          </div>
          <div class="inv2-client-sep">·</div>
          <div class="inv2-client-item">
            <span class="inv2-client-label">الهاتف</span>
            <span class="inv2-client-value ltr">${order.phone || '—'}</span>
          </div>
        </div>
      </div>

      <!-- تفاصيل الطلب -->
      <div class="inv2-section">
        <div class="inv2-section-title">
          <span class="inv2-bullet">◆</span>
          تفاصيل الطلب
        </div>
        <div class="inv2-details">
          <div class="inv2-detail-item">
            <span class="inv2-detail-label">النوع</span>
            <span class="inv2-detail-value">${order.type || '—'}</span>
          </div>
          ${order.fabric ? `
            <div class="inv2-detail-item">
              <span class="inv2-detail-label">القماش</span>
              <span class="inv2-detail-value">${order.fabric}</span>
            </div>
          ` : ''}
          ${order.pillows ? `
            <div class="inv2-detail-item">
              <span class="inv2-detail-label">المخاد</span>
              <span class="inv2-detail-value">${order.pillows}</span>
            </div>
          ` : ''}
          <div class="inv2-detail-item">
            <span class="inv2-detail-label">تاريخ الطلب</span>
            <span class="inv2-detail-value">${order.date || '—'}</span>
          </div>
          <div class="inv2-detail-item">
            <span class="inv2-detail-label">تاريخ الاستلام</span>
            <span class="inv2-detail-value">${order.receiveDate || 'قيد التحديد'}</span>
          </div>
        </div>
      </div>

      <!-- التفاصيل المالية -->
      <div class="inv2-section">
        <div class="inv2-section-title">
          <span class="inv2-bullet">◆</span>
          التفاصيل المالية
        </div>
        <div class="inv2-financial">
          <div class="inv2-fin-cell">
            <span class="inv2-fin-label">طريقة الدفع</span>
            <span class="inv2-fin-value">${paymentLabel}</span>
          </div>
          <div class="inv2-fin-cell">
            <span class="inv2-fin-label">الإجمالي</span>
            <span class="inv2-fin-value" dir="ltr">${formatMoney(total)}</span>
          </div>
          <div class="inv2-fin-cell">
            <span class="inv2-fin-label">المدفوع</span>
            <span class="inv2-fin-value" dir="ltr">${formatMoney(paid)}</span>
          </div>
          <div class="inv2-fin-cell inv2-fin-highlight">
            <span class="inv2-fin-label">المتبقي</span>
            <span class="inv2-fin-value" dir="ltr">${formatMoney(remaining)}</span>
          </div>
        </div>
      </div>

      <!-- الملاحظات -->
      ${order.notes && order.notes !== '—' ? `
        <div class="inv2-section">
          <div class="inv2-section-title">
            <span class="inv2-bullet">◆</span>
            ملاحظات
          </div>
          <div class="inv2-notes">${order.notes}</div>
        </div>
      ` : ''}

      <!-- QR -->
      <div class="inv2-qr">
        <div class="inv2-qr-box">
          <img src="${qrDataUrl}" alt="QR" class="inv2-qr-img">
        </div>
        <div class="inv2-qr-text">
          <div class="inv2-qr-title">امسح الرمز</div>
          <div class="inv2-qr-sub">لمتابعة حالة طلبك</div>
        </div>
      </div>

      <!-- الفوتر -->
      <div class="inv2-footer">
        <div class="inv2-thanks">شكراً لثقتكم بـ ديّار</div>
        <div class="inv2-contact">
          <span>+218 91 000 0000</span>
          <span class="inv2-sep">·</span>
          <span>hello@diar.ly</span>
        </div>
      </div>

    </div>
  `;
}

// =============================================
// المعاينة
// =============================================

function showPreview(invoiceHTML, orderId) {
  const old = document.getElementById('invoice-preview-modal');
  if (old) old.remove();
  
  const modal = document.createElement('div');
  modal.id = 'invoice-preview-modal';
  modal.className = 'invoice-preview-modal';
  
  modal.innerHTML = `
    <div class="invoice-preview-container">
      <div class="invoice-preview-toolbar">
        <div class="invoice-preview-title">
          <strong>معاينة الفاتورة</strong>
          <span>الطلب: ${orderId}</span>
        </div>
        <div class="invoice-preview-actions">
          <button class="invoice-btn-secondary" onclick="closeInvoicePreview()">إغلاق</button>
          <button class="invoice-btn-pdf" onclick="doSaveAsImage()">حفظ كصورة</button>
          <button class="invoice-btn-print" onclick="doPrintInvoice()">طباعة</button>
        </div>
      </div>
      <div class="invoice-preview-scroll">
        <div class="invoice-preview-page">
          <div class="invoice-preview-content" id="invoice-content-holder">
            ${invoiceHTML}
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
}

// =============================================
// Global Functions
// =============================================

window.closeInvoicePreview = function () {
  const modal = document.getElementById('invoice-preview-modal');
  if (modal) modal.remove();
  document.body.style.overflow = '';
};

window.doPrintInvoice = function () {
  const content = document.getElementById('invoice-content-holder');
  if (!content) return;
  
  let printArea = document.getElementById('diar-print-area');
  if (printArea) printArea.remove();
  
  printArea = document.createElement('div');
  printArea.id = 'diar-print-area';
  printArea.innerHTML = content.innerHTML;
  document.body.appendChild(printArea);
  
  const images = printArea.querySelectorAll('img');
  let loaded = 0;
  const total = images.length;
  
  const doPrint = () => {
    setTimeout(() => {
      window.print();
      setTimeout(() => printArea.remove(), 500);
    }, 200);
  };
  
  if (total === 0) {
    doPrint();
  } else {
    images.forEach(img => {
      if (img.complete) {
        loaded++;
        if (loaded === total) doPrint();
      } else {
        img.onload = () => {
          loaded++;
          if (loaded === total) doPrint();
        };
        img.onerror = () => {
          loaded++;
          if (loaded === total) doPrint();
        };
      }
    });
  }
};

window.doSaveAsImage = async function () {
  const content = document.getElementById('invoice-content-holder');
  if (!content) return;
  
  const btn = document.querySelector('.invoice-btn-pdf');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'جاري الحفظ...';
  btn.disabled = true;
  
  const orderIdEl = document.querySelector('.invoice-preview-title span');
  let orderId = 'diar';
  if (orderIdEl) {
    const match = orderIdEl.textContent.match(/DR-\d+/);
    if (match) orderId = match[0];
  }
  
  try {
    if (typeof html2canvas === 'undefined') {
      await loadHtml2Canvas();
    }
    
    await waitForImages(content);
    await new Promise(r => setTimeout(r, 500));
    
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    
    const link = document.createElement('a');
    link.download = `فاتورة-${orderId}.jpg`;
    link.href = imageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showInvoiceToast('تم حفظ الفاتورة بنجاح');
    
  } catch (error) {
    console.error('خطأ:', error);
    showInvoiceToast('تعذر حفظ الفاتورة');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
};

// =============================================
// Helpers
// =============================================

function loadHtml2Canvas() {
  return new Promise((resolve, reject) => {
    if (typeof html2canvas !== 'undefined') {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('فشل تحميل html2canvas'));
    document.head.appendChild(script);
  });
}

function waitForImages(container) {
  const images = container.querySelectorAll('img');
  if (images.length === 0) return Promise.resolve();
  
  return new Promise(resolve => {
    let loaded = 0;
    const total = images.length;
    
    images.forEach(img => {
      if (img.complete) {
        loaded++;
        if (loaded === total) resolve();
      } else {
        img.onload = () => {
          loaded++;
          if (loaded === total) resolve();
        };
        img.onerror = () => {
          loaded++;
          if (loaded === total) resolve();
        };
      }
    });
    
    setTimeout(resolve, 3000);
  });
}

function showInvoiceToast(msg) {
  let toast = document.getElementById('invoice-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'invoice-toast';
    toast.className = 'invoice-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window.__invoiceToastTimer);
  window.__invoiceToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

console.log('✓ invoice.js محمّل');