import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, Star } from 'lucide-react';

const sources = [
  { name: 'BBC News', url: 'bbc.com', trust: 97, category: 'International', status: 'Trusted' },
  { name: 'Reuters', url: 'reuters.com', trust: 96, category: 'Wire Service', status: 'Trusted' },
  { name: 'The Hindu', url: 'thehindu.com', trust: 93, category: 'National', status: 'Trusted' },
  { name: 'NDTV', url: 'ndtv.com', trust: 89, category: 'National', status: 'Trusted' },
  { name: 'Times of India', url: 'timesofindia.com', trust: 85, category: 'National', status: 'Trusted' },
  { name: 'India Today', url: 'indiatoday.in', trust: 83, category: 'National', status: 'Trusted' },
  { name: 'PIB India', url: 'pib.gov.in', trust: 99, category: 'Government', status: 'Trusted' },
  { name: 'ISRO', url: 'isro.gov.in', trust: 99, category: 'Government', status: 'Trusted' },
  { name: 'NASA', url: 'nasa.gov', trust: 99, category: 'Government', status: 'Trusted' },
  { name: 'WHO', url: 'who.int', trust: 95, category: 'International', status: 'Trusted' },
  { name: 'Viral News XYZ', url: 'viralnewsxyz.com', trust: 12, category: 'Unknown', status: 'Untrusted' },
  { name: 'Conspiracy Daily', url: 'conspiracydaily.net', trust: 5, category: 'Satire/Fake', status: 'Untrusted' },
  { name: 'Unknown Cure Blog', url: 'unknowncure.org', trust: 8, category: 'Health Misinformation', status: 'Untrusted' },
  { name: 'FakeAlert Portal', url: 'fakealert.xyz', trust: 3, category: 'Misinformation', status: 'Untrusted' },
];

const Sources: React.FC = () => {
  const trusted = sources.filter(s => s.status === 'Trusted');
  const untrusted = sources.filter(s => s.status === 'Untrusted');

  return (
    <div className="p-6 min-h-screen bg-[#0B1120]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">News Sources</h1>
        <p className="text-sm text-gray-400">Credibility ratings of known news sources monitored by TruthScan</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Sources', value: sources.length, color: 'text-blue-400' },
          { label: 'Trusted', value: trusted.length, color: 'text-green-400' },
          { label: 'Untrusted/Unknown', value: untrusted.length, color: 'text-red-400' },
        ].map((s, i) => (
          <div key={i} className="dashboard-card p-4 rounded-xl text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Trusted Sources */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <h2 className="text-sm font-bold text-white">Trusted Sources</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {trusted.map((src, i) => (
            <div key={i} className="dashboard-card p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-xs font-bold text-green-500">
                  {src.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{src.name}</p>
                  <p className="text-[10px] text-gray-500">{src.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-green-400">{src.trust}%</span>
                  </div>
                  <div className="w-20 h-1 bg-[#0B1120] rounded-full mt-1">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${src.trust}%` }}></div>
                  </div>
                </div>
                <a href={`https://${src.url}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Untrusted Sources */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-bold text-white">Untrusted / Flagged Sources</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {untrusted.map((src, i) => (
            <div key={i} className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-xs font-bold text-red-500">
                  {src.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{src.name}</p>
                  <p className="text-[10px] text-gray-500">{src.category}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-red-400">{src.trust}%</span>
                <div className="w-20 h-1 bg-[#0B1120] rounded-full mt-1">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${src.trust}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sources;
