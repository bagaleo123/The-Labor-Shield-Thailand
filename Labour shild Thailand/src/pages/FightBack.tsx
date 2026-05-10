import { useState } from 'react';
import { BookOpen, Phone, MapPin, Clock, ChevronDown, ExternalLink, AlertTriangle, CheckCircle, Shield, Scale, Users } from 'lucide-react';

type Agency = {
  id: string;
  name: string;
  thaiName: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  hotline: string;
  address: string;
  hours: string;
  jurisdiction: string;
  steps: { step: number; title: string; detail: string }[];
  docs: string[];
  tips: string[];
};

const AGENCIES: Agency[] = [
  {
    id: 'dlpw',
    name: 'Department of Labour Protection and Welfare',
    thaiName: 'กรมสวัสดิการและคุ้มครองแรงงาน (กสร.)',
    icon: <Shield size={22} />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-700/50',
    hotline: '1546',
    address: 'Mitthraphap Road, Din Daeng, Bangkok 10400',
    hours: 'Mon–Fri 08:30–16:30',
    jurisdiction: 'Handles all labor rights violations: unpaid wages, illegal termination, sick pay denial, overtime violations, and severance disputes.',
    steps: [
      {
        step: 1,
        title: 'Gather Your Evidence',
        detail: 'Collect: pay slips (3–6 months), employment contract, work permit, passport, any written termination notice, and bank statements showing salary deposits. Screenshot any WhatsApp/email messages about your dismissal.',
      },
      {
        step: 2,
        title: 'File a Complaint (In Person or Online)',
        detail: 'Visit your local Labour Protection and Welfare Office (LPWO) in person, or file at e-Service.labour.go.th. Bring original documents and 2 copies of each. A labour officer will interview you — you can request an interpreter.',
      },
      {
        step: 3,
        title: 'The Mediation Process',
        detail: 'The DLPW will summon your employer for mediation within 7 days. Both parties meet with a labour inspector. If agreement is reached, it is legally binding. If employer refuses to attend or pay, the case escalates.',
      },
      {
        step: 4,
        title: 'No Settlement — Escalate',
        detail: 'If mediation fails, the officer issues a written order (คำสั่งพนักงานตรวจแรงงาน). Your employer has 30 days to comply or appeal. If they appeal, the case goes to the Labour Court. You may be assigned free legal aid.',
      },
      {
        step: 5,
        title: 'Enforcement',
        detail: 'If the employer ignores the order, the DLPW can seize employer assets to satisfy your claim. Criminal charges may be filed for willful non-compliance (up to 6 months imprisonment + fines).',
      },
    ],
    docs: ['Original passport + work permit', 'Employment contract (all pages)', '3–6 months of pay slips', 'Written termination notice (if any)', 'Bank account statements', 'SSO card / contribution history'],
    tips: [
      'File within 2 years of the violation — cases expire.',
      'Bring a Thai-speaking colleague or hire a translator.',
      'Do NOT resign before filing — this complicates your case.',
      'Request a document receipt (ใบรับแจ้ง) at the counter.',
    ],
  },
  {
    id: 'sso',
    name: 'Social Security Office',
    thaiName: 'สำนักงานประกันสังคม (สปส.)',
    icon: <Users size={22} />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-700/50',
    hotline: '1506',
    address: 'Nonthaburi (head office) + local branches nationwide',
    hours: 'Mon–Fri 08:30–16:30',
    jurisdiction: 'Handles SSO contribution disputes, sick pay claims beyond 30 days, unemployment benefits, and maternity benefits.',
    steps: [
      {
        step: 1,
        title: 'Verify Your SSO Status',
        detail: 'Check your contribution history at sso.go.th or via the MySSOApp. You need at least 3 months of contributions to claim sick benefits and 6 months for unemployment. Verify your employer has been paying your SSO correctly.',
      },
      {
        step: 2,
        title: 'Claim Extended Sick Pay (Days 31+)',
        detail: 'If you were sick for more than 30 days, file a claim at your local SSO branch within 2 years. Bring a doctor certificate, hospital discharge papers, and your SSO card. SSO pays 50% of your average daily wage for days 31–90.',
      },
      {
        step: 3,
        title: 'Claim Unemployment Benefit',
        detail: 'If terminated (not resigned or for misconduct), register at the SSO within 30 days. You will receive 50% of your daily wage for up to 180 days. Bring: resignation/termination letter, SSO card, bank book.',
      },
      {
        step: 4,
        title: 'Report Employer Non-Payment',
        detail: 'If your employer failed to register you or withheld your SSO contributions, this is a criminal offense. File a complaint at SSO — the employer faces fines and must pay all back contributions plus penalties.',
      },
    ],
    docs: ['SSO card (บัตรประกันสังคม)', 'Work permit + passport', 'Bank passbook', 'Termination letter', 'Medical certificates (for sick claims)', 'Pay slips showing SSO deductions'],
    tips: [
      'SSO wage ceiling is ฿17,500 (2026). Max contribution = ฿875/month.',
      'You can continue SSO voluntarily (Section 39) after termination.',
      'Unemployment benefit registration must be done within 30 days of termination.',
      'SSO hotline 1506 has English-language support.',
    ],
  },
  {
    id: 'lawyers',
    name: "Lawyers Council of Thailand",
    thaiName: 'สภาทนายความแห่งประเทศไทย',
    icon: <Scale size={22} />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    borderColor: 'border-amber-700/50',
    hotline: '02-627-3322',
    address: '149 Ratchadapisek Rd, Chatuchak, Bangkok 10900',
    hours: 'Mon–Fri 08:30–16:00',
    jurisdiction: 'Provides free legal consultation, lawyer referrals for labour cases, and legal aid for low-income workers.',
    steps: [
      {
        step: 1,
        title: 'Free Legal Consultation',
        detail: 'The Lawyers Council offers free 30-minute consultations. Call 02-627-3322 or walk in. Explain your case briefly and they will assign a lawyer. You can also request pro bono (free) representation if you qualify.',
      },
      {
        step: 2,
        title: 'Request a Labour Law Specialist',
        detail: 'Specifically ask for a lawyer specializing in labor law (กฎหมายแรงงาน). Expat cases often involve work permit nuances — ensure the lawyer has experience with foreign worker cases.',
      },
      {
        step: 3,
        title: 'Prepare Your Case Summary',
        detail: 'Write a clear timeline: start date, events, termination date. Translate key documents to Thai. Calculate your claimed amounts using The Labor Shield calculator. A prepared client gets faster, better representation.',
      },
      {
        step: 4,
        title: 'Labour Court Filing',
        detail: 'Labour Court filing in Thailand is free for workers. Your lawyer files the claim. Cases are heard relatively quickly (3–12 months). Judgments can include back pay, severance, and additional compensation for moral damages.',
      },
    ],
    docs: ['Full case timeline (written in English and/or Thai)', 'All employment documents', 'Calculator printout / entitlements summary', 'Your contact information and availability'],
    tips: [
      'Labour Court filing fees are free for employees — you do not pay to sue.',
      'Keep all evidence in digital and physical copies.',
      'Do not accept informal payments outside the DLPW process.',
      'An interpreter can be provided by the court for non-Thai speakers.',
    ],
  },
];

