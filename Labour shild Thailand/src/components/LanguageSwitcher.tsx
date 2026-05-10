import { useLang } from '../lib/LanguageContext';
import type { Lang } from '../lib/i18n';

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'th', label: 'TH', flag: '🇹🇭' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-0.5 bg-slate-800/80 border border-slate-700/60 rounded-lg p-0.5">
      {LANGS.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all ${lang === code ? 'bg-blue-600/40 text-blue-200' : 'text-slate-400 hover:text-white'}`}
          title={flag}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
