import { useState } from 'react';
import { Shield, Calculator, FileSearch, BookOpen, FileText, Menu, X, Clock, Lock, MapPin } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLang } from '../lib/LanguageContext';

type Page = 'home' | 'calculator' | 'scanner' | 'guide' | 'documents' | 'ot' | 'evidence' | 'map';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLang();

  const NAV_ITEMS: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'calculator', label: t('navCalc'), icon: <Calculator size={16} /> },
    { page: 'scanner', label: t('navScan'), icon: <FileSearch size={16} /> },
    { page: 'ot', label: t('navOT'), icon: <Clock size={16} /> },
    { page: 'guide', label: t('navGuide'), icon: <BookOpen size={16} /> },
    { page: 'documents', label: t('navDocs'), icon: <FileText size={16} /> },
    { page: 'evidence', label: t('navEvidence'), icon: <Lock size={16} /> },
    { page: 'map', label: t('navMap'), icon: <MapPin size={16} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-blue-800/40 backdrop-blur-md"
      style={{ background: 'rgba(15, 31, 61, 0.97)' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <button
          onClick={() => { onNavigate('home'); setMenuOpen(false); }}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Shield size={16} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-sm tracking-wide">{t('appName')}</span>
            <span className="text-blue-400 text-xs font-medium">{t('appSub')}</span>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_ITEMS.map(({ page, label, icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
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

        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <button
            className="lg:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-blue-800/30" style={{ background: 'rgba(15, 31, 61, 0.99)' }}>
          <div className="px-4 py-3 grid grid-cols-2 gap-1.5">
            {NAV_ITEMS.map(({ page, label, icon }) => (
              <button
                key={page}
                onClick={() => { onNavigate(page); setMenuOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
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
