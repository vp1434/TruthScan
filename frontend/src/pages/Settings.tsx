import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Lock, Shield, Moon, Sun, Trash2, Save, Loader2,
  Eye, EyeOff, CheckCircle2, Camera, Key, ChevronRight,
  Globe, Palette, AlertTriangle, LogOut, Smartphone
} from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/* ─────────────── Reusable Toggle ─────────────── */
const Toggle = ({ value, onChange, id }: { value: boolean; onChange: () => void; id: string }) => (
  <button
    id={id}
    role="switch"
    aria-checked={value}
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      value ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.4)]' : 'bg-white/10'
    }`}
  >
    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${value ? 'right-0.5' : 'left-0.5'}`} />
  </button>
);

/* ─────────────── Section Card ─────────────── */
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#0d1628] border border-white/[0.07] rounded-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, label, color = 'text-blue-400', iconBg = 'bg-blue-500/10' }:
  { icon: React.ElementType; label: string; color?: string; iconBg?: string }) => (
  <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05]">
    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <h3 className="text-sm font-semibold text-white">{label}</h3>
  </div>
);

/* ─────────────── Tab Pills ─────────────── */
const tabs = [
  { id: 'profile',       label: 'Profile',      icon: User      },
  { id: 'appearance',   label: 'Appearance',   icon: Palette   },
  { id: 'notifications',label: 'Notifications', icon: Bell      },
  { id: 'security',     label: 'Security',      icon: Shield    },
  { id: 'danger',       label: 'Danger Zone',   icon: AlertTriangle },
] as const;
type Tab = typeof tabs[number]['id'];

