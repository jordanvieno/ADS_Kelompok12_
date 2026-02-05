import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Building2, CalendarCheck, ShieldCheck } from 'lucide-react';

export const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
        navigate('/facilities', { state: { aiQuery: query } });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-ipb-dark to-ipb-blue text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e1/Gedung_Rektorat_IPB.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Sistem Peminjaman Fasilitas <br/>
              <span className="text-ipb-accent">IPB University</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Platform terintegrasi untuk memudahkan civitas akademika dalam meminjam ruang kuliah, auditorium, dan fasilitas olahraga dengan dukungan rekomendasi cerdas.
            </p>
            
            <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col md:flex-row gap-2 max-w-2xl">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-blue-200" />
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Coba: 'Butuh gedung untuk wisuda kapasitas 2000 orang'"
                        className="w-full bg-transparent border-none text-white placeholder-blue-200 focus:ring-0 pl-12 pr-4 py-3"
                    />
                </div>
                <button type="submit" className="bg-ipb-accent hover:bg-yellow-500 text-ipb-dark font-bold px-8 py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center">
                    Cari Fasilitas <ArrowRight className="ml-2 h-4 w-4" />
                </button>
            </form>
            <p className="text-sm text-blue-200 mt-4 ml-2">Didukung oleh Gemini AI untuk rekomendasi yang lebih akurat.</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900">Mengapa Sipinjampas?</h2>
                <p className="mt-4 text-slate-500">Layanan prima untuk mendukung kegiatan tri dharma perguruan tinggi.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="h-8 w-8 text-ipb-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Inventaris Lengkap</h3>
                    <p className="text-slate-600 leading-relaxed">Akses data real-time ketersediaan seluruh fasilitas di kampus Dramaga, Baranangsiang, hingga Gunung Gede.</p>
                </div>

                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-xl transition-all duration-300">
                     <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Proses Transparan</h3>
                    <p className="text-slate-600 leading-relaxed">Pantau status pengajuan peminjaman Anda dari tahap verifikasi prodi, fakultas, hingga direktorat sarpras.</p>
                </div>

                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-xl transition-all duration-300">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CalendarCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Penjadwalan Cerdas</h3>
                    <p className="text-slate-600 leading-relaxed">Sistem secara otomatis mendeteksi bentrok jadwal dan memberikan alternatif ruangan yang sesuai.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};