import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Loader2 } from 'lucide-react';
import { FacilityService } from '../services/facilityService';
import { getFacilityRecommendations } from '../services/geminiService';
import { FacilityCard } from '../components/FacilityCard';
import { Facility, FacilityType } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

export const FacilityList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [displayedFacilities, setDisplayedFacilities] = useState<Facility[]>([]);
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch facilities from service on load
    const loadFacilities = async () => {
        const res = await FacilityService.getAllFacilities();
        if (res.data) {
            setFacilities(res.data);
            setDisplayedFacilities(res.data);
            
            // Handle AI Query if present in navigation state
            const state = location.state as { aiQuery?: string };
            if (state?.aiQuery) {
                setSearch(state.aiQuery);
                // We need to pass the fetched data to handleAISearch or let it use state
                handleAISearch(state.aiQuery, res.data);
                window.history.replaceState({}, document.title);
            }
        }
    };
    loadFacilities();
  }, []);

  const handleBooking = (facility: Facility) => {
    navigate('/book', { state: { facility } });
  };

  const handleAISearch = async (queryText?: string, currentFacilities: Facility[] = facilities) => {
    const text = queryText || search;
    if (!text.trim()) return;

    setIsAISearching(true);
    setAiReasoning(null);
    
    // Call AI Service
    const result = await getFacilityRecommendations(text);
    
    if (result.recommendedFacilityIds.length > 0) {
      const recommended = currentFacilities.filter(f => result.recommendedFacilityIds.includes(f.id));
      setDisplayedFacilities(recommended);
      setAiReasoning(result.reasoning);
    } else {
      // Fallback to simple name search if AI fails or returns empty
      const filtered = currentFacilities.filter(f => f.name.toLowerCase().includes(text.toLowerCase()));
      setDisplayedFacilities(filtered);
      setAiReasoning("AI tidak menemukan kecocokan spesifik, menampilkan hasil pencarian standar.");
    }
    
    setIsAISearching(false);
  };

  const handleStandardFilter = (type: string) => {
    setFilterType(type);
    setAiReasoning(null);
    if (type === 'All') {
        setDisplayedFacilities(facilities);
    } else {
        setDisplayedFacilities(facilities.filter(f => f.type === type));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Daftar Fasilitas</h1>
        <p className="text-slate-600">Temukan ruangan yang tepat untuk kegiatan akademik maupun non-akademik.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 sticky top-20 z-30">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    placeholder="Cari (contoh: 'Ruangan untuk seminar 100 orang di Dramaga')"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-ipb-blue/20 focus:border-ipb-blue transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <button 
                    onClick={() => handleAISearch()}
                    disabled={isAISearching}
                    className="absolute right-2 top-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                   {isAISearching ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4" />}
                   AI Search
                </button>
            </div>
            <div className="flex overflow-x-auto gap-2 pb-1 md:pb-0 no-scrollbar">
                 <button 
                    onClick={() => handleStandardFilter('All')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterType === 'All' ? 'bg-ipb-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                 >
                    Semua
                 </button>
                 {Object.values(FacilityType).map(type => (
                     <button 
                        key={type}
                        onClick={() => handleStandardFilter(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterType === type ? 'bg-ipb-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                     >
                        {type}
                     </button>
                 ))}
            </div>
        </div>
        {aiReasoning && (
            <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-3 items-start animate-fade-in">
                <Sparkles className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Rekomendasi AI</span>
                    <p className="text-sm text-indigo-900 mt-1">{aiReasoning}</p>
                </div>
            </div>
        )}
      </div>

      {/* Grid */}
      {displayedFacilities.length === 0 ? (
          <div className="text-center py-20">
              <div className="bg-slate-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Tidak ada fasilitas ditemukan</h3>
              <p className="text-slate-500">Coba ubah kata kunci pencarian atau filter.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedFacilities.map(facility => (
                <FacilityCard key={facility.id} facility={facility} onBook={handleBooking} />
            ))}
        </div>
      )}
    </div>
  );
};