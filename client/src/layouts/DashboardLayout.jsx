import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, ChevronRight, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar } from '../components/ui.jsx';

export default function DashboardLayout({ children, navItems, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const notificationsPath = user?.role === 'employer'
    ? '/employer/notifications'
    : user && ['student', 'graduate', 'job_seeker'].includes(user.role)
      ? '/student/notifications'
      : '/notifications';

  const handleLogout = async () => { await logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-primary">CareerBridge</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar src={user?.profilePhoto} name={user?.fullName} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text truncate">{user?.fullName}</p>
            <p className="text-xs text-text-light capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          item.divider
            ? <div key={item.label} className="pt-3 pb-1 px-1"><p className="text-xs font-semibold text-text-light uppercase tracking-wider">{item.label}</p></div>
            : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-text-light hover:bg-background hover:text-text'
                  }`
                }
              >
                {item.icon && <item.icon size={18} />}
                <span className="flex-1">{item.label}</span>
                {item.badge && <span className="bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span>}
              </NavLink>
            )
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error hover:bg-opacity-10 w-full transition-colors">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-border shrink-0 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-xl">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 text-text-light hover:text-text">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-background text-text-light">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-text hidden sm:block">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to={notificationsPath} className="p-2 rounded-lg hover:bg-background text-text-light relative">
              <Bell size={20} />
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar src={user?.profilePhoto} name={user?.fullName} size="sm" />
              <span className="text-sm font-medium text-text hidden sm:block max-w-[120px] truncate">{user?.fullName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
