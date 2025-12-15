import crypto from 'crypto';

// Ambil kredensial dari Environment Variables
const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID;
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY;
const DOKU_URL = process.env.DOKU_API_URL; // Sandbox atau Production URL

export async function generateDokuPaymentUrl({ orderId, amount, customerEmail, customerName }) {
    
    // 1. Generate Signature (Wajib untuk keamanan DOKU)
    // Format signature sangat bergantung pada dokumentasi DOKU versi berapa yang dipakai
    // Ini contoh generik untuk request signature
    const timestamp = new Date().toISOString();
    const requestId = crypto.randomUUID();
    
    // Payload request body ke DOKU
    const paymentBody = {
        order: {
            invoice_number: `INV-${orderId}`, // Format Invoice Unik
            amount: amount,
            callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/finish`, // Redirect setelah bayar
            auto_redirect: true
        },
        payment: {
            payment_due_date: 60 // Expire dalam 60 menit
        },
        customer: {
            name: customerName,
            email: customerEmail
        }
    };

    // Contoh logic signature (sesuaikan dengan doc DOKU):
    // const signatureComponent = `Client-Id:${DOKU_CLIENT_ID}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:/checkout/v1/payment\nDigest:...`;
    // const signature = crypto.createHmac('sha256', DOKU_SECRET_KEY).update(signatureComponent).digest('base64');

    try {
        // Simulasi Fetch ke DOKU API
        const response = await fetch(`${DOKU_URL}/checkout/v1/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Client-Id': DOKU_CLIENT_ID,
                'Request-Id': requestId,
                'Request-Timestamp': timestamp,
                // 'Signature': signature // Header wajib biasanya
            },
            body: JSON.stringify(paymentBody)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`DOKU Error: ${data.message || response.statusText}`);
        }

        // Mapping response DOKU ke format standar aplikasi kita
        return {
            payment_url: data.response.payment.url, // URL untuk redirect user
            invoice_number: data.response.order.invoice_number
        };

    } catch (error) {
        console.error("DOKU Generation Failed:", error);
        throw new Error("Gagal menghubungkan ke gerbang pembayaran.");
    }
}