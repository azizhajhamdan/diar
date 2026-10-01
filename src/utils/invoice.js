// =============================================
// نظام الفاتورة + QR Code
// =============================================

import { SITE_CONFIG } from '../config.js';

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
      document.body.appendChild(tempDiv);
      
      new window.QRCode(tempDiv, {
        text: text,
        width: 300,
        height: 300,
        colorDark: '#8a7040',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      });
      
      setTimeout(() => {
        const canvas = tempDiv.querySelector('canvas');
        const img = tempDiv.querySelector('img');
        let result = '';
        
        if (canvas) {
          try { result = canvas.toDataURL('image/png'); } catch (e) {}
        }
        if (!result && img && img.src) result = img.src;
        
        tempDiv.remove();
        
        if (result) resolve(result);
        else reject(new Error('فشل توليد QR'));
      }, 200);
      
    } catch (e) {
      reject(e);
    }
  });
}

// =============================================
// طباعة الفاتورة
// =============================================

export async function printInvoice(order) {
  console.log('🖨️ تحضير الفاتورة:', order.id);
  
  const trackUrl = window.location.origin + '/#track-' + order.id;
  
  let qrDataUrl = '';
  try {
    qrDataUrl = await generateQR(trackUrl);
  } catch (error) {
    console.error('QR Error:', error);
    alert('⚠️ تعذر توليد QR: ' + error.message);
    return;
  }
  
  const invoiceHTML = buildInvoiceHTML(order, qrDataUrl);
  showPreview(invoiceHTML, order.id);
}

// =============================================
// HTML الفاتورة
// =============================================

function buildInvoiceHTML(order, qrDataUrl) {
  const contact = SITE_CONFIG;
  const date = new Date().toLocaleDateString('ar-LY', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  return `
    <div class="diar-invoice-wrapper">
      
      <!-- الإطار الذهبي -->
      <div class="invoice-frame-outer">
        <div class="invoice-frame-inner">
          
          <div class="diar-invoice">
            
            <!-- الرأس -->
            <div class="invoice-header-new">
              
              <!-- الشعار في الوسط -->
              <div class="invoice-brand-center">
                <div class="invoice-logo-big">ديّار<span>.</span></div>
                <div class="invoice-tagline-center">للمفروشات · نصنع من المكان حكاية</div>
              </div>
              
              <!-- فاصل ذهبي -->
              <div class="invoice-gold-line"></div>
              
              <!-- رقم الطلب + التاريخ -->
              <div class="invoice-meta-row">
                <div class="invoice-meta-right">
                  <span class="invoice-meta-label">رقم الطلب</span>
                  <span class="invoice-meta-value">${order.id}</span>
                </div>
                <div class="invoice-meta-left">
                  <span class="invoice-meta-label">التاريخ</span>
                  <span class="invoice-meta-value">${date}</span>
                </div>
              </div>
              
              <!-- فاصل ذهبي -->
              <div class="invoice-gold-line"></div>
              
              <!-- عنوان الفاتورة -->
              <div class="invoice-title-new">فاتورة طلب</div>
              
            </div>
            
            <!-- بيانات العميل -->
            <div class="invoice-section-new">
              <div class="invoice-section-title-new">بيانات العميل</div>
              <div class="invoice-grid-2">
                <div class="invoice-item-new">
                  <span class="invoice-item-label">الاسم</span>
                  <span class="invoice-item-value">${order.customer}</span>
                </div>
                <div class="invoice-item-new">
                  <span class="invoice-item-label">الهاتف</span>
                  <span class="invoice-item-value ltr">${order.phone}</span>
                </div>
                <div class="invoice-item-new full">
                  <span class="invoice-item-label">المدينة</span>
                  <span class="invoice-item-value">${order.city}</span>
                </div>
              </div>
            </div>
            
            <!-- تفاصيل الطلب -->
            <div class="invoice-section-new">
              <div class="invoice-section-title-new">تفاصيل الطلب</div>
              <div class="invoice-grid-2">
                <div class="invoice-item-new">
                  <span class="invoice-item-label">النوع</span>
                  <span class="invoice-item-value">${order.type}</span>
                </div>
                <div class="invoice-item-new">
                  <span class="invoice-item-label">الحالة</span>
                  <span class="invoice-item-value">${order.statusLabel || 'قبول الطلب'}</span>
                </div>
                <div class="invoice-item-new">
                  <span class="invoice-item-label">تاريخ الطلب</span>
                  <span class="invoice-item-value">${order.date}</span>
                </div>
                <div class="invoice-item-new">
                  <span class="invoice-item-label">تاريخ التسليم</span>
                  <span class="invoice-item-value">${order.receiveDate || 'قيد التحديد'}</span>
                </div>
              </div>
            </div>
            
            <!-- الملاحظات -->
            ${order.notes && order.notes !== '—' ? `
              <div class="invoice-section-new">
                <div class="invoice-section-title-new">ملاحظات</div>
                <div class="invoice-notes-new">${order.notes}</div>
              </div>
            ` : ''}
            
            <!-- QR في الوسط -->
            <div class="invoice-qr-center">
              <div class="invoice-qr-frame">
                <img src="${qrDataUrl}" alt="QR" class="invoice-qr-img">
              </div>
              <div class="invoice-qr-caption">امسح الرمز لمتابعة حالة طلبك</div>
            </div>
            
            <!-- الفوتر -->
            <div class="invoice-footer-new">
              
              <div class="invoice-thanks-new">شكراً لثقتكم بـ ديّار</div>
              
              <div class="invoice-contact-new">
                <div class="invoice-contact-line">
                  <span class="invoice-contact-icon">📞</span>
                  <span class="invoice-contact-text ltr">${contact.phone || '+218 91 000 0000'}</span>
                </div>
                <div class="invoice-contact-line">
                  <span class="invoice-contact-icon">✉️</span>
                  <span class="invoice-contact-text ltr">${contact.email || 'hello@diar.ly'}</span>
                </div>
              </div>
              
              <div class="invoice-copyright-new">
                © ${new Date().getFullYear()} ديّار للمفروشات — جميع الحقوق محفوظة
              </div>
              
            </div>
            
          </div>
          
        </div>
      </div>
      
    </div>
  `;
}

// =============================================
// معاينة
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
          <button class="invoice-btn-secondary" onclick="closeInvoicePreview()">✕ إغلاق</button>
          <button class="invoice-btn-print" onclick="doPrintInvoice()">🖨️ طباعة</button>
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

window.closeInvoicePreview = function() {
  const modal = document.getElementById('invoice-preview-modal');
  if (modal) modal.remove();
  document.body.style.overflow = '';
};

window.doPrintInvoice = function() {
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

console.log('✓ invoice.js محمّل');