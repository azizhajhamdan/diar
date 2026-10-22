// =============================================
// لوحة التحكم - المنسق الرئيسي
// =============================================

import { isAuthenticated } from './auth.js';
import { buildLoginScreen } from './login.js';
import { buildAdminDashboard } from './dashboard.js';

export async function buildAdminPage() {
  const page = document.createElement('div');
  page.className = 'admin-root';
  
  // تحقق من الجلسة
  if (!isAuthenticated()) {
    page.appendChild(buildLoginScreen(async () => {
      // عند نجاح الدخول — أعد البناء
      const newPage = await buildAdminPage();
      const app = document.getElementById('app');
      app.innerHTML = '';
      app.appendChild(newPage);
    }));
  } else {
    const dashboard = await buildAdminDashboard();
    page.appendChild(dashboard);
  }
  
  return page;
}

console.log('✓ admin/admin.js محمّل');