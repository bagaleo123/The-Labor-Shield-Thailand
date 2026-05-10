import { useState } from 'react';
import { Calculator, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info, ChevronDown } from 'lucide-react';
import { calculateSeverance, type DismissalReason } from '../lib/laborLaw';
import { useLang } from '../lib/LanguageContext';

const DISMISSAL_REASONS: { value: DismissalReason; label: string; desc: string }[] = [
  { value: 'redundancy', label: 'Redundancy / Position Eliminated', desc: 'Your role was made redundant' },
  { value: 'restructuring', label: 'Company Restructuring', desc: 'Business reorganization' },
  { value: 'illness', label: 'Termination Due to Illness', desc: 'Fired because of health issues (ILLEGAL)' },
  { value: 'unfair', label: 'Unfair / Unjustified Dismissal', desc: 'No valid legal reason given' },
  { value: 'misconduct', label: 'Alleged Misconduct', desc: 'Accused of workplace misconduct' },
  { value: 'resignation', label: 'Voluntary Resignation', desc: 'You chose to leave' },
  { value: 'contract_end', label: 'Fixed-Term Contract End', desc: 'Your contract term expired' },
];

function formatThb(amount: number): string {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export default function CalculatorPage() {
  const { t } = useLang();
  const [salary, setSalary] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState<DismissalReason>('redundancy');
  const [sickDays, setSickDays] = useState('0');
  const [result, setResult] = useState<ReturnType<typeof calculateSeverance> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!salary || isNaN(Number(salary)) || Number(salary) <= 0) e.salary = 'Enter a valid monthly salary';
    if (!startDate) e.startDate = 'Enter your employment start date';
    if (!endDate) e.endDate = 'Enter the termination date';
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) e.endDate = 'End date must be after start date';
    return e;
  }

  function handleCalculate() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const res = calculateSeverance(
      Number(salary),
      new Date(startDate),
      new Date(endDate),
      reason,
      Number(sickDays) || 0
    );
    setResult(res);
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  const ssoContribution = Math.min(Number(salary) * 0.05, 875);
  const yearsDisplay = startDate && endDate
    ? ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
    : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#0a1628' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4">
            <Calculator size={28} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('calcTitle')}
          </h1>
          <p className="text-slate-400">{t('calcSub')}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-6">
          <div className="space-y-5">
            {/* Salary */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Monthly Salary (THB) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">฿</span>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 45000"
                  className={`w-full bg-slate-800 border rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.salary ? 'border-red-500/60' : 'border-slate-700 focus:border-blue-500/60'}`}
                />
              </div>
              {errors.salary && <p className="text-red-400 text-xs mt-1">{errors.salary}</p>}
              {salary && Number(salary) > 0 && (
                <p className="text-slate-500 text-xs mt-1">
                  Daily rate: ฿{formatThb(Number(salary) / 30)} · SSO contribution: ฿{formatThb(ssoContribution)}/month
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Employment Start Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.startDate ? 'border-red-500/60' : 'border-slate-700 focus:border-blue-500/60'}`}
                />
                {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Termination Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.endDate ? 'border-red-500/60' : 'border-slate-700 focus:border-blue-500/60'}`}
                />
                {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate}</p>}
              </div>
            </div>
            {yearsDisplay && (
              <div className="flex items-center gap-2 text-xs text-slate-400 -mt-2">
                <Info size={12} />
                Service length: <span className="text-blue-300 font-medium">{yearsDisplay} years</span>
              </div>
            )}

            {/* Dismissal Reason */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Reason for Termination <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as DismissalReason)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/60 appearance-none transition-all"
                >
                  {DISMISSAL_REASONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              {reason === 'illness' && (
                <div className="flex items-start gap-2 mt-2 bg-red-950/40 border border-red-800/50 rounded-lg p-3">
                  <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-red-300 text-xs">Termination due to illness is <strong>illegal</strong> under Thai Labor Law. You have strong grounds to file a complaint.</p>
                </div>
              )}
            </div>

            {/* Sick Days */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Sick Days Taken This Year
                <span className="text-slate-500 font-normal ml-1">(optional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={sickDays}
                onChange={(e) => setSickDays(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/60 transition-all"
              />
              <p className="text-slate-500 text-xs mt-1">First 30 days are fully paid. Days 31+ are covered at 50% by SSO.</p>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/40 active:scale-98 text-sm"
            >
              Calculate My Entitlements
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div id="results-section" className="space-y-4">
            {result.isUnfairDismissal && (
              <div className="bg-red-950/40 border border-red-700/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} className="text-red-400" />
                  <h3 className="text-red-300 font-bold">Unfair / Illegal Dismissal Detected</h3>
                </div>
                <p className="text-red-200/80 text-sm leading-relaxed">
                  Your termination may be illegal under Thai labor law. In addition to the amounts below, you may be entitled to additional compensation. File a complaint with the DLPW immediately.
                </p>
              </div>
            )}

            {result.warnings.length > 0 && (
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={16} className="text-amber-400" />
                  <h4 className="text-amber-300 font-semibold text-sm">Important Notices</h4>
                </div>
                {result.warnings.map((w, i) => (
                  <p key={i} className="text-amber-200/80 text-xs leading-relaxed pl-5 border-l-2 border-amber-700/50">{w}</p>
                ))}
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800">
                <h3 className="text-white font-bold text-lg">Breakdown of Entitlements</h3>
              </div>
              <div className="divide-y divide-slate-800">
                {result.breakdown.map((item, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-slate-200 font-medium text-sm">{item.label}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{item.note}</p>
                      </div>
                      <span className="text-white font-semibold text-sm whitespace-nowrap">
                        ฿{formatThb(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-5 bg-blue-900/20 border-t-2 border-blue-600/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 font-bold text-lg">Total Compensation Owed</p>
                    <p className="text-blue-400 text-xs mt-0.5">Minimum legal entitlement under Thai law</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-3xl">฿{formatThb(result.totalCompensation)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4">
              <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-emerald-200/80 text-xs leading-relaxed">
                These figures represent your <strong className="text-emerald-300">minimum legal entitlements</strong>. Unfair dismissal, discrimination, or contractual bonuses may increase this amount. Consult a Thai labor lawyer for your specific situation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
