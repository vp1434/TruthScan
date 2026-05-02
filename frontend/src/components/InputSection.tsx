import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link as LinkIcon, FileText, Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const InputSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('http://localhost:8000/analyze-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setResult(response.data);
      } else {
        const endpoint = activeTab === 'text' ? '/predict' : '/analyze-url';
        const payload = activeTab === 'text' ? { text: inputText } : { url };
        const response = await axios.post(`http://localhost:8000${endpoint}`, payload);
        setResult(response.data);
      }
    } catch (error) {
      console.error('Analysis failed', error);
      alert('Analysis failed. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <section className="py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Main Input Card */}
        <div className="bg-[#111827] rounded-[24px] p-6 border border-white/5 shadow-2xl">

          {/* Tab Toggle */}
          <div className="flex bg-[#0B1120] w-max p-1 rounded-xl mb-6 border border-white/5">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'text' ? 'bg-[#1e1b4b] text-[#818cf8]' : 'text-gray-400 hover:text-gray-300'}`}
            >
              <FileText className="w-4 h-4" />
              Text Input
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'url' ? 'bg-[#1e1b4b] text-[#818cf8]' : 'text-gray-400 hover:text-gray-300'}`}
            >
              <LinkIcon className="w-4 h-4" />
              URL Input
            </button>
          </div>

          {/* Input Row */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch mb-6">

            {/* Text / URL Area */}
            <div className="flex-1 relative min-h-[192px]">
              <AnimatePresence mode="wait">
                {activeTab === 'text' ? (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter news article, headline or paste text here..."
                      maxLength={5000}
                      className="w-full h-full min-h-[192px] bg-[#0B1120] border border-white/5 rounded-2xl p-5 text-gray-300 focus:outline-none focus:border-blue-500/50 transition-colors resize-none text-sm placeholder-gray-600"
                    />
                    <div className="absolute bottom-4 left-5 text-[10px] text-gray-600">
                      {inputText.length} / 5000 characters
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col gap-3"
                  >
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter the news article URL (e.g., https://bbc.com/news/...)"
                      className="w-full bg-[#0B1120] border border-white/5 rounded-2xl p-5 text-gray-300 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                    />
                    <div className="flex-1 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-600 gap-2">
                      <LinkIcon className="w-6 h-6 opacity-30" />
                      <p className="text-xs">We'll automatically extract the content</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* OR Divider */}
            <div className="hidden md:flex flex-col items-center justify-center gap-2 px-1">
              <div className="flex-1 w-px bg-white/5"></div>
              <div className="w-8 h-8 rounded-full bg-[#0B1120] border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-bold shrink-0">
                OR
              </div>
              <div className="flex-1 w-px bg-white/5"></div>
            </div>

            {/* File Upload */}
            <div className="w-full md:w-64 shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-full min-h-[192px] border-2 border-dashed border-white/5 bg-[#0B1120] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-blue-500/30 transition-colors cursor-pointer group"
              >
                <Upload className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-xs text-white mb-1">
                    {file ? file.name : 'Upload News Article / File'}
                  </p>
                  <p className="text-[10px] text-gray-500">PDF, TXT, DOCX (Max. 5MB)</p>
                </div>
                <button
                  type="button"
                  className="mt-1 px-4 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-medium rounded-lg transition-colors border border-white/10"
                >
                  Choose File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={loading || (!file && (activeTab === 'text' ? !inputText.trim() : !url.trim()))}
              className="px-8 py-3 w-64 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Analyzing...' : 'Analyze News'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 bg-[#111827] rounded-[24px] p-8 border border-white/5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${result.prediction === 'Fake' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-green-500/20 text-green-400 border border-green-500/20'}`}>
                    {result.prediction}
                  </div>
                  <div className="text-sm text-gray-400">
                    Confidence: <span className="text-white font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(result.timestamp).toLocaleString()}
                </div>
              </div>

              {result.highlights && result.highlights.length > 0 && (
                <>
                  <h3 className="text-base font-bold mb-3 text-white">Key Indicators</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.highlights.map((h: any, i: number) => (
                      <div
                        key={i}
                        className={`px-3 py-1 rounded-lg text-xs flex items-center gap-2 ${h.weight < 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}
                      >
                        {h.word}
                        <span className="opacity-60">{(Math.abs(h.weight) * 10).toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InputSection;
