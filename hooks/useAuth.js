'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;   
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 1. Check authentication status on mount (Page Refresh)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Cek apakah kode berjalan di browser
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('homedecor_user');
          const storedToken = localStorage.getItem('homedecor_token');

          if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Jika data corrupt, bersihkan storage
        localStorage.removeItem('homedecor_user');
        localStorage.removeItem('homedecor_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 2. Login Function
  const login = async (emailOrUsername, password) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // PERBAIKAN DISINI:
        // Gunakan parameter 'emailOrUsername' dan kirim sebagai key 'username'
        // (karena backend/plugin JWT WordPress biasanya butuh key 'username')
        body: JSON.stringify({ 
            username: emailOrUsername, 
            password: password 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update State
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Simpan ke LocalStorage
        localStorage.setItem('homedecor_user', JSON.stringify(data.user));
        if (data.token) {
            localStorage.setItem('homedecor_token', data.token);
        }
        
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      // Pesan error ini muncul karena ReferenceError 'email is not defined' sebelumnya
      return { success: false, error: 'Connection failed. Please check your console.' };
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Register Function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update State
        setUser(data.user);
        setIsAuthenticated(true);

        // Simpan ke LocalStorage
        localStorage.setItem('homedecor_user', JSON.stringify(data.user));
        
        // Register biasanya langsung mengembalikan token (auto-login)
        if (data.token) {
           localStorage.setItem('homedecor_token', data.token);
        }

        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Logout Function
  const logout = async () => {
    try {
      // Opsional: Panggil API logout jika Anda menggunakan HTTPOnly Cookies di server
      // await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Bersihkan State & Storage
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('homedecor_user');
      localStorage.removeItem('homedecor_token');
      
      // Refresh halaman opsional, untuk memastikan semua komponen reset
      // window.location.href = '/'; 
    }
  };

  // Helper untuk mendapatkan token (berguna untuk API call lain)
  const getToken = () => {
     if (typeof window !== 'undefined') {
         return localStorage.getItem('homedecor_token');
     }
     return null;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    getToken, // Expose fungsi ini
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};