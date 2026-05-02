import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Image as ImageIcon, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LLM_API = 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQnA5TTJtZWVIZFFud0hFQTBqb2thOHBnNXk3cFc1T0dQYXVjUGNrY2d2RUJZUjNfb1ZoQU82X3pDS05UWUI3TzRmUmZzYmdBbVpBWm1oazdSVF84M2FIVzFhQkE9PQ==';
const IMG_API = 'https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQnA5TTJtZWVIZFFud0hFQTBqb2thOHBnNXk3cFc1T0dQYXVjUGNrY2d2RUJZUjNfb1ZoQU82X3pDS05UWUI3TzRmUmZzYmdBbVpBWm1oazdSVF84M2FIVzFhQkE9PQ==';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'image' | 'error';
  text?: string;
  imageUrl?: string;
  time: string;
}

const PERSONA = `You are TruthScan Assistant — a helpful AI for the TruthScan fake news detection platform.
Help users understand how fake news detection works, explain results, guide them through features, and answer general questions.
If asked to generate an image, reply with "/image " followed by the description.
Keep responses concise and friendly.`;

async function callApi(url: string, prompt: string): Promise<any> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}

const ChatWidget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'bot',
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm the TruthScan Assistant. Ask me anything about fake news detection, how to use the platform, or type **/image** followed by a description to generate an image.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addMessage = (msg: Omit<Message, 'id'>) =>
    setMessages(prev => [...prev, { ...msg, id: Date.now().toString() }]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    addMessage({ type: 'user', text, time: now() });
    setLoading(true);

    try {
      const isImageRequest = text.toLowerCase().startsWith('/image');

      if (isImageRequest) {
        const desc = text.slice(6).trim();
        const data = await callApi(IMG_API, desc);
        if (data.status === 'success') {
          addMessage({ type: 'image', imageUrl: data.imageUrl, time: now() });
        } else {
          addMessage({ type: 'error', text: 'Failed to generate image. Try again.', time: now() });
        }
      } else {
        const data = await callApi(LLM_API, PERSONA + '\nUser: ' + text);
        if (data.status === 'success') {
          const reply: string = data.text ?? '';
          if (reply.trim().toLowerCase().startsWith('/image')) {
            const desc = reply.slice(reply.toLowerCase().indexOf('/image') + 6).trim();
            const imgData = await callApi(IMG_API, desc);
            if (imgData.status === 'success') {
              addMessage({ type: 'image', imageUrl: imgData.imageUrl, time: now() });
            }
          } else {
            addMessage({ type: 'bot', text: reply, time: now() });
          }
        } else {
          addMessage({ type: 'error', text: 'Something went wrong. Please try again.', time: now() });
        }
      }
    } catch {
      addMessage({ type: 'error', text: 'Connection error. Check your internet and try again.', time: now() });
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
      className="fixed bottom-6 right-6 z-50 w-[380px] flex flex-col shadow-2xl"
      style={{ maxHeight: minimized ? 'auto' : '600px' }}
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
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(!minimized)} className="text-gray-400 hover:text-white transition-colors p-1">
            {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!minimized && (
        <>
          <div className="flex-1 overflow-y-auto bg-[#0B1120] border-x border-white/10 p-4 space-y-3"
            style={{ minHeight: '380px', maxHeight: '440px' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  msg.type === 'user' ? 'bg-indigo-500' : 'bg-blue-600'
                }`}>
                  {msg.type === 'user'
                    ? (user?.name?.[0]?.toUpperCase() || <User className="w-3 h-3" />)
                    : <Bot className="w-3.5 h-3.5 text-white" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] ${msg.type === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {msg.type === 'image' && msg.imageUrl ? (
                    <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                      <img src={msg.imageUrl} alt="Generated"
                        className="w-48 h-48 rounded-xl object-cover border border-white/10 hover:opacity-90 transition-opacity" />
                    </a>
                  ) : (
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.type === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : msg.type === 'error'
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-sm'
                        : 'bg-[#111827] border border-white/5 text-gray-200 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  )}
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
              <div className="flex-1 flex items-center bg-[#0B1120] border border-white/5 rounded-xl px-3 gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Ask anything or type "/image ..."'
                  disabled={loading}
                  className="flex-1 bg-transparent py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none disabled:opacity-50"
                />
                <button
                  title="Generate image with /image <description>"
                  className="text-gray-600 hover:text-blue-400 transition-colors shrink-0"
                  onClick={() => { setInput('/image '); inputRef.current?.focus(); }}
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(37,99,235,0.3)]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-1.5 text-center">
              Powered by TruthScan AI · <span className="text-indigo-500">/image</span> to generate images
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChatWidget;
