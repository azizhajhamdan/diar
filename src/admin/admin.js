// =============================================
// لوحة التحكم - المنسق الرئيسي
// =============================================

import { isAuthenticated } from './auth.js';
import { buildLoginScreen } from './login.js';
import { buildAdminDashboard } from './dashboard.js';

// =============================================
// بناء صفحة Admin
// =============================================

export async function buildAdminPage() {
  const page = document.createElement('div');
  page.className = 'admin-root';
  
  // ═══ التحقق من الجلسة ═══
  if (!isAuthenticated()) {
    // شاشة تسجيل الدخول
    page.appendChild(buildLoginScreen(async () => {
      const newPage = await buildAdminPage();
      const app = document.getElementById('app');
      app.innerHTML = '';
      app.appendChild(newPage);
    }));
  } else {
    // لوحة التحكم
    const dashboard = await buildAdminDashboard();
    page.appendChild(dashboard);
  }
  
  return page;
}

console.log('✓ admin/admin.js محمّل');