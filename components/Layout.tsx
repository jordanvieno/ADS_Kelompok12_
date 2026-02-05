import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Calendar, Menu, X, University, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Don't show layout elements on login/register pages for cleaner look
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
      return <>{children}</>;
  }

  const isActive = (path: string) => location.pathname === path ? "text-ipb-accent font-semibold" : "text-white hover:text-ipb-accent transition-colors";

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-ipb-blue shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-white p-1.5 rounded-full">
                    <University className="h-6 w-6 text-ipb-blue" />
                </div>
                <div className="hidden md:block">
                    <span className="text-white font-bold text-lg tracking-wide block leading-none">SIPINJAMPAS</span>
                    <span className="text-blue-200 text-xs font-light block leading-none">IPB University</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={isActive('/')}>Beranda</Link>
              <Link to="/facilities" className={isActive('/facilities')}>Daftar Fasilitas</Link>
              
              {isAuthenticated && user?.role === 'admin' ? (
                 <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>
                    Admin Dashboard
                 </Link>
              ) : isAuthenticated ? (
                 <Link to="/my-bookings" className={isActive('/my-bookings')}>
                    Peminjaman Saya
                 </Link>
              ) : null}
              
              <div className="ml-4 border-l border-blue-800 pl-4 flex items-center gap-4">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <span className="block text-white text-sm font-medium">{user?.name}</span>
                            <span className="block text-blue-200 text-xs uppercase">{user?.role}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-ipb-accent flex items-center justify-center text-ipb-dark font-bold cursor-default">
                             {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="text-white hover:text-red-300 transition-colors"
                            title="Keluar"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-white hover:text-white/80 text-sm font-medium">Masuk</Link>
                        <Link to="/register" className="bg-white text-ipb-blue px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">Daftar</Link>
                    </div>
                  )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-ipb-dark">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-ipb-blue">Beranda</Link>
              <Link to="/facilities" onClick={() => setIsMenuOpen(false)} className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-ipb-blue">Daftar Fasilitas</Link>
              
              {isAuthenticated && user?.role === 'admin' ? (
                <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-ipb-blue">
                    Admin Dashboard
                </Link>
              ) : isAuthenticated ? (
                <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)} className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-ipb-blue">
                    Peminjaman Saya
                </Link>
              ) : null}

              {!isAuthenticated && (
                 <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-ipb-blue">Masuk</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-ipb-accent block px-3 py-2 rounded-md text-base font-medium hover:bg-ipb-blue">Daftar Akun</Link>
                 </>
              )}
               {isAuthenticated && (
                  <button onClick={handleLogout} className="text-red-300 w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-ipb-blue">
                      Keluar
                  </button>
               )}
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-grow bg-slate-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h3 className="text-lg font-bold mb-4">Direktorat Umum & Sarana Prasarana</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Gedung Andi Hakim Nasoetion, Lt. 1<br/>
                    Kampus IPB Dramaga, Bogor 16680<br/>
                    Jawa Barat, Indonesia
                </p>
            </div>
            <div>
                <h3 className="text-lg font-bold mb-4">Tautan Cepat</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-white">Prosedur Peminjaman</a></li>
                    <li><a href="#" className="hover:text-white">Jadwal Gedung</a></li>
                    <li><a href="#" className="hover:text-white">Layanan Pengaduan</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-bold mb-4">Hubungi Kami</h3>
                <p className="text-slate-400 text-sm">Email: sarpras@apps.ipb.ac.id</p>
                <p className="text-slate-400 text-sm">Telp: +62 251 8622642</p>
            </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} IPB University. All rights reserved.
        </div>
      </footer>
    </div>
  );
};