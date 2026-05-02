import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Shield, Target, Users, Zap } from 'lucide-react';

const team = [
  {
    name: 'Bikki Kumar Pandit',
    role: 'Project Lead & ML Engineer',
    avatar: 'BK',
    avatarBg: 'from-blue-500 to-indigo-600',
    bio: 'Leads the overall project and builds core ML models for fake news detection using BERT and TF-IDF.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Shubham Kumar',
    role: 'Full Stack Developer',
    avatar: 'SK',
    avatarBg: 'from-purple-500 to-pink-600',
    bio: 'Builds the frontend React UI and integrates with FastAPI backend, ensuring pixel-perfect design.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Vikash Kumar',
    role: 'Backend Developer',
    avatar: 'VK',
    avatarBg: 'from-green-500 to-teal-600',
    bio: 'Designs and maintains the FastAPI backend, database schema, and REST API architecture.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Mukesh Pandit',
    role: 'Data Scientist',
    avatar: 'MP',
    avatarBg: 'from-orange-500 to-red-600',
    bio: 'Responsible for data collection, preprocessing, and training the classification models on the ISOT dataset.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Kailash Kumar',
    role: 'UI/UX Designer',
    avatar: 'KK',
    avatarBg: 'from-yellow-500 to-orange-600',
    bio: 'Designs the user interface, creates wireframes, and ensures a premium user experience across all pages.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

const stats = [
  { icon: Target, value: '98.8%', label: 'Model Accuracy', color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: Shield, value: '44K+', label: 'Articles Trained On', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Users, value: '5', label: 'Team Members', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Zap, value: '2.3s', label: 'Avg Detection Time', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Shield className="w-3 h-3" /> About TruthScan
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Fighting Misinformation<br />
            with <span className="text-[#6366f1]">Artificial Intelligence</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            TruthScan is an AI-powered fake news detection platform built to help people identify
            misinformation quickly and accurately. Using state-of-the-art NLP models trained on
            thousands of real and fake news articles, we provide transparent, explainable results.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111827] border border-white/5 rounded-2xl p-6 text-center"
            >
              <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#1e1b4b]/60 to-[#111827] border border-[#312e81]/40 rounded-2xl p-10 mb-20 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl mx-auto">
            In an era of rapid information spread, it is critical for citizens to have access to tools
            that help verify the authenticity of news. Our mission is to make AI-powered fact-checking
            accessible, fast, and understandable for everyone — empowering individuals to make
            informed decisions in the digital age.
          </p>
        </motion.div>

        {/* Team */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Meet the Team</h2>
            <p className="text-gray-400 text-sm">The talented people behind TruthScan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group"
              >
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white text-xl font-bold mb-5 shadow-lg`}>
                  {member.avatar}
                </div>

                <h3 className="text-base font-bold text-white mb-0.5">{member.name}</h3>
                <p className="text-xs text-blue-400 font-medium mb-3">{member.role}</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-5">{member.bio}</p>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-lg text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-center mb-8">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'React + TypeScript', tag: 'Frontend', color: 'text-blue-400' },
              { name: 'FastAPI + Python', tag: 'Backend', color: 'text-green-400' },
              { name: 'BERT + TF-IDF', tag: 'ML Models', color: 'text-purple-400' },
              { name: 'MongoDB', tag: 'Database', color: 'text-yellow-400' },
              { name: 'HuggingFace Transformers', tag: 'NLP', color: 'text-pink-400' },
              { name: 'Recharts', tag: 'Analytics', color: 'text-orange-400' },
              { name: 'LIME', tag: 'Explainability', color: 'text-teal-400' },
              { name: 'Framer Motion', tag: 'Animation', color: 'text-red-400' },
            ].map((t, i) => (
              <div key={i} className="bg-[#0B1120] border border-white/5 rounded-xl p-4 text-center">
                <p className={`text-sm font-semibold ${t.color} mb-1`}>{t.name}</p>
                <p className="text-[10px] text-gray-500">{t.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
