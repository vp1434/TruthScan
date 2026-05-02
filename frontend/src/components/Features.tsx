import React from 'react';
import { ShieldCheck, BarChart3, History, BrainCircuit } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, iconBg, iconColor }: { icon: any, title: string, description: string, iconBg: string, iconColor: string }) => (
  <div className="bg-[#111827] p-6 rounded-[20px] border border-white/5 hover:border-white/10 transition-all group shadow-xl">
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-[14px] ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-[15px] font-bold text-white mb-1.5">{title}</h3>
        <p className="text-[13px] text-gray-400 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  </div>
);

const Features: React.FC = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-10 gap-6">
          <div className="h-px w-16 bg-blue-500/50"></div>
          <h2 className="text-xl font-bold text-white">Powerful Features</h2>
          <div className="h-px w-16 bg-blue-500/50"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={BrainCircuit}
            title="AI Powered Detection"
            description="Advanced machine learning models to detect fake news with high accuracy."
            iconBg="bg-pink-500/10"
            iconColor="text-pink-500"
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Real-time Analysis"
            description="Get instant results in just a few seconds and stay ahead of misinformation."
            iconBg="bg-green-500/10"
            iconColor="text-green-500"
          />
          <FeatureCard 
            icon={BarChart3}
            title="Detailed Insights"
            description="View confidence score, key indicators and reasoning behind the prediction."
            iconBg="bg-blue-500/10"
            iconColor="text-blue-500"
          />
          <FeatureCard 
            icon={History}
            title="History Tracking"
            description="Track all your past searches and results in one place for easy reference."
            iconBg="bg-orange-500/10"
            iconColor="text-orange-500"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
