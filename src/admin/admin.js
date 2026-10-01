// =============================================
// لوحة التحكم - المنسق
// =============================================

import { isAuthenticated } from './auth.js';
import { buildLoginScreen } from './login.js';
import { buildAdminDashboard } from './dashboard.js';

export function buildAdminPage() {
  const page = document.createElement('div');
  page.className = 'admin-root';
  
  if (!isAuthenticated()) {
    page.appendChild(buildLoginScreen(() => {
      const newPage = buildAdminPage();
      const app = document.getElementById('app');
      app.innerHTML = '';
      app.appendChild(newPage);
    }));
  } else {
    page.appendChild(buildAdminDashboard());
  }
  
  return page;
}

console.log('✓ admin/admin.js محمّل');