import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import { University, Loader2, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      nim: '',
      role: 'student' as 'student' | 'staff'
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await AuthService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.nim
    );
    
    setIsLoading(false);
    if (result.success && result.data) {
      login(result.data);
      navigate('/');
    } else {
      setError(result.error || 'Registrasi gagal.');
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
          Daftar Akun Baru
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-md flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="h-5 w-5" />
                {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
              <div className="mt-1">
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-ipb-blue focus:border-ipb-blue sm:text-sm bg-white text-slate-900" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-ipb-blue focus:border-ipb-blue sm:text-sm bg-white text-slate-900" />
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700">Kategori</label>
              <div className="mt-1">
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-ipb-blue focus:border-ipb-blue sm:text-sm bg-white text-slate-900">
                    <option value="student">Mahasiswa</option>
                    <option value="staff">Tendik / Dosen</option>
                </select>
              </div>
            </div>

            {formData.role === 'student' && (
                <div>
                    <label htmlFor="nim" className="block text-sm font-medium text-slate-700">NIM</label>
                    <div className="mt-1">
                        <input id="nim" name="nim" type="text" required value={formData.nim} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-ipb-blue focus:border-ipb-blue sm:text-sm bg-white text-slate-900" />
                    </div>
                </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Kata Sandi</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-ipb-blue focus:border-ipb-blue sm:text-sm bg-white text-slate-900" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ipb-blue hover:bg-ipb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ipb-blue transition-colors disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Daftar Sekarang'}
              </button>
            </div>
          </form>
          
           <div className="mt-6 text-center">
             <Link to="/login" className="text-sm font-medium text-ipb-blue hover:text-ipb-dark">
                Sudah punya akun? Masuk di sini
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};