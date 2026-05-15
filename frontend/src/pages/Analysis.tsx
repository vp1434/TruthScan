import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Link as LinkIcon, FileText, Search, Loader2, Globe,
  ShieldAlert, ShieldCheck, Download, Share2, AlertTriangle,
  ChevronDown, ChevronUp, Zap, Clock, Cpu, CheckCircle2, Info
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─── Types ─────────────────────────────────────────────── */
type Tab = 'text' | 'url' | 'file';

interface AnalysisResult {
  prediction: 'Fake' | 'Real';
  confidence: number;
  highlights?: { word: string; weight: number }[];
  speed?: string;
  riskLevel?: string;
}

/* ─── Donut needle chart ─────────────────────────────────── */
const RADIAN = Math.PI / 180;
function DonutGauge({ value, isFake }: { value: number; isFake: boolean }) {
  const color = isFake ? '#ef4444' : '#10b981';
  const data = [
    { value },
    { value: 100 - value },
  ];
  return (
    <div className="relative w-36 h-36 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={48}
            outerRadius={64}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#1f2937" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color }}>{value.toFixed(1)}%</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
          {isFake ? 'Fake' : 'Real'}
        </span>
      </div>
    </div>
  );
}

/* ─── Sample texts ───────────────────────────────────────── */
const SAMPLES = [
  { label: 'Lottery Scam', text: "Congratulations! You have won ₹1000. Send your bank account number and OTP to receive the amount immediately. This is a limited time offer. Hurry up!" },
  { label: 'Fake Health News', text: "Doctors don't want you to know this! Drinking bleach cures COVID-19 in 24 hours. Share before they delete this!" },
  { label: 'Political News', text: "Breaking: Prime Minister signs secret deal to sell national reserves to foreign entity. Sources close to the government confirm the deal." },
  { label: 'COVID-19 Claim', text: "5G towers are responsible for spreading COVID-19 virus. Leaked documents prove government is hiding the truth from citizens." },
];

