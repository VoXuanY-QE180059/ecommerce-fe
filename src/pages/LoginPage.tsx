import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { login } from '../services/auth'; // Giả sử bạn có file này
import React from 'react';

interface LoginPageProps {
  navigateTo: (page: string) => void;
  onAuthSuccess: () => void;
}

export default function LoginPage({ navigateTo, onAuthSuccess }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await login(formData);
      setSuccess(true);
      setTimeout(() => {
        onAuthSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop')" }}>
      <div className="min-h-screen bg-black/50 flex items-center justify-center p-4">
        
        <div className="relative w-full max-w-sm">
          {/* Lớp phủ cho trạng thái Loading và Success */}
          <div 
            className={`absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl z-20 transition-opacity duration-500 flex items-center justify-center
            ${loading || success ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {loading && (
              <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
                <div className="text-white">
                  <p className="font-semibold text-lg">Đang đăng nhập...</p>
                  <p className="text-sm text-white/70">Vui lòng chờ trong giây lát.</p>
                </div>
              </div>
            )}
            {success && (
               <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                   <div className="absolute -inset-2 border-2 border-green-400/50 rounded-full animate-ping"></div>
                </div>
                <div className="text-white">
                  <p className="font-semibold text-lg text-green-400">Đăng nhập thành công!</p>
                  <p className="text-sm text-white/70">Đang chuyển hướng đến trang chính...</p>
                </div>
              </div>
            )}
          </div>

          {/* Form đăng nhập */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 transform transition-all duration-500">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white tracking-wider">Login</h1>
              <p className="text-white/60 mt-2">Chào mừng bạn đã trở lại!</p>
            </div>

            {error && (
              <div className="bg-red-500/30 border border-red-500/50 rounded-lg p-3 mb-6 flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                <span className="text-white text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading || success}
                  className="w-full bg-white/10 border-2 border-transparent text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors duration-300 placeholder:text-white/40"
                  placeholder="Email của bạn"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading || success}
                  className="w-full bg-white/10 border-2 border-transparent text-white rounded-lg pl-12 pr-12 py-3 focus:outline-none focus:border-indigo-500 transition-colors duration-300 placeholder:text-white/40"
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || success}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => navigateTo('register')}
                  disabled={loading || success}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-colors duration-200"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
       <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}