import { Facility, ServiceResponse } from '../types';
import { FACILITIES as INITIAL_DATA } from './mockData';

// In-memory store for facilities (initialized with mock data)
let facilitiesStore: Facility[] = [...INITIAL_DATA];

export class FacilityService {
  static async getAllFacilities(): Promise<ServiceResponse<Facility[]>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: facilitiesStore };
  }

  static getFacilityById(id: string): Facility | undefined {
    return facilitiesStore.find(f => f.id === id);
  }

  static async updateFacility(id: string, updatedData: Partial<Facility>): Promise<ServiceResponse<Facility>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = facilitiesStore.findIndex(f => f.id === id);
    if (index === -1) {
        return { success: false, error: "Fasilitas tidak ditemukan" };
    }

    facilitiesStore[index] = { ...facilitiesStore[index], ...updatedData };
    return { success: true, data: facilitiesStore[index] };
  }
}