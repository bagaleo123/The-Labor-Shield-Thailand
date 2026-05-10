import { useState } from 'react';
import { MapPin, Phone, Clock, ChevronDown, Navigation, ExternalLink, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';

type Office = {
  id: string;
  city: string;
  name: string;
  thaiName: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  mapUrl: string;
  note?: string;
};

const OFFICES: Office[] = [
  {
    id: 'bkk-central',
    city: 'Bangkok',
    name: 'DLPW Head Office (Bangkok)',
    thaiName: 'กรมสวัสดิการและคุ้มครองแรงงาน (สำนักงานใหญ่)',
    address: 'Mitthraphap Road, Din Daeng, Bangkok 10400',
    phone: '1546',
    hours: 'Mon–Fri 08:30–16:30',
    lat: 13.7829,
    lng: 100.5628,
    mapUrl: 'https://maps.google.com/?q=Department+of+Labour+Protection+and+Welfare+Bangkok',
    note: 'Main filing office for Bangkok. Request an English-speaking officer or interpreter on arrival.',
  },
  {
    id: 'bkk-north',
    city: 'Bangkok',
    name: 'Bangkok North Labour Protection Office',
    thaiName: 'สำนักงานสวัสดิการและคุ้มครองแรงงานกรุงเทพมหานคร พื้นที่ 1',
    address: 'Lak Si District, Bangkok',
    phone: '02-521-0188',
    hours: 'Mon–Fri 08:30–16:30',
    lat: 13.8761,
    lng: 100.5693,
    mapUrl: 'https://maps.google.com/?q=Labour+Protection+Office+Lak+Si+Bangkok',
  },
  {
    id: 'bkk-south',
    city: 'Bangkok',
    name: 'Bangkok South Labour Protection Office',
    thaiName: 'สำนักงานสวัสดิการและคุ้มครองแรงงานกรุงเทพมหานคร พื้นที่ 3',
    address: 'Rat Burana District, Bangkok',
    phone: '02-427-1610',
    hours: 'Mon–Fri 08:30–16:30',
    lat: 13.6775,
    lng: 100.4947,
    mapUrl: 'https://maps.google.com/?q=Labour+Protection+Office+Rat+Burana+Bangkok',
  },
  {
    id: 'phuket',
    city: 'Phuket',
    name: 'Phuket Labour Protection and Welfare Office',
    thaiName: 'สำนักงานสวัสดิการและคุ้มครองแรงงานจังหวัดภูเก็ต',
    address: '8 Phang Nga Road, Talat Yai, Mueang Phuket 83000',
    phone: '076-212-718',
    hours: 'Mon–Fri 08:30–16:30',
    lat: 7.8804,
    lng: 98.3923,
    mapUrl: 'https://maps.google.com/?q=Labour+Protection+Office+Phuket',
    note: 'Serves all Phuket-based workers including Patong Beach area employers.',
  },
  {
    id: 'pattaya',
    city: 'Pattaya',
    name: 'Chonburi Labour Protection and Welfare Office',
    thaiName: 'สำนักงานสวัสดิการและคุ้มครองแรงงานจังหวัดชลบุรี',
    address: 'Nongprue, Bang Lamung, Chonburi 20150',
    phone: '038-279-260',
    hours: 'Mon–Fri 08:30–16:30',
    lat: 12.9236,
    lng: 100.8825,
    mapUrl: 'https://maps.google.com/?q=Labour+Protection+Office+Chonburi+Pattaya',
    note: 'Covers Pattaya, Jomtien, and surrounding Chonburi areas.',
  },
  {
    id: 'chiang-mai',
    city: 'Chiang Mai',
    name: 'Chiang Mai Labour Protection and Welfare Office',
    thaiName: 'สำนักงานสวัสดิการและคุ้มครองแรงงานจังหวัดเชียงใหม่',
    address: 'Nakhon Ping, Mueang Chiang Mai, Chiang Mai 50000',
    phone: '053-112-834',
    hours: 'Mon–Fri 08:30–16:30',
    lat: 18.7883,
    lng: 98.9853,
    mapUrl: 'https://maps.google.com/?q=Labour+Protection+Office+Chiang+Mai',
  },
];

const COMPLAINT_STEPS = [
  {
    step: 1,
    title: 'Prepare Your Documents',
    detail: 'Gather: passport + work permit, employment contract, 3–6 months pay slips, written/electronic termination notice, bank statements showing salary. Screenshot WhatsApp/LINE messages. Use the Evidence Locker to timestamp files.',
    icon: '📁',
  },
  {
    step: 2,
    title: 'Arrive at the Office',
    detail: 'Go in person to your nearest DLPW office. Request a "Labour Complaint Form" (แบบฟอร์มร้องเรียน). Ask for an English-speaking officer or interpreter — this is your right. Bring 2 copies of all documents.',
    icon: '🏢',
  },
  {
    step: 3,
    title: 'File Your Complaint',
    detail: 'Fill in the form: describe the violation clearly, state the sections violated (e.g. Section 32, Section 118). Hand over the form and documents. Request a receipt (ใบรับแจ้ง) — keep it.',
    icon: '📝',
  },
  {
    step: 4,
    title: 'Mediation (within 7 days)',
    detail: 'The labour officer summons your employer within 7 days. Both parties meet. If a settlement is reached, it is legally binding. If employer refuses, the officer issues a formal order.',
    icon: '⚖️',
  },
  {
    step: 5,
    title: 'Enforcement or Court',
    detail: 'If the employer ignores the order within 30 days, the DLPW can seize assets. If you disagree with the outcome, escalate to the Labour Court — filing is FREE for employees.',
    icon: '🔨',
  },
];

function OfficeCard({ office }: { office: Office }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl overflow-hidden transition-all">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-900/30 border border-rose-700/40 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={16} className="text-rose-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-rose-400 bg-rose-900/20 border border-rose-800/40 rounded-full px-2 py-0.5 mb-1.5 inline-block">{office.city}</span>
              <p className="text-white font-semibold text-sm">{office.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">{office.thaiName}</p>
            </div>
          </div>
          <ChevronDown size={16} className={`text-slate-400 shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
        <div className="flex flex-wrap gap-3 mt-3 pl-12">
          <span className="flex items-center gap-1 text-xs text-blue-400">
            <Phone size={11} />{office.phone}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={11} />{office.hours}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 px-5 pb-5 pt-4 space-y-3">
          <div className="flex items-start gap-2">
            <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-slate-300 text-sm">{office.address}</p>
          </div>
          {office.note && (
            <div className="flex items-start gap-2 bg-amber-950/20 border border-amber-800/30 rounded-xl p-3">
              <AlertTriangle size={12} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-amber-200/80 text-xs">{office.note}</p>
            </div>
          )}
          <a
            href={office.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-rose-700/20 border border-rose-700/40 text-rose-300 hover:bg-rose-700/30 rounded-xl px-4 py-2.5 text-sm font-medium transition-all w-fit"
          >
            <Navigation size={14} />
            Open in Google Maps
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}

export default function JusticeMap() {
  const { t } = useLang();
  const [cityFilter, setCityFilter] = useState<string>('All');
  const cities = ['All', ...Array.from(new Set(OFFICES.map((o) => o.city)))];
  const filtered = cityFilter === 'All' ? OFFICES : OFFICES.filter((o) => o.city === cityFilter);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#0a1628' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 mb-4">
            <MapPin size={28} className="text-rose-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('mapTitle')}
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">{t('mapSub')}</p>
        </div>

        {/* Step-by-step guide */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-bold mb-5 flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-400" />
            How to File a Complaint — Step by Step
          </h3>
          <div className="space-y-4">
            {COMPLAINT_STEPS.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-sm">
                  {s.step}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office List */}
        <div className="mb-5">
          <h3 className="text-white font-bold mb-4">DLPW Offices by Region</h3>
          {/* City filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${cityFilter === city ? 'bg-rose-700/30 text-rose-300 border-rose-600/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'}`}
              >
                {city}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((office) => (
              <OfficeCard key={office.id} office={office} />
            ))}
          </div>
        </div>

        {/* SSO offices quick reference */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-6">
          <h4 className="text-white font-semibold mb-3 text-sm">SSO Quick Contact</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['SSO Hotline', '1506', 'text-emerald-400'],
              ['Bangkok SSO HQ', '02-956-2534', 'text-emerald-400'],
              ['Phuket SSO', '076-355-110', 'text-emerald-400'],
              ['Chonburi SSO', '038-279-275', 'text-emerald-400'],
            ].map(([name, number, color]) => (
              <a key={name} href={`tel:${number.replace(/[^0-9]/g, '')}`} className="bg-slate-800 rounded-xl p-3 hover:bg-slate-700 transition-colors block">
                <p className="text-slate-400 text-xs mb-1">{name}</p>
                <p className={`${color} font-mono font-semibold`}>{number}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
