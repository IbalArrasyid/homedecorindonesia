export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { createWooClientWrite } from "@/lib/woocommerce";
import { getProductById } from "@/services/server-helpers";
// Import helper DOKU (akan kita buat di langkah berikutnya)
import { generateDokuPaymentUrl } from "@/lib/doku";

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, customer } = body;

        // --- TAHAP 1: VALIDASI & SANITASI (Server Authority) ---
        // Menjamin harga diambil dari database, bukan dari input client
        const line_items = await Promise.all(items.map(async (item) => {
            const product = await getProductById(item.product_id);

            if (!product) throw new Error(`Product ID ${item.product_id} invalid.`);

            // Validasi stok sederhana
            if (product.stock_status !== 'instock') {
                throw new Error(`Stok untuk ${product.name} habis.`);
            }

            return {
                product_id: product.product_id, // atau product.id
                quantity: item.quantity,
                // WooCommerce akan menghitung total otomatis berdasarkan harga DB
            };
        }));

        // --- TAHAP 2: PERSISTENSI ORDER KE WOOCOMMERCE ---
        // Kita set status 'pending' karena user belum bayar di DOKU
        const orderPayload = {
            payment_method: "doku", // Label untuk catatan internal Woo
            payment_method_title: "DOKU Payment Gateway",
            set_paid: false,
            status: "pending",
            billing: customer.billing,
            shipping: customer.shipping,
            line_items: line_items,
            // Simpan metadata jika perlu debugging
            meta_data: [
                { key: "checkout_source", value: "nextjs_headless" }
            ]
        };

        const wooClient = createWooClientWrite();
        const { data: orderData } = await wooClient.post("orders", orderPayload);

        if (!orderData || !orderData.id) {
            throw new Error("Gagal membuat order di WooCommerce.");
        }

        // --- TAHAP 3: INISIASI PEMBAYARAN KE DOKU ---
        // Menggunakan data order yang BARU SAJA dibuat (ID & Total)
        // untuk menjamin integritas nominal yang ditagihkan.

        const paymentResponse = await generateDokuPaymentUrl({
            orderId: orderData.id.toString(),
            amount: parseFloat(orderData.total), // Total final dari Woo (inc. tax/shipping)
            customerEmail: customer.billing.email,
            customerName: `${customer.billing.first_name} ${customer.billing.last_name}`,
            products: line_items // Opsional: kirim detail item ke DOKU jika didukung
        });

        // --- TAHAP 4: RESPONSE KE CLIENT ---
        // Mengembalikan Order ID dan Payment URL agar front-end bisa redirect
        return NextResponse.json({
            success: true,
            order_id: orderData.id,
            invoice_number: paymentResponse.invoice_number,
            payment: {
                paymentUrl: paymentResponse.payment_url, // URL redirect DOKU
                orderId: orderData.id.toString(),
                invoiceNumber: paymentResponse.invoice_number
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Checkout Logic Error:", error);
        const message = error?.response?.data?.message || error.message;
        return NextResponse.json({ error: message }, { status: 500 });
    }
}