function AgencyCard({ agency }: { agency: Agency }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'docs' | 'tips'>('steps');

  return (
    <div className={`${agency.bgColor} border ${agency.borderColor} rounded-2xl overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl bg-slate-900/60 flex items-center justify-center ${agency.color} shrink-0`}>
              {agency.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-base">{agency.name}</h3>
              <p className="text-slate-400 text-xs mt-0.5">{agency.thaiName}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className={`flex items-center gap-1 text-xs ${agency.color}`}>
                  <Phone size={11} />{agency.hotline}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={11} />{agency.hours}
                </span>
              </div>
            </div>
          </div>
          <ChevronDown size={18} className={`text-slate-400 shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
        <p className="text-slate-300 text-sm mt-3 leading-relaxed">{agency.jurisdiction}</p>
      </button>

      {expanded && (
        <div className="border-t border-slate-800/60">
          <div className="flex border-b border-slate-800/60">
            {(['steps', 'docs', 'tips'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? `${agency.color} border-b-2 border-current`
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === 'steps' ? 'Steps' : tab === 'docs' ? 'Documents' : 'Tips'}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 'steps' && (
              <div className="space-y-4">
                {agency.steps.map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className={`w-7 h-7 rounded-full bg-slate-900 border ${agency.borderColor} flex items-center justify-center shrink-0 mt-0.5`}>
                      <span className={`text-xs font-bold ${agency.color}`}>{s.step}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
                      <p className="text-slate-300 text-sm leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="space-y-2">
                <p className="text-slate-400 text-xs mb-3">Bring these documents when filing your complaint:</p>
                {agency.docs.map((doc, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={14} className={`${agency.color} mt-0.5 shrink-0`} />
                    <p className="text-slate-200 text-sm">{doc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-3">
                {agency.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 bg-slate-900/50 rounded-lg p-3">
                    <AlertTriangle size={13} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-slate-200 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`px-5 pb-5 pt-1`}>
            <div className={`flex items-start gap-2 bg-slate-900/50 rounded-lg p-3`}>
              <MapPin size={13} className={`${agency.color} mt-0.5 shrink-0`} />
              <p className="text-slate-400 text-xs">{agency.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FightBack() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#0a1628' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 mb-4">
            <BookOpen size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            The Fight Back Guide
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">Step-by-step instructions to file complaints with official Thai authorities. Know your channels. Know your rights.</p>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-950/40 border border-red-700/50 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-red-300 font-bold mb-1">Act Fast — Time Limits Apply</h3>
              <p className="text-red-200/80 text-sm leading-relaxed">
                Labour complaints must be filed within <strong>2 years</strong> of the violation. Unemployment SSO must be registered within <strong>30 days</strong> of termination. Do not delay.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Contact Strip */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { name: 'DLPW', number: '1546', color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700/40' },
            { name: 'SSO', number: '1506', color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-700/40' },
            { name: "Lawyers", number: '02-627-3322', color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-700/40' },
          ].map((c) => (
            <a
              key={c.name}
              href={`tel:${c.number.replace(/[^0-9+]/g, '')}`}
              className={`${c.bg} border rounded-xl p-3 text-center block hover:opacity-90 transition-opacity`}
            >
              <Phone size={14} className={`${c.color} mx-auto mb-1`} />
              <p className="text-white text-xs font-bold">{c.name}</p>
              <p className={`${c.color} text-xs font-mono mt-0.5`}>{c.number}</p>
            </a>
          ))}
        </div>

        <div className="space-y-4">
          {AGENCIES.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))}
        </div>

        {/* Labour Court Note */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Scale size={20} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                Labour Court — Your Final Recourse
                <ExternalLink size={14} className="text-slate-500" />
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                If DLPW mediation fails, your case goes to the Labour Court (ศาลแรงงาน). Filing is <strong className="text-white">free for employees</strong> — no court fees. Cases typically resolve in 3–12 months. The court can award:
              </p>
              <ul className="space-y-1.5">
                {['Full severance + unpaid wages + interest', 'Notice pay if not given', 'Additional "unfair dismissal" compensation (up to ~6 months salary)', 'Moral damages in egregious cases'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-400 text-xs mt-3">Bangkok Labour Court: 02-513-0515 | Ratchadaphisek Road, Din Daeng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
