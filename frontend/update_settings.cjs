const fs = require('fs');
let content = fs.readFileSync('./src/pages/Settings.tsx', 'utf8');

// Replace hardcoded dark classes with light/dark classes
content = content.replace(/bg-\[\#070d1c\]/g, 'bg-slate-50 dark:bg-[#070d1c]');
content = content.replace(/bg-\[\#0d1628\]/g, 'bg-white dark:bg-[#0d1628]');
content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
content = content.replace(/text-gray-500/g, 'text-slate-500 dark:text-gray-500');
content = content.replace(/text-gray-400/g, 'text-slate-600 dark:text-gray-400');
content = content.replace(/text-gray-600/g, 'text-slate-400 dark:text-gray-600');
content = content.replace(/text-gray-300/g, 'text-slate-700 dark:text-gray-300');
content = content.replace(/text-gray-200/g, 'text-slate-800 dark:text-gray-200');
content = content.replace(/border-white\/\[0\.07\]/g, 'border-slate-200 dark:border-white/[0.07]');
content = content.replace(/border-white\/\[0\.05\]/g, 'border-slate-200 dark:border-white/[0.05]');
content = content.replace(/border-white\/\[0\.08\]/g, 'border-slate-200 dark:border-white/[0.08]');
content = content.replace(/border-white\/8/g, 'border-slate-200 dark:border-white/8');
content = content.replace(/border-white\/5/g, 'border-slate-200 dark:border-white/5');
content = content.replace(/bg-white\/10/g, 'bg-slate-200 dark:bg-white/10');
content = content.replace(/bg-white\/5/g, 'bg-slate-100 dark:bg-white/5');
content = content.replace(/bg-white\/\[0\.04\]/g, 'bg-slate-50 dark:bg-white/[0.04]');
content = content.replace(/bg-white\/\[0\.06\]/g, 'bg-slate-100 dark:bg-white/[0.06]');

// Revert specific ones that are buttons/gradients which MUST stay text-white
content = content.replace(/text-slate-900 dark:text-white shadow-/g, 'text-white shadow-');
content = content.replace(/text-slate-900 dark:text-white text-sm font-bold/g, 'text-white text-sm font-bold');
content = content.replace(/text-slate-900 dark:text-white shrink-0/g, 'text-white shrink-0');
content = content.replace(/text-slate-900 dark:text-white mb-1/g, 'text-slate-900 dark:text-white mb-1'); // Keep this one

fs.writeFileSync('./src/pages/Settings.tsx', content);