/* ─────────────── Main Component ─────────────── */
const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, logout }             = useAuth();
  const navigate                     = useNavigate();

  const [activeTab, setActiveTab]           = useState<Tab>('profile');
  const [name, setName]                     = useState(user?.name || 'Aditya Kumar');
  const [email]                             = useState(user?.email || 'admin@example.com');
  const [notifications, setNotifications]   = useState(true);
  const [emailAlerts, setEmailAlerts]       = useState(false);
  const [mobileAlerts, setMobileAlerts]     = useState(true);
  const [weeklyReport, setWeeklyReport]     = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [saved, setSaved]                   = useState(false);
  const [saveError, setSaveError]           = useState('');

  /* password change state */
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd]         = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCur, setShowCur]       = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [pwdError, setPwdError]     = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);

  /* delete confirm state */
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const CONFIRM_PHRASE = 'DELETE MY ACCOUNT';

  const handleSave = async () => {
    setSaving(true); setSaveError('');
    await new Promise(r => setTimeout(r, 1100));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = async () => {
    setPwdError(''); setPwdSuccess('');
    if (!currentPwd || !newPwd || !confirmPwd) { setPwdError('All fields are required.'); return; }
    if (newPwd.length < 6) { setPwdError('New password must be at least 6 characters.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }
    setChangingPwd(true);
    await new Promise(r => setTimeout(r, 1200));
    setChangingPwd(false);
    setPwdSuccess('Password updated successfully!');
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    setTimeout(() => setPwdSuccess(''), 4000);
  };

  const handleLogout = () => { logout(); navigate('/auth'); };

  const inputCls = 'w-full px-4 py-3 bg-white/[0.04] border border-white/8 rounded-xl text-sm text-gray-200 ' +
    'focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all placeholder-gray-600';

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#070d1c]">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account, preferences, and security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl">

        {/* ── Tab sidebar ── */}
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === t.id
                    ? t.id === 'danger'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <t.icon className="w-4 h-4 shrink-0" />
                {t.label}
                {activeTab === t.id && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Content panel ── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">

            {/* ───── PROFILE ───── */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">
                <Card>
                  <CardHeader icon={User} label="Profile Information" />
                  <div className="p-6 space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-5">
                      <div className="relative group">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-[0_0_24px_rgba(99,102,241,0.3)]">
                          {initials}
                        </div>
                        <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user?.name || 'Aditya Kumar'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'admin@example.com'}</p>
                        <button className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                          <Camera className="w-3 h-3" /> Change avatar
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs text-gray-500 font-medium block mb-1.5">Full Name</label>
                        <input
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className={inputCls}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium block mb-1.5">Email Address</label>
                        <input
                          value={email}
                          disabled
                          className={`${inputCls} opacity-50 cursor-not-allowed`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1.5">Language</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        <select className={`${inputCls} pl-10 appearance-none`}>
                          <option value="en">English (US)</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Save */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 shadow-[0_4px_16px_rgba(79,70,229,0.3)]"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <AnimatePresence>
                    {saved && (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-xs text-green-400"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Saved successfully!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ───── APPEARANCE ───── */}
            {activeTab === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <Card>
                  <CardHeader icon={Palette} label="Appearance" color="text-purple-400" iconBg="bg-purple-500/10" />
                  <div className="p-6 space-y-5">
                    {/* Theme */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-indigo-500/10' : 'bg-yellow-500/10'}`}>
                          {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-yellow-400" />}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">Dark Mode</p>
                          <p className="text-xs text-gray-500 mt-0.5">Switch between dark and light theme</p>
                        </div>
                      </div>
                      <Toggle id="dark-mode-toggle" value={darkMode} onChange={toggleDarkMode} />
                    </div>

                    <div className="border-t border-white/5" />

                    {/* Color accent */}
                    <div>
                      <p className="text-sm text-white font-medium mb-3">Accent Color</p>
                      <div className="flex gap-3">
                        {[
                          { bg: 'bg-gradient-to-br from-blue-600 to-indigo-600', active: true },
                          { bg: 'bg-gradient-to-br from-purple-600 to-pink-600', active: false },
                          { bg: 'bg-gradient-to-br from-emerald-600 to-teal-600', active: false },
                          { bg: 'bg-gradient-to-br from-orange-600 to-amber-600', active: false },
                        ].map((c, i) => (
                          <button key={i} className={`w-8 h-8 rounded-full ${c.bg} ${c.active ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d1628]' : 'opacity-50 hover:opacity-80'} transition-all`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ───── NOTIFICATIONS ───── */}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <Card>
                  <CardHeader icon={Bell} label="Notifications" color="text-yellow-400" iconBg="bg-yellow-500/10" />
                  <div className="divide-y divide-white/[0.05]">
                    {[
                      { label: 'In-App Notifications', desc: 'Get notified when analysis is complete', value: notifications, onChange: () => setNotifications(!notifications), id: 'in-app-notif', icon: Bell },
                      { label: 'Email Alerts',         desc: 'Receive weekly summary reports via email', value: emailAlerts, onChange: () => setEmailAlerts(!emailAlerts), id: 'email-alerts', icon: Globe },
                      { label: 'Mobile Push',          desc: 'Push notifications on your mobile device', value: mobileAlerts, onChange: () => setMobileAlerts(!mobileAlerts), id: 'mobile-push', icon: Smartphone },
                      { label: 'Weekly Digest',        desc: 'Get a weekly summary every Monday',       value: weeklyReport, onChange: () => setWeeklyReport(!weeklyReport), id: 'weekly-digest', icon: Bell },
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm text-white">{item.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <Toggle id={item.id} value={item.value} onChange={item.onChange} />
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ───── SECURITY ───── */}
            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">
                <Card>
                  <CardHeader icon={Lock} label="Change Password" color="text-green-400" iconBg="bg-green-500/10" />
                  <div className="p-6 space-y-4">
                    {[
                      { label: 'Current Password', value: currentPwd, set: setCurrentPwd, show: showCur, toggle: () => setShowCur(!showCur), placeholder: 'Enter current password', id: 'cur-pwd' },
                      { label: 'New Password',      value: newPwd,     set: setNewPwd,     show: showNew, toggle: () => setShowNew(!showNew),  placeholder: 'Enter new password (min. 6 chars)',    id: 'new-pwd' },
                      { label: 'Confirm New Password', value: confirmPwd, set: setConfirmPwd, show: showNew, toggle: () => setShowNew(!showNew), placeholder: 'Confirm new password', id: 'confirm-pwd' },
                    ].map(field => (
                      <div key={field.id}>
                        <label className="text-xs text-gray-500 font-medium block mb-1.5">{field.label}</label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                          <input
                            type={field.show ? 'text' : 'password'}
                            value={field.value}
                            onChange={e => field.set(e.target.value)}
                            placeholder={field.placeholder}
                            className={`${inputCls} pl-10 pr-10`}
                          />
                          <button type="button" onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                            {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}

                    <AnimatePresence>
                      {pwdError && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-xs text-red-400 bg-red-500/10 border border-red-500/15 rounded-lg px-3 py-2">
                          ⚠ {pwdError}
                        </motion.p>
                      )}
                      {pwdSuccess && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-xs text-green-400 bg-green-500/10 border border-green-500/15 rounded-lg px-3 py-2 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {pwdSuccess}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={handlePasswordChange}
                      disabled={changingPwd}
                      className="flex items-center gap-2 px-5 py-2.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/20 text-green-400 text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
                    >
                      {changingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      {changingPwd ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </Card>

                {/* Active sessions card */}
                <Card>
                  <CardHeader icon={Shield} label="Active Sessions" color="text-blue-400" />
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">Chrome — Windows</p>
                          <p className="text-xs text-gray-500 mt-0.5">Current session · India</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">Active</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ───── DANGER ZONE ───── */}
            {activeTab === 'danger' && (
              <motion.div key="danger" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">
                {/* Sign Out */}
                <div className="bg-orange-500/5 border border-orange-500/15 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-orange-500/10">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-orange-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-400">Sign Out</h3>
                  </div>
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-white font-medium">Sign out of TruthScan</p>
                      <p className="text-xs text-gray-500 mt-1">You will be redirected to the login page.</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 text-sm font-semibold rounded-xl transition-all shrink-0"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Delete account */}
                <div className="bg-red-500/5 border border-red-500/15 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/10">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-red-400">Delete Account</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-white font-medium">Permanently delete your account</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        This will permanently delete all your data, history, and saved articles.
                        This action <strong className="text-red-400">cannot be undone</strong>.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">
                        Type <span className="text-red-400 font-mono font-bold">{CONFIRM_PHRASE}</span> to confirm
                      </label>
                      <input
                        value={deleteConfirm}
                        onChange={e => setDeleteConfirm(e.target.value)}
                        placeholder={CONFIRM_PHRASE}
                        className="w-full px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-red-500/50 placeholder-gray-700 transition-all"
                      />
                    </div>

                    <button
                      disabled={deleteConfirm !== CONFIRM_PHRASE}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete My Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
