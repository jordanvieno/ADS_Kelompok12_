import { Booking, BookingStatus, ServiceResponse } from '../types';
import { AuthService } from './authService';

// In-memory store with some initial dummy data to simulate an existing queue
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

export class BookingService {
  
  static async createBooking(bookingRequest: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<ServiceResponse<Booking>> {
    // Domain Logic Simulation
    
    // 1. Validation
    const start = new Date(bookingRequest.startTime);
    const end = new Date(bookingRequest.endTime);

    if (start >= end) {
      return { success: false, error: "Waktu selesai harus setelah waktu mulai." };
    }

    if (start < new Date()) {
        return { success: false, error: "Tidak dapat meminjam untuk waktu yang sudah lewat." };
    }

    // 2. Conflict Check
    const hasConflict = bookingsStore.some(b => 
      b.facilityId === bookingRequest.facilityId &&
      b.status !== BookingStatus.REJECTED &&
      b.status !== BookingStatus.COMPLETED &&
      (
        (start >= new Date(b.startTime) && start < new Date(b.endTime)) ||
        (end > new Date(b.startTime) && end <= new Date(b.endTime))
      )
    );

    if (hasConflict) {
      return { success: false, error: "Fasilitas sudah dipesan pada jam tersebut." };
    }

    // Get User Details for the record
    const user = AuthService.getUserById(bookingRequest.userId);

    // 3. Creation
    const newBooking: Booking = {
      ...bookingRequest,
      id: Math.random().toString(36).substr(2, 9),
      status: BookingStatus.PENDING,
      userName: user ? user.name : 'Unknown',
      createdAt: new Date().toISOString(),
      // Initial placeholders, will be calculated dynamically in getUserBookings
      queuePosition: 0, 
      estimatedConfirmationDate: new Date().toISOString()
    };

    bookingsStore.push(newBooking);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    return { success: true, data: newBooking };
  }

  static async getUserBookings(userId: string): Promise<ServiceResponse<Booking[]>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 1. Calculate global queue for PENDING items (FIFO)
    const pendingBookings = bookingsStore
        .filter(b => b.status === BookingStatus.PENDING)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // 2. Map user bookings and inject dynamic queue status
    const userBookings = bookingsStore
        .filter(b => b.userId === userId)
        .map(booking => {
            if (booking.status === BookingStatus.PENDING) {
                const position = pendingBookings.findIndex(pb => pb.id === booking.id) + 1;
                const processingTimePerItem = 30 * 60 * 1000; 
                const estimatedTime = new Date(Date.now() + (position * processingTimePerItem));
                
                return {
                    ...booking,
                    queuePosition: position,
                    estimatedConfirmationDate: estimatedTime.toISOString()
                };
            }
            return booking;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { success: true, data: userBookings };
  }

  // Method for Admins to see all bookings
  static async getAllBookings(): Promise<ServiceResponse<Booking[]>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const allBookings = bookingsStore.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { success: true, data: allBookings };
  }

  // NEW: Update Booking Status
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