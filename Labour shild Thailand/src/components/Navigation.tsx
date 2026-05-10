import { useState } from 'react';
import { Shield, Calculator, FileSearch, BookOpen, FileText, Menu, X } from 'lucide-react';

type Page = 'home' | 'calculator' | 'scanner' | 'guide' | 'documents';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'calculator', label: 'Calculator', icon: <Calculator size={18} /> },
  { page: 'scanner', label: 'Contract Scan', icon: <FileSearch size={18} /> },
  { page: 'guide', label: 'Fight Back', icon: <BookOpen size={18} /> },
  { page: 'documents', label: 'Documents', icon: <FileText size={18} /> },
];

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900 border-b border-blue-800/40 backdrop-blur-md"
      style={{ background: 'rgba(15, 31, 61, 0.97)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => { onNavigate('home'); setMenuOpen(false); }}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Shield size={16} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-sm tracking-wide">The Labor Shield</span>
            <span className="text-blue-400 text-xs font-medium">Thailand 2026</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ page, label, icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <button
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-blue-800/30 bg-navy-900" style={{ background: 'rgba(15, 31, 61, 0.99)' }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ page, label, icon }) => (
              <button
                key={page}
                onClick={() => { onNavigate(page); setMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
