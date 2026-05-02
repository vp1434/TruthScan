import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Eye, EyeOff, Loader2, Mail, Lock, User,
  ArrowRight, CheckCircle2, Sparkles, Zap, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── tiny animated particle ─── */
const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

const features = [
  { icon: Zap,      text: 'Real-time AI analysis in seconds'   },
  { icon: Globe,    text: 'Cross-reference 500+ trusted sources' },
  { icon: Shield,   text: 'End-to-end encrypted & private'      },
  { icon: Sparkles, text: 'Detailed credibility reports'         },
];

const inputBase =
  'w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-gray-200 placeholder-gray-600 ' +
  'bg-white/5 border border-white/8 focus:outline-none focus:border-blue-500/60 ' +
  'focus:bg-white/8 transition-all duration-200';

const AuthPage: React.FC = () => {
  const [mode, setMode]               = useState<'login' | 'signup'>('login');
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [strength, setStrength]       = useState(0);
  const { login, register }           = useAuth();
  const navigate                      = useNavigate();

  /* password strength */
  useEffect(() => {
    if (!password) { setStrength(0); return; }
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccess('Welcome back! Redirecting…');
      } else {
        if (!name.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
        await register(name, email, password);
        setSuccess('Account created! Redirecting…');
      }
      setTimeout(() => navigate('/dashboard'), 900);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Something went wrong. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: 'login' | 'signup') => {
    setMode(m); setError(''); setSuccess('');
    setName(''); setEmail(''); setPassword('');
  };

  /* random particles */
  const particles = Array.from({ length: 20 }, (_, i) => ({
    width:  Math.random() * 6 + 2,
    top:    Math.random() * 100,
    left:   Math.random() * 100,
    opacity: Math.random() * 0.15 + 0.04,
    animDuration: Math.random() * 14 + 8,
    animDelay: Math.random() * 6,
    bg: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#a855f7' : '#3b82f6',
  }));

  return (
    <div className="min-h-screen bg-[#050b18] flex overflow-hidden">

      {/* ── Left panel: branding / features ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex flex-col justify-between w-[52%] relative px-16 py-14 overflow-hidden"
      >
        {/* gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b3e] via-[#0a0f22] to-[#050b18]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/15 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

        {/* particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={{
            width: p.width, height: p.width,
            top: `${p.top}%`, left: `${p.left}%`,
            background: p.bg, opacity: p.opacity,
            animation: `float ${p.animDuration}s ease-in-out ${p.animDelay}s infinite alternate`,
          }} />
        ))}

        {/* logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.5)]">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight block leading-tight">TruthScan</span>
            <span className="text-[10px] text-indigo-300/70 tracking-widest uppercase">AI News Detector</span>
          </div>
        </div>

        {/* hero copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-5xl font-extrabold leading-tight text-white mb-4">
              Detect fake news<br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                with AI precision.
              </span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              TruthScan uses advanced machine learning to verify news authenticity
              in real time — so you always know what to trust.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm text-gray-300">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* bottom quote */}
        <div className="relative z-10">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-sm text-gray-300 italic leading-relaxed">
              "TruthScan has completely changed how our newsroom verifies stories.
              We catch misinformation before it spreads."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                S
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Sarah Mitchell</p>
                <p className="text-[10px] text-gray-500">Editor-in-Chief, DailyVerify</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative bg-[#070d1c]">
        {/* subtle right-side glow */}
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-blue-600/8 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="w-full max-w-[440px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">TruthScan</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">
              {mode === 'login' ? 'Welcome back 👋' : 'Get started free'}
            </h1>
            <p className="text-sm text-gray-500">
              {mode === 'login'
                ? 'Sign in to your TruthScan account to continue.'
                : 'Create your account — it only takes a minute.'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex p-1 bg-white/[0.04] border border-white/8 rounded-xl mb-7">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 capitalize ${
                  mode === m
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_16px_rgba(79,70,229,0.4)]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative mb-4">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full Name"
                      autoComplete="name"
                      className={inputBase}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                required
                autoComplete="email"
                className={inputBase}
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className={`${inputBase} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar (signup only) */}
              <AnimatePresence>
                {mode === 'signup' && password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(n => (
                        <div
                          key={n}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: n <= strength ? strengthColor[strength] : 'rgba(255,255,255,0.08)' }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Password strength: <span style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Forgot password */}
            {mode === 'login' && (
              <div className="flex justify-end -mt-1">
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  <span className="mt-0.5 shrink-0">⚠</span>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 shadow-[0_8px_24px_rgba(79,70,229,0.4)] hover:shadow-[0_8px_32px_rgba(79,70,229,0.6)] active:scale-[0.98] mt-1"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</>
                : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-xs text-gray-600">or continue with</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-xs font-semibold text-gray-300 hover:bg-white/8 hover:border-white/15 transition-all duration-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </button>
            <button className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-xs font-semibold text-gray-300 hover:bg-white/8 hover:border-white/15 transition-all duration-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          {/* Switch mode link */}
          <p className="text-center text-xs text-gray-600 mt-7">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          {/* Back link */}
          <p className="text-center mt-3">
            <Link to="/" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">
              ← Back to homepage
            </Link>
          </p>
        </motion.div>
      </div>

      {/* float animation */}
      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-18px) scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
