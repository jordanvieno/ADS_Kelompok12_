// Domain Entities

export enum FacilityType {
  AUDITORIUM = 'Auditorium',
  CLASSROOM = 'Ruang Kelas',
  FIELD = 'Lapangan',
  LABORATORY = 'Laboratorium',
  MEETING_ROOM = 'Ruang Rapat'
}

export enum BookingStatus {
  PENDING = 'Menunggu Persetujuan',
  APPROVED = 'Disetujui',
  REJECTED = 'Ditolak',
  COMPLETED = 'Selesai'
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  capacity: number;
  location: string; // e.g., "Kampus Dramaga", "Kampus Baranangsiang"
  description: string;
  imageUrl: string;
  features: string[]; // e.g., ["Projector", "AC", "Sound System"]
}

export interface User {
  id: string;
  name: string;
  nim?: string; // Optional for admin/staff
  role: 'student' | 'staff' | 'admin';
  email: string;
  // Password is deliberately excluded from the interface used in the frontend UI for security
}

export interface Booking {
  id: string;
  facilityId: string;
  userId: string;
  userName?: string; // Added to track who booked it in Admin view
  eventName: string;
  eventDescription: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  status: BookingStatus;
  attendees: number;
  documentUrl?: string; // Mocked document path
  createdAt: string;
  
  // New fields for Queue Transparency
  queuePosition?: number;
  estimatedConfirmationDate?: string;
}

// Service Response Types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AISearchResult {
  recommendedFacilityIds: string[];
  reasoning: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}