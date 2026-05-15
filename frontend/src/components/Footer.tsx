import React from 'react';
import { Search, Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/10 glass">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Search className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">TruthScan</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Empowering individuals with AI-driven news verification to combat misinformation and promote truth in the digital age.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Product</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">API</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/vp1434" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/bikki-kumar-pandit-b98b34259/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5 text-xs text-gray-500">
          <p>© 2026 TruthScan. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
