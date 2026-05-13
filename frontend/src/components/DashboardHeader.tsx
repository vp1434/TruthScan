import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, LogOut, Settings, User, ChevronDown, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardHeader: React.FC<{ toggleSidebar?: () => void }> = ({ toggleSidebar }) => {
  const { user, logout }       = useAuth();
  const navigate               = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const dropRef  = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/auth'); };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const notifications = [
    { id: 1, title: 'Analysis complete',    desc: 'BBC article scored 94% credibility', time: '2m ago', dot: 'bg-green-500' },
    { id: 2, title: 'New source added',     desc: 'Reuters added to trusted sources',   time: '1h ago', dot: 'bg-blue-500'  },
    { id: 3, title: 'Weekly report ready',  desc: 'Your weekly digest is available',    time: '3h ago', dot: 'bg-purple-500'},
  ];

  return (
    <header className="h-16 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between px-6 md:px-8 bg-white/95 dark:bg-[#070d1c]/95 backdrop-blur-md sticky top-0 z-20 transition-colors duration-300">

      {/* Left: hamburger (mobile only) */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors lg:hidden p-1.5 rounded-lg hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-1 max-w-sm mx-4 md:mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 border border-slate-200 dark:border-white/[0.07] rounded-xl bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-gray-300 placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-white/[0.06] text-sm transition-all"
            placeholder="Search anything…"
          />
          <AnimatePresence>
            {searchVal && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchVal('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* ── Notifications ── */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setDropOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#070d1c] animate-pulse" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.05]">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
                  <span className="text-[10px] text-blue-400 font-medium bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
                    {notifications.length} new
                  </span>
                </div>
                <div className="divide-y divide-white/[0.04] max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <button key={n.id} className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors text-left">
                      <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.dot}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-gray-500 mt-0.5 truncate">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 dark:text-gray-700 mt-1">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/[0.05] px-4 py-3">
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 w-full text-center transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── User Dropdown ── */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => { setDropOpen(!dropOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all group"
          >
            {/* Avatar */}
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-[0_0_10px_rgba(99,102,241,0.3)] shrink-0">
              {initials}
            </div>
            {/* Name */}
            <div className="hidden md:block text-left min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                {user?.name || 'Guest'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-gray-600 truncate max-w-[120px]">
                {user?.email || 'Not signed in'}
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 bg-[#0d1628] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Guest'}</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-500 truncate">{user?.email || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  <Link
                    to="/settings"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <User className="w-3.5 h-3.5" /> My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Settings className="w-3.5 h-3.5" /> Settings
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-white/[0.05] py-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
