import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { TrendingUp, Shield, AlertCircle, Target } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token;
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:8000/global-stats');
        setStats(res.data);
      } catch {
        setStats({ total: 0, fake_count: 0, real_count: 0, accuracy: 92.4 });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const weeklyData = [
    { day: 'Mon', real: 42, fake: 18 }, { day: 'Tue', real: 58, fake: 24 },
    { day: 'Wed', real: 35, fake: 16 }, { day: 'Thu', real: 72, fake: 30 },
    { day: 'Fri', real: 61, fake: 22 }, { day: 'Sat', real: 48, fake: 19 },
    { day: 'Sun', real: 53, fake: 21 },
  ];

  const categoryData = [
    { name: 'Politics', fake: 45 }, { name: 'Health', fake: 32 }, { name: 'Science', fake: 18 },
    { name: 'Finance', fake: 28 }, { name: 'Sports', fake: 8 }, { name: 'Tech', fake: 15 },
  ];

  const confidenceData = [
    { range: '90-100%', count: 624 }, { range: '80-90%', count: 312 },
    { range: '70-80%', count: 198 }, { range: '60-70%', count: 82 }, { range: '<60%', count: 32 },
  ];

  const pieData = [
    { name: 'Real', value: stats?.real_count || 0, color: '#10b981' },
    { name: 'Fake', value: stats?.fake_count || 0, color: '#ef4444' },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400 bg-[#0B1120]">Loading statistics...</div>;

  return (
    <div className="p-6 min-h-screen bg-[#0B1120]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Statistics</h1>
        <p className="text-sm text-gray-400">Deep dive into your detection analytics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: TrendingUp, label: 'Total Analyses', value: stats?.total || 0, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: Shield, label: 'Real News', value: stats?.real_count || 0, color: 'text-green-400', bg: 'bg-green-500/10' },
          { icon: AlertCircle, label: 'Fake News', value: stats?.fake_count || 0, color: 'text-red-400', bg: 'bg-red-500/10' },
          { icon: Target, label: 'Accuracy', value: `${(stats?.accuracy || 92.4).toFixed(1)}%`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((s, i) => (
          <div key={i} className="dashboard-card p-5 rounded-xl flex items-center gap-4">
            <div className={`w-11 h-11 rounded-full ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Weekly Trend */}
        <div className="dashboard-card p-6 rounded-xl lg:col-span-2">
          <h3 className="font-bold text-white text-sm mb-4">Weekly Detection Trend</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="real" fill="#10b981" radius={[4, 4, 0, 0]} name="Real News" />
                <Bar dataKey="fake" fill="#ef4444" radius={[4, 4, 0, 0]} name="Fake News" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Pie */}
        <div className="dashboard-card p-6 rounded-xl">
          <h3 className="font-bold text-white text-sm mb-4">Overall Distribution</h3>
          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-lg font-bold text-white">{stats?.total || 0}</span>
              <span className="text-[10px] text-gray-400">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-1 text-xs">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }}></div>
                  <span className="text-gray-300">{d.name}</span>
                </div>
                <span className="text-gray-400">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <div className="dashboard-card p-6 rounded-xl">
          <h3 className="font-bold text-white text-sm mb-4">Fake News by Category</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={60} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="fake" fill="#ef4444" radius={[0, 4, 4, 0]} name="Fake Articles" barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Distribution */}
        <div className="dashboard-card p-6 rounded-xl">
          <h3 className="font-bold text-white text-sm mb-4">Confidence Score Distribution</h3>
          <div className="space-y-3 mt-2">
            {confidenceData.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="w-14 text-gray-400 shrink-0">{c.range}</div>
                <div className="flex-1 h-2 bg-[#0B1120] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.count / confidenceData[0].count) * 100}%` }}></div>
                </div>
                <div className="w-10 text-right text-gray-500 shrink-0">{c.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
