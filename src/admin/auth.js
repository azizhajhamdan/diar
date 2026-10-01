// =============================================
// نظام تسجيل الدخول
// =============================================

import { SITE_CONFIG } from '../config.js';

const SESSION_KEY = 'diar_admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000;

export function isAuthenticated() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    if (!session.loggedIn) return false;
    if (Date.now() - session.loginTime > SESSION_DURATION) {
      logout();
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function login(password) {
  const correctPassword = SITE_CONFIG.adminKey || 'diar2024';
  if (password !== correctPassword) {
    return { success: false, error: 'كلمة المرور غير صحيحة' };
  }
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      loggedIn: true,
      loginTime: Date.now()
    }));
    return { success: true };
  } catch (e) {
    return { success: false, error: 'خطأ في حفظ الجلسة' };
  }
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

console.log('✓ admin/auth.js محمّل');