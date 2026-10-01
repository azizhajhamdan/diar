// =============================================
// إدارة الطلبات (Orders)
// =============================================

import { readData, writeData, updateData, deleteData, listenData } from './firebase.js';
import { generateOrderId } from '../utils/helpers.js';

// =============================================
// مراحل الطلب حسب النوع
// =============================================

export const ORDER_STAGES = {
  'صالونات': [
    { id: 1, label: 'قبول الطلب', desc: 'تم استلام طلبك وسيتم التواصل معك قريباً' },
    { id: 2, label: 'تجهيز الخشب', desc: 'جارٍ تجهيز الهيكل الخشبي' },
    { id: 3, label: 'النجارة مكتملة', desc: 'تم الانتهاء من النجارة' },
    { id: 4, label: 'تحضير النشاف', desc: 'جارٍ تحضير النشاف والاسفنج' },
    { id: 5, label: 'قيد التنجيد', desc: 'جارٍ تنجيد الصالون بعناية' },
    { id: 6, label: 'التشطيب النهائي', desc: 'لمسات أخيرة وتفاصيل دقيقة' },
    { id: 7, label: 'جاهز للاستلام', desc: 'طلبك جاهز — في انتظارك' }
  ],
  'جلسات': [
    { id: 1, label: 'قبول الطلب', desc: 'تم استلام طلبك وسيتم التواصل معك قريباً' },
    { id: 2, label: 'تجهيز النشاف', desc: 'جارٍ تحضير النشاف والاسفنج' },
    { id: 3, label: 'قص القماش', desc: 'جارٍ قص القماش بمقاسات دقيقة' },
    { id: 4, label: 'قيد التفصيل', desc: 'جارٍ تفصيل الجلسة بعناية' },
    { id: 5, label: 'التشطيب النهائي', desc: 'لمسات أخيرة وتفاصيل دقيقة' },
    { id: 6, label: 'جاهز للاستلام', desc: 'طلبك جاهز — في انتظارك' }
  ],
  'ستائر': [
    { id: 1, label: 'قبول الطلب', desc: 'تم استلام طلبك وسيتم التواصل معك قريباً' },
    { id: 2, label: 'قص الأقمشة', desc: 'جارٍ قص الأقمشة بمقاسات دقيقة' },
    { id: 3, label: 'قيد التفصيل', desc: 'جارٍ تفصيل الستائر بعناية' },
    { id: 4, label: 'التشطيب النهائي', desc: 'لمسات أخيرة وتفاصيل دقيقة' },
    { id: 5, label: 'جاهز للاستلام', desc: 'طلبك جاهز — في انتظارك' }
  ],
  'أقمشة': [
    { id: 1, label: 'قبول الطلب', desc: 'تم استلام طلبك وسيتم التواصل معك قريباً' },
    { id: 2, label: 'اختيار القماش', desc: 'جارٍ تجهيز الأقمشة المختارة' },
    { id: 3, label: 'القص والتجهيز', desc: 'جارٍ قص وتجهيز الأقمشة' },
    { id: 4, label: 'التفصيل', desc: 'جارٍ تفصيل المنتجات بعناية' },
    { id: 5, label: 'جاهز للاستلام', desc: 'طلبك جاهز — في انتظارك' }
  ],
  'خدمة أخرى': [
    { id: 1, label: 'قبول الطلب', desc: 'تم استلام طلبك' },
    { id: 2, label: 'قيد التنفيذ', desc: 'جارٍ العمل على طلبك' },
    { id: 3, label: 'جاهز للاستلام', desc: 'طلبك جاهز' }
  ]
};

// =============================================
// الحالة الحالية
// =============================================

let currentOrders = [];
let listeners = [];

// =============================================
// الدوال الرئيسية
// =============================================

/**
 * تحميل الطلبات من Firebase
 */
export async function loadOrders() {
  try {
    console.log('📥 تحميل الطلبات...');
    const data = await readData('orders');
    
    if (data && typeof data === 'object') {
      currentOrders = Object.values(data);
      // ترتيب: الأحدث أولاً
      currentOrders.sort((a, b) => {
        const dateA = a.createdAt || '';
        const dateB = b.createdAt || '';
        return dateB.localeCompare(dateA);
      });
      console.log(`✓ تم تحميل ${currentOrders.length} طلب`);
    } else {
      currentOrders = [];
      console.log('لا توجد طلبات بعد');
    }
    
    notifyListeners();
    return currentOrders;
  } catch (error) {
    console.error('✗ خطأ في تحميل الطلبات:', error);
    currentOrders = [];
    return [];
  }
}

