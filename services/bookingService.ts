
import { Booking, BookingStatus, ServiceResponse, BookingRequestDTO } from '../types';
import { AuthService } from './authService';

// In-memory store
let bookingsStore: Booking[] = [
  {
    id: 'mock-q1',
    facilityId: 'f1',
    userId: 'other-user-1',
    userName: 'BEM KM IPB',
    eventName: 'Seminar BEM',
    eventDescription: '..',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 90000000).toISOString(),
    status: BookingStatus.PENDING,
    attendees: 100,
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    queuePosition: 1,
    estimatedConfirmationDate: new Date(Date.now() + 1800000).toISOString()
  },
  {
    id: 'mock-q2',
    facilityId: 'f2',
    userId: 'other-user-2',
    userName: 'HIMPRO Agronomi',
    eventName: 'Rapat Himpunan',
    eventDescription: '..',
    startTime: new Date(Date.now() + 186400000).toISOString(),
    endTime: new Date(Date.now() + 190000000).toISOString(),
    status: BookingStatus.PENDING,
    attendees: 50,
    createdAt: new Date(Date.now() - 5000000).toISOString(),
    queuePosition: 2,
    estimatedConfirmationDate: new Date(Date.now() + 3600000).toISOString()
  }
];

// Helper to convert File to Base64 (Simulating Cloud Upload)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- DOMAIN LAYER ---
// Encapsulates business rules, validation, and transformations
class BookingDomain {
  
  static validateRequest(dto: BookingRequestDTO): { valid: boolean; error?: string; parsedData?: any } {
    const attendees = parseInt(dto.attendees.toString(), 10);
    
    if (isNaN(attendees) || attendees <= 0) {
      return { valid: false, error: "Jumlah peserta tidak valid." };
    }

    const startDateTime = new Date(`${dto.date}T${dto.startTime}:00`);
    const endDateTime = new Date(`${dto.date}T${dto.endTime}:00`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        return { valid: false, error: "Format tanggal atau waktu salah." };
    }

    if (startDateTime >= endDateTime) {
      return { valid: false, error: "Waktu selesai harus setelah waktu mulai." };
    }

    if (startDateTime < new Date()) {
        return { valid: false, error: "Tidak dapat meminjam untuk waktu yang sudah lewat." };
    }

    // Optional: Validate Document Presence
    // if (!dto.documentFile) {
    //    return { valid: false, error: "Wajib mengunggah Surat Pengantar." };
    // }

    return { 
        valid: true, 
        parsedData: { 
            startDateTime: startDateTime.toISOString(), 
            endDateTime: endDateTime.toISOString(),
            attendees
        } 
    };
  }

  static checkConflicts(facilityId: string, start: string, end: string, existingBookings: Booking[]): boolean {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return existingBookings.some(b => 
      b.facilityId === facilityId &&
      b.status !== BookingStatus.REJECTED &&
      b.status !== BookingStatus.COMPLETED &&
      (
        (startDate >= new Date(b.startTime) && startDate < new Date(b.endTime)) ||
        (endDate > new Date(b.startTime) && endDate <= new Date(b.endTime))
      )
    );
  }

  static calculateQueueStatus(booking: Booking, allPending: Booking[]): Booking {
    if (booking.status !== BookingStatus.PENDING) return booking;

    const position = allPending.findIndex(pb => pb.id === booking.id) + 1;
    // Business Rule: Estimation is 30 mins per item in queue
    const processingTimePerItem = 30 * 60 * 1000; 
    const estimatedTime = new Date(Date.now() + (position * processingTimePerItem));
    
    return {
        ...booking,
        queuePosition: position,
        estimatedConfirmationDate: estimatedTime.toISOString()
    };
  }
}

// --- SERVICE LAYER ---
// Coordinates data persistence and calls Domain Logic
export class BookingService {
  
  static async createBooking(dto: BookingRequestDTO): Promise<ServiceResponse<Booking>> {
    // 1. Delegate Validation to Domain
    const validation = BookingDomain.validateRequest(dto);
    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    const { startDateTime, endDateTime, attendees } = validation.parsedData;

    // 2. Delegate Conflict Check to Domain
    const hasConflict = BookingDomain.checkConflicts(dto.facilityId, startDateTime, endDateTime, bookingsStore);
    if (hasConflict) {
      return { success: false, error: "Fasilitas sudah dipesan pada jam tersebut." };
    }

    // 3. Process File Upload (Simulation)
    let documentUrl = undefined;
    if (dto.documentFile) {
        try {
            documentUrl = await fileToBase64(dto.documentFile);
        } catch (e) {
            console.error("File upload failed", e);
            return { success: false, error: "Gagal mengunggah dokumen." };
        }
    }

    // 4. Data Retrieval (Infrastructure concern)
    const user = AuthService.getUserById(dto.userId);

    // 5. Object Construction
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      facilityId: dto.facilityId,
      userId: dto.userId,
      userName: user ? user.name : 'Unknown',
      eventName: dto.eventName,
      eventDescription: dto.eventDescription,
      startTime: startDateTime,
      endTime: endDateTime,
      attendees: attendees,
      status: BookingStatus.PENDING,
      documentUrl: documentUrl, // Store the uploaded file URL
      createdAt: new Date().toISOString(),
      queuePosition: 0, 
      estimatedConfirmationDate: new Date().toISOString()
    };

    bookingsStore.push(newBooking);
    
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate DB/Upload latency

    return { success: true, data: newBooking };
  }

  static async getUserBookings(userId: string): Promise<ServiceResponse<Booking[]>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const pendingBookings = bookingsStore
        .filter(b => b.status === BookingStatus.PENDING)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Use Domain Logic to enrich data
    const userBookings = bookingsStore
        .filter(b => b.userId === userId)
        .map(booking => BookingDomain.calculateQueueStatus(booking, pendingBookings))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { success: true, data: userBookings };
  }

  static async getAllBookings(): Promise<ServiceResponse<Booking[]>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const allBookings = bookingsStore.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { success: true, data: allBookings };
  }

  static async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<ServiceResponse<Booking>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = bookingsStore.findIndex(b => b.id === bookingId);
    
    if (index === -1) {
        return { success: false, error: "Booking tidak ditemukan" };
    }

    bookingsStore[index] = { ...bookingsStore[index], status };
    return { success: true, data: bookingsStore[index] };
  }
}