'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditAddressPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, getToken } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // State form sesuai field di gambar
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company: '',
    country: 'ID', // Default Indonesia
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    email: ''
  });

  // Pre-fill form saat user data tersedia
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.billing?.first_name || user.firstName || '',
        last_name: user.billing?.last_name || user.lastName || '',
        company: user.billing?.company || '',
        country: user.billing?.country || 'ID',
        address_1: user.billing?.address_1 || '',
        address_2: user.billing?.address_2 || '',
        city: user.billing?.city || '',
        state: user.billing?.state || '',
        postcode: user.billing?.postcode || '',
        phone: user.billing?.phone || user.phone || '',
        email: user.billing?.email || user.email || ''
      });
    }
  }, [user]);

  // Redirect jika belum login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/my-account');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = getToken();
      const response = await fetch('/api/user/update-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'billing', // Kita spesifik update billing
          data: formData
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Address changed successfully.' });
        // Optional: Redirect back after delay
        // setTimeout(() => router.push('/my-account?tab=address'), 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save address.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  // Custom Input Style agar mirip gambar (hanya border bawah)
  const inputStyle = "w-full py-2 border-b border-gray-400 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-400 text-gray-800 text-sm";
  const labelStyle = "block text-xs font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
            <Link href="/my-account?tab=address" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Back to Addresses
            </Link>
            <h1 className="text-2xl font-bold text-black mb-2">Billing address</h1>
        </div>

        {/* Notifikasi */}
        {message.text && (
          <div className={`p-4 mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>First name <span className="text-red-500">*</span></label>
              <input 
                type="text" name="first_name" required 
                value={formData.first_name} onChange={handleChange} 
                className={inputStyle} 
              />
            </div>
            <div>
              <label className={labelStyle}>Last name <span className="text-red-500">*</span></label>
              <input 
                type="text" name="last_name" required 
                value={formData.last_name} onChange={handleChange} 
                className={inputStyle} 
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className={labelStyle}>Company name (optional)</label>
            <input 
              type="text" name="company" 
              value={formData.company} onChange={handleChange} 
              className={inputStyle} 
            />
          </div>

          {/* Country */}
          <div>
            <label className={labelStyle}>Country / Region <span className="text-red-500">*</span></label>
            <select 
              name="country" required 
              value={formData.country} onChange={handleChange} 
              className={`${inputStyle} bg-white`}
            >
              <option value="ID">Indonesia</option>
              {/* Tambahkan negara lain jika perlu */}
            </select>
          </div>

          {/* Street Address */}
          <div>
            <label className={labelStyle}>Street address <span className="text-red-500">*</span></label>
            <input 
              type="text" name="address_1" required 
              placeholder="House number and street name"
              value={formData.address_1} onChange={handleChange} 
              className={inputStyle} 
            />
          </div>

          {/* Apartment */}
          <div>
            <label className={labelStyle}>Apartment, suite, unit, etc. (optional)</label>
            <input 
              type="text" name="address_2" 
              placeholder="Apartment, suite, unit, etc. (optional)"
              value={formData.address_2} onChange={handleChange} 
              className={inputStyle} 
            />
          </div>

          {/* Town / City */}
          <div>
            <label className={labelStyle}>Town / City <span className="text-red-500">*</span></label>
            <input 
              type="text" name="city" required 
              value={formData.city} onChange={handleChange} 
              className={inputStyle} 
            />
          </div>

          {/* Province */}
          <div>
            <label className={labelStyle}>Province <span className="text-red-500">*</span></label>
            <select 
              name="state" required 
              value={formData.state} onChange={handleChange} 
              className={`${inputStyle} bg-white`}
            >
              <option value="">Select an option...</option>
              <option value="JK">DKI Jakarta</option>
              <option value="JB">Jawa Barat</option>
              <option value="JT">Jawa Tengah</option>
              <option value="JI">Jawa Timur</option>
              <option value="BT">Banten</option>
              <option value="YO">DI Yogyakarta</option>
              <option value="BA">Bali</option>
              {/* Anda bisa menambahkan list provinsi lengkap di sini */}
            </select>
          </div>

          {/* Postcode */}
          <div>
            <label className={labelStyle}>Postcode / ZIP <span className="text-red-500">*</span></label>
            <input 
              type="text" name="postcode" required 
              value={formData.postcode} onChange={handleChange} 
              className={inputStyle} 
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelStyle}>Phone <span className="text-red-500">*</span></label>
            <input 
              type="tel" name="phone" required 
              value={formData.phone} onChange={handleChange} 
              className={inputStyle} 
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelStyle}>Email address <span className="text-red-500">*</span></label>
            <input 
              type="email" name="email" required 
              value={formData.email} onChange={handleChange} 
              className={inputStyle} 
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-[#2e3d32] text-white px-8 py-3 font-semibold hover:bg-black transition-colors disabled:opacity-70 text-sm"
            >
              {isSaving ? 'Saving...' : 'Save address'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}