/**
 * الحصول على الطلبات الحالية
 */
export function getOrders() {
  return [...currentOrders];
}

/**
 * البحث عن طلب برقم
 */
export function findOrder(orderId) {
  return currentOrders.find(o => o.id === orderId) || null;
}

/**
 * إنشاء طلب جديد
 */
export async function createOrder(orderData) {
  try {
    // التحقق من البيانات
    if (!orderData.customer || !orderData.phone || !orderData.type) {
      throw new Error('بيانات ناقصة: الاسم، الهاتف، والنوع مطلوبة');
    }
    
    // تحديد المرحلة الأولى
    const stages = ORDER_STAGES[orderData.type] || ORDER_STAGES['خدمة أخرى'];
    const firstStage = stages[0];
    
    // بناء الطلب
    const order = {
      id: generateOrderId(),
      type: orderData.type,
      service: orderData.type,
      customer: orderData.customer,
      phone: orderData.phone,
      city: orderData.city || '',
      notes: orderData.notes || '—',
      status: firstStage.id,
      statusLabel: firstStage.label,
      progress: Math.round((firstStage.id / stages.length) * 100),
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      receiveDate: ''
    };
    
    // حفظ في Firebase
    await writeData(`orders/${order.id}`, order);
    
    // إضافة للقائمة المحلية
    currentOrders.unshift(order);
    notifyListeners();
    
    console.log(`✓ تم إنشاء طلب: ${order.id}`);
    return order;
    
  } catch (error) {
    console.error('✗ خطأ في إنشاء الطلب:', error);
    throw error;
  }
}

/**
 * تحديث طلب
 */
export async function updateOrder(orderId, updates) {
  try {
    const order = findOrder(orderId);
    if (!order) throw new Error(`الطلب ${orderId} غير موجود`);
    
    // دمج التحديثات
    const updatedOrder = { ...order, ...updates };
    
    // تحديث المرحلة إذا تغيرت
    if (updates.status) {
      const stages = ORDER_STAGES[updatedOrder.type] || ORDER_STAGES['خدمة أخرى'];
      const stage = stages.find(s => s.id === updates.status);
      if (stage) {
        updatedOrder.statusLabel = stage.label;
        updatedOrder.progress = Math.round((stage.id / stages.length) * 100);
      }
    }
    
    // حفظ في Firebase
    await writeData(`orders/${orderId}`, updatedOrder);
    
    // تحديث القائمة المحلية
    const index = currentOrders.findIndex(o => o.id === orderId);
    if (index !== -1) currentOrders[index] = updatedOrder;
    
    notifyListeners();
    console.log(`✓ تم تحديث الطلب ${orderId}`);
    return updatedOrder;
    
  } catch (error) {
    console.error('✗ خطأ في تحديث الطلب:', error);
    throw error;
  }
}

/**
 * حذف طلب
 */
export async function removeOrder(orderId) {
  try {
    await deleteData(`orders/${orderId}`);
    
    currentOrders = currentOrders.filter(o => o.id !== orderId);
    notifyListeners();
    
    console.log(`✓ تم حذف الطلب ${orderId}`);
    return true;
    
  } catch (error) {
    console.error('✗ خطأ في حذف الطلب:', error);
    throw error;
  }
}

/**
 * الاستماع لتغييرات الطلبات (Live)
 */
export function onOrdersChange(callback) {
  listeners.push(callback);
  
  if (currentOrders.length > 0) {
    callback(currentOrders);
  }
  
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
}

/**
 * الحصول على مراحل نوع معين
 */
export function getStagesForType(type) {
  return ORDER_STAGES[type] || ORDER_STAGES['خدمة أخرى'];
}

// =============================================
// دوال مساعدة
// =============================================

function notifyListeners() {
  listeners.forEach(callback => {
    try {
      callback(currentOrders);
    } catch (error) {
      console.error('Listener error:', error);
    }
  });
}

console.log('✓ orders.js محمّل');