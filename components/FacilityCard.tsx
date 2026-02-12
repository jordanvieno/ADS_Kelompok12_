import React from 'react';
import { Facility } from '../types';
import { MapPin, Users, CheckCircle, ArrowRight } from 'lucide-react';

interface FacilityCardProps {
  facility: Facility;
  onBook: (facility: Facility) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onBook }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10"></div>
        <img 
            src={facility.imageUrl} 
            alt={facility.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-20">
             <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-ipb-blue shadow-lg tracking-wide uppercase border border-blue-50">
                {facility.type}
            </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-ipb-blue transition-colors">{facility.name}</h3>
        
        <div className="flex items-center text-slate-600 text-sm mb-4 font-medium">
            <MapPin className="h-4 w-4 mr-1.5 text-ipb-accent flex-shrink-0" />
            <span className="truncate">{facility.location}</span>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed font-normal">{facility.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
            {facility.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="inline-flex items-center text-xs bg-slate-50 text-slate-700 font-medium px-2.5 py-1.5 rounded-md border border-slate-200">
                    {feature}
                </span>
            ))}
            {facility.features.length > 3 && (
                <span className="text-xs text-slate-500 font-medium flex items-center px-2 bg-slate-50 rounded-md border border-slate-200">+{facility.features.length - 3}</span>
            )}
        </div>

        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center text-slate-700 font-bold">
                <Users className="h-4 w-4 mr-2 text-slate-400" />
                {facility.capacity}
                <span className="text-xs text-slate-500 ml-1 font-semibold uppercase">Orang</span>
            </div>
            
            <button 
                onClick={() => onBook(facility)}
                className="flex items-center gap-2 text-ipb-blue font-bold text-sm hover:gap-3 transition-all"
            >
                Ajukan
                <div className="bg-blue-50 border border-blue-100 p-1 rounded-full group-hover:bg-ipb-blue group-hover:text-white transition-colors">
                    <ArrowRight className="h-3.5 w-3.5" />
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};