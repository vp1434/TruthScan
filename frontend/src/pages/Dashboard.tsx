import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FileText, ShieldCheck, AlertCircle, Target, Zap, ChevronDown, MoreVertical, Lightbulb } from 'lucide-react';

const Dashboard: React.FC = () => {

  const trendData = [
    { name: 'Apr 22', real: 45, fake: 20 },
    { name: 'Apr 27', real: 60, fake: 35 },
    { name: 'May 02', real: 50, fake: 18 },
    { name: 'May 07', real: 75, fake: 25 },
    { name: 'May 12', real: 40, fake: 15 },
    { name: 'May 17', real: 85, fake: 35 },
    { name: 'May 22', real: 55, fake: 20 },
  ];

  const pieData = [
    { name: 'Real News', value: 732, color: '#10b981' },
    { name: 'Fake News', value: 516, color: '#ef4444' },
  ];

  const keywordData = [
    { name: 'shocking', count: 128 },
    { name: 'viral', count: 116 },
    { name: 'secret', count: 98 },
    { name: 'miracle', count: 87 },
    { name: 'you won', count: 76 },
  ];

  const recentActivity = [
    { title: 'India launches new solar mission', time: '2 mins ago', type: 'Real' },
    { title: 'Shocking! Celebrity found dead in Hotel', time: '15 mins ago', type: 'Fake' },
    { title: 'New education policy changes announced', time: '28 mins ago', type: 'Real' },
    { title: 'You won a free iPhone click here', time: '1 hr ago', type: 'Fake' },
    { title: 'Stock market hits all-time high', time: '2 hrs ago', type: 'Real' },
  ];

  const recentAnalyses = [
    { headline: 'NASA confirms water on Mars', result: 'Real', confidence: 98.6, source: 'nasa.gov', time: '2 mins ago' },
    { headline: 'Miracle cure for diabetes in 3 days', result: 'Fake', confidence: 94.2, source: 'unknown.com', time: '10 mins ago' },
    { headline: 'Government announces new scheme', result: 'Real', confidence: 96.1, source: 'pib.gov.in', time: '25 mins ago' },
    { headline: 'Breaking: Earth will end in 2026', result: 'Fake', confidence: 93.7, source: 'viralnews.com', time: '1 hr ago' },
    { headline: 'ISRO successfully launches satellite', result: 'Real', confidence: 97.8, source: 'isro.gov.in', time: '2 hrs ago' },
  ];

  return (
    <div className="p-6 bg-[#0B1120] min-h-screen">
      {/* Header Area */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-gray-400">Overview of your fake news detection activity</p>
        </div>
        <div className="flex items-center gap-2 bg-[#111827] border border-white/5 px-4 py-2 rounded-lg text-sm text-gray-300 cursor-pointer hover:bg-white/5 transition-colors">
          <span>Apr 22 - May 22, 2025</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Analyses', value: '1,248', sub: '↑ 18.6% vs last 30 days', subColor: 'text-green-500', icon: FileText, iconBg: 'bg-blue-600/20', iconColor: 'text-blue-500' },
          { label: 'Real News', value: '732', sub: '58.7% of total', subColor: 'text-green-500', icon: ShieldCheck, iconBg: 'bg-green-500/20', iconColor: 'text-green-500' },
          { label: 'Fake News', value: '516', sub: '41.3% of total', subColor: 'text-red-500', icon: AlertCircle, iconBg: 'bg-red-500/20', iconColor: 'text-red-500' },
          { label: 'Accuracy', value: '92.4%', sub: '↑ 3.2% vs last 30 days', subColor: 'text-green-500', icon: Target, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-500' },
          { label: 'Avg. Response Time', value: '2.3s', sub: '↓ 0.4s vs last 30 days', subColor: 'text-green-500', icon: Zap, iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-500' },
        ].map((card, i) => (
          <div key={i} className="dashboard-card p-5 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-11 h-11 rounded-full ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 leading-tight">{card.label}</p>
                <p className="text-2xl font-bold text-white leading-tight">{card.value}</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-500">
              <span className={card.subColor}>{card.sub.split(' ')[0]}</span>{' '}
              {card.sub.split(' ').slice(1).join(' ')}
            </p>
          </div>
        ))}
      </div>

      {/* Row 2: Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Detection Trend */}
        <div className="dashboard-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-sm">Detection Trend</h3>
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-[11px] text-gray-400 cursor-pointer">
              Last 30 Days <ChevronDown className="w-3 h-3 ml-1" />
            </div>
          </div>
          <div className="flex items-center gap-6 mb-3 text-[11px]">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-gray-300">Real News</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-gray-300">Fake News</span></div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="real" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981' }} />
                <Line type="monotone" dataKey="fake" stroke="#ef4444" strokeWidth={2} dot={{ r: 2, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-gray-600 mt-1 px-1">
            {trendData.map(d => <span key={d.name}>{d.name}</span>)}
          </div>
        </div>

        {/* News Distribution Donut */}
        <div className="dashboard-card p-6 rounded-xl">
          <h3 className="font-bold text-white text-sm mb-4">News Distribution</h3>
          <div className="relative flex items-center justify-center h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={72} paddingAngle={2} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-xl font-bold text-white">1,248</span>
              <span className="text-[10px] text-gray-400">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2 text-xs">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }}></div>
                  <span className="text-gray-300">{d.name}</span>
                </div>
                <span className="text-gray-400">{d.value} ({((d.value / 1248) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-sm">Recent Activity</h3>
            <span className="text-[11px] text-blue-500 cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 p-1 rounded bg-[#0B1120] border border-white/5 shrink-0">
                    {a.type === 'Real'
                      ? <ShieldCheck className="w-3 h-3 text-green-500" />
                      : <AlertCircle className="w-3 h-3 text-red-500" />}
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-200 font-medium leading-snug line-clamp-2">{a.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{a.time}</p>
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
        <div className="dashboard-card rounded-xl col-span-1 lg:col-span-2 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">Recent Analyses</h3>
            <span className="text-[11px] text-blue-500 cursor-pointer hover:underline">View All History</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-gray-500 border-b border-white/5 bg-[#0B1120]/40">
                  <th className="font-normal px-6 py-3">News / Headline</th>
                  <th className="font-normal px-6 py-3">Result</th>
                  <th className="font-normal px-6 py-3">Confidence</th>
                  <th className="font-normal px-6 py-3">Source</th>
                  <th className="font-normal px-6 py-3">Time</th>
                  <th className="font-normal px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentAnalyses.map((item, i) => (
                  <tr key={i} className="hover:bg-white/3 transition-colors text-xs">
                    <td className="px-6 py-3.5 text-gray-200 max-w-[220px] truncate">{item.headline}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${item.result === 'Real' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-red-500/20 text-red-500 bg-red-500/10'}`}>
                        {item.result}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 w-10">{item.confidence}%</span>
                        <div className="w-14 h-1.5 bg-[#0B1120] rounded-full overflow-hidden">
                          <div className={`h-full ${item.result === 'Real' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${item.confidence}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-400">{item.source}</td>
                    <td className="px-6 py-3.5 text-gray-500">{item.time}</td>
                    <td className="px-6 py-3.5 text-gray-600 cursor-pointer hover:text-gray-300"><MoreVertical className="w-4 h-4" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Keywords + Tip */}
        <div className="flex flex-col gap-4">
          <div className="dashboard-card p-6 rounded-xl flex-1">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-white text-sm">Top Fake Keywords</h3>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-[11px] text-gray-400 cursor-pointer">
                Last 30 Days <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="space-y-3">
              {keywordData.map((kw, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <div className="w-14 text-gray-300 truncate shrink-0">{kw.name}</div>
                  <div className="flex-1 h-1.5 bg-[#0B1120] rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(kw.count / keywordData[0].count) * 100}%` }}></div>
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
                <p className="text-[11px] text-gray-400 leading-relaxed">Our AI model has analyzed over 25,000+ news articles with 92.4% accuracy rate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[11px] text-gray-600 mt-8">© 2025 TruthScan. All rights reserved.</p>
    </div>
  );
};

export default Dashboard;
