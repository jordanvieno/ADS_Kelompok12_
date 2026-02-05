import React, { useEffect, useState } from 'react';
import { BookingService } from '../services/bookingService';
import { FacilityService } from '../services/facilityService';
import { Booking, BookingStatus, Facility } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, FileText, MapPin, Edit, Users, Search, Loader2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'facilities'>('bookings');
  
  // Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    if (activeTab === 'bookings') {
        const res = await BookingService.getAllBookings();
        if (res.data) setBookings(res.data);
    } else {
        const res = await FacilityService.getAllFacilities();
        if (res.data) setFacilities(res.data);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (bookingId: string, status: BookingStatus) => {
    const res = await BookingService.updateBookingStatus(bookingId, status);
    if (res.success) {
        // Refresh data locally
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    }
  };

  const handleEditFacility = (facilityId: string) => {
    navigate(`/admin/facility/edit/${facilityId}`);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch(status) {
        case BookingStatus.APPROVED: return "bg-green-100 text-green-700 border-green-200";
        case BookingStatus.REJECTED: return "bg-red-100 text-red-700 border-red-200";
        case BookingStatus.PENDING: return "bg-yellow-50 text-yellow-700 border-yellow-200";
        default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Administrator</h1>
            <p className="text-slate-600">Kelola pengajuan peminjaman dan data fasilitas.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex">
            <button 
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'bookings' ? 'bg-ipb-blue text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Persetujuan Peminjaman
            </button>
            <button 
                onClick={() => setActiveTab('facilities')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'facilities' ? 'bg-ipb-blue text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Manajemen Aset
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-ipb-blue" />
        </div>
      ) : (
        <>
            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
                <div className="space-y-4">
                    {bookings.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">Belum ada data peminjaman.</div>
                    ) : (
                        bookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                                <div className={`w-full md:w-2 ${
                                    booking.status === BookingStatus.PENDING ? 'bg-yellow-400' :
                                    booking.status === BookingStatus.APPROVED ? 'bg-green-500' :
                                    booking.status === BookingStatus.REJECTED ? 'bg-red-500' : 'bg-slate-300'
                                }`}></div>
                                
                                <div className="p-6 flex-1">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs px-2 py-1 rounded border font-medium ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-xs text-slate-400">#{booking.id}</span>
                                                <span className="text-xs text-slate-500 font-medium flex items-center bg-slate-100 px-2 py-0.5 rounded-full">
                                                    <Users className="h-3 w-3 mr-1" /> {booking.userName}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">{booking.eventName}</h3>
                                            <p className="text-sm text-slate-600 mt-1 line-clamp-1">{booking.eventDescription}</p>
                                            
                                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1.5" />
                                                    {new Date(booking.startTime).toLocaleDateString()} {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1.5" />
                                                    {FacilityService.getFacilityById(booking.facilityId)?.name || booking.facilityId}
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1.5" />
                                                    {booking.attendees} Orang
                                                </div>
                                            </div>
                                        </div>

                                        {booking.status === BookingStatus.PENDING && (
                                            <div className="flex items-center gap-2 self-start md:self-center">
                                                <button 
                                                    onClick={() => handleStatusUpdate(booking.id, BookingStatus.REJECTED)}
                                                    className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                                                >
                                                    Tolak
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(booking.id, BookingStatus.APPROVED)}
                                                    className="px-4 py-2 rounded-lg bg-ipb-blue text-white hover:bg-ipb-dark text-sm font-medium transition-colors shadow-sm"
                                                >
                                                    Setujui
                                                </button>
                                            </div>
                                        )}
                                        {booking.status !== BookingStatus.PENDING && (
                                            <div className="self-center text-sm font-medium text-slate-400 italic">
                                                Selesai diproses
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* FACILITIES TAB */}
            {activeTab === 'facilities' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {facilities.map(facility => (
                        <div key={facility.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="h-40 overflow-hidden relative">
                                <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-700">
                                    {facility.type}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-slate-800 mb-1">{facility.name}</h3>
                                <div className="text-sm text-slate-500 mb-3 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" /> {facility.location}
                                </div>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{facility.description}</p>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700">{facility.capacity} Kapasitas</span>
                                    <button 
                                        onClick={() => handleEditFacility(facility.id)}
                                        className="flex items-center gap-1.5 text-ipb-blue hover:text-ipb-dark font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <Edit className="h-4 w-4" /> Ubah Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
      )}
    </div>
  );
};