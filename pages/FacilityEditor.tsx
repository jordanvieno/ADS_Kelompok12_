import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FacilityService } from '../services/facilityService';
import { Facility, FacilityType } from '../types';
import { useAuth } from '../context/AuthContext';
import { Save, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

export const FacilityEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<Partial<Facility>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    if (id) {
        const data = FacilityService.getFacilityById(id);
        if (data) {
            setFormData(data);
        } else {
            setError("Fasilitas tidak ditemukan.");
        }
    }
    setLoading(false);
  }, [id, isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     // Simple feature list string parsing for demo
     const features = e.target.value.split(',').map(f => f.trim()).filter(f => f !== '');
     setFormData(prev => ({...prev, features}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setSaving(true);
    const res = await FacilityService.updateFacility(id, formData);
    setSaving(false);

    if (res.success) {
        navigate('/admin/dashboard');
    } else {
        setError(res.error || "Gagal menyimpan perubahan");
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/admin/dashboard')} className="mb-6 flex items-center text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 p-6 text-white">
            <h1 className="text-xl font-bold">Edit Fasilitas</h1>
            <p className="text-slate-400 text-sm">Mengubah informasi: {formData.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Fasilitas</label>
                    <input 
                        type="text" name="name" value={formData.name || ''} onChange={handleChange}
                        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
                    <select 
                        name="type" value={formData.type} onChange={handleChange}
                        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue"
                    >
                        {Object.values(FacilityType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kapasitas (Orang)</label>
                    <input 
                        type="number" name="capacity" value={formData.capacity || 0} onChange={handleChange}
                        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" required
                    />
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                    <input 
                        type="text" name="location" value={formData.location || ''} onChange={handleChange}
                        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                    <textarea 
                        name="description" rows={4} value={formData.description || ''} onChange={handleChange}
                        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue" required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">URL Gambar</label>
                    <input 
                        type="text" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange}
                        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue"
                    />
                    <p className="text-xs text-slate-500 mt-1">Masukkan URL gambar yang valid.</p>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fasilitas (pisahkan dengan koma)</label>
                    <input 
                        type="text" 
                        defaultValue={formData.features?.join(', ')} 
                        onBlur={handleFeatureChange}
                        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-ipb-blue focus:border-ipb-blue"
                    />
                </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
                <button 
                    type="submit" disabled={saving}
                    className="flex items-center bg-ipb-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-ipb-dark transition-colors disabled:opacity-70"
                >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : <Save className="h-5 w-5 mr-2" />}
                    Simpan Perubahan
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};