import { useState } from 'react';
import { FileSearch, AlertTriangle, CheckCircle, Info, Shield, Clipboard } from 'lucide-react';
import { scanContract, type RedFlag } from '../lib/laborLaw';

const SAMPLE_TEXT = `EMPLOYMENT CONTRACT

This contract is between ABC Company Ltd and the Employee.

1. Salary: 50,000 THB per month, overtime included in salary.
2. Sick Leave: Sick leave shall be deducted from annual leave entitlement.
3. Termination: The company may terminate employment immediately without notice at will.
4. Fines: Employees may be fined up to 5,000 THB for tardiness or policy violations.
5. Non-compete: Employee cannot work for any competing company for 2 years after resignation.
6. Severance: Employee waives all rights to severance upon signing this contract.`;

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Low Risk' : score >= 50 ? 'Moderate Risk' : 'High Risk';
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${(score / 100) * 251.2} 251.2`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-2xl">{score}</span>
          <span className="text-slate-400 text-xs">/100</span>
        </div>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

function FlagCard({ flag }: { flag: RedFlag }) {
  const [expanded, setExpanded] = useState(false);
  const styles = {
    illegal: { bg: 'bg-red-950/40', border: 'border-red-700/60', badge: 'bg-red-900/60 text-red-300 border-red-700', icon: <AlertTriangle size={16} className="text-red-400" /> },
    warning: { bg: 'bg-amber-950/30', border: 'border-amber-700/50', badge: 'bg-amber-900/50 text-amber-300 border-amber-700', icon: <Info size={16} className="text-amber-400" /> },
    missing: { bg: 'bg-slate-800/50', border: 'border-slate-700', badge: 'bg-slate-700 text-slate-300 border-slate-600', icon: <Info size={16} className="text-slate-400" /> },
  };
  const s = styles[flag.type];
  return (
    <div className={`${s.bg} border ${s.border} rounded-xl overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-4 flex items-start gap-3"
      >
        <div className="mt-0.5 shrink-0">{s.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{flag.clause}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${s.badge}`}>
              {flag.type === 'illegal' ? 'ILLEGAL' : flag.type === 'warning' ? 'WARNING' : 'MISSING'}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1 truncate">{flag.excerpt}</p>
        </div>
        <span className="text-slate-500 text-xs mt-1 shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-800/60 pt-3">
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Detected Clause</p>
              <p className="text-slate-300 text-xs italic bg-slate-900/60 rounded-lg p-3 leading-relaxed">{flag.excerpt}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Why This Is a Problem</p>
              <p className="text-slate-200 text-sm leading-relaxed">{flag.explanation}</p>
            </div>
            <div className="flex items-start gap-2">
              <Shield size={12} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-blue-300 text-xs">{flag.legalRef}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContractScanner() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ReturnType<typeof scanContract> | null>(null);
  const [scanning, setScanning] = useState(false);

  function handleScan() {
    if (!text.trim()) return;
    setScanning(true);
    setTimeout(() => {
      setResult(scanContract(text));
      setScanning(false);
      setTimeout(() => {
        document.getElementById('scan-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 600);
  }

  function loadSample() {
    setText(SAMPLE_TEXT);
    setResult(null);
  }

  const illegal = result?.flags.filter((f) => f.type === 'illegal') ?? [];
  const warnings = result?.flags.filter((f) => f.type === 'warning') ?? [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#0a1628' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 mb-4">
            <FileSearch size={28} className="text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Contract Scanner
          </h1>
          <p className="text-slate-400">Paste your employment contract below. Our scanner checks for illegal clauses under Thai Labor Law 2026.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-slate-300 text-sm font-medium">Contract Text</label>
            <button
              onClick={loadSample}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Clipboard size={12} />
              Load sample contract
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); }}
            placeholder="Paste your employment contract text here... Include clauses about sick leave, termination, salary deductions, non-compete, and overtime."
            rows={10}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/60 transition-all resize-y leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-slate-500 text-xs">{text.length} characters · {text.trim().split(/\s+/).filter(Boolean).length} words</p>
            <button
              onClick={handleScan}
              disabled={!text.trim() || scanning}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 disabled:cursor-not-allowed"
            >
              {scanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <FileSearch size={16} />
                  Scan for Red Flags
                </>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div id="scan-results" className="space-y-5">
            {/* Score Overview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreGauge score={result.score} />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-white font-bold text-lg mb-2">Scan Complete</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{result.summary}</p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    <div className="flex items-center gap-1.5 bg-red-950/50 border border-red-800/50 rounded-lg px-3 py-1.5">
                      <AlertTriangle size={13} className="text-red-400" />
                      <span className="text-red-300 text-xs font-medium">{illegal.length} illegal clause{illegal.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-950/30 border border-amber-800/40 rounded-lg px-3 py-1.5">
                      <Info size={13} className="text-amber-400" />
                      <span className="text-amber-300 text-xs font-medium">{warnings.length} warning{warnings.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flags */}
            {result.flags.length > 0 ? (
              <div>
                <h3 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-400" />
                  Detected Issues ({result.flags.length})
                </h3>
                <div className="space-y-3">
                  {result.flags.map((flag, i) => (
                    <FlagCard key={i} flag={flag} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-6 text-center">
                <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
                <h3 className="text-emerald-300 font-bold text-lg mb-2">No Red Flags Detected</h3>
                <p className="text-emerald-200/70 text-sm">
                  The scanned text doesn't contain obvious illegal clauses. Always have a Thai labor lawyer review your full contract before signing.
                </p>
              </div>
            )}

            <div className="flex items-start gap-3 bg-blue-950/30 border border-blue-800/40 rounded-xl p-4">
              <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-blue-200/80 text-xs leading-relaxed">
                This scanner detects common illegal patterns. It does not replace a full legal review. Clauses in Thai language should be translated and reviewed by a qualified lawyer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
