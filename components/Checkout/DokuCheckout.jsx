"use client";

import { useEffect, useState } from 'react';
import { loadScript } from '@/lib/utils';

/**
 * DOKU Checkout Component
 * Integrates DOKU Checkout JS for seamless payment experience
 */
const DokuCheckout = ({
  paymentUrl,
  isOpen,
  onClose,
  onSuccess,
  onError,
  isLoading
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);

  // Load DOKU Checkout JS
  useEffect(() => {
    const loadDokuScript = async () => {
      try {
        // Determine which script to load based on environment
        const isProduction = process.env.NODE_ENV === 'production';
        const scriptUrl = isProduction
          ? 'https://jokul.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js'
          : 'https://sandbox.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js';

        console.log('📦 Loading DOKU Checkout JS:', scriptUrl);

        await loadScript(scriptUrl);
        setScriptLoaded(true);
        setCheckoutReady(true);

        console.log('✅ DOKU Checkout JS loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load DOKU Checkout JS:', error);
        onError?.(error);
      }
    };

    if (isOpen && !scriptLoaded) {
      loadDokuScript();
    }
  }, [isOpen, scriptLoaded, onError]);

  // Initialize DOKU Checkout when ready
  useEffect(() => {
    if (isOpen && scriptLoaded && paymentUrl && checkoutReady) {
      initializeCheckout();
    }
  }, [isOpen, scriptLoaded, paymentUrl, checkoutReady]);

  const initializeCheckout = () => {
    try {
      console.log('🚀 Initializing DOKU Checkout with URL:', paymentUrl);

      // Check if loadJokulCheckout function is available
      if (typeof window !== 'undefined' && window.loadJokulCheckout) {
        // Setup callback handlers
        setupDokuCallbacks();

        // Load the checkout
        window.loadJokulCheckout(paymentUrl);
        console.log('✅ DOKU Checkout initialized');
      } else {
        throw new Error('loadJokulCheckout function not available');
      }
    } catch (error) {
      console.error('❌ Failed to initialize DOKU Checkout:', error);
      onError?.(error);
    }
  };

  const setupDokuCallbacks = () => {
    // Setup DOKU checkout callbacks based on their documentation
    if (typeof window !== 'undefined') {
      // Success callback
      window.dokuCheckoutSuccess = function(response) {
        console.log('✅ DOKU Checkout Success:', response);
        onSuccess?.(response);
        onClose?.();
      };

      // Failure callback
      window.dokuCheckoutFailed = function(error) {
        console.error('❌ DOKU Checkout Failed:', error);
        onError?.(error);
        onClose?.();
      };

      // Close callback
      window.dokuCheckoutClosed = function() {
        console.log('🔒 DOKU Checkout Closed');
        onClose?.();
      };
    }
  };

  const handleClose = () => {
    console.log('🔒 User closed DOKU Checkout');
    onClose?.();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Complete Payment</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading payment gateway...</p>
            </div>
          )}

          {!scriptLoaded && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-yellow-500 mb-4">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-gray-600 text-center mb-2">Loading secure payment gateway...</p>
              <p className="text-sm text-gray-500">Please wait while we initialize DOKU Checkout</p>
            </div>
          )}

          {scriptLoaded && checkoutReady && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Secure Payment</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You will be redirected to DOKU secure payment page to complete your transaction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p className="text-gray-600">Initializing payment gateway...</p>
                <p className="text-sm text-gray-500 mt-1">This window will show the payment form</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Powered by DOKU
            </div>
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokuCheckout;