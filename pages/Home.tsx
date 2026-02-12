import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, BarChart3, TrendingUp, Activity, Clock, AlertCircle } from 'lucide-react';

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
                    <Sparkles className="h-3 w-3" /> Official TLS Platform
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
                  Tools & Lab Sharing <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-ipb-blue to-ipb-dark">IPB University</span>
                </h1>
                <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Temukan dan pinjam laboratorium, peralatan riset, dan ruang fasilitas dengan mudah, cepat, dan transparan.
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
                            placeholder="Cari fasilitas (misal: 'Laboratorium', 'Auditorium')..."
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

      {/* Features Grid with Data Visualization */}
      <div className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Dashboard Analitik Cerdas</h2>
                <p className="text-slate-500 text-lg">Keputusan berbasis data untuk efisiensi pemanfaatan aset universitas.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Card 1: Analitik Jam Sibuk */}
                <div className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                        <BarChart3 className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Analitik Jam Sibuk</h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">Hindari antrean dengan memantau grafik waktu pengajuan tertinggi secara real-time.</p>
                    
                    {/* Visual Data Example */}
                    <div className="mt-auto bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex justify-between items-end h-24 gap-2 mb-2">
                            <div className="w-full bg-blue-100 rounded-t-md h-[40%] relative group-hover:bg-blue-200 transition-colors"></div>
                            <div className="w-full bg-blue-100 rounded-t-md h-[60%] relative group-hover:bg-blue-200 transition-colors"></div>
                            <div className="w-full bg-ipb-blue rounded-t-md h-[90%] relative shadow-lg shadow-blue-900/10">
                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded font-bold">Peak</span>
                            </div>
                            <div className="w-full bg-blue-100 rounded-t-md h-[50%] relative group-hover:bg-blue-200 transition-colors"></div>
                            <div className="w-full bg-blue-100 rounded-t-md h-[30%] relative group-hover:bg-blue-200 transition-colors"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                            <span>08.00</span>
                            <span className="text-ipb-blue">10.00</span>
                            <span>16.00</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-ipb-accent" />
                            Jam Sibuk: <span className="text-slate-800">Senin, 09:00 - 11:00</span>
                        </div>
                    </div>
                </div>

                {/* Card 2: Fasilitas Paling Diminati */}
                <div className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                    <div className="w-14 h-14 bg-ipb-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
                        <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Fasilitas Paling Diminati</h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">Lihat tren penggunaan aset untuk perencanaan kegiatan yang lebih matang.</p>
                    
                    {/* Visual Data Example */}
                    <div className="mt-auto bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                                <span>1. Graha Widya Wisuda</span>
                                <span className="text-ipb-blue">98% Booked</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-ipb-blue h-1.5 rounded-full w-[98%]"></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 italic">Dipakai Wisuda & Seminar Nasional</p>
                        </div>
                        <div>
                             <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                                <span>2. Computer Hall B</span>
                                <span className="text-ipb-blue">85% Booked</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-ipb-blue h-1.5 rounded-full w-[85%]"></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 italic">Kuliah Algoritme (Prodi Ilkom)</p>
                        </div>
                    </div>
                </div>

                {/* Card 3: Metrik Antrean & Pembatalan */}
                <div className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                        <Activity className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Kesehatan Layanan</h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">Transparansi data tingkat pembatalan dan rata-rata waktu tunggu persetujuan.</p>
                    
                    {/* Visual Data Example */}
                    <div className="mt-auto grid grid-cols-2 gap-3">
                        <div className="bg-red-50 rounded-xl p-3 border border-red-100 text-center group-hover:bg-red-100/50 transition-colors">
                            <div className="text-red-600 mb-1">
                                <AlertCircle className="h-5 w-5 mx-auto" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800">4.2%</div>
                            <div className="text-[9px] font-bold text-red-500 uppercase tracking-wide">Tingkat Batal</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center group-hover:bg-emerald-100/50 transition-colors">
                            <div className="text-emerald-600 mb-1">
                                <Clock className="h-5 w-5 mx-auto" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800">15m</div>
                            <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Rata-rata Tunggu</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};