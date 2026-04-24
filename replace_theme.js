const fs = require('fs');
const path = require('path');

const dir = 'c:/Projects/CRM-Prototype/src/components/Insights/HoneycombBuilder';

const replacements = {
    'bg-[#0B1120]': 'bg-slate-50',
    'bg-[#1e293b]': 'bg-white',
    'bg-[#0f172a]': 'bg-slate-50',
    'border-[#334155]': 'border-slate-200',
    'hover:bg-[#334155]': 'hover:bg-slate-100',
    'hover:bg-[#1e293b]': 'hover:bg-slate-50',
    'text-white': 'text-slate-900',
    'text-slate-200': 'text-slate-800',
    'text-slate-300': 'text-slate-700',
    'text-slate-400': 'text-slate-500',
    'text-slate-500': 'text-slate-400',
    'text-slate-600': 'text-slate-300',
    'border-slate-600': 'border-slate-300',
    'border-slate-500': 'border-slate-300',
    'hover:border-slate-500': 'hover:border-slate-300',
    'hover:text-slate-300': 'hover:text-slate-800',
    'bg-slate-800': 'bg-white',
    'bg-slate-900': 'bg-slate-50',
};

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    for (const [key, value] of Object.entries(replacements)) {
        // Use a global regex replacement for each exact class match
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, value);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
