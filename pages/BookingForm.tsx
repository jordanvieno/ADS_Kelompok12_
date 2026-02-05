import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Facility } from '../types';
import { BookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { Upload, AlertCircle, ArrowLeft } from 'lucide-react';

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
    attendees: '' as string | number, // Changed to allow empty string for better UX
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
      if (!isAuthenticated) {
          navigate('/login');
      }
  }, [isAuthenticated, navigate]);

  if (!facility) {
    return (
        <div className="min-h-screen flex items-center justify-center">
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

    const startDateTime = `${formData.date}T${formData.startTime}:00`;
    const endDateTime = `${formData.date}T${formData.endTime}:00`;
    
    // Explicitly parse attendees as integer base 10 to prevent any off-by-one or type issues
    const attendeesCount = parseInt(formData.attendees.toString(), 10);

    if (isNaN(attendeesCount) || attendeesCount <= 0) {
        setError("Jumlah peserta tidak valid.");
        setIsSubmitting(false);
        return;
    }

    // Call "Backend" Service with Real User ID
    const result = await BookingService.createBooking({
        facilityId: facility.id,
        userId: user.id, 
        eventName: formData.eventName,
        eventDescription: formData.eventDescription,
        startTime: startDateTime,
        endTime: endDateTime,
        attendees: attendeesCount
    });

    setIsSubmitting(false);

    if (result.success) {
        navigate('/my-bookings', { state: { newBooking: true } });
    } else {
        setError(result.error || "Gagal mengajukan peminjaman.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-ipb-blue p-6 text-white">
            <h1 className="text-2xl font-bold">Formulir Peminjaman</h1>
            <p className="text-blue-100 mt-1">Mengajukan peminjaman untuk {facility.name}</p>
        </div>

        <div className="p-8">
            {error && (
                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Event Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Detail Acara</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Acara</label>
                            <input 
                                required
                                type="text" 
                                name="eventName" 
                                value={formData.eventName}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" 
                                placeholder="Contoh: Seminar Nasional Pertanian"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Kegiatan</label>
                            <textarea 
                                required
                                name="eventDescription"
                                value={formData.eventDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" 
                                placeholder="Jelaskan tujuan dan isi kegiatan..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Estimasi Peserta</label>
                            <div>
                                <input 
                                    required
                                    type="number" 
                                    name="attendees"
                                    min="1"
                                    max={facility.capacity}
                                    value={formData.attendees}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" 
                                    placeholder="0"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Maks. {facility.capacity} orang</p>
                        </div>
                    </div>
                </div>

                {/* Time & Date */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Waktu Pelaksanaan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                            <input 
                                required
                                type="date" 
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
                            <input 
                                required
                                type="time" 
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" 
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
                            <input 
                                required
                                type="time" 
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" 
                            />
                        </div>
                    </div>
                </div>

                {/* Document Upload (Mock) */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Dokumen Pendukung</h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mb-2 text-slate-400" />
                        <span className="text-sm font-medium">Klik untuk unggah Surat Pengantar (PDF)</span>
                        <span className="text-xs mt-1">Maksimal 2MB</span>
                        <input type="file" className="hidden" accept=".pdf" />
                    </div>
                </div>

                <div className="pt-6 border-t mt-6 flex justify-end">
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="mr-3 px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 rounded-lg bg-ipb-accent text-ipb-dark font-bold hover:bg-yellow-500 transition-colors shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Memproses...' : 'Kirim Pengajuan'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};