// =============================================
// Firebase REST API - أسرع بكثير من SDK
// =============================================

import { FIREBASE_CONFIG } from '../config.js';

const BASE_URL = FIREBASE_CONFIG.databaseURL;

/**
 * جلب بيانات عبر REST (سريع جداً)
 */
export async function fetchREST(path) {
  const url = `${BASE_URL}/${path}.json?t=${Date.now()}`;
  
  const response = await fetch(url, { cache: 'no-store' });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * حفظ بيانات عبر REST
 */
export async function putREST(path, data) {
  const url = `${BASE_URL}/${path}.json`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

console.log('✓ rest.js محمّل');