import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Building2, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
        navigate('/facilities', { state: { searchQuery: query } });
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Modern Hero Section */}
      <div className="relative bg-white pb-16 pt-24 lg:pb-32 lg:pt-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            
            <div className="animate-fade-in-up">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-ipb-blue text-xs font-semibold tracking-wide uppercase mb-6 border border-blue-100">
                    <Sparkles className="h-3 w-3" /> Official Booking Platform
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
                  Fasilitas Terbaik <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-ipb-blue to-ipb-dark">IPB University</span>
                </h1>
                <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Temukan dan pinjam ruang kuliah, auditorium, dan fasilitas olahraga dengan mudah, cepat, dan transparan.
                </p>
            </div>

            {/* Floating Search Bar */}
            <div className="w-full max-w-3xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                 <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-ipb-accent to-ipb-blue rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white rounded-2xl shadow-xl flex items-center p-2 border border-slate-100">
                        <div className="pl-4 text-slate-400">
                            <Search className="h-6 w-6" />
                        </div>
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari fasilitas (misal: 'Auditorium', 'Lapangan')..."
                            className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 focus:ring-0 text-lg py-4 px-4"
                        />
                        <button type="submit" className="bg-ipb-blue hover:bg-ipb-dark text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95">
                            Cari <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </form>
                <div className="mt-4 flex justify-center gap-4 text-sm text-slate-500">
                    <span>Popular:</span>
                    <button onClick={() => navigate('/facilities')} className="hover:text-ipb-blue underline decoration-dotted">GWW</button>
                    <button onClick={() => navigate('/facilities')} className="hover:text-ipb-blue underline decoration-dotted">Gymnasium</button>
                    <button onClick={() => navigate('/facilities')} className="hover:text-ipb-blue underline decoration-dotted">IICC</button>
                </div>
            </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-50 rounded-full blur-3xl opacity-60"></div>
        </div>
      </div>

      {/* Stats/Trust Section */}
      <div className="border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                  { label: 'Fasilitas Terdaftar', value: '50+' },
                  { label: 'Kampus Tercover', value: '3' },
                  { label: 'Peminjaman Aktif', value: '1.2k' },
                  { label: 'Kepuasan Layanan', value: '98%' },
              ].map((stat, i) => (
                  <div key={i}>
                      <div className="text-3xl font-bold text-ipb-blue">{stat.value}</div>
                      <div className="text-sm text-slate-500 font-medium uppercase tracking-wide mt-1">{stat.label}</div>
                  </div>
              ))}
          </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Solusi Peminjaman Modern</h2>
                <p className="text-slate-500 text-lg">Meningkatkan efisiensi pemanfaatan aset universitas dengan sistem yang terintegrasi.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        icon: <Building2 className="h-8 w-8 text-white" />,
                        color: 'bg-blue-500',
                        title: 'Inventaris Lengkap',
                        desc: 'Akses data real-time ketersediaan seluruh fasilitas di berbagai lokasi kampus.'
                    },
                    {
                        icon: <ShieldCheck className="h-8 w-8 text-white" />,
                        color: 'bg-yellow-500',
                        title: 'Proses Transparan',
                        desc: 'Tracking status pengajuan real-time dari verifikasi hingga persetujuan.'
                    },
                    {
                        icon: <CalendarCheck className="h-8 w-8 text-white" />,
                        color: 'bg-emerald-500',
                        title: 'Smart Schedule',
                        desc: 'Sistem otomatis mendeteksi bentrok jadwal untuk mencegah double booking.'
                    }
                ].map((feature, i) => (
                    <div key={i} className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1">
                        <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};