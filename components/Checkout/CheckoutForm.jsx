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
  initialData,
  currentStep,
  onStepChange
}) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    billingAddress: { street: '', city: '', province: '', postalCode: '', country: 'Indonesia' },
    shippingSameAsBilling: true,
    shippingAddress: { street: '', city: '', province: '', postalCode: '', country: 'Indonesia' },
    orderNotes: '',
    paymentMethod: 'doku',
    paymentMethodType: 'BCA', // Default
    dokuPaymentMethod: 'VIRTUAL_ACCOUNT',
    dokuPaymentType: 'BCA',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
      }));
    }
  }, [initialData]);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev, [type]: { ...prev[type], [field]: value }
    }));
  };

  const validateInfoStep = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.billingAddress.street.trim()) newErrors['billing.street'] = 'Address is required';
    if (!formData.billingAddress.city.trim()) newErrors['billing.city'] = 'City is required';
    if (!formData.billingAddress.postalCode.trim()) newErrors['billing.postalCode'] = 'Postal Code is required';

    if (!formData.shippingSameAsBilling) {
      if (!formData.shippingAddress.street.trim()) newErrors['shipping.street'] = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateInfoStep()) {
      onStepChange(2);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReviewInfo = () => {
    onStepChange(1);
  };

  const handleDokuPaymentSelection = (method, type) => {
    setFormData(prev => ({
      ...prev,
      dokuPaymentMethod: method,
      dokuPaymentType: type,
      paymentMethodType: type
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInfoStep()) {
      const finalFormData = {
        ...formData,
        shippingAddress: formData.shippingSameAsBilling ? formData.billingAddress : formData.shippingAddress
      };
      onSubmit(finalFormData);
    }
  };

  // Helper for Payment Options
  const PaymentOption = ({ label, method, type, icon }) => (
    <div
      onClick={() => handleDokuPaymentSelection(method, type)}
      className={`relative p-4 border rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-28
        ${formData.dokuPaymentType === type
          ? 'border-black bg-gray-50 ring-1 ring-black shadow-sm'
          : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'}`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <span className="text-sm font-medium leading-tight">{label}</span>
      {formData.dokuPaymentType === type && (
        <div className="absolute top-2 right-2 text-black">
          <div className="w-2 h-2 rounded-full bg-black"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">

      {/* STEP 1: INFORMATION */}
      <motion.div
        initial={false}
        animate={currentStep === 1 ? "open" : "collapsed"}
        className={`bg-white rounded-xl shadow-sm border overflow-hidden ${currentStep === 1 ? 'ring-1 ring-black/5' : 'opacity-60 grayscale-[0.5]'}`}
      >
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">1</span>
            Contact & Shipping
          </h2>
          {currentStep === 2 && (
            <button onClick={handleReviewInfo} className="text-sm underline text-gray-600 hover:text-black">Edit</button>
          )}
        </div>

        {/* Form Content - Collapsible */}
        <div className={`${currentStep === 1 ? 'block' : 'hidden'} p-6 space-y-6`}>
          {/* Contact Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">First Name</label>
              <input type="text" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`} placeholder="John" />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Last Name</label>
              <input type="text" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Doe" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Email</label>
              <input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200'}`} placeholder="john@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Phone</label>
              <input type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} placeholder="+62..." />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-sm text-gray-900">Shipping Address</h3>
            <div>
              <input type="text" value={formData.billingAddress.street} onChange={e => handleAddressChange('billingAddress', 'street', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors ${errors['billing.street'] ? 'border-red-500' : 'border-gray-200'}`} placeholder="Street Address" />
              {errors['billing.street'] && <p className="text-red-500 text-xs mt-1">{errors['billing.street']}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={formData.billingAddress.city} onChange={e => handleAddressChange('billingAddress', 'city', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="City" />
              <input type="text" value={formData.billingAddress.postalCode} onChange={e => handleAddressChange('billingAddress', 'postalCode', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="Postal Code" />
            </div>
          </div>

          <button type="button" onClick={handleContinueToPayment} className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-zinc-800 transition-colors">
            Continue to Payment
          </button>
        </div>

        {/* Summary View (When Collapsed) */}
        {currentStep === 2 && (
          <div className="px-6 pb-6 text-sm text-gray-600">
            <p className="font-medium text-black">{formData.firstName} {formData.lastName}</p>
            <p>{formData.email}</p>
            <p className="truncate">{formData.billingAddress.street}, {formData.billingAddress.city}</p>
          </div>
        )}
      </motion.div>


      {/* STEP 2: PAYMENT */}
      <motion.div
        initial={false}
        animate={currentStep === 2 ? "open" : "collapsed"}
        className={`bg-white rounded-xl shadow-sm border overflow-hidden ${currentStep === 2 ? 'ring-1 ring-black/5' : 'opacity-40 pointer-events-none'}`}
      >
        <div className="p-6 border-b bg-gray-50/50">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${currentStep === 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
            Payment Method
          </h2>
        </div>

        {currentStep === 2 && (
          <div className="p-6 space-y-6">

            {/* Visual Payment Selection */}
            <div className="space-y-6">
              {/* Virtual Accounts */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Virtual Account</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <PaymentOption label="BCA" method="VIRTUAL_ACCOUNT" type="BCA" icon="🏦" />
                  <PaymentOption label="Mandiri" method="VIRTUAL_ACCOUNT" type="MANDIRI" icon="🏦" />
                  <PaymentOption label="BNI" method="VIRTUAL_ACCOUNT" type="BNI" icon="🏦" />
                  <PaymentOption label="BRI" method="VIRTUAL_ACCOUNT" type="BRI" icon="🏦" />
                </div>
              </div>

              {/* E-Wallets */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">E-Wallet & QRIS</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <PaymentOption label="QRIS" method="QR_CODE" type="QRIS" icon="📱" />
                  <PaymentOption label="OVO" method="EWALLET" type="OVO" icon="👛" />
                  <PaymentOption label="DANA" method="EWALLET" type="DANA" icon="👛" />
                  <PaymentOption label="GoPay" method="EWALLET" type="GOPAY" icon="👛" />
                </div>
              </div>

              {/* Credit Card */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Credit Card</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <PaymentOption label="Credit Card" method="CREDIT_CARD" type="CREDIT_CARD" icon="💳" />
                </div>
              </div>
            </div>

            {/* Secure Notice */}
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 text-sm items-start">
              <User size={16} className="mt-0.5" />
              <p>All transactions are secure and encrypted. You will be redirected to DOKU Safe Page to complete the payment.</p>
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Order Notes (Optional)</label>
              <textarea
                value={formData.orderNotes} onChange={e => handleInputChange('orderNotes', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Specific delivery instructions..."
              />
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-black/10"
              >
                {isLoading ? (
                  <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Pay {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalAmount)}
                    <CreditCard size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default CheckoutForm;