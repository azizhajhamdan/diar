// =============================================
// لوحة التحكم - المنسق
// =============================================

import { isAuthenticated } from './auth.js';
import { buildLoginScreen } from './login.js';
import { buildAdminDashboard } from './dashboard.js';

export async function buildAdminPage() {
  const page = document.createElement('div');
  page.className = 'admin-root';
  
  if (!isAuthenticated()) {
    page.appendChild(buildLoginScreen(async () => {
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