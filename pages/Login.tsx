import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import { University, Loader2, AlertCircle, Info } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await AuthService.login(email, password);
    
    setIsLoading(false);
    if (result.success && result.data) {
      login(result.data);
      if (result.data.role === 'admin') {
          navigate('/admin/dashboard');
      } else {
          navigate('/');
      }
    } else {
      setError(result.error || 'Login gagal.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="bg-ipb-blue p-3 rounded-full">
                <University className="h-10 w-10 text-white" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Masuk ke Sipinjampas
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sistem Peminjaman Fasilitas IPB University
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Demo Helper */}
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2 text-xs text-blue-800">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
                <span className="font-bold">Info Demo:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li>Admin: <strong>admin@ipb.ac.id</strong> / <strong>password123</strong></li>
                    <li>User: <strong>mahasiswa@apps.ipb.ac.id</strong> / <strong>user123</strong></li>
                </ul>
            </div>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-md flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="h-5 w-5" />
                {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Alamat Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-ipb-blue focus:border-ipb-blue sm:text-sm bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Kata Sandi
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-ipb-blue focus:border-ipb-blue sm:text-sm bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ipb-blue hover:bg-ipb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ipb-blue transition-colors disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Masuk'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Belum punya akun?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};