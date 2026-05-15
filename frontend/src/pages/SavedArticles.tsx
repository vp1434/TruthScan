import React, { useEffect, useState } from 'react';
import { Bookmark, Search, Shield, AlertTriangle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SavedArticles: React.FC = () => {
  const [saved, setSaved] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Load from localStorage
    const data = JSON.parse(localStorage.getItem('truthscan_saved') || '[]');
    setSaved(data);
  }, []);

  const removeItem = (id: string) => {
    const updated = saved.filter(s => s.id !== id);
    setSaved(updated);
    localStorage.setItem('truthscan_saved', JSON.stringify(updated));
  };

  const filtered = saved.filter(s => s.text?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 min-h-screen bg-[#0B1120]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Saved Articles</h1>
        <p className="text-sm text-gray-400">Your bookmarked analyses for quick reference</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search saved articles..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-white/5 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/40" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/3 flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-gray-400 font-medium">No saved articles yet</h3>
          <p className="text-gray-600 text-sm max-w-xs">Analyze news articles and bookmark them here for easy access later.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <motion.div key={item.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="dashboard-card p-5 rounded-xl group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${item.prediction === 'Real' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-red-500/20 text-red-500 bg-red-500/10'}`}>
                  {item.prediction === 'Real' ? <Shield className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
                  {item.prediction}
                </span>
                <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-200 line-clamp-3 mb-3">{item.text}</p>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Confidence: {(item.confidence * 100).toFixed(1)}%</span>
                <span>{item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Unknown Date'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedArticles;
