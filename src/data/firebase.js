// =============================================
// طبقة الاتصال بـ Firebase
// =============================================

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, remove, get } from 'firebase/database';
import { FIREBASE_CONFIG } from '../config.js';

// تهيئة Firebase
let app = null;
let db = null;

export function initFirebase() {
  if (app) return { app, db };
  
  try {
    app = initializeApp(FIREBASE_CONFIG);
    db = getDatabase(app);
    console.log('✓ Firebase متصل');
    return { app, db };
  } catch (error) {
    console.error('✗ Firebase فشل الاتصال:', error);
    throw error;
  }
}

// =============================================
// دوال مساعدة للتعامل مع البيانات
// =============================================

/**
 * قراءة بيانات مرة واحدة
 */
export async function readData(path) {
  const { db } = initFirebase();
  const snapshot = await get(ref(db, path));
  return snapshot.exists() ? snapshot.val() : null;
}

/**
 * الاستماع للتغييرات (Live)
 */
export function listenData(path, callback) {
  const { db } = initFirebase();
  return onValue(ref(db, path), (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
}

/**
 * حفظ بيانات (استبدال كامل)
 */
export async function writeData(path, data) {
  const { db } = initFirebase();
  await set(ref(db, path), data);
  return true;
}

/**
 * تحديث جزئي
 */
export async function updateData(path, data) {
  const { db } = initFirebase();
  await update(ref(db, path), data);
  return true;
}

/**
 * حذف بيانات
 */
export async function deleteData(path) {
  const { db } = initFirebase();
  await remove(ref(db, path));
  return true;
}