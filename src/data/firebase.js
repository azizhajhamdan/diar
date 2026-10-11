// =============================================
// طبقة الاتصال بـ Firebase
// =============================================

import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  remove,
  get
} from 'firebase/database';
import { FIREBASE_CONFIG } from '../config.js';

// =============================================
// State
// =============================================

let app = null;
let db = null;

// =============================================
// التهيئة
// =============================================

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
// قراءة
// =============================================

export async function readData(path) {
  const { db } = initFirebase();
  const snapshot = await get(ref(db, path));
  return snapshot.exists() ? snapshot.val() : null;
}

// =============================================
// الاستماع الحي
// =============================================

export function listenData(path, callback) {
  const { db } = initFirebase();
  return onValue(ref(db, path), (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
}

// =============================================
// الكتابة (استبدال كامل)
// =============================================

export async function writeData(path, data) {
  const { db } = initFirebase();
  await set(ref(db, path), data);
  return true;
}

// =============================================
// تحديث جزئي
// =============================================

export async function updateData(path, data) {
  const { db } = initFirebase();
  await update(ref(db, path), data);
  return true;
}

// =============================================
// حذف
// =============================================

export async function deleteData(path) {
  const { db } = initFirebase();
  await remove(ref(db, path));
  return true;
}

// =============================================
// الوصول لـ db الحالي
// =============================================

export function getDB() {
  if (!db) initFirebase();
  return db;
}

export function getApp() {
  if (!app) initFirebase();
  return app;
}

console.log('✓ firebase.js محمّل');