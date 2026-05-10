import { Shield, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Shield size={14} className="text-white" />
              </div>
              <span className="text-white font-bold text-sm">The Labor Shield</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              A legal-tech tool for foreign workers in Thailand. Powered by Thai Labor Law 2026 provisions.
            </p>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold text-sm mb-3">Key Resources</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Department of Labour Protection (DLPW): 1546</li>
              <li>Social Security Office (SSO): 1506</li>
              <li>Lawyers Council of Thailand: 02-627-3322</li>
              <li>Labour Court Bangkok: 02-513-0515</li>
            </ul>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold text-sm mb-3">Legal Framework</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Labor Protection Act B.E. 2541 (amended 2026)</li>
              <li>Social Security Act B.E. 2533</li>
              <li>Work Permit Act B.E. 2560</li>
              <li>Civil and Commercial Code</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <div className="flex items-start gap-3 bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 mb-6">
            <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-amber-200/80 text-xs leading-relaxed">
              <strong className="text-amber-300">Legal Disclaimer:</strong> The Labor Shield provides general legal information based on Thai labor law. It does not constitute legal advice and cannot replace consultation with a qualified Thai labor attorney. Laws may change — always verify current regulations with official sources.
            </p>
          </div>
          <p className="text-slate-600 text-xs text-center">
            © 2026 The Labor Shield · Built for expat workers in Thailand · Not a law firm
          </p>
        </div>
      </div>
    </footer>
  );
}
