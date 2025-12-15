"use client";

import { useEffect, useState, useRef } from 'react';
import { X, ExternalLink, Shield, Loader2 } from 'lucide-react';

/**
 * DOKU Checkout Component
 * Uses iframe to embed DOKU payment page directly
 */
const DokuCheckout = ({
  paymentUrl,
  isOpen,
  onClose,
  onSuccess,
  onError,
  isLoading
}) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef(null);

  // Reset iframe loaded state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIframeLoaded(false);
    }
  }, [isOpen]);

  const handleIframeLoad = () => {
    console.log('✅ DOKU iframe loaded successfully');
    setIframeLoaded(true);
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

  const handleOpenExternal = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <h2 className="text-lg font-semibold">Secure Payment</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative" style={{ minHeight: '500px' }}>
          {/* Loading State */}
          {(!iframeLoaded || isLoading) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-700 font-medium">Loading payment gateway...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we connect to DOKU</p>
            </div>
          )}

          {/* DOKU Payment Iframe */}
          {paymentUrl && (
            <iframe
              ref={iframeRef}
              src={paymentUrl}
              className="w-full h-full border-0"
              style={{ minHeight: '500px' }}
              onLoad={handleIframeLoad}
              title="DOKU Payment"
              allow="payment"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield size={14} className="text-green-600" />
              <span>Secured by DOKU</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenExternal}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                <ExternalLink size={14} />
                Open in new tab
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokuCheckout;
