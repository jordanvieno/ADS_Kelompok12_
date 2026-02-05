import React from 'react';
import { Facility } from '../types';
import { MapPin, Users, CheckCircle } from 'lucide-react';

interface FacilityCardProps {
  facility: Facility;
  onBook: (facility: Facility) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden group">
        <img 
            src={facility.imageUrl} 
            alt={facility.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-ipb-blue shadow-sm">
            {facility.type}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{facility.name}</h3>
        <div className="flex items-center text-slate-500 text-sm mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {facility.location}
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{facility.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
            {facility.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="inline-flex items-center text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-200">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    {feature}
                </span>
            ))}
            {facility.features.length > 3 && (
                <span className="text-xs text-slate-400 flex items-center px-1">+{facility.features.length - 3}</span>
            )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center text-slate-700 font-medium">
                <Users className="h-4 w-4 mr-1.5 text-ipb-accent" />
                {facility.capacity} <span className="text-xs text-slate-400 ml-1 font-normal">Kapasitas</span>
            </div>
            <button 
                onClick={() => onBook(facility)}
                className="bg-ipb-blue hover:bg-ipb-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
                Ajukan Pinjam
            </button>
        </div>
      </div>
    </div>
  );
};