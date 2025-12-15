'use client'

import React, { useState, useRef, useEffect } from 'react';
import { User, UserRound, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  // Login State
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Register State
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();
  const { user, isAuthenticated, login, register, logout } = useAuth();

  // --- Dropdown Animation Logic ---
  const openDropdown = () => {
    setIsOpen(true);
    requestAnimationFrame(() => setIsAnimating(true));
  };

  const closeDropdown = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setError('');
    }, 300);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  // --- Handlers ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(loginForm.username, loginForm.password);

      if (result.success) {
        closeDropdown();
        setLoginForm({ username: '', password: '' });
        
        // --- FITUR BARU: REDIRECT KE MY ACCOUNT ---
        router.push('/my-account'); 
        router.refresh(); // Refresh agar header berubah status jadi login
      } else {
        // Tampilkan pesan error spesifik dari API (bukan generik)
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Login Component Error:", err);
      setError('An unexpected error occurred. Please check console.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...userData } = registerForm;

      const result = await register(userData);

      if (result.success) {
        closeDropdown();
        setRegisterForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // --- FITUR BARU: AUTO REDIRECT SETELAH REGISTER ---
        router.push('/my-account');
        router.refresh();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    closeDropdown();
    router.push('/'); // Redirect ke home setelah logout
    router.refresh();
  };

  const redirectToMyAccount = () => {
    closeDropdown();
    router.push('/my-account');
  };

  // --- Effects ---

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      // closeDropdown(); // Opsional: matikan ini jika ingin dropdown tetap terbuka sebentar
    }
  }, [isAuthenticated, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // --- Styles ---
  const dropdownStyle = {
    opacity: isAnimating ? 1 : 0,
    transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
    transformOrigin: 'top right',
    transition: 'opacity 300ms ease, transform 300ms ease'
  };

  return (
    <div className="relative z-50">
      {/* User Button Trigger */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="p-2 text-black hover:text-gray-700 transition-colors sm:flex hidden items-center gap-2 focus:outline-none"
      >
        {isAuthenticated ? (
          <>
            <User className="w-6 h-6 text-gray-700" />
            <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
              {user?.username || user?.email?.split('@')[0] || 'Account'}
            </span>
          </>
        ) : (
          <UserRound className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="account-dropdown absolute top-full right-0 mt-2 bg-white rounded-lg shadow-2xl w-96 border border-gray-200 overflow-hidden"
          style={dropdownStyle}
        >
          {isAuthenticated ? (
            /* --- LOGGED IN VIEW --- */
            <div className="account-wrap">
              <div className="account-inner">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/my-account"
                    onClick={closeDropdown}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/my-account?tab=orders"
                    onClick={closeDropdown}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded transition-colors text-left font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* --- GUEST VIEW (Login/Register) --- */
            <div className="account-wrap">
              <div className="account-inner">
                {/* Form Header */}
                <div className="login-form-head">
                  <span className="login-form-title">
                    {activeTab === 'signin' ? 'Sign in' : 'Create Account'}
                  </span>
                  <span className="pull-right">
                    {activeTab === 'signin' ? (
                      <button
                        onClick={redirectToMyAccount}
                        className="register-link text-gray-600 hover:text-black transition-colors"
                      >
                        Create an Account
                      </button>
                    ) : (
                      <button
                        onClick={() => { setActiveTab('signin'); setError(''); }}
                        className="register-link text-gray-600 hover:text-black transition-colors"
                      >
                        Sign in
                      </button>
                    )}
                  </span>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm">
                    {error}
                  </div>
                )}

                {activeTab === 'signin' ? (
                  /* --- LOGIN FORM --- */
                  <form onSubmit={handleLogin} className="umimo-login-form-ajax">
                    <p>
                      <label>Username or email <span className="required">*</span></label>
                      <input
                        name="username"
                        type="text"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Username"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors text-sm"
                      />
                    </p>
                    <p>
                      <label>Password <span className="required">*</span></label>
                      <input
                        name="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors text-sm"
                      />
                    </p>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary btn-block w-100 mt-3 bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'SIGNING IN...' : 'Login'}
                    </button>
                  </form>
                ) : (
                  /* --- REGISTER FORM --- */
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="First Name *"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Last Name *"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="password"
                        placeholder="Password (min. 6 chars) *"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                        minLength={6}
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="password"
                        placeholder="Confirm Password *"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                        minLength={6}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary btn-block w-100 mt-3 bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'CREATING ACCOUNT...' : 'Create Account'}
                    </button>
                  </form>
                )}

                <div className="login-form-bottom mt-4">
                  <Link
                    href="/auth/forgot-password"
                    onClick={closeDropdown}
                    className="lostpass-link text-gray-600 hover:text-black transition-colors text-sm"
                  >
                    Lost your password?
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          {!isAuthenticated && (
            <button
              onClick={closeDropdown}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Add CSS styles for template look
const LoginDropdownStyles = `
  .account-dropdown {
    font-family: inherit;
  }

  .account-wrap {
    padding: 0;
    margin: 0;
  }

  .login-form-head {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    margin-bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .login-form-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .pull-right {
    float: right;
  }

  .register-link {
    font-size: 14px;
    color: #666;
    text-decoration: none;
    transition: color 0.2s;
    background: none;
    border: none;
    cursor: pointer;
  }

  .register-link:hover {
    color: #000;
    text-decoration: underline;
  }

  .umimo-login-form-ajax p {
    margin-bottom: 15px;
  }

  .umimo-login-form-ajax label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .umimo-login-form-ajax input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  .umimo-login-form-ajax input:focus {
    outline: none;
    border-color: #000;
  }

  .required {
    color: #e74c3c;
  }

  .btn {
    display: inline-block;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background-color: #000;
    color: #fff;
  }

  .btn-primary:hover {
    background-color: #333;
  }

  .btn-block {
    display: block;
    width: 100%;
  }

  .w-100 {
    width: 100%;
  }

  .login-form-bottom {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    text-align: center;
  }

  .lostpass-link {
    color: #666;
    text-decoration: none;
    font-size: 14px;
  }

  .lostpass-link:hover {
    color: #000;
    text-decoration: underline;
  }

  .account-inner {
    padding: 20px;
  }

  .d-none {
    display: none;
  }
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = LoginDropdownStyles;
  document.head.appendChild(styleSheet);
}