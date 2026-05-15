import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { FileText, ShieldCheck, AlertCircle, Target, Zap, ChevronDown, MoreVertical, Lightbulb, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const formatRelativeTime = (dateStr: string) => {
  if (!dateStr) return 'Unknown';
  const normalizedDateStr = dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`;
  const date = new Date(normalizedDateStr);
  if (isNaN(date.getTime())) return 'Invalid date';
  const now = new Date();
  const diffInSecs = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSecs < 60) return 'Just now';
  const diffInMins = Math.floor(diffInSecs / 60);
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  // Dynamic date range display
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - days);
  const dateRangeStr = `${startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} – ${now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`;

  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [histRes, statsRes] = await Promise.all([
        axios.get('http://localhost:8000/history', { headers }),
        axios.get(`http://localhost:8000/dashboard-stats?days=${days}`, { headers })
      ]);
      setHistory(histRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, [token, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleDays = () => setDays(prev => prev === 30 ? 7 : 30);

  const trendData = stats?.trend_data || [];

  const pieData = [
    { name: 'Real News', value: stats?.real_count || 0, color: '#10b981' },
    { name: 'Fake News', value: stats?.fake_count || 0, color: '#ef4444' },
  ];

  const keywordData = stats?.keyword_data || [
    { name: 'shocking', count: 12 },
    { name: 'viral', count: 8 },
    { name: 'secret', count: 15 },
    { name: 'miracle', count: 5 },
    { name: 'breaking', count: 20 },
  ];
  const maxKeyword = keywordData.length > 0 ? Math.max(...keywordData.map((k: any) => k.count)) : 1;

  const recentActivity = history.slice(0, 5).map((h: any) => ({
    title: (h.text || h.url || 'Analyzed Content').substring(0, 50) + '...',
    time: formatRelativeTime(h.timestamp),
    type: h.prediction || 'Unknown'
  }));

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1120] text-gray-400 gap-4">
        <ShieldCheck className="w-12 h-12 text-blue-500/40" />
        <h2 className="text-xl font-bold text-white">Sign in to view your dashboard</h2>
        <p className="text-sm text-gray-500">Your personal analytics will appear here after logging in.</p>
        <button
          onClick={() => navigate('/auth')}
          className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 dark:bg-[#0B1120] min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">Your personal fake news detection activity</p>
        </div>
        <button
          onClick={toggleDays}
          className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-gray-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
        >
          <Calendar className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span>{dateRangeStr}</span>
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-gray-500" />
        </button>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Analyses', value: stats?.total?.toLocaleString() ?? '—', sub: '↑ Real-time data', subColor: 'text-green-500', icon: FileText, iconBg: 'bg-blue-600/20', iconColor: 'text-blue-500' },
          { label: 'Real News', value: stats?.real_count?.toLocaleString() ?? '—', sub: `${(stats?.total && stats.total > 0) ? ((stats.real_count / stats.total) * 100).toFixed(1) : 0}% of total`, subColor: 'text-green-500', icon: ShieldCheck, iconBg: 'bg-green-500/20', iconColor: 'text-green-500' },
          { label: 'Fake News', value: stats?.fake_count?.toLocaleString() ?? '—', sub: `${(stats?.total && stats.total > 0) ? ((stats.fake_count / stats.total) * 100).toFixed(1) : 0}% of total`, subColor: 'text-red-500', icon: AlertCircle, iconBg: 'bg-red-500/20', iconColor: 'text-red-500' },
          { label: 'Accuracy', value: `${stats?.accuracy ?? 92.4}%`, sub: '↑ System performance', subColor: 'text-green-500', icon: Target, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-500' },
          { label: 'Avg. Response Time', value: `${stats?.avg_detection ?? 1.8}s`, sub: '↓ Optimization active', subColor: 'text-green-500', icon: Zap, iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-500' },
        ].map((card, i) => (
          <div key={i} className="dashboard-card p-5 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-11 h-11 rounded-full ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-tight">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{card.value}</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-500">
              <span className={card.subColor}>{card.sub?.split(' ')[0] || ''}</span>{' '}
              {card.sub?.split(' ').slice(1).join(' ') || ''}
            </p>
          </div>
        ))}
      </div>

      {/* Row 2: Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Detection Trend */}
        <div className="dashboard-card p-6 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Detection Trend</h3>
            <button
              className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded text-[11px] text-slate-500 dark:text-gray-400 cursor-pointer hover:bg-blue-500/10 hover:text-blue-500 transition-all"
              onClick={toggleDays}
            >
              {days === 30 ? 'Last 30 Days' : 'Last 7 Days'} <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
          <div className="flex items-center gap-6 mb-3 text-[11px]">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-gray-400">Real News</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-gray-400">Fake News</span></div>
          </div>
          <div className="h-44">
            {trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-xs">No data yet. Start analyzing news!</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff06" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false}
                    interval={days === 30 ? 6 : 0} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="real" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981' }} />
                  <Line type="monotone" dataKey="fake" stroke="#ef4444" strokeWidth={2} dot={{ r: 2, fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* News Distribution Donut */}
        <div className="dashboard-card p-6 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">News Distribution</h3>
          <div className="relative flex items-center justify-center h-44">
            {stats?.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={72} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 z-10 bg-[#111827]">
                No data available
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{stats?.total?.toLocaleString() ?? '0'}</span>
              <span className="text-[10px] text-slate-500 dark:text-gray-400">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2 text-xs">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }}></div>
                  <span className="text-gray-300">{d.name}</span>
                </div>
                <span className="text-gray-400">{d.value} ({(stats?.total ? ((d.value / stats.total) * 100) : 0).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card p-6 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Activity</h3>
            <span onClick={() => navigate('/history')} className="text-[11px] text-blue-500 cursor-pointer hover:underline font-medium">View All</span>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No activity yet.</p>
            ) : recentActivity.map((a, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 p-1 rounded bg-[#0B1120] border border-white/5 shrink-0">
                    {a.type === 'Real'
                      ? <ShieldCheck className="w-3 h-3 text-green-500" />
                      : <AlertCircle className="w-3 h-3 text-red-500" />}
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-700 dark:text-gray-200 font-medium leading-snug line-clamp-2">{a.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">{a.time}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded ${a.type === 'Real' ? 'border border-green-500/30 text-green-500 bg-green-500/10' : 'border border-red-500/30 text-red-500 bg-red-500/10'}`}>
                  {a.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Table + Keywords + Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Analyses Table */}
        <div className="dashboard-card rounded-xl col-span-1 lg:col-span-2 overflow-hidden shadow-sm border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Analyses</h3>
            <span onClick={() => navigate('/history')} className="text-[11px] text-blue-500 cursor-pointer hover:underline font-medium">View All History</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-slate-500 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0B1120]/40">
                  <th className="font-normal px-6 py-3">News / Headline</th>
                  <th className="font-normal px-6 py-3">Result</th>
                  <th className="font-normal px-6 py-3">Confidence</th>
                  <th className="font-normal px-6 py-3">Time</th>
                  <th className="font-normal px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading...</td></tr>
                ) : history.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No analyses yet. Start by checking some news!</td></tr>
                ) : history.slice(0, 10).map((item, i) => (
                  <tr key={item.id || i} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors text-xs">
                    <td className="px-6 py-3.5 text-slate-700 dark:text-gray-200 max-w-[240px] truncate">{item.text}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${item.prediction === 'Real' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-red-500/20 text-red-500 bg-red-500/10'}`}>
                        {item.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 w-10">{(item.confidence * 100).toFixed(1)}%</span>
                        <div className="w-14 h-1.5 bg-[#0B1120] rounded-full overflow-hidden">
                          <div className={`h-full ${item.prediction === 'Real' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${item.confidence * 100}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{formatRelativeTime(item.timestamp)}</td>
                    <td className="px-6 py-3.5 text-gray-600 cursor-pointer hover:text-gray-300"><MoreVertical className="w-4 h-4" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Keywords + Tip */}
        <div className="flex flex-col gap-4">
          <div className="dashboard-card p-6 rounded-xl flex-1 shadow-sm border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-5">Top Fake Keywords</h3>
            <div className="space-y-3">
              {keywordData.map((kw: any, i: number) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <div className="w-14 text-gray-300 truncate shrink-0">{kw.name}</div>
                  <div className="flex-1 h-1.5 bg-[#0B1120] rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(kw.count / maxKeyword) * 100}%` }}></div>
                  </div>
                  <div className="w-8 text-right text-gray-500 shrink-0">{kw.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-5 rounded-xl border-[#1e1b4b] bg-gradient-to-br from-[#1e1b4b]/60 to-[#111827]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">Did You Know?</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  You have analyzed {stats?.total?.toLocaleString() || '0'} articles so far.
                  Our AI runs at {stats?.accuracy ?? 92.4}% accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