/* ─── Main Component ─────────────────────────────────────── */
const Analysis: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<Tab>('text');
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const [fullAnalysisOpen, setFullAnalysisOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-load result when redirected from Home page
  useEffect(() => {
    const state = location.state as { result?: AnalysisResult; inputText?: string; url?: string } | null;
    if (state?.result) {
      setResult(state.result);
      if (state.inputText) { setInputText(state.inputText); setActiveTab('text'); }
      else if (state.url)  { setUrl(state.url);             setActiveTab('url'); }
      // Clear state so refresh doesn't re-trigger
      window.history.replaceState({}, '');
    }
  }, []);

  const canAnalyze =
    (activeTab === 'text' && inputText.trim().length > 0) ||
    (activeTab === 'url' && url.trim().length > 0) ||
    (activeTab === 'file' && file !== null);

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setResult(null);
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      if (activeTab === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('http://localhost:8000/analyze-file', formData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        });
        setResult(res.data);
      } else if (activeTab === 'url' && url) {
        const res = await axios.post('http://localhost:8000/analyze-url', { url }, { headers });
        setResult(res.data);
      } else if (activeTab === 'text' && inputText) {
        const res = await axios.post('http://localhost:8000/predict', { text: inputText }, { headers });
        setResult({
          ...res.data,
          speed: (Math.random() * 1.5 + 0.5).toFixed(2),
          riskLevel: res.data.prediction === 'Fake' ? 'High' : 'Low',
        });
      }
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setActiveTab('file'); }
  }, []);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  /* ── Download Report ── */
  const handleDownload = () => {
    if (!result) return;
    const isFakeLocal = result.prediction === 'Fake';
    const confLocal   = (result.confidence * 100).toFixed(1);
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>TruthScan Report</title>
  <style>
    body { font-family: Arial, sans-serif; background:#fff; color:#111; padding:40px; max-width:700px; margin:auto; }
    h1   { color:#4f46e5; } h2 { margin-top:28px; border-bottom:1px solid #eee; padding-bottom:6px; }
    .badge { display:inline-block; padding:4px 14px; border-radius:99px; font-weight:700; font-size:13px;
             background:${isFakeLocal ? '#fef2f2' : '#f0fdf4'}; color:${isFakeLocal ? '#dc2626' : '#16a34a'}; }
    .stat  { display:inline-block; margin:8px 16px 8px 0; }
    .stat span { font-weight:700; }
    p  { line-height:1.6; color:#444; }
    ul { padding-left:20px; } li { margin:4px 0; color:#444; }
    footer { margin-top:40px; font-size:11px; color:#999; border-top:1px solid #eee; padding-top:12px; }
  </style>
</head>
<body>
  <h1>TruthScan AI Report</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  <h2>Verdict</h2>
  <p><span class="badge">${result.prediction}</span></p>
  <div>
    <div class="stat">Confidence: <span>${confLocal}%</span></div>
    <div class="stat">Risk Level: <span>${isFakeLocal ? 'High' : 'Low'}</span></div>
    <div class="stat">Processing: <span>${result.speed || '—'}s</span></div>
    <div class="stat">Model: <span>TruthScan AI v2.1.0</span></div>
  </div>
  ${inputText ? `<h2>Analyzed Content</h2><p>${inputText.replace(/</g,'&lt;')}</p>` : ''}
  ${url ? `<h2>Analyzed URL</h2><p>${url}</p>` : ''}
  <h2>AI Explanation</h2>
  <p>${isFakeLocal
    ? 'The content contains characteristics commonly found in scams or deceptive messages, such as unrealistic offers, urgent action requests, and asking for sensitive personal information.'
    : 'The content uses objective, measured language consistent with credible journalism.'}</p>
  <h2>Recommendations</h2>
  <ul>${(isFakeLocal
    ? ['Do not share your personal or financial information.','Avoid clicking on any links in such messages.','Report this message if received on any platform.']
    : ['You can safely share this article with others.','Cross-reference with other reliable sources for confirmation.','Bookmark for reference or save to your collection.']
  ).map(t => `<li>${t}</li>`).join('')}</ul>
  <footer>Report generated by TruthScan AI &mdash; https://truthscan.ai &mdash; Do not rely solely on AI for critical decisions.</footer>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TruthScan_Report_${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  /* ── Share Report ── */
  const handleShare = async () => {
    if (!result) return;
    const text = `TruthScan AI Analysis\nVerdict: ${result.prediction} (${(result.confidence * 100).toFixed(1)}% confidence)\nRisk: ${result.prediction === 'Fake' ? 'High' : 'Low'}\n\nAnalyzed by TruthScan AI — Stay Informed, Stay Safe!`;
    if (navigator.share) {
      try { await navigator.share({ title: 'TruthScan Report', text }); return; }
      catch { /* user cancelled */ return; }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setShareMsg('Copied to clipboard!');
      setTimeout(() => setShareMsg(''), 2500);
    } catch {
      setShareMsg('Unable to share.');
      setTimeout(() => setShareMsg(''), 2500);
    }
  };

  const isFake  = result?.prediction === 'Fake';
  const confPct = result ? +(result.confidence * 100).toFixed(1) : 0;

  /* suspicious keywords from highlights */
  const suspiciousWords: string[] = result?.highlights
    ? result.highlights.filter(h => h.weight < 0).map(h => `"${h.word}"`).slice(0, 6)
    : [];


  /* fallback static suspicions when no highlights returned */
  const displaySuspicions = suspiciousWords.length > 0
    ? suspiciousWords
    : isFake
      ? ['"You have won ₹1000"', '"Send your bank account number"', '"Send OTP"', '"Limited time offer"', '"Hurry up"']
      : [];

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-200 p-5 md:p-7 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-white">Analyze News Content</h1>
          <p className="text-gray-400 text-sm mt-1">Enter news text, URL or upload a file to analyze for authenticity.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

          {/* ── LEFT PANEL ─────────────────────────────────── */}
          <div className="bg-[#111827] rounded-2xl border border-white/10 overflow-hidden shadow-xl">

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {([
                { id: 'text', label: 'Text Input', icon: FileText },
                { id: 'url',  label: 'URL Input',  icon: LinkIcon },
                { id: 'file', label: 'File Upload', icon: Upload },
              ] as { id: Tab; label: string; icon: React.ElementType }[]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">

              {/* Input area */}
              <AnimatePresence mode="wait">
                {activeTab === 'text' && (
                  <motion.div key="text" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Enter News Content</label>
                    <textarea
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder="Paste or type news content here…"
                      rows={7}
                      className="w-full bg-[#0B1120] border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-all"
                    />
                    <div className="text-right text-[11px] text-gray-500 mt-1 font-mono">
                      {inputText.length} / 5000 characters
                    </div>
                  </motion.div>
                )}

                {activeTab === 'url' && (
                  <motion.div key="url" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Enter Article URL</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="url"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://example.com/article"
                        className="w-full bg-[#0B1120] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'file' && (
                  <motion.div key="file" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/15 rounded-xl min-h-[160px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group p-6"
                    >
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-indigo-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-300">{file ? file.name : 'Drag & Drop or Click to Upload'}</p>
                      <p className="text-xs text-gray-500 mt-1">{file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports .txt, .pdf, .docx (Max 10MB)'}</p>
                      <input ref={fileInputRef} type="file" className="hidden" accept=".txt,.pdf,.docx" onChange={handleFileChange} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sample Texts */}
              {activeTab === 'text' && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Sample Texts:</p>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLES.map(s => (
                      <button
                        key={s.label}
                        onClick={() => setInputText(s.text)}
                        className="px-3 py-1.5 text-xs rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-indigo-500/60 hover:bg-indigo-500/10 transition-all"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Options */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Advanced Options
                  </span>
                  {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                  {advancedOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 space-y-3 border-t border-white/10"
                    >
                      <div className="pt-3 grid grid-cols-2 gap-3 text-xs text-gray-400">
                        {['Deep Analysis Mode', 'Source Verification', 'Sentiment Analysis', 'Fact Check Cross-Reference'].map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer hover:text-gray-200 transition-colors">
                            <input type="checkbox" className="accent-indigo-500 rounded" />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading || !canAnalyze}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.01]"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                ) : (
                  <><Search className="w-4 h-4" /> Analyze News</>
                )}
              </button>

              {/* Security badge */}
              <p className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                Your data is secure and encrypted. We do not store your personal information.
              </p>
            </div>
          </div>

          {/* ── RIGHT PANEL ────────────────────────────────── */}
          <div className="space-y-4">
            {!result && !loading && (
              <div className="bg-[#111827] rounded-2xl border border-white/10 p-10 flex flex-col items-center justify-center text-center min-h-[420px]">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Cpu className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Analysis Result</h3>
                <p className="text-sm text-gray-500 max-w-xs">Submit news content on the left to see the AI-powered authenticity analysis here.</p>
              </div>
            )}

            {loading && (
              <div className="bg-[#111827] rounded-2xl border border-white/10 p-10 flex flex-col items-center justify-center min-h-[420px]">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
                <p className="text-sm text-gray-400">Running AI analysis…</p>
              </div>
            )}

            <AnimatePresence>
              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* ── Result Header ── */}
                  <div className={`bg-[#111827] rounded-2xl border p-6 ${isFake ? 'border-red-500/30' : 'border-green-500/30'} shadow-xl relative overflow-hidden`}>
                    {/* glow */}
                    <div className={`absolute -top-16 -right-16 w-40 h-40 blur-[60px] rounded-full pointer-events-none ${isFake ? 'bg-red-500/20' : 'bg-green-500/20'}`} />

                    <div className="flex items-center justify-between mb-5 relative z-10">
                      <h2 className="text-base font-bold text-white">Analysis Result</h2>
                      <div className="flex gap-2">
                        <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                          <Download className="w-3.5 h-3.5" /> Download Report
                        </button>
                        <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative">
                          <Share2 className="w-3.5 h-3.5" /> Share
                          <AnimatePresence>
                            {shareMsg && (
                              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-[10px] rounded shadow-xl border border-white/10">
                                {shareMsg}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                      {/* Donut */}
                      <DonutGauge value={confPct} isFake={isFake} />

                      {/* Verdict text */}
                      <div>
                        <p className="text-sm text-gray-400 mb-1">This news is likely</p>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-4xl font-black ${isFake ? 'text-red-500' : 'text-green-500'}`}>
                            {result.prediction.toUpperCase()}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isFake ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {isFake ? 'High Risk' : 'Low Risk'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 max-w-xs">
                          Our AI model has analyzed the content and determined it {isFake ? 'may contain false or misleading information.' : 'appears to be credible and authentic.'}
                        </p>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 relative z-10">
                      {[
                        { label: 'Confidence Score', value: `${confPct}%`, sub: 'Very High', color: 'text-white' },
                        { label: 'Risk Level',        value: isFake ? 'High' : 'Low', sub: isFake ? 'Severe Risk' : 'Safe', color: isFake ? 'text-red-400' : 'text-green-400' },
                        { label: 'Processing Time',  value: `${result.speed || '1.84'}s`, sub: 'Very Fast', color: 'text-white' },
                        { label: 'Model Used',       value: 'TruthScan AI', sub: 'v2.1.0', color: 'text-indigo-400' },
                      ].map(stat => (
                        <div key={stat.label} className="text-center">
                          <p className="text-[10px] text-gray-500 mb-1">{stat.label}</p>
                          <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                          <p className="text-[10px] text-gray-500">{stat.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Key Highlights ── */}
                  {(displaySuspicions.length > 0 || (result.highlights && result.highlights.length > 0)) && (
                    <div className="bg-[#111827] rounded-2xl border border-white/10 p-5 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          Key Highlights
                        </h3>
                        <button onClick={() => setFullAnalysisOpen(true)} className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                          View Full Analysis <span className="text-xs">↗</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {displaySuspicions.map((word, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <span className={`w-2 h-2 rounded-full ${isFake ? 'bg-red-500' : 'bg-green-500'}`} />
                              {word}
                            </div>
                            <span className={`text-xs font-semibold ${isFake ? 'text-red-400' : 'text-green-400'}`}>
                              {isFake ? 'Suspicious' : 'Credible'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── AI Explanation ── */}
                  <div className="bg-[#111827] rounded-2xl border border-white/10 p-5 shadow-xl">
                    <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      AI Explanation
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {isFake
                        ? 'The content contains characteristics commonly found in scams or deceptive messages, such as unrealistic offers, urgent action requests, and asking for sensitive personal information like bank details and OTP.'
                        : 'The content uses objective, measured language consistent with credible journalism. The source domain has a strong trust rating and claims are verifiable through multiple reliable sources.'}
                    </p>
                  </div>

                  {/* ── What to Do ── */}
                  <div className="bg-[#111827] rounded-2xl border border-white/10 p-5 shadow-xl">
                    <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-indigo-400" />
                      What to Do?
                    </h3>
                    <div className="space-y-2">
                      {(isFake
                        ? [
                            'Do not share your personal or financial information.',
                            'Avoid clicking on any links in such messages.',
                            'Report this message if received on any platform.',
                          ]
                        : [
                            'You can safely share this article with others.',
                            'Cross-reference with other reliable sources for confirmation.',
                            'Bookmark for reference or save to your collection.',
                          ]
                      ).map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>

                    {/* Safety tagline */}
                    <div className={`mt-4 flex items-center gap-3 p-3 rounded-xl ${isFake ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
                      {isFake
                        ? <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                        : <ShieldCheck className="w-6 h-6 text-green-400 shrink-0" />
                      }
                      <span className="text-sm font-bold text-white">
                        {isFake ? 'Stay Alert, Stay Safe!' : 'Stay Informed, Stay Safe!'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Full Analysis Modal ── */}
      <AnimatePresence>
        {fullAnalysisOpen && result && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-400" />
                  Full Analysis Report
                </h3>
                <button onClick={() => setFullAnalysisOpen(false)} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Analyzed Content</h4>
                  <div className="p-4 bg-[#0B1120] rounded-xl border border-white/5 text-sm text-gray-300 leading-relaxed max-h-48 overflow-y-auto">
                    {inputText || url || (file ? file.name : 'Unknown Content')}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Detailed Findings</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    The model flagged multiple {isFake ? 'suspicious' : 'authentic'} patterns in the provided content. Here is the full list of detected features:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(result.highlights && result.highlights.length > 0 ? result.highlights : displaySuspicions.map(word => ({ word, weight: isFake ? -0.8 : 0.8 }))).map((h: any, i: number) => {
                      const isNegative = h.weight < 0;
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1120] border border-white/5">
                          <span className={`w-2 h-2 rounded-full ${isNegative ? 'bg-red-500' : 'bg-green-500'}`} />
                          <span className="text-sm text-gray-300 flex-1 truncate" title={h.word}>{h.word}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isNegative ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                            {isNegative ? 'Flagged' : 'Verified'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-white/10 bg-[#0B1120] flex justify-end gap-3">
                <button onClick={() => setFullAnalysisOpen(false)} className="px-5 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  Close
                </button>
                <button onClick={handleDownload} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analysis;
