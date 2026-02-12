import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { FacilityService } from '../services/facilityService';
import { FacilityCard } from '../components/FacilityCard';
import { Facility, FacilityType } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

export const FacilityList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [displayedFacilities, setDisplayedFacilities] = useState<Facility[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadFacilities = async () => {
        const res = await FacilityService.getAllFacilities();
        if (res.data) {
            setFacilities(res.data);
            const state = location.state as { searchQuery?: string };
            if (state?.searchQuery) {
                setSearch(state.searchQuery);
                window.history.replaceState({}, document.title);
            } else {
                setDisplayedFacilities(res.data);
            }
        }
    };
    loadFacilities();
  }, []); 

  useEffect(() => {
    let result = facilities;

    if (filterType !== 'All') {
        result = result.filter(f => f.type === filterType);
    }

    if (search.trim()) {
        const lowerQuery = search.toLowerCase();
        result = result.filter(f => 
            f.name.toLowerCase().includes(lowerQuery) || 
            f.location.toLowerCase().includes(lowerQuery) ||
            f.description.toLowerCase().includes(lowerQuery) ||
            f.features.some(feat => feat.toLowerCase().includes(lowerQuery))
        );
    }

    setDisplayedFacilities(result);
  }, [search, filterType, facilities]);

  const handleBooking = (facility: Facility) => {
    navigate('/book', { state: { facility } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Eksplorasi Fasilitas</h1>
            <p className="text-slate-600 font-medium">Temukan ruangan yang sempurna untuk kebutuhan kegiatan Anda.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-200 mb-10 sticky top-24 z-30 transition-shadow">
        <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative group">
                <input 
                    type="text" 
                    placeholder="Cari nama gedung, lokasi..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-ipb-blue/10 focus:border-ipb-blue transition-all font-semibold text-slate-800 placeholder-slate-400 shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-ipb-blue transition-colors" />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 px-2 no-scrollbar border-l border-slate-200 pl-4">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 hidden md:block">Filter:</span>
                 {['All', ...Object.values(FacilityType)].map(type => (
                     <button 
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
                            filterType === type 
                            ? 'bg-ipb-blue text-white border-ipb-blue shadow-md' 
                            : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                     >
                        {type === 'All' ? 'Semua Tipe' : type}
                     </button>
                 ))}
            </div>
        </div>
      </div>

      {/* Grid */}
      {displayedFacilities.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
              <div className="bg-white rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                  <Search className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Fasilitas tidak ditemukan</h3>
              <p className="text-slate-600 font-medium max-w-xs mx-auto">Kami tidak dapat menemukan fasilitas dengan kata kunci tersebut. Silakan coba kata kunci lain.</p>
              <button onClick={() => {setSearch(''); setFilterType('All')}} className="mt-6 text-ipb-blue font-bold hover:underline">Reset Pencarian</button>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedFacilities.map((facility, idx) => (
                <div key={facility.id} className="animate-fade-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
                    <FacilityCard facility={facility} onBook={handleBooking} />
                </div>
            ))}
        </div>
      )}
    </div>
  );
};