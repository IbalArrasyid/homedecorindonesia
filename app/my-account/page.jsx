'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  MapPin, 
  User, 
  LogOut,
  ArrowRightLeft // Icon untuk Compare (opsional)
} from 'lucide-react';

export default function MyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading, logout } = useAuth(); // Pastikan ada fungsi logout di useAuth

  // State untuk Tab Navigasi Dashboard
  const [activeTab, setActiveTab] = useState('dashboard');

  // State untuk Form Login/Register
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    reg_password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirectTo');

  // --- LOGIC AUTH (Login/Register) ---
  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (redirectTo) router.push(redirectTo);
        else router.refresh(); // Refresh halaman agar state isAuthenticated update
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) { setError('Network error.'); } finally { setIsSubmitting(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.reg_password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (redirectTo) router.push(redirectTo);
        else router.refresh();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) { setError('Network error.'); } finally { setIsSubmitting(false); }
  };

  const handleLogout = () => {
    if (logout) logout();
    // Redirect atau refresh manual jika perlu
    window.location.href = '/my-account'; 
  };

  // --- RENDER LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // --- RENDER DASHBOARD (JIKA SUDAH LOGIN) ---
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-normal text-black mb-10">My account</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* SIDEBAR NAVIGATION */}
            <nav className="w-full lg:w-1/4 border-r border-gray-100 pr-0 lg:pr-8">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left py-3 px-0 flex items-center justify-between group ${activeTab === 'dashboard' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                  >
                    <span>Dashboard</span>
                    <LayoutDashboard size={18} className={activeTab === 'dashboard' ? 'text-black' : 'text-gray-300'} />
                  </button>
                  <hr className="border-gray-100" />
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left py-3 px-0 flex items-center justify-between group ${activeTab === 'orders' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                  >
                    <span>Orders</span>
                    <ShoppingBag size={18} className={activeTab === 'orders' ? 'text-black' : 'text-gray-300'} />
                  </button>
                  <hr className="border-gray-100" />
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('downloads')}
                    className={`w-full text-left py-3 px-0 flex items-center justify-between group ${activeTab === 'downloads' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                  >
                    <span>Downloads</span>
                    <FileText size={18} className={activeTab === 'downloads' ? 'text-black' : 'text-gray-300'} />
                  </button>
                  <hr className="border-gray-100" />
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('address')}
                    className={`w-full text-left py-3 px-0 flex items-center justify-between group ${activeTab === 'address' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                  >
                    <span>Address</span>
                    <MapPin size={18} className={activeTab === 'address' ? 'text-black' : 'text-gray-300'} />
                  </button>
                  <hr className="border-gray-100" />
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('account-details')}
                    className={`w-full text-left py-3 px-0 flex items-center justify-between group ${activeTab === 'account-details' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                  >
                    <span>Account details</span>
                    <User size={18} className={activeTab === 'account-details' ? 'text-black' : 'text-gray-300'} />
                  </button>
                  <hr className="border-gray-100" />
                </li>
                {/* <li>
                  <button
                    onClick={() => setActiveTab('compare')}
                    className={`w-full text-left py-3 px-0 flex items-center justify-between group ${activeTab === 'compare' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                  >
                    <span>Compare</span>
                    <ArrowRightLeft size={18} className={activeTab === 'compare' ? 'text-black' : 'text-gray-300'} />
                  </button>
                  <hr className="border-gray-100" />
                </li> */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-0 flex items-center justify-between text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <span>Log out</span>
                    <LogOut size={18} className="text-gray-300 group-hover:text-red-600" />
                  </button>
                  <hr className="border-gray-100" />
                </li>
              </ul>
            </nav>

            {/* MAIN CONTENT AREA */}
            <main className="w-full lg:w-3/4 pl-0 lg:pl-8">
              
              {/* DASHBOARD CONTENT */}
              {activeTab === 'dashboard' && (
                <div className="space-y-4">
                  <p className="text-gray-800">
                    Hello <span className="font-semibold text-black">{user?.username || user?.email?.split('@')[0]}</span> (not <span className="font-semibold">{user?.username || user?.email?.split('@')[0]}</span>? <button onClick={handleLogout} className="text-black underline hover:text-gray-600">Log out</button>)
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    From your account dashboard you can view your <button onClick={() => setActiveTab('orders')} className="text-black underline">recent orders</button>, manage your <button onClick={() => setActiveTab('address')} className="text-black underline">billing address</button>, and <button onClick={() => setActiveTab('account-details')} className="text-black underline">edit your password and account details</button>.
                  </p>
                </div>
              )}

              {/* ORDERS CONTENT (Placeholder) */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-light mb-6">Orders</h2>
                  <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                    No orders has been made yet.
                    <Link href="/shop" className="block mt-2 text-black underline">Go Shop</Link>
                  </div>
                </div>
              )}

              {/* DOWNLOADS CONTENT (Placeholder) */}
              {activeTab === 'downloads' && (
                <div>
                  <h2 className="text-2xl font-light mb-6">Downloads</h2>
                  <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                    No downloads available yet.
                  </div>
                </div>
              )}

              {/* ADDRESS CONTENT (Placeholder) */}
              {activeTab === 'address' && (
                <div>
                  <h2 className="text-2xl font-light mb-6">Addresses</h2>
                  <p className="text-gray-600 mb-6">The following addresses will be used on the checkout page by default.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-0">
                      <header className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium">Billing address</h3>
                        <a href="my-account/edit-address/" className="text-sm text-red-500 hover:text-black">Edit</a>
                      </header>
                      <address className="not-italic text-gray-600 text-sm">
                        {user?.name}<br/>
                        {user?.email}<br/>
                        You have not set up this type of address yet.
                      </address>
                    </div>
                    {/* Shipping Address block */}
                  </div>
                </div>
              )}

              {/* ACCOUNT DETAILS CONTENT (Placeholder) */}
              {activeTab === 'account-details' && (
                <div className="max-w-xl">
                  <h2 className="text-2xl font-light mb-6">Account Details</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">First name *</label>
                        <input type="text" defaultValue={user?.firstName} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Last name *</label>
                        <input type="text" defaultValue={user?.lastName} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Display name *</label>
                      <input type="text" defaultValue={user?.username} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black" />
                      <span className="text-xs text-gray-500">This will be how your name will be displayed in the account section and in reviews</span>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Email address *</label>
                      <input type="email" defaultValue={user?.email} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black" />
                    </div>
                    <button className="bg-black text-white px-6 py-3 rounded mt-4 hover:bg-gray-800">Save changes</button>
                  </form>
                </div>
              )}

            </main>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN/REGISTER FORM (JIKA BELUM LOGIN) ---
  // Kode ini SAMA PERSIS dengan yang Anda berikan sebelumnya untuk layout 2 kolom
  return (
    <div className="account-page-wrapper">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .account-page-wrapper {
          font-family: 'Poppins', sans-serif;
          background-color: #fff;
          min-height: 100vh;
          padding: 40px 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        h1.page-title {
          font-size: 32px;
          font-weight: 400;
          color: #000;
          margin-bottom: 40px;
        }

        .u-columns {
          display: flex;
          flex-wrap: wrap;
          gap: 60px; /* Jarak antar kolom */
        }

        .u-column1, .u-column2 {
          flex: 1;
          min-width: 300px;
        }

        .account-box {
          background: #f6f6f6; /* Warna background abu-abu sesuai gambar */
          padding: 40px;
          border-radius: 0; /* Gambar menunjukkan sudut tajam */
        }

        .form-title {
          font-size: 20px;
          font-weight: 400;
          color: #333;
          margin-bottom: 20px;
        }

        .form-row {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #333;
          line-height: 1.5;
        }

        .required {
          color: #e2401c;
        }

        .input-text {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          background-color: #fff;
          font-size: 14px;
          box-sizing: border-box;
          height: 48px;
        }

        .input-text:focus {
          outline: none;
          border-color: #000;
        }

        .woocommerce-button {
          display: block;
          width: 100%;
          padding: 15px;
          background-color: #000;
          color: #fff;
          border: none;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.3s;
          margin-top: 10px;
        }

        .woocommerce-button:hover {
          background-color: #333;
        }

        .woocommerce-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Styling untuk Remember Me dan Lost Password */
        .login-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          font-size: 14px;
        }

        .remember-me label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          font-weight: 400;
          cursor: pointer;
        }

        .lost-password-link {
          color: #000;
          text-decoration: underline;
        }

        .privacy-policy-text {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .privacy-policy-text a {
          color: #000;
          text-decoration: underline;
        }

        .error-message {
          background-color: #fff4f4;
          border-left: 4px solid #cc0000;
          color: #cc0000;
          padding: 12px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        /* Responsiveness untuk Mobile */
        @media (max-width: 768px) {
          .u-columns {
            flex-direction: column;
            gap: 40px;
          }
          
          .account-box {
            padding: 20px;
          }
        }
      `}</style>

      <div className="container">
        <h1 className="page-title">My account</h1>

        {redirectTo && (
          <div className="error-message" style={{borderColor: '#0070e0', backgroundColor: '#eef7ff', color: '#005bb5'}}>
            Please login or register to continue.
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="u-columns" id="customer_login">
          
          {/* KOLOM KIRI: LOGIN */}
          <div className="u-column1">
            <div className="account-box">
              <h2 className="form-title">Login</h2>

              <form method="post" onSubmit={handleLogin}>
                <p className="form-row">
                  <label htmlFor="username">Username or email address <span className="required">*</span></label>
                  <input
                    type="text"
                    className="input-text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    autoComplete="username"
                    required
                  />
                </p>

                <p className="form-row">
                  <label htmlFor="password">Password <span className="required">*</span></label>
                  <input
                    type="password"
                    className="input-text"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    required
                  />
                </p>

                <p className="form-row">
                  <button
                    type="submit"
                    className="woocommerce-button"
                    name="login"
                    value="Log in"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Log in'}
                  </button>
                </p>
              </form>
            </div>
            
            {/* Area Actions dibawah kotak abu-abu (Login only) */}
            <div className="login-actions" style={{padding: '10px 0'}}>
                <div className="remember-me">
                  <label>
                    <input type="checkbox" name="rememberme" id="rememberme" value="forever" />
                    Remember me
                  </label>
                </div>
                <Link href="/my-account/lost-password" className="lost-password-link">
                  Lost your password?
                </Link>
            </div>
          </div>

          {/* KOLOM KANAN: REGISTER */}
          <div className="u-column2">
            <div className="account-box">
              <h2 className="form-title">Register</h2>

              <form method="post" onSubmit={handleRegister}>
                <p className="form-row">
                  <label htmlFor="reg_email">Email address <span className="required">*</span></label>
                  <input
                    type="email"
                    className="input-text"
                    name="email"
                    id="reg_email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    required
                  />
                </p>

                <p className="form-row">
                  <label htmlFor="reg_password">Password <span className="required">*</span></label>
                  <input
                    type="password"
                    className="input-text"
                    name="reg_password"
                    id="reg_password"
                    value={formData.reg_password}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    required
                  />
                </p>

                <div className="privacy-policy-text">
                  <p>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <Link href="/privacy-policy">privacy policy</Link>.</p>
                </div>

                <p className="form-row">
                  <button
                    type="submit"
                    className="woocommerce-button"
                    name="register"
                    value="Register"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}