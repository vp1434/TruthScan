import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, History, Bookmark, BarChart3, Radio, Settings, HelpCircle, Moon, Sun, Crown, LogOut } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze News', path: '/', icon: Shield },
  { name: 'History', path: '/history', icon: History },
  { name: 'Saved Articles', path: '/saved', icon: Bookmark },
  { name: 'Statistics', path: '/statistics', icon: BarChart3 },
  { name: 'Sources', path: '/sources', icon: Radio },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Help & Support', path: '/help', icon: HelpCircle },
];

const Sidebar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="w-64 flex-shrink-0 bg-[#0B1120] border-r border-white/[0.06] h-screen sticky top-0 flex flex-col pt-6 pb-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center relative shadow-[0_0_12px_rgba(59,130,246,0.4)]">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white block leading-tight">TruthScan</span>
          <span className="text-[10px] text-gray-400 block">Fake News Detector</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade Card */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="bg-[#111827] rounded-2xl p-4 border border-white/5 mb-4 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none"></div>
          <Crown className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
          <h4 className="text-white font-bold text-xs mb-1">Upgrade to Pro</h4>
          <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">Get advanced insights, priority support and more.</p>
          <button className="w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors">
            Upgrade Now
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            <span className="text-xs">Dark Mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-blue-600' : 'bg-white/10'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${darkMode ? 'right-0.5' : 'left-0.5'}`}></div>
          </button>
        </div>

        {/* User + Logout */}
        {user && (
          <div className="mt-2 flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} title="Sign Out" className="text-gray-500 hover:text-red-400 transition-colors ml-2">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
