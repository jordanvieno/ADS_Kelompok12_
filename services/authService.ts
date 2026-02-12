import { User, ServiceResponse } from '../types';

// Internal interface for storage including the hashed password
interface StoredUser extends User {
  passwordHash: string; 
}

// Initial Mock Users
const usersStore: StoredUser[] = [
  {
    id: 'admin-1',
    name: 'Administrator Sarpras',
    email: 'admin@ipb.ac.id',
    role: 'admin',
    passwordHash: 'cGFzc3dvcmQxMjM=' // simple base64 of "password123" for demo purposes
  },
  {
    id: 'user-mock-1',
    name: 'Mahasiswa Teladan',
    email: 'mahasiswa@apps.ipb.ac.id',
    role: 'student',
    nim: 'G64190001',
    passwordHash: 'dXNlcjEyMw==' // "user123"
  }
];

export class AuthService {
  
  // Helper to simulate hashing. In production, use bcrypt on backend.
  // Here we simulate it so "plain text" password is never stored in our "database" variable.
  private static async hashPassword(password: string): Promise<string> {
    // Using a simple encoding for frontend demo to represent hashing concept
    // In real app: await crypto.subtle.digest(...)
    return btoa(password); 
  }

  static async login(email: string, password: string): Promise<ServiceResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const inputHash = await this.hashPassword(password);
    const foundUser = usersStore.find(u => u.email === email && u.passwordHash === inputHash);

    if (foundUser) {
      // Return User object WITHOUT passwordHash to frontend
      const { passwordHash, ...safeUser } = foundUser;
      return { success: true, data: safeUser };
    }

    return { success: false, error: "Email atau kata sandi salah." };
  }

  static async register(name: string, email: string, password: string, role: 'student' | 'staff', nim?: string): Promise<ServiceResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (usersStore.some(u => u.email === email)) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const passwordHash = await this.hashPassword(password);

    const newUser: StoredUser = {
      id: newId,
      name,
      email,
      role,
      nim,
      passwordHash
    };

    usersStore.push(newUser);

    // Return safe user
    const { passwordHash: _, ...safeUser } = newUser;
    return { success: true, data: safeUser };
  }

  static async updateProfile(id: string, updates: Partial<User>): Promise<ServiceResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const index = usersStore.findIndex(u => u.id === id);
    if (index === -1) {
        return { success: false, error: "Pengguna tidak ditemukan." };
    }

    // Check if email is being changed and if it already exists elsewhere
    if (updates.email && updates.email !== usersStore[index].email) {
        if (usersStore.some(u => u.email === updates.email && u.id !== id)) {
            return { success: false, error: "Email sudah digunakan oleh pengguna lain." };
        }
    }

    // Update user in store (preserve passwordHash)
    usersStore[index] = { ...usersStore[index], ...updates };

    const { passwordHash, ...safeUser } = usersStore[index];
    return { success: true, data: safeUser };
  }

  static getUserById(id: string): User | undefined {
    const u = usersStore.find(u => u.id === id);
    if (!u) return undefined;
    const { passwordHash, ...safeUser } = u;
    return safeUser;
  }
}