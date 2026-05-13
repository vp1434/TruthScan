import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, User, Loader2, Minimize2, Maximize2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CHATBOT_API = 'http://localhost:8000/chatbot';

async function sendMessage(prompt: string): Promise<string> {
  const res = await fetch(CHATBOT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  const data = await res.json();
  if (data.status === 'success') {
    return data.text ?? '';
  }
  throw new Error(data.message || 'Failed to get response from AI');
}

interface Message {
  id: string;
  type: 'user' | 'bot' | 'error';
  text: string;
  time: string;
}

const ChatWidget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'bot',
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm the TruthScan Assistant. Ask me anything about fake news detection, how to use the platform, or media literacy.`,
      time: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!minimized) inputRef.current?.focus();
  }, [minimized]);

  const addMessage = (msg: Omit<Message, 'id'>) =>
    setMessages(prev => [...prev, { ...msg, id: Date.now().toString() }]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    addMessage({ type: 'user', text, time: now() });
    setLoading(true);

    try {
      const reply = await sendMessage(text);
      addMessage({ type: 'bot', text: reply, time: now() });
    } catch (err: any) {
      console.error('Chatbot Error:', err);
      addMessage({
        type: 'error',
        text: err.message || 'Something went wrong. Please try again.',
        time: now()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-6 right-6 z-50 w-[380px] flex flex-col shadow-2xl rounded-2xl overflow-hidden"
      style={{ maxHeight: minimized ? 'auto' : '580px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111827] border border-white/10 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.4)]">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">TruthScan Assistant</p>
            <p className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
          >
            {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!minimized && (
        <>
          <div
            className="flex-1 overflow-y-auto bg-[#0B1120] border-x border-white/10 p-4 space-y-3"
            style={{ minHeight: '360px', maxHeight: '420px' }}
          >
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  msg.type === 'user' ? 'bg-indigo-500' : msg.type === 'error' ? 'bg-red-500/20' : 'bg-blue-600'
                }`}>
                  {msg.type === 'user'
                    ? (user?.name?.[0]?.toUpperCase() || <User className="w-3 h-3" />)
                    : msg.type === 'error'
                    ? <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    : <Bot className="w-3.5 h-3.5 text-white" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] ${msg.type === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.type === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : msg.type === 'error'
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-sm'
                      : 'bg-[#111827] border border-white/5 text-gray-200 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-600 px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-[#111827] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-[#111827] border border-white/10 rounded-b-2xl p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about fake news detection..."
                disabled={loading}
                className="flex-1 bg-[#0B1120] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(37,99,235,0.3)]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-1.5 text-center">
              Powered by TruthScan AI
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChatWidget;
