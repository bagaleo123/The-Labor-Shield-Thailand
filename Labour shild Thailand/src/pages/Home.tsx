import { Shield, Calculator, FileSearch, BookOpen, FileText, ChevronRight, CheckCircle, AlertTriangle, Scale, Globe, Clock, Lock, MapPin } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';

type Page = 'home' | 'calculator' | 'scanner' | 'guide' | 'documents' | 'ot' | 'evidence' | 'map';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const FEATURES = [
  {
    page: 'calculator' as Page,
    icon: <Calculator size={24} className="text-blue-400" />,
    title: 'Severance Calculator',
    description: 'Enter your salary and work history. Get an exact breakdown of severance, notice pay, and sick leave owed.',
    badge: 'Thai Law 2026',
    badgeColor: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  },
  {
    page: 'scanner' as Page,
    icon: <FileSearch size={24} className="text-red-400" />,
    title: 'Contract Scanner',
    description: 'Upload or paste your employment contract. Flags illegal clauses, missing protections, and red flags instantly.',
    badge: 'Instant Analysis',
    badgeColor: 'bg-red-900/50 text-red-300 border-red-700/50',
  },
  {
    page: 'ot' as Page,
    icon: <Clock size={24} className="text-cyan-400" />,
    title: 'OT & Tax Calculator',
    description: 'Calculate overtime (1.5x/2x/3x), public holiday pay, SSO contributions, and estimated personal income tax.',
    badge: 'Min Wage 2026',
    badgeColor: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/50',
  },
  {
    page: 'guide' as Page,
    icon: <BookOpen size={24} className="text-emerald-400" />,
    title: 'Fight Back Guide',
    description: 'Step-by-step instructions to file complaints with DLPW, SSO, and access the Lawyers Council of Thailand.',
    badge: 'Official Channels',
    badgeColor: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  },
  {
    page: 'documents' as Page,
    icon: <FileText size={24} className="text-amber-400" />,
    title: 'Document Generator',
    description: 'Generate formal demand letters in both English and Legal Thai, ready to send to HR or court.',
    badge: 'Bilingual',
    badgeColor: 'bg-amber-900/50 text-amber-300 border-amber-700/50',
  },
  {
    page: 'evidence' as Page,
    icon: <Lock size={24} className="text-teal-400" />,
    title: 'Evidence Locker',
    description: 'Securely upload and cryptographically timestamp your pay slips, screenshots, and documents for court.',
    badge: 'SHA-256 Sealed',
    badgeColor: 'bg-teal-900/50 text-teal-300 border-teal-700/50',
  },
  {
    page: 'map' as Page,
    icon: <MapPin size={24} className="text-rose-400" />,
    title: 'Justice Map',
    description: 'Find DLPW offices in Bangkok, Phuket, Pattaya, and Chiang Mai with GPS links and filing checklists.',
    badge: 'GPS Locations',
    badgeColor: 'bg-rose-900/50 text-rose-300 border-rose-700/50',
  },
];

const RIGHTS = [
  '30 fully paid sick days per year — employer cannot deny',
  'Severance pay after 120 days of employment',
  'Minimum 1 month notice (or cash in lieu) before termination',
  'Termination due to illness is illegal',
  'SSO contribution cap: ฿875/month (5% of ฿17,500)',
  'Annual leave cannot substitute sick leave',
];

export default function Home({ onNavigate }: HomeProps) {
  const { t } = useLang();
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 50%, #0f2850 100%)',
          }}
        />
        <div className="absolute inset-0 -z-10 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234299e1' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5 text-blue-300 text-sm font-medium mb-8">
            <Globe size={14} />
            Thai Labor Law 2026 — Updated Edition
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-900/60">
              <Shield size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 font-light mb-3">
            {t('heroSub')}
          </p>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('heroBody')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-800/50 hover:-translate-y-0.5"
            >
              <Calculator size={18} />
              {t('calcBtn')}
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <FileSearch size={18} />
              {t('scanBtn')}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Rights Summary */}
      <section className="bg-slate-900 py-12 px-4 border-y border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Scale size={20} className="text-blue-400" />
            <h2 className="text-white font-bold text-lg">{t('rightsTitle')}</h2>
            <span className="bg-blue-900/50 text-blue-300 border border-blue-700/50 text-xs font-medium px-2 py-0.5 rounded-full">2026</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {RIGHTS.map((right, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-slate-200 text-sm leading-relaxed">{right}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4" style={{ background: '#0a1628' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('fourTools')}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {t('fourToolsSub')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ page, icon, title, description, badge, badgeColor }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className="group text-left bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {icon}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badgeColor}`}>
                    {badge}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{description}</p>
                <div className="flex items-center gap-1 text-blue-400 text-sm font-medium group-hover:gap-2 transition-all duration-200">
                  {t('openTool')} <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Banner */}
      <section className="py-10 px-4 bg-amber-950/20 border-y border-amber-800/20">
        <div className="max-w-4xl mx-auto flex items-start gap-4">
          <AlertTriangle size={22} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-amber-300 font-semibold mb-1">Know Your Enemy: Common Employer Violations</h3>
            <p className="text-amber-200/70 text-sm leading-relaxed">
              The most common violations against expat workers include: denying sick pay, demanding immediate resignation under threat, making illegal salary deductions, and termination during illness. All of these are prosecutable under Thai labor law. The Labor Shield helps you identify and fight them.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
