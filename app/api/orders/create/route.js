export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { createWooClientWrite } from "@/lib/woocommerce";
import { generateDokuPaymentUrl } from "@/lib/doku"; // Use the fixed DOKU library
import { getProductById } from "@/services/server-helpers"; // Get product prices

// --- HELPER FUNCTIONS ---

/**
 * Generate unique order number for WooCommerce
 */
function generateOrderNumber() {
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${dateStr}-${randomNum}`;
}

/**
 * Calculate totals from cart items
 */
async function calculateTotals(items, shippingCost = 0) {
  let subtotal = 0;

  for (const item of items) {
    try {
      // Get real product price from database
      const product = await getProductById(item.product_id);
      const price = product ? parseFloat(product.price) : 250000; // Default fallback

      console.log(`💰 Product ${item.product_id}: name=${product?.name || 'Unknown'}, price=${price}, qty=${item.quantity}`);

      subtotal += (price * item.quantity);
    } catch (error) {
      console.error(`❌ Error getting price for product ${item.product_id}:`, error);
      subtotal += (250000 * item.quantity); // Default fallback
    }
  }

  const total = subtotal + shippingCost;

  console.log(`💰 Total Calculation: subtotal=${subtotal}, shipping=${shippingCost}, total=${total}`);

  return { subtotal, shippingCost, total, currency: 'IDR' };
}

/**
 * Validate order data
 */
function validateOrderData(orderData) {
  const errors = [];

  // Extract customer data dari structure baru
  const firstName = orderData.customer?.billing?.first_name || orderData.firstName;
  const email = orderData.customer?.billing?.email || orderData.email;

  if (!firstName?.trim()) errors.push('First name is required');
  if (!email?.trim()) errors.push('Email is required');
  if (!orderData.items || orderData.items.length === 0) errors.push('No items in order');

  console.log('🔍 Validation Debug:', {
    firstName,
    email,
    itemsCount: orderData.items?.length || 0,
    customerStructure: !!orderData.customer
  });

  return { isValid: errors.length === 0, errors };
}

/**
 * Get payment method title for WooCommerce
 */
function getPaymentMethodTitle(orderData) {
  if (orderData.paymentMethod === 'doku') {
    return `Doku - ${orderData.paymentMethodType || 'Virtual Account'}`;
  }
  return orderData.paymentMethod;
}

// --- MAIN API ROUTE ---

export async function POST(request) {
  try {
    const orderData = await request.json();

    console.log('=== WOOCOMMERCE ORDER CREATION START ===');
    console.log('📥 Received Payload:', JSON.stringify(orderData, null, 2));

    // 1. Validate Input
    const validation = validateOrderData(orderData);
    if (!validation.isValid) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    // 2. Calculate Totals (now async)
    const totals = await calculateTotals(orderData.items, orderData.shippingCost || 0);

    // 3. --- AUTHENTICATION LOGIC (NEW) ---
    // Cek apakah User Login (punya Token JWT)
    let customerId = 0; // Default Guest
    const authHeader = request.headers.get('authorization');

    if (authHeader) {
      console.log('🔐 Auth token detected, validating user...');
      try {
        const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
        // Validasi token ke WordPress
        const userRes = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
          headers: { 'Authorization': authHeader }
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          customerId = userData.id; // Set ID Customer Asli
          console.log(`✅ User identified: ID ${customerId} (${userData.name})`);
        } else {
          console.warn('⚠️ Token invalid or expired, proceeding as Guest.');
        }
      } catch (e) {
        console.error('⚠️ Auth check error:', e.message);
      }
    }

    // 4. Prepare WooCommerce Order Data
    const api = createWooClientWrite();
    if (!api) throw new Error('WooCommerce API not configured');

    const orderNumber = generateOrderNumber();

    // Extract customer data dari structure baru (prioritas ke customer.billing)
    const billingData = orderData.customer?.billing || {};
    const shippingData = orderData.customer?.shipping || billingData;

    const wooOrder = {
      status: 'pending',
      currency: 'IDR',
      customer_id: customerId, // Menggunakan ID yang sudah dideteksi
      billing: {
        first_name: billingData.first_name || orderData.firstName || '',
        last_name: billingData.last_name || orderData.lastName || '',
        email: billingData.email || orderData.email || '',
        phone: billingData.phone || orderData.phone || '',
        address_1: billingData.address_1 || '',
        city: billingData.city || '',
        state: billingData.state || '',
        postcode: billingData.postcode || billingData.postalCode || '',
        country: billingData.country || 'ID'
      },
      shipping: {
        first_name: shippingData.first_name || billingData.first_name || orderData.firstName || '',
        last_name: shippingData.last_name || billingData.last_name || orderData.lastName || '',
        address_1: shippingData.address_1 || '',
        city: shippingData.city || '',
        state: shippingData.state || '',
        postcode: shippingData.postcode || shippingData.postalCode || '',
        country: shippingData.country || 'ID'
      },
      line_items: orderData.items.map((item, index) => {
        const mappedItem = {
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          price: parseFloat(item.sale_price || item.price || 0)
        };

        console.log(`🛍️ Item ${index + 1}:`, {
          original: item,
          mapped: mappedItem
        });

        return mappedItem;
      }),
      shipping_lines: [{
        method_id: 'flat_rate',
        method_title: 'Flat Rate Shipping',
        total: totals.shippingCost.toString()
      }],
      payment_method: orderData.paymentMethod,
      payment_method_title: getPaymentMethodTitle(orderData),
      customer_note: orderData.orderNotes || '',
      meta_data: [
        { key: '_order_number', value: orderNumber },
        { key: '_order_total', value: totals.total.toString() },
        { key: '_doku_payment_type', value: orderData.paymentMethodType || '' }
      ]
    };

    // 5. Create Order in WooCommerce
    console.log('📦 Creating order in WooCommerce...');
    const wooRes = await api.post('orders', wooOrder);

    if (!wooRes.data) throw new Error('WooCommerce API returned no data');
    const createdOrder = wooRes.data;
    console.log(`✅ Order Created: #${createdOrder.id}`);

    // 6. --- DOKU PAYMENT GENERATION (USING FIXED LIBRARY) ---
    let paymentResponse = { paymentUrl: null };

    if (orderData.paymentMethod === 'doku') {
      console.log('💳 Generating Doku Payment using library...');

      try {
        const dokuResponse = await generateDokuPaymentUrl({
          orderId: createdOrder.id.toString(),
          amount: totals.total,
          customerEmail: billingData.email || orderData.email,
          customerName: `${billingData.first_name || orderData.firstName} ${billingData.last_name || orderData.lastName}`.trim(),
          products: orderData.items
        });

        console.log('✅ Doku Payment URL Generated:', dokuResponse);

        paymentResponse = {
          paymentUrl: dokuResponse.payment_url,
          sessionId: dokuResponse.session_id || null,
          invoiceNumber: dokuResponse.invoice_number
        };

      } catch (dokuError) {
        console.error('❌ Doku Error:', dokuError.message);
        // Real error - no fallback for production
        throw new Error(`Payment gateway error: ${dokuError.message}`);
      }
    }

    // 7. Return Final Response
    console.log('📤 Final Response:', {
      success: true,
      order_id: createdOrder.id,
      invoice_number: orderNumber,
      payment: paymentResponse
    });

    // Ensure payment object has the structure expected by frontend
    const finalPaymentResponse = paymentResponse.paymentUrl ? {
      paymentUrl: paymentResponse.paymentUrl,
      orderId: createdOrder.id.toString(),
      invoiceNumber: paymentResponse.invoiceNumber || orderNumber
    } : {
      error: paymentResponse.error || 'Payment generation failed'
    };

    return NextResponse.json({
      success: true,
      order_id: createdOrder.id,
      invoice_number: orderNumber,
      payment: finalPaymentResponse
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Order Creation Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active' });
}