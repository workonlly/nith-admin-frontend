'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
      
      const res = await fetch(`${API_BASE}/auth/faculty/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store JWT token and faculty user info in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('faculty_token', data.token);
        // Optional session cookie for Next.js SSR / route guards
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }

      if (data.faculty || data.user) {
        const userData = data.faculty || data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('faculty_user', JSON.stringify(userData));
      }

      // Redirect to admin dashboard after successful login
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to authentication server');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#631012] via-[#7a1214] to-[#8b1517] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <h1 className="text-4xl font-bold mb-4 text-center">NIT Hamirpur</h1>
          <p className="text-xl text-white/80 mb-2">Admin Portal</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <div className="w-16 h-16 bg-[#631012] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">NIT Hamirpur</h1>
            <p className="text-gray-500">Admin Portal</p>
          </div>

          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Admin
            </h2>
            <p className="text-gray-500">
              Please enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#631012]/20 focus:border-[#631012] outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="admin@nith.ac.in"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#631012]/20 focus:border-[#631012] outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#631012] text-white py-3.5 px-4 rounded-xl hover:bg-[#7a1214] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 group shadow-lg shadow-[#631012]/25 hover:shadow-xl hover:shadow-[#631012]/30"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
