import { useState } from 'react';
import { Clock, Info, ChevronDown } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';

const MIN_WAGE_BANGKOK = 400;
const MIN_WAGE_REGIONAL = 361;
const SSO_CEILING = 17500;
const SSO_RATE = 0.05;

function formatThb(n: number) {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

type WorkDay = 'regular' | 'overtime_regular' | 'holiday' | 'holiday_overtime';

interface OTResult {
  regularPay: number;
  otPay: number;
  holidayBasePay: number;
  holidayOtPay: number;
  grossMonthly: number;
  ssoEmployee: number;
  ssoEmployer: number;
  taxableIncome: number;
  estimatedTax: number;
  netMonthly: number;
  breakdown: { label: string; amount: number; rate: string }[];
}

function estimatePIT(annual: number): number {
  // Thailand Personal Income Tax 2026 brackets
  if (annual <= 150000) return 0;
  let tax = 0;
  const brackets = [
    [150000, 300000, 0.05],
    [300000, 500000, 0.10],
    [500000, 750000, 0.15],
    [750000, 1000000, 0.20],
    [1000000, 2000000, 0.25],
    [2000000, 5000000, 0.30],
    [5000000, Infinity, 0.35],
  ] as [number, number, number][];
  for (const [lo, hi, rate] of brackets) {
    if (annual > lo) {
      tax += (Math.min(annual, hi) - lo) * rate;
    }
  }
  return tax;
}

export default function OTCalculator() {
  const { t } = useLang();
  const [baseSalary, setBaseSalary] = useState('');
  const [otHours, setOtHours] = useState('');
  const [holidayDays, setHolidayDays] = useState('');
  const [holidayOtHours, setHolidayOtHours] = useState('');
  const [region, setRegion] = useState<'bangkok' | 'regional'>('bangkok');
  const [result, setResult] = useState<OTResult | null>(null);

  function calculate() {
    const salary = Number(baseSalary) || 0;
    const ot = Number(otHours) || 0;
    const hDays = Number(holidayDays) || 0;
    const hOt = Number(holidayOtHours) || 0;

    const hourlyRate = salary / 30 / 8;
    const otPay = ot * hourlyRate * 1.5;
    const holidayBasePay = hDays * (salary / 30) * 2;
    const holidayOtPay = hOt * hourlyRate * 3;
    const grossMonthly = salary + otPay + holidayBasePay + holidayOtPay;

    const ssoBase = Math.min(salary, SSO_CEILING);
    const ssoEmployee = ssoBase * SSO_RATE;
    const ssoEmployer = ssoBase * SSO_RATE;

    const annualGross = grossMonthly * 12;
    const personalAllowance = 60000;
    const employeeAllowance = Math.min(annualGross * 0.5, 100000);
    const ssoDeduction = ssoEmployee * 12;
    const taxableIncome = Math.max(0, annualGross - personalAllowance - employeeAllowance - ssoDeduction);
    const annualTax = estimatePIT(taxableIncome);
    const estimatedTax = annualTax / 12;
    const netMonthly = grossMonthly - ssoEmployee - estimatedTax;

    const breakdown = [
      { label: 'Base Salary', amount: salary, rate: 'Monthly' },
      ...(ot > 0 ? [{ label: `Overtime (${ot}h)`, amount: otPay, rate: '1.5x hourly' }] : []),
      ...(hDays > 0 ? [{ label: `Holiday Base Pay (${hDays} days)`, amount: holidayBasePay, rate: '2x daily' }] : []),
      ...(hOt > 0 ? [{ label: `Holiday OT (${hOt}h)`, amount: holidayOtPay, rate: '3x hourly' }] : []),
      { label: 'SSO (Employee 5%)', amount: -ssoEmployee, rate: `Max ฿${formatThb(SSO_CEILING * SSO_RATE)}` },
      { label: 'Est. Income Tax (PND.91)', amount: -estimatedTax, rate: 'Progressive' },
    ];

    setResult({ regularPay: salary, otPay, holidayBasePay, holidayOtPay, grossMonthly, ssoEmployee, ssoEmployer, taxableIncome, estimatedTax, netMonthly, breakdown });
  }

  const minWage = region === 'bangkok' ? MIN_WAGE_BANGKOK : MIN_WAGE_REGIONAL;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#0a1628' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 mb-4">
            <Clock size={28} className="text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('otTitle')}
          </h1>
          <p className="text-slate-400">{t('otSub')}</p>
          <div className="inline-flex items-center gap-2 mt-3 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-700/40 rounded-full px-3 py-1">
            <Info size={11} />
            {t('minWageNote')}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 space-y-5">
          {/* Region selector */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Region / Minimum Wage Zone</label>
            <div className="grid grid-cols-2 gap-2">
              {(['bangkok', 'regional'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${region === r ? 'bg-cyan-600/20 text-cyan-300 border-cyan-600/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'}`}
                >
                  {r === 'bangkok' ? `Bangkok (฿${MIN_WAGE_BANGKOK}/day)` : `Regional (฿${MIN_WAGE_REGIONAL}/day)`}
                </button>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-1">Min wage: ฿{minWage}/day = ฿{formatThb(minWage * 26)}/month (26 working days)</p>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              {t('monthlyPay')} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">฿</span>
              <input
                type="number"
                value={baseSalary}
                onChange={(e) => { setBaseSalary(e.target.value); setResult(null); }}
                placeholder="45000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Overtime Hours (Regular Day)</label>
              <input
                type="number"
                min="0"
                value={otHours}
                onChange={(e) => { setOtHours(e.target.value); setResult(null); }}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <p className="text-slate-500 text-xs mt-1">Rate: 1.5x hourly wage</p>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Public Holiday Days Worked</label>
              <input
                type="number"
                min="0"
                value={holidayDays}
                onChange={(e) => { setHolidayDays(e.target.value); setResult(null); }}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <p className="text-slate-500 text-xs mt-1">Rate: 2x daily wage</p>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Overtime on Holidays (hours)</label>
              <input
                type="number"
                min="0"
                value={holidayOtHours}
                onChange={(e) => { setHolidayOtHours(e.target.value); setResult(null); }}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <p className="text-slate-500 text-xs mt-1">Rate: 3x hourly wage</p>
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!baseSalary}
            className="w-full bg-cyan-700 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3.5 rounded-xl transition-all text-sm disabled:cursor-not-allowed"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800">
                <h3 className="text-white font-bold">Monthly Pay Breakdown</h3>
              </div>
              <div className="divide-y divide-slate-800">
                {result.breakdown.map((item, i) => (
                  <div key={i} className="px-6 py-3.5 flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${item.amount < 0 ? 'text-red-300' : 'text-slate-200'}`}>{item.label}</p>
                      <p className="text-slate-500 text-xs">{item.rate}</p>
                    </div>
                    <span className={`font-semibold text-sm ${item.amount < 0 ? 'text-red-400' : 'text-white'}`}>
                      {item.amount < 0 ? '-' : ''}฿{formatThb(Math.abs(item.amount))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-5 bg-cyan-900/20 border-t-2 border-cyan-600/40">
                <div className="flex justify-between mb-2">
                  <span className="text-cyan-200 font-medium text-sm">Gross Monthly</span>
                  <span className="text-white font-bold">฿{formatThb(result.grossMonthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300 font-bold text-lg">Net Take-Home</span>
                  <span className="text-white font-bold text-2xl">฿{formatThb(result.netMonthly)}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-white font-semibold mb-3 text-sm">SSO & Tax Summary</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['SSO (Employee)', `฿${formatThb(result.ssoEmployee)}/mo`],
                  ['SSO (Employer)', `฿${formatThb(result.ssoEmployer)}/mo`],
                  ['Annual Taxable Income', `฿${formatThb(result.taxableIncome)}`],
                  ['Est. Annual Tax', `฿${formatThb(result.estimatedTax * 12)}`],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-800 rounded-xl p-3">
                    <p className="text-slate-400 text-xs mb-1">{label}</p>
                    <p className="text-white font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-3">Tax estimated using Thailand PND.91 progressive brackets. Actual tax may vary based on deductions claimed. SSO employer matches employee contribution capped at ฿875/month.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
