import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-4xl font-extrabold mb-3">Get in <span className="text-[#6366f1]">Touch</span></h1>
          <p className="text-gray-400 text-base">Have questions? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Info */}
          <div className="md:col-span-2 space-y-5">
            {[
              { icon: Mail, label: 'Email', value: 'support@truthscan.ai', color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { icon: Phone, label: 'Phone', value: '+91 9876543210', color: 'text-green-400', bg: 'bg-green-500/10' },
              { icon: MapPin, label: 'Location', value: 'Bihar, India', color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { icon: MessageSquare, label: 'Response Time', value: 'Within 24 hours', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-[#111827] border border-white/5 rounded-2xl p-5"
              >
                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                  <p className="text-sm text-white font-medium">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3 bg-[#111827] border border-white/5 rounded-2xl p-8"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-10 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-2 px-5 py-2 bg-blue-600 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
                >Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Your Name</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                      placeholder="Bikki Kumar" className="w-full px-4 py-3 bg-[#0B1120] border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/40" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                      placeholder="you@example.com" className="w-full px-4 py-3 bg-[#0B1120] border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/40" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Subject</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required
                    placeholder="How can we help?" className="w-full px-4 py-3 bg-[#0B1120] border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/40" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Message</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5}
                    placeholder="Tell us more about your query..." className="w-full px-4 py-3 bg-[#0B1120] border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/40 resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
