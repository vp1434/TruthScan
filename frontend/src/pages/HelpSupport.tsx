import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MessageCircle, Book, Shield } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ChatWidget from '../components/ChatWidget';

const faqs = [
  { q: 'How does TruthScan detect fake news?', a: 'TruthScan uses a combination of TF-IDF + Logistic Regression for fast detection and a BERT-based zero-shot classifier for higher accuracy. Both models are trained on over 44,000 real and fake news articles from the ISOT dataset, achieving 98.8% accuracy.' },
  { q: 'What file formats can I upload?', a: 'You can upload TXT, PDF, and DOCX files up to 5MB in size. The system automatically extracts the text content and runs it through the detection pipeline.' },
  { q: 'Does it support languages other than English?', a: 'Yes! For non-English text, TruthScan automatically detects the language and routes it to our multilingual BERT model (facebook/bart-large-mnli) which supports 100+ languages.' },
  { q: 'How accurate is the model?', a: 'Our TF-IDF baseline model achieves 98.8% accuracy on the test set. The BERT model provides additional confidence for borderline cases. However, no AI model is 100% accurate — always use critical thinking alongside the tool.' },
  { q: 'Is my data stored?', a: 'Analysis results are stored in our database to power your History and Dashboard features. We do not share your data with third parties. You can delete your history at any time.' },
  { q: 'Can I use TruthScan via API?', a: 'Yes! TruthScan exposes a REST API built with FastAPI. You can POST to /predict with text, /analyze-url with a URL, or /analyze-file with a file upload.' },
  { q: 'What is the LIME explanation feature?', a: 'LIME (Local Interpretable Model-agnostic Explanations) highlights which specific words in the article most influenced the prediction — giving you insight into why the model classified the content as Real or Fake.' },
];

const HelpSupport: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="p-6 min-h-screen bg-[#0B1120]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Help & Support</h1>
        <p className="text-sm text-gray-400">Everything you need to get started with TruthScan</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
          className="dashboard-card p-5 rounded-xl flex items-start gap-4 hover:border-white/10 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Book className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-0.5">Documentation</p>
            <p className="text-xs text-gray-500">Read the full API and user guide</p>
          </div>
        </a>

        {/* Live Chat — opens ChatWidget */}
        <button
          onClick={() => setChatOpen(true)}
          className="dashboard-card p-5 rounded-xl flex items-start gap-4 hover:border-green-500/20 transition-colors cursor-pointer text-left w-full"
        >
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-0.5">Live Chat</p>
            <p className="text-xs text-gray-500">Chat with our AI assistant now</p>
          </div>
        </button>

        <a href="mailto:support@truthscan.ai"
          className="dashboard-card p-5 rounded-xl flex items-start gap-4 hover:border-white/10 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-0.5">Email Support</p>
            <p className="text-xs text-gray-500">support@truthscan.ai</p>
          </div>
        </a>
      </div>

      {/* FAQ */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" /> Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="dashboard-card rounded-xl overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/3 transition-colors">
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                {openIndex === i
                  ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-[#1e1b4b]/60 to-[#111827] border border-[#312e81]/30 rounded-2xl p-8 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Still need help?</h3>
        <p className="text-gray-400 text-sm mb-5">Our team is here to help you get the most out of TruthScan.</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => setChatOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition-colors">
            <MessageCircle className="w-4 h-4" /> Start Chat
          </button>
          <a href="mailto:support@truthscan.ai"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors">
            <Mail className="w-4 h-4" /> Contact Us
          </a>
        </div>
      </div>

      {/* Chat Widget */}
      <AnimatePresence>
        {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default HelpSupport;
