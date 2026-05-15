import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Target, Cpu, Globe, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpgradePro: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '0',
      desc: 'Perfect for casual fact-checking',
      features: [
        '50 analyses per month',
        'Basic AI model',
        'Standard history (7 days)',
        'Community support',
        'Ad-supported'
      ],
      button: 'Current Plan',
      active: false,
      color: 'blue'
    },
    {
      name: 'Pro',
      price: '19',
      desc: 'For power users & professionals',
      features: [
        'Unlimited analyses',
        'Advanced BERT model',
        'Full analysis history',
        'Priority AI inference',
        'LIME word explanations',
        'Premium support'
      ],
      button: 'Get Started',
      active: true,
      color: 'indigo'
    },
    {
      name: 'Enterprise',
      price: '99',
      desc: 'Advanced security for teams',
      features: [
        'Bulk URL scanning',
        'API access (10k/mo)',
        'Custom model training',
        'Team collaboration',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      button: 'Contact Sales',
      active: false,
      color: 'purple'
    }
  ];

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50 dark:bg-[#070d1c] transition-colors duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold mb-4 uppercase tracking-wider"
        >
          <Star className="w-3 h-3 fill-current" />
          Go Premium
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6"
        >
          Unleash the Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">TruthScan Pro</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 dark:text-gray-400"
        >
          Upgrade your account to access advanced AI models, unlimited history, and powerful news analysis tools designed for professionals.
        </motion.p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.3 }}
              plan.active 
                ? 'bg-white dark:bg-[#0d1628] border-indigo-500 shadow-[0_20px_50px_rgba(79,70,229,0.15)] scale-105 z-10' 
                : 'bg-white/50 dark:bg-[#0d1628]/40 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            } shadow-sm transition-all duration-300`}
          >
            {plan.active && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                <span className="text-slate-500 dark:text-gray-500 text-sm">/month</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400">{plan.desc}</p>
            </div>

            <div className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-gray-500'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm text-slate-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => plan.name !== 'Free' && alert('Payment system integration coming soon!')}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                plan.active
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-indigo-600/20'
                  : plan.name === 'Free'
                  ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-500 cursor-default'
                  : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10'
              }`}
            >
              {plan.button}
              {!plan.active && plan.name !== 'Free' && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why Choose Pro?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'Deep Analysis', desc: 'Go beyond keywords with semantic pattern matching.', color: 'text-blue-500' },
            { icon: Zap, title: 'Fast Priority', desc: 'Get your results in milliseconds with dedicated AI nodes.', color: 'text-yellow-500' },
            { icon: Target, title: 'Explainability', desc: 'See exactly which words influenced the AI result.', color: 'text-green-500' },
            { icon: Globe, title: 'Global Data', desc: 'Cross-reference with real-time news across 100+ languages.', color: 'text-purple-500' },
          ].map((feat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-200 dark:border-white/5">
              <feat.icon className={`w-8 h-8 ${feat.color} mb-4`} />
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{feat.title}</h4>
              <p className="text-xs text-slate-500 dark:text-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="mt-24 text-center pb-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-sm text-slate-500 hover:text-blue-500 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UpgradePro;
