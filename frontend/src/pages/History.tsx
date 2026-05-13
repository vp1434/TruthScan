import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Search, Clock, Shield, AlertTriangle, Trash2 } from 'lucide-react';

const History: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token;
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get('http://localhost:8000/history?limit=50', { headers });
        setHistory(res.data);
      } catch {
        // Fallback demo data
        setHistory([
          { _id: '1', text: 'NASA confirms water on Mars surface found by rover.', prediction: 'Real', confidence: 0.986, timestamp: new Date(Date.now() - 120000).toISOString() },
          { _id: '2', text: 'Miracle cure for diabetes found in 3 days, doctors hate him.', prediction: 'Fake', confidence: 0.942, timestamp: new Date(Date.now() - 600000).toISOString() },
          { _id: '3', text: 'Government announces new scheme for farmers worth ₹50,000 crore.', prediction: 'Real', confidence: 0.961, timestamp: new Date(Date.now() - 1500000).toISOString() },
          { _id: '4', text: 'Breaking: Earth will end in 2026, scientist warns governments.', prediction: 'Fake', confidence: 0.937, timestamp: new Date(Date.now() - 3600000).toISOString() },
          { _id: '5', text: 'ISRO successfully launches communication satellite into orbit.', prediction: 'Real', confidence: 0.978, timestamp: new Date(Date.now() - 7200000).toISOString() },
          { _id: '6', text: 'You won a free iPhone 16 Pro, click here to claim now!', prediction: 'Fake', confidence: 0.998, timestamp: new Date(Date.now() - 10800000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  const filtered = history.filter(item =>
    item.text?.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (ts: string) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="p-6 min-h-screen bg-[#0B1120]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Analysis History</h1>
        <p className="text-sm text-gray-400">All your past fake news detection results</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search history..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-white/5 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/40"
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Scanned', value: history.length, color: 'text-blue-400' },
          { label: 'Real News', value: history.filter(h => h.prediction === 'Real').length, color: 'text-green-400' },
          { label: 'Fake News', value: history.filter(h => h.prediction === 'Fake').length, color: 'text-red-400' },
          { label: 'Avg. Confidence', value: history.length ? `${(history.reduce((a, b) => a + b.confidence, 0) / history.length * 100).toFixed(1)}%` : '—', color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="dashboard-card p-4 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="dashboard-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm">Loading history...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Clock className="w-10 h-10 text-gray-600" />
            <p className="text-gray-500 text-sm">No history found</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] text-gray-500 border-b border-white/5 bg-[#0B1120]/40">
                <th className="font-normal px-6 py-3">Content</th>
                <th className="font-normal px-6 py-3">Result</th>
                <th className="font-normal px-6 py-3">Confidence</th>
                <th className="font-normal px-6 py-3">Time</th>
                <th className="font-normal px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item, i) => (
                <motion.tr
                  key={item._id || i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/3 transition-colors text-xs group"
                >
                  <td className="px-6 py-4 text-gray-200 max-w-xs">
                    <p className="truncate">{item.text}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${item.prediction === 'Real' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-red-500/20 text-red-500 bg-red-500/10'}`}>
                      {item.prediction === 'Real' ? <Shield className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                      {item.prediction}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 w-10">{(item.confidence * 100).toFixed(1)}%</span>
                      <div className="w-16 h-1.5 bg-[#0B1120] rounded-full overflow-hidden">
                        <div className={`h-full ${item.prediction === 'Real' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${item.confidence * 100}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatTime(item.timestamp)}</td>
                  <td className="px-6 py-4">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default History;
