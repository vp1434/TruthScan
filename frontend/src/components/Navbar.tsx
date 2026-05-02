import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu, Home, History, LayoutDashboard, Info, Mail, X, LogOut, User } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/history', label: 'History', icon: History, exact: false },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: false },
  { to: '/about', label: 'About', icon: Info, exact: false },
  { to: '/contact', label: 'Contact', icon: Mail, exact: false },
];

const Navbar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.4)]">
              <svg className="text-white w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-tight">TruthScan</span>
              <span className="text-[10px] text-gray-400 block leading-none">Fake News Detector</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map(({ to, label, icon: Icon, exact }) => {
              const active = isActive(to, exact);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/25 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center bg-white/5 rounded-full px-3 py-1.5 border border-white/10 gap-2">
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm text-white focus:outline-none w-24 placeholder-gray-600" />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center bg-black/30 rounded-full p-1 border border-white/10 gap-1"
              title="Toggle Dark Mode"
            >
              <div className={`p-1 rounded-full transition-colors ${!darkMode ? 'bg-white/15' : ''}`}>
                <Sun className={`w-3.5 h-3.5 ${!darkMode ? 'text-yellow-400' : 'text-gray-500'}`} />
              </div>
              <div className={`p-1 rounded-full transition-colors ${darkMode ? 'bg-white/15' : ''}`}>
                <Moon className={`w-3.5 h-3.5 ${darkMode ? 'text-blue-400' : 'text-gray-500'}`} />
              </div>
            </button>

            {/* Auth Buttons */}
            {user ? (
              // Logged in — show avatar + dropdown
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-gray-200 hidden md:block">{user.name.split(' ')[0]}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/settings" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                      <User className="w-4 h-4" /> Profile & Settings
                    </Link>
                    <div className="border-t border-white/5">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Logged out — show Login + Sign Up
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 mt-3 pt-3 pb-2 space-y-1">
            {navLinks.map(({ to, label, icon: Icon, exact }) => {
              const active = isActive(to, exact);
              return (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-indigo-600/15 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              );
            })}
            {!user && (
              <div className="flex gap-2 px-2 pt-2">
                <Link to="/auth" onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2 text-center text-sm border border-white/10 rounded-xl text-gray-300 hover:bg-white/5">Login</Link>
                <Link to="/auth" onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2 text-center text-sm bg-blue-600 rounded-xl text-white font-bold">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Click-away to close user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
