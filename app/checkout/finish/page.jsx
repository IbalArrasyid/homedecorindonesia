"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Clock, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function CheckoutFinishPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Get parameters from URL (DOKU callback)
        const orderId = searchParams.get('order_id') || searchParams.get('invoice_number');
        const transactionStatus = searchParams.get('transaction_status') || searchParams.get('status');
        const paymentCode = searchParams.get('payment_code');
        const signatureKey = searchParams.get('signature_key');

        console.log('🔍 DOKU Callback Parameters:', {
          orderId,
          transactionStatus,
          paymentCode,
          signatureKey
        });

        if (!orderId) {
          throw new Error('Order ID tidak ditemukan');
        }

        // Call API to check real payment status from DOKU
        const response = await fetch('/api/orders/check-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceNumber: orderId })
        });

        const data = await response.json();
        setLoading(false);

        if (data.success) {
          const status = data.status; // SUCCESS, FAILED, PENDING

          if (status === 'SUCCESS') {
            setPaymentStatus('success');
            setOrderDetails({
              orderId: orderId,
              paymentMethod: 'DOKU Payment Gateway',
              paymentCode: paymentCode || '-',
              status: 'Pembayaran Berhasil'
            });
          } else if (status === 'FAILED' || status === 'EXPIRED') {
            setPaymentStatus('failed');
            setError('Pembayaran gagal atau kadaluwarsa');
          } else {
            setPaymentStatus('pending');
            setOrderDetails({
              orderId: orderId,
              paymentMethod: 'DOKU Payment Gateway',
              paymentCode: paymentCode || '-',
              status: 'Menunggu Pembayaran'
            });
          }
        } else {
          throw new Error(data.error || 'Failed to verify payment status');
        }

      } catch (err) {
        console.error('❌ Payment processing error:', err);
        setLoading(false);
        setError('Terjadi kesalahan saat memproses pembayaran');
        setPaymentStatus('error');
      }
    };

    processPaymentCallback();
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="w-20 h-20 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-20 h-20 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="w-20 h-20 text-yellow-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Pembayaran Berhasil!';
      case 'failed':
        return 'Pembayaran Gagal';
      case 'error':
        return 'Terjadi Kesalahan';
      case 'pending':
      default:
        return 'Memproses Pembayaran...';
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Terima kasih! Pesanan Anda telah berhasil dibayar dan akan segera diproses.';
      case 'failed':
        return 'Maaf, pembayaran Anda gagal. Silakan coba lagi atau hubungi customer service.';
      case 'error':
        return error || 'Terjadi kesalahan saat memproses pembayaran.';
      case 'pending':
        return 'Pembayaran Anda sedang diproses. Halaman akan diperbarui secara otomatis.';
      default:
        return 'Sedang memproses status pembayaran...';
    }
  };

  const getActionButtons = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <>
            <Link
              href="/"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Kembali ke Beranda
            </Link>
            <Link
              href="/orders"
              className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Lihat Pesanan Saya
            </Link>
          </>
        );
      case 'failed':
      case 'error':
        return (
          <>
            <button
              onClick={() => router.back()}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Coba Lagi
            </button>
            <Link
              href="/cart"
              className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kembali ke Keranjang
            </Link>
          </>
        );
      case 'pending':
        return (
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Perbarui Status
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-light mb-2">Memproses Pembayaran</h2>
          <p className="text-gray-600">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>

          {/* Status Title */}
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {getStatusTitle()}
          </h1>

          {/* Status Message */}
          <p className="text-gray-600 mb-6 text-lg">
            {getStatusMessage()}
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-lg mb-3">Detail Pesanan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nomor Pesanan:</span>
                  <span className="font-medium">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Metode Pembayaran:</span>
                  <span className="font-medium">{orderDetails.paymentMethod}</span>
                </div>
                {orderDetails.paymentCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kode Pembayaran:</span>
                    <span className="font-medium">{orderDetails.paymentCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${paymentStatus === 'success' ? 'text-green-600' :
                      paymentStatus === 'failed' ? 'text-red-600' :
                        'text-yellow-600'
                    }`}>
                    {orderDetails.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {getActionButtons()}
          </div>

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Butuh bantuan? Hubungi kami:
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
              >
                WhatsApp
              </a>
              <a
                href="mailto:support@homedecorindonesia.com"
                className="text-blue-600 hover:text-blue-700"
              >
                Email
              </a>
              <a
                href="tel:+6281234567890"
                className="text-gray-600 hover:text-gray-700"
              >
                Phone
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}