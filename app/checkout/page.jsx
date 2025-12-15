"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth"; // 1. Import Auth Hook
import CheckoutForm from "@/components/Checkout/CheckoutForm";
import OrderSummary from "@/components/Checkout/OrderSummary";
import DokuCheckout from "@/components/Checkout/DokuCheckout";
import { Shield, Truck, Clock, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotals, getShippingCost, clearCart } = useCart();
  const { getToken, user } = useAuth(); // 2. Ambil helper Token & User
  
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [cartReady, setCartReady] = useState(false);

  // DOKU Checkout states
  const [showDokuCheckout, setShowDokuCheckout] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const cartTotals = getCartTotals();
  const shippingCost = getShippingCost();
  const totalAmount = cartTotals.subtotal + shippingCost;

  // Mark cart as ready after hydration
  useEffect(() => {
    setCartReady(true);
  }, []);

  // Redirect to cart if empty
  useEffect(() => {
    if (!cartReady) return;
    if (cartItems.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [cartReady, cartItems.length, orderPlaced, router]);

  // 3. Logic Utama Submit Order
  const handleOrderSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // A. Ambil Token
      const token = getToken();
      
      // B. Siapkan Payload sesuai yang dibutuhkan API
      const payload = {
        // Data items dari cart
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),

        // Data customer sesuai format WooCommerce
        customer: {
          billing: {
            first_name: formData.firstName || '',
            last_name: formData.lastName || '',
            email: formData.email || '',
            phone: formData.phone || '',
            address_1: formData.billingAddress.street || '',
            city: formData.billingAddress.city || '',
            state: formData.billingAddress.province || '',
            postcode: formData.billingAddress.postalCode || '',
            country: formData.billingAddress.country || 'Indonesia'
          },
          shipping: formData.shippingSameAsBilling ?
            {
              first_name: formData.firstName || '',
              last_name: formData.lastName || '',
              email: formData.email || '',
              phone: formData.phone || '',
              address_1: formData.billingAddress.street || '',
              city: formData.billingAddress.city || '',
              state: formData.billingAddress.province || '',
              postcode: formData.billingAddress.postalCode || '',
              country: formData.billingAddress.country || 'Indonesia'
            } : {
              first_name: formData.firstName || '',
              last_name: formData.lastName || '',
              email: formData.email || '',
              phone: formData.phone || '',
              address_1: formData.shippingAddress.street || '',
              city: formData.shippingAddress.city || '',
              state: formData.shippingAddress.province || '',
              postcode: formData.shippingAddress.postalCode || '',
              country: formData.shippingAddress.country || 'Indonesia'
            }
        },

        // Payment method info
        paymentMethod: formData.paymentMethod || 'doku',
        dokuPaymentMethod: formData.dokuPaymentMethod || 'VIRTUAL_ACCOUNT',
        dokuPaymentType: formData.dokuPaymentType || 'BCA',

        // Additional data
        shippingCost: shippingCost,
        orderNotes: formData.orderNotes || ''
      };

      console.log("📤 Submitting Order Payload:", payload);

      // C. Siapkan Headers
      const headers = {
        'Content-Type': 'application/json',
      };

      // D. LAMPIRKAN TOKEN JIKA ADA (Kunci Integrasi Login)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // E. Panggil API Internal Next.js
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to place order');
      }

      console.log("✅ Order Created:", result);

      // F. Handle Success
      if (result.success && result.payment && result.payment.paymentUrl) {
        console.log("💳 Payment URL received:", result.payment.paymentUrl);

        // Clear cart setelah order berhasil dibuat
        clearCart();

        // Set order data dan payment URL untuk DOKU modal
        setOrderData({
          orderId: result.order_id,
          invoiceNumber: result.invoice_number
        });

        setPaymentUrl(result.payment.paymentUrl);
        setShowDokuCheckout(true);

      } else {
        throw new Error("Invalid payment response received");
      }

    } catch (error) {
      console.error("❌ Checkout Error:", error);
      alert(`Checkout Failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // DOKU Checkout handlers
  const handleDokuSuccess = (response) => {
    console.log("✅ DOKU Payment Success:", response);
    setOrderPlaced(true);
    setOrderData(prev => ({
      ...prev,
      paymentCompleted: true,
      paymentResponse: response
    }));
    // Redirect ke success page atau show success state
    setTimeout(() => {
      router.push('/checkout/finish?status=success&order_id=' + orderData.orderId);
    }, 2000);
  };

  const handleDokuError = (error) => {
    console.error("❌ DOKU Payment Error:", error);
    alert(`Payment Failed: ${error.message || 'Payment could not be processed'}`);
    setShowDokuCheckout(false);
  };

  const handleDokuClose = () => {
    console.log("🔒 DOKU Checkout closed");
    setShowDokuCheckout(false);
    // Optionally show retry or return to checkout
  };

  // Tampilan Cart Kosong
  if (cartReady && cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-light mb-2">Your cart is empty</h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Tampilan Sukses - Menunggu redirect ke DOKU
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-6"></div>

          <h1 className="text-3xl font-light mb-4">
            {orderData?.redirecting ? 'Redirecting to Payment...' : 'Order Created Successfully!'}
          </h1>

          <p className="text-gray-600 mb-6">
            {orderData?.redirecting
              ? 'You will be redirected to the secure payment page in a moment...'
              : 'Your order has been created successfully.'
            }
          </p>

          {orderData?.orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="font-medium text-lg">#{orderData.orderId}</p>
              {orderData?.invoiceNumber && (
                <>
                  <p className="text-sm text-gray-600 mb-1 mt-2">Invoice Number</p>
                  <p className="font-medium">{orderData.invoiceNumber}</p>
                </>
              )}
            </div>
          )}

          {orderData?.redirecting && (
            <div className="text-sm text-gray-500">
              If you are not redirected automatically,{' '}
              <a href="#" className="text-black underline">
                click here to continue
              </a>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-light">Checkout</h1>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-blue-600" />
              <span>Free Shipping over 500k</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-600" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              onSubmit={handleOrderSubmit} // PENTING: Form harus memanggil fungsi ini saat submit
              isLoading={isLoading}
              cartItems={cartItems}
              cartTotals={cartTotals}
              shippingCost={shippingCost}
              totalAmount={totalAmount}
              // Opsional: Kirim data user yang login untuk auto-fill form
              initialData={user ? {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
              } : null}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <OrderSummary
                items={cartItems}
                totals={cartTotals}
                shippingCost={shippingCost}
                totalAmount={totalAmount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* DOKU Checkout Modal */}
      <DokuCheckout
        paymentUrl={paymentUrl}
        isOpen={showDokuCheckout}
        onClose={handleDokuClose}
        onSuccess={handleDokuSuccess}
        onError={handleDokuError}
        isLoading={paymentLoading}  
      />
      </>
  );
}