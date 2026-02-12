import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Facility } from '../types';
import { BookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { Upload, AlertCircle, ArrowLeft, Calendar, Clock, FileText, Users, CheckCircle2 } from 'lucide-react';

export const BookingForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const facility = location.state?.facility as Facility;

  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: '' as string | number,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      if (!isAuthenticated) {
          navigate('/login');
      }
  }, [isAuthenticated, navigate]);

  if (!facility) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Fasilitas tidak valid</h2>
                <button onClick={() => navigate('/facilities')} className="text-ipb-blue hover:underline">Kembali ke Daftar</button>
            </div>
        </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setIsSubmitting(true);

    const result = await BookingService.createBooking({
        facilityId: facility.id,
        userId: user.id,
        eventName: formData.eventName,
        eventDescription: formData.eventDescription,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        attendees: formData.attendees
    });

    setIsSubmitting(false);

    if (result.success) {
        navigate('/my-bookings', { state: { newBooking: true } });
    } else {
        setError(result.error || "Gagal mengajukan peminjaman.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="group flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                <div className="bg-white border border-slate-300 p-2 rounded-full mr-3 shadow-sm group-hover:shadow transition-all">
                    <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="font-bold">Kembali</span>
            </button>
            <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fasilitas Dipilih</span>
                <p className="font-bold text-slate-900 text-lg">{facility.name}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Form */}
            <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-200 shadow-sm">
                            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="font-bold">{error}</span>
                        </div>
                    )}

                    {/* Section 1: Event Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="bg-blue-50 p-2 rounded-lg text-ipb-blue border border-blue-100">
                                <FileText className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Detail Kegiatan</h3>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">Nama Acara</label>
                                <input 
                                    required
                                    type="text" 
                                    name="eventName" 
                                    value={formData.eventName}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-4 focus:ring-ipb-blue/10 focus:border-ipb-blue transition-all py-3 px-4 font-semibold placeholder:font-normal placeholder:text-slate-400 shadow-sm" 
                                    placeholder="Contoh: Seminar Nasional Pertanian"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">Deskripsi Lengkap</label>
                                <textarea 
                                    required
                                    name="eventDescription"
                                    value={formData.eventDescription}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-4 focus:ring-ipb-blue/10 focus:border-ipb-blue transition-all py-3 px-4 font-medium placeholder:text-slate-400 shadow-sm" 
                                    placeholder="Jelaskan tujuan dan isi kegiatan..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">Estimasi Peserta</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    <input 
                                        required
                                        type="number" 
                                        name="attendees"
                                        min="1"
                                        max={facility.capacity}
                                        value={formData.attendees}
                                        onChange={handleChange}
                                        className="w-full pl-12 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-4 focus:ring-ipb-blue/10 focus:border-ipb-blue transition-all py-3 pr-4 font-semibold shadow-sm" 
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        Max {facility.capacity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Time */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600 border border-yellow-100">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Waktu Pelaksanaan</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-800 mb-2">Tanggal</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    <input 
                                        required
                                        type="date" 
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full pl-12 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-4 focus:ring-ipb-blue/10 focus:border-ipb-blue transition-all py-3 pr-4 font-semibold shadow-sm" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">Jam Mulai</label>
                                <input 
                                    required
                                    type="time" 
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-4 focus:ring-ipb-blue/10 focus:border-ipb-blue transition-all py-3 px-4 font-semibold text-center shadow-sm" 
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">Jam Selesai</label>
                                <input 
                                    required
                                    type="time" 
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-4 focus:ring-ipb-blue/10 focus:border-ipb-blue transition-all py-3 px-4 font-semibold text-center shadow-sm" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Docs */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 border border-emerald-100">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Kelengkapan Administrasi</h3>
                        </div>
                        
                        <div className="border-2 border-dashed border-slate-300 hover:border-ipb-blue hover:bg-blue-50/30 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 transition-all cursor-pointer group bg-slate-50">
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform border border-slate-200">
                                <Upload className="h-6 w-6 text-ipb-blue" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Unggah Surat Pengantar</span>
                            <span className="text-xs mt-1 font-medium">Format PDF, Maksimal 2MB</span>
                            <input type="file" className="hidden" accept=".pdf" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`bg-ipb-accent hover:bg-yellow-500 text-ipb-dark font-extrabold text-lg px-8 py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform hover:-translate-y-1 hover:shadow-xl w-full md:w-auto ${isSubmitting ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
                        >
                            {isSubmitting ? 'Sedang Memproses...' : 'Kirim Pengajuan Peminjaman'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:w-80">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Ringkasan</h4>
                    
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 relative shadow-inner">
                        <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-white font-bold text-sm shadow-black drop-shadow-md">{facility.type}</div>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{facility.name}</h3>
                    <div className="flex items-center text-sm text-slate-600 mb-4 font-medium">
                        <div className="w-2 h-2 rounded-full bg-ipb-accent mr-2"></div>
                        {facility.location}
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Kapasitas</span>
                            <span className="font-bold text-slate-800">{facility.capacity} Orang</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Fasilitas</span>
                            <span className="font-bold text-slate-800 text-right">{facility.features.length} item</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};