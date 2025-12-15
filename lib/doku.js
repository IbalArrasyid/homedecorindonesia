import crypto from 'crypto';

// Setup Konfigurasi
const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID;
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY;
const DOKU_URL = process.env.DOKU_API_URL || 'https://api-sandbox.doku.com';

/**
 * Helper: Generate DOKU Signature (Jokul / Doku V2 Standard)
 * Logic updated to use Hex for Digest and Base64 for HMAC
 */
function generateSignature({ clientId, requestId, timestamp, requestTarget, jsonBody, secretKey }) {
    // 1. Generate Digest (SHA256 Base64)
    // Update: Menggunakan Base64 karena Hex gagal (Invalid Signature).
    // Standar Jokul/DOKU V2 umumnya menggunakan Base64 untuk Digest Body.
    const digest = crypto.createHash('sha256').update(jsonBody).digest('base64');

    // 2. Build Component String
    // Format: Client-Id:Request-Id:Request-Timestamp:Request-Target:Digest
    const component =
        `Client-Id:${clientId}\n` +
        `Request-Id:${requestId}\n` +
        `Request-Timestamp:${timestamp}\n` +
        `Request-Target:${requestTarget}\n` +
        `Digest:${digest}`;

    // 3. Generate HMAC (Base64)
    const signature = crypto.createHmac('sha256', secretKey)
        .update(component)
        .digest('base64');

    return `HMACSHA256=${signature}`;
}

/**
 * Fungsi Utama: Generate Payment URL
 */
export async function generateDokuPaymentUrl({ orderId, amount, customerEmail, customerName, products }) {
    if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY) {
        throw new Error("DOKU Credentials belum disetting di .env.local");
    }

    try {
        const requestId = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const timestamp = new Date().toISOString().slice(0, 19) + "Z";
        const requestTarget = '/checkout/v1/payment';
        // Note: Jika URL endpoint berubah (misal ada query params), requestTarget harus ikut berubah.

        // Format Invoice Unik
        // Kita gunakan invoice number dari orderId jika memungkinkan, atau generate baru
        const uniqueInvoiceNumber = orderId.toString().startsWith('INV') ? orderId : `INV-${orderId}-${Math.floor(Date.now() / 1000)}`;

        const paymentBody = {
            order: {
                invoice_number: uniqueInvoiceNumber,
                amount: Math.round(amount),
                callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/finish`,
                auto_redirect: true
            },
            payment: {
                payment_due_date: 60 // menit
            },
            customer: {
                name: customerName,
                email: customerEmail
            }
        };

        // Opsional: Tambahkan Line Items jika data products tersedia dan valid
        // DOKU kadang strict soal total amount vs sum of line items. 
        // Aman-nya jika total amount sudah dihitung di backend, kirim global amount saja.
        // Jika ingin mengirim basket, pastikan perhitungannya 100% akurat down to rupiah.

        const jsonBody = JSON.stringify(paymentBody);

        const signature = generateSignature({
            clientId: DOKU_CLIENT_ID,
            requestId,
            timestamp,
            requestTarget,
            jsonBody,
            secretKey: DOKU_SECRET_KEY
        });

        console.log('🚀 Sending DOKU Request:', {
            url: `${DOKU_URL}${requestTarget}`,
            invoice: uniqueInvoiceNumber,
            amount: amount,
            requestId
        });

        const response = await fetch(`${DOKU_URL}${requestTarget}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Client-Id': DOKU_CLIENT_ID,
                'Request-Id': requestId,
                'Request-Timestamp': timestamp,
                'Signature': signature
            },
            body: jsonBody
        });

        const data = await response.json();

        // Handle Non-200 Responses
        if (!response.ok) {
            const errorMessage =
                data.error?.message ||
                data.message ||
                (data.error ? JSON.stringify(data.error) : "Unknown Error");

            console.error('❌ DOKU API ERROR:', {
                status: response.status,
                message: errorMessage,
                details: data
            });

            throw new Error(`DOKU Payment Failed: ${errorMessage}`);
        }

        console.log('✅ DOKU Success:', data.response.order.invoice_number);

        return {
            payment_url: data.response.payment.url,
            invoice_number: data.response.order.invoice_number,
            session_id: data.response.order.session_id || data.response.payment_session_id // Fallback key
        };


    } catch (error) {
        console.error("🚨 DOKU Library Exception:", error.message);
        throw error;
    }
}

/**
 * Cek Status Pembayaran ke DOKU
 */
export async function checkDokuPaymentStatus(invoiceNumber) {
    if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY) {
        throw new Error("DOKU Credentials belum disetting");
    }

    const requestId = `REQ-STATUS-${Date.now()}`;
    const timestamp = new Date().toISOString().slice(0, 19) + "Z";
    const requestTarget = `/checkout/v1/payment/status`;

    // Note: URL status berbeda dengan URL payment generation.
    // Payment: /checkout/v1/payment
    // Status: /checkout/v1/payment/status (Base URL sama)

    const requestBody = {
        order: {
            invoice_number: invoiceNumber
        }
    };

    const jsonBody = JSON.stringify(requestBody);

    const signature = generateSignature({
        clientId: DOKU_CLIENT_ID,
        requestId,
        timestamp,
        requestTarget,
        jsonBody,
        secretKey: DOKU_SECRET_KEY
    });

    console.log('🔎 Checking DOKU Status:', invoiceNumber);

    try {
        const response = await fetch(`${DOKU_URL}${requestTarget}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Client-Id': DOKU_CLIENT_ID,
                'Request-Id': requestId,
                'Request-Timestamp': timestamp,
                'Signature': signature
            },
            body: jsonBody
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ DOKU Status Check Failed:', data);
            throw new Error(data.message || 'Failed to check status');
        }

        return data.response.transaction.status; // SUCCESS, FAILED, PENDING

    } catch (error) {
        console.error('🚨 Status Check Exception:', error);
        throw error; // Re-throw agar caller tahu
    }
}