// =============================================
// شاشة تسجيل الدخول
// =============================================

import { el } from '../utils/helpers.js';
import { login } from './auth.js';

// =============================================
// بناء شاشة تسجيل الدخول
// =============================================

export function buildLoginScreen(onSuccess) {
  const page = el('div', { class: 'lock-page' });
  const card = el('div', { class: 'lock-card' });
  
  // ═══ الأيقونة ═══
  const icon = el('div', { class: 'lock-icon' });
  icon.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  `;
  card.appendChild(icon);
  
  // ═══ العنوان ═══
  card.appendChild(el('h2', null, ['منطقة محمية']));
  card.appendChild(el('p', null, ['أدخل كلمة المرور للوصول إلى لوحة التحكم']));
  
  // ═══ حقل كلمة المرور ═══
  const input = el('input', {
    type: 'password',
    class: 'lock-input',
    id: 'lock-pass',
    placeholder: '••••••••',
    autocomplete: 'current-password'
  });
  card.appendChild(input);
  
  // ═══ رسالة الخطأ ═══
  const errorMsg = el('div', { class: 'lock-error', id: 'lock-err' }, ['كلمة المرور غير صحيحة']);
  card.appendChild(errorMsg);
  
  // ═══ زر الدخول ═══
  const submitBtn = el('button', {
    class: 'btn btn-primary',
    onclick: () => doLogin()
  }, ['دخول']);
  card.appendChild(submitBtn);
  
  // ═══ زر العودة ═══
  const backBtn = el('button', {
    class: 'btn btn-outline',
    style: 'width:100%;margin-top:10px',
    onclick: () => {
      window.location.hash = '';
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    }
  }, ['← العودة للموقع']);
  card.appendChild(backBtn);
  
  // ═══ دالة الدخول ═══
  function doLogin() {
    const password = input.value;
    
    if (!password) {
      showError('أدخل كلمة المرور');
      return;
    }
    
    const result = login(password);
    
    if (result.success) {
      console.log('✅ تم تسجيل الدخول');
      onSuccess();
    } else {
      showError(result.error);
      input.value = '';
      input.focus();
    }
  }
  
  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add('show');
    setTimeout(() => {
      errorMsg.classList.remove('show');
    }, 2500);
  }
  
  // ═══ Enter للدخول ═══
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin();
  });
  
  page.appendChild(card);
  
  // Focus تلقائي
  setTimeout(() => input.focus(), 200);
  
  return page;
}

console.log('✓ admin/login.js محمّل');