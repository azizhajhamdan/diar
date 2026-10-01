// =============================================
// شاشة تسجيل الدخول
// =============================================

import { el } from '../utils/helpers.js';
import { login } from './auth.js';

export function buildLoginScreen(onSuccess) {
  const page = el('div', { class: 'admin-login-page' });
  const card = el('div', { class: 'admin-login-card' });
  
  const icon = el('div', { class: 'admin-lock-icon' });
  icon.innerHTML = '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  card.appendChild(icon);
  
  card.appendChild(el('h1', { class: 'admin-login-title' }, ['لوحة التحكم']));
  card.appendChild(el('p', { class: 'admin-login-sub' }, ['أدخل كلمة المرور للدخول']));
  
  const input = el('input', {
    type: 'password',
    class: 'admin-login-input',
    placeholder: '••••••••',
    autocomplete: 'current-password',
    id: 'admin-password'
  });
  card.appendChild(input);
  
  const errorMsg = el('div', { class: 'admin-login-error', id: 'admin-login-error' });
  card.appendChild(errorMsg);
  
  const submitBtn = el('button', {
    class: 'btn btn-primary btn-lg',
    style: 'width: 100%; margin-top: 8px;',
    onclick: () => doLogin()
  }, ['دخول']);
  card.appendChild(submitBtn);
  
  const backBtn = el('button', {
    class: 'btn btn-outline',
    style: 'width: 100%; margin-top: 12px;',
    onclick: () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    }
  }, ['← العودة للموقع']);
  card.appendChild(backBtn);
  
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
    setTimeout(() => errorMsg.classList.remove('show'), 3000);
  }
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin();
  });
  
  page.appendChild(card);
  setTimeout(() => input.focus(), 200);
  return page;
}

console.log('✓ admin/login.js محمّل');