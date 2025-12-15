"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, CreditCard, Truck } from "lucide-react";

const CheckoutForm = ({ 
  onSubmit, 
  isLoading, 
  cartItems, 
  cartTotals, 
  shippingCost, 
  totalAmount,
  initialData // 1. Menerima data user yang login
}) => {
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Billing Address
    billingAddress: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Indonesia'
    },

    // Shipping Information
    shippingSameAsBilling: true,
    shippingAddress: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Indonesia'
    },

    // Order Notes
    orderNotes: '',

    // Payment Method
    paymentMethod: 'doku', // Default ke Doku
    paymentMethodType: 'BCA', // Default Type

    // Doku specific (opsional, disinkronkan dengan paymentMethodType)
    dokuPaymentMethod: 'VIRTUAL_ACCOUNT',
    dokuPaymentType: 'BCA',
  });

  const [errors, setErrors] = useState({});

  // 2. Auto-fill Form jika User Login
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        // Jika user punya alamat tersimpan (misal dari profil), bisa di-map disini juga
      }));
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleShippingSameChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      shippingSameAsBilling: checked,
      // Jika dicentang, salin billing ke shipping
      shippingAddress: checked ? { ...prev.billingAddress } : prev.shippingAddress
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Contact validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Billing address validation
    if (!formData.billingAddress.street.trim()) newErrors['billing.street'] = 'Street address is required';
    if (!formData.billingAddress.city.trim()) newErrors['billing.city'] = 'City is required';
    if (!formData.billingAddress.province.trim()) newErrors['billing.province'] = 'Province is required';
    if (!formData.billingAddress.postalCode.trim()) newErrors['billing.postalCode'] = 'Postal code is required';

    // Shipping address validation (if different)
    if (!formData.shippingSameAsBilling) {
      if (!formData.shippingAddress.street.trim()) newErrors['shipping.street'] = 'Street address is required';
      if (!formData.shippingAddress.city.trim()) newErrors['shipping.city'] = 'City is required';
      if (!formData.shippingAddress.province.trim()) newErrors['shipping.province'] = 'Province is required';
      if (!formData.shippingAddress.postalCode.trim()) newErrors['shipping.postalCode'] = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDokuPaymentChange = (method, type) => {
    setFormData(prev => ({
      ...prev,
      dokuPaymentMethod: method,
      dokuPaymentType: type,
      paymentMethod: 'doku',
      paymentMethodType: type // Penting: Ini yang dikirim ke API
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
      // Reset type jika bukan doku, atau set default jika doku
      paymentMethodType: method === 'doku' ? prev.dokuPaymentType || 'BCA' : ''
    }));
  };

  // 3. Logic Submit Utama
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi Form
    if (validateForm()) {
      // Pastikan Shipping Address terisi benar sebelum kirim
      const finalFormData = {
        ...formData,
        shippingAddress: formData.shippingSameAsBilling ? formData.billingAddress : formData.shippingAddress
      };

      // Panggil fungsi parent (CheckoutPage) untuk proses API
      onSubmit(finalFormData);
    } else {
      // Scroll ke atas jika ada error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <User size={20} />
            Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="John"
                disabled={isLoading}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Doe"
                disabled={isLoading}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="john.doe@example.com"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="+62 812-3456-7890"
                disabled={isLoading}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Billing Address
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input
                type="text"
                value={formData.billingAddress.street}
                onChange={(e) => handleAddressChange('billingAddress', 'street', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors['billing.street'] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="123 Main Street"
                disabled={isLoading}
              />
              {errors['billing.street'] && <p className="text-red-500 text-sm mt-1">{errors['billing.street']}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.billingAddress.city}
                  onChange={(e) => handleAddressChange('billingAddress', 'city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors['billing.city'] ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Jakarta"
                  disabled={isLoading}
                />
                {errors['billing.city'] && <p className="text-red-500 text-sm mt-1">{errors['billing.city']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                <input
                  type="text"
                  value={formData.billingAddress.province}
                  onChange={(e) => handleAddressChange('billingAddress', 'province', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors['billing.province'] ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="DKI Jakarta"
                  disabled={isLoading}
                />
                {errors['billing.province'] && <p className="text-red-500 text-sm mt-1">{errors['billing.province']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  value={formData.billingAddress.postalCode}
                  onChange={(e) => handleAddressChange('billingAddress', 'postalCode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors['billing.postalCode'] ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="12345"
                  disabled={isLoading}
                />
                {errors['billing.postalCode'] && <p className="text-red-500 text-sm mt-1">{errors['billing.postalCode']}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Truck size={20} />
            <h2 className="text-lg font-medium">Shipping Address</h2>
          </div>

          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.shippingSameAsBilling}
              onChange={(e) => handleShippingSameChange(e.target.checked)}
              className="rounded border-gray-300 text-black focus:ring-black"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-700">Same as billing address</span>
          </label>

          {!formData.shippingSameAsBilling && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  value={formData.shippingAddress.street}
                  onChange={(e) => handleAddressChange('shippingAddress', 'street', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors['shipping.street'] ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={isLoading}
                />
                {errors['shipping.street'] && <p className="text-red-500 text-sm mt-1">{errors['shipping.street']}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input type="text" value={formData.shippingAddress.city} onChange={(e) => handleAddressChange('shippingAddress', 'city', e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors['shipping.city'] ? 'border-red-500' : 'border-gray-300'}`} disabled={isLoading}/>
                    {errors['shipping.city'] && <p className="text-red-500 text-sm mt-1">{errors['shipping.city']}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                    <input type="text" value={formData.shippingAddress.province} onChange={(e) => handleAddressChange('shippingAddress', 'province', e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors['shipping.province'] ? 'border-red-500' : 'border-gray-300'}`} disabled={isLoading}/>
                    {errors['shipping.province'] && <p className="text-red-500 text-sm mt-1">{errors['shipping.province']}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                    <input type="text" value={formData.shippingAddress.postalCode} onChange={(e) => handleAddressChange('shippingAddress', 'postalCode', e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors['shipping.postalCode'] ? 'border-red-500' : 'border-gray-300'}`} disabled={isLoading}/>
                    {errors['shipping.postalCode'] && <p className="text-red-500 text-sm mt-1">{errors['shipping.postalCode']}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <CreditCard size={20} />
            Payment Method
          </h2>

          <div className="mb-6">
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === 'doku' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="doku"
                  checked={formData.paymentMethod === 'doku'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-600"
                  disabled={isLoading}
                />
                <div className="flex-1">
                  <div className="font-medium text-blue-900">Secure Online Payment</div>
                  <div className="text-sm text-blue-700">Virtual Account, E-Wallet, QR Code, Credit Card & More</div>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">Recommended</div>
              </label>

              {formData.paymentMethod === 'doku' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pl-2 space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={formData.dokuPaymentMethod}
                      onChange={(e) => handleDokuPaymentChange(e.target.value, formData.dokuPaymentType)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="VIRTUAL_ACCOUNT">Virtual Account</option>
                      <option value="EWALLET">E-Wallet</option>
                      <option value="QR_CODE">QR Code</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank/Provider</label>
                    <select
                      value={formData.dokuPaymentType}
                      onChange={(e) => handleDokuPaymentChange(formData.dokuPaymentMethod, e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {formData.dokuPaymentMethod === 'VIRTUAL_ACCOUNT' && (
                        <>
                          <option value="BCA">BCA Virtual Account</option>
                          <option value="BNI">BNI Virtual Account</option>
                          <option value="BRI">BRI Virtual Account</option>
                          <option value="MANDIRI">Mandiri Virtual Account</option>
                        </>
                      )}
                      {formData.dokuPaymentMethod === 'EWALLET' && (
                        <>
                          <option value="OVO">OVO</option>
                          <option value="DANA">DANA</option>
                          <option value="GOPAY">GoPay</option>
                          <option value="LINKAJA">LinkAja</option>
                        </>
                      )}
                      {formData.dokuPaymentMethod === 'QR_CODE' && (
                        <>
                          <option value="QRIS">QRIS</option>
                        </>
                      )}
                      {formData.dokuPaymentMethod === 'CREDIT_CARD' && (
                        <>
                          <option value="VISA">Visa</option>
                          <option value="MASTERCARD">Mastercard</option>
                          <option value="JCB">JCB</option>
                        </>
                      )}
                    </select>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Order Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
          <textarea
            value={formData.orderNotes}
            onChange={(e) => handleInputChange('orderNotes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Special instructions for delivery..."
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t">
          {/* Kita menggunakan tombol standard di sini agar form submit ter-trigger dengan benar */}
          <button
             type="submit"
             disabled={isLoading}
             className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
             {isLoading ? (
                 <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing Order...
                 </>
             ) : (
                 <>
                    Place Order & Pay {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalAmount)}
                    <CreditCard size={18} />
                 </>
             )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;