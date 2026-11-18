import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, Briefcase, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar } from './ui.jsx';

const NAV_LINKS = [
  { to: '/opportunities', label: 'Browse Jobs' },
  { to: '/resources', label: 'Resources' },
];

const ROLE_DASHBOARD = {
  student: '/student/dashboard', graduate: '/student/dashboard', job_seeker: '/student/dashboard',
  employer: '/employer/dashboard', admin: '/admin/dashboard', super_admin: '/admin/dashboard',
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <nav className="bg-primary text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Briefcase size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">CareerBridge</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-white/80 hover:text-white'}`}>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={ROLE_DASHBOARD[user.role]} className="text-sm text-white/80 hover:text-white flex items-center gap-1.5">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1.5 transition-colors">
                    <Avatar src={user.profilePhoto} name={user.fullName} size="sm" />
                    <span className="text-sm font-medium max-w-[120px] truncate">{user.fullName}</span>
                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-border py-1 animate-slide-up">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-semibold text-text truncate">{user.fullName}</p>
                        <p className="text-xs text-text-light capitalize">{user.role.replace('_', ' ')}</p>
                      </div>
                      <Link to={ROLE_DASHBOARD[user.role]} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      {['student', 'graduate', 'job_seeker'].includes(user.role) && (
                        <Link to="/student/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background">
                          <User size={15} /> My Profile
                        </Link>
                      )}
                      <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background">
                        <Settings size={15} /> Settings
                      </Link>
                      <div className="border-t border-border mt-1">
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-background w-full">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white px-3 py-1.5">Sign In</Link>
                <Link to="/register" className="text-sm font-semibold bg-accent hover:bg-teal-500 text-white px-4 py-2 rounded-lg transition-colors">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/10">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 px-4 py-4 space-y-2">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-white text-sm font-medium">{l.label}</Link>
          ))}
          <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to={ROLE_DASHBOARD[user.role]} onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-white text-sm">Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-error text-sm w-full text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-white text-sm">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 bg-accent text-white text-sm font-semibold rounded-lg px-4 text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
