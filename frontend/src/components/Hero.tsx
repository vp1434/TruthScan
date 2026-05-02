import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, FileText, ShieldCheck } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, iconBg, iconColor }: { icon: any, label: string, value: string, iconBg: string, iconColor: string }) => (
  <div className="glass p-5 rounded-[20px] flex items-center gap-4 min-w-[160px] bg-[#111827] border-white/5 hover:border-white/10 transition-colors">
    <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-white leading-tight">{value}</p>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
    </div>
  </div>
);

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Detect Fake News,<br />
            Stay <span className="text-[#6366f1]">Informed</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-lg">
            Analyze news articles, headlines or URLs and find out whether the news is Real or Fake using AI.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-max">
            <StatCard icon={FileText} label="News Analyzed" value="25K+" iconBg="bg-blue-500/10" iconColor="text-blue-500" />
            <StatCard icon={ShieldCheck} label="Accuracy" value="95.6%" iconBg="bg-green-500/10" iconColor="text-green-500" />
            <StatCard icon={Users} label="Happy Users" value="10K+" iconBg="bg-purple-500/10" iconColor="text-purple-500" />
            <StatCard icon={Zap} label="Avg. Detection" value="2.3s" iconBg="bg-yellow-500/10" iconColor="text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative flex items-center justify-start pl-0">
            {/* Soft glow background */}
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-75 pointer-events-none"></div>
            <motion.img
              src="/src/fakenews.png"
              alt="Fake News Detection Illustration"
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-lg drop-shadow-2xl select-none translate-x-32"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
