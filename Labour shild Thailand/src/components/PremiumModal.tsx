import { useState, useRef } from 'react';
import { X, Crown, Upload, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Loader as Loader2 } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import { supabase } from '../lib/supabase';

interface PremiumModalProps {
  onClose: () => void;
  onVerified: () => void;
}

// PromptPay QR code — static placeholder image (official PromptPay visual)
const PROMPTPAY_QR_EXPAT = 'https://images.pexels.com/photos/5872349/pexels-photo-5872349.jpeg?auto=compress&cs=tinysrgb&w=300';
const PROMPTPAY_QR_THAI = 'https://images.pexels.com/photos/5872349/pexels-photo-5872349.jpeg?auto=compress&cs=tinysrgb&w=300';

export default function PremiumModal({ onClose, onVerified }: PremiumModalProps) {
  const { t } = useLang();
  const [plan, setPlan] = useState<'expat' | 'thai'>('expat');
  const [email, setEmail] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const amount = plan === 'expat' ? 499 : 199;

  async function handleSubmit() {
    if (!email) { setError('Please enter your email.'); return; }
    setSubmitting(true);
    setError('');
    try {
      let receiptUrl = '';
      if (receipt) {
        const path = `receipts/${email.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.${receipt.name.split('.').pop()}`;
        const { error: upErr } = await supabase.storage.from('evidence-locker').upload(path, receipt, { upsert: false });
        if (!upErr) {
          const { data } = supabase.storage.from('evidence-locker').getPublicUrl(path);
          receiptUrl = data?.publicUrl ?? '';
        }
      }
      await supabase.from('premium_payments').insert({ email, amount, plan, receipt_url: receiptUrl, verified: false });
      setSubmitted(true);
      setTimeout(() => { onVerified(); onClose(); }, 2000);
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-amber-900/30 to-slate-900">
          <div className="flex items-center gap-2">
            <Crown size={20} className="text-amber-400" />
            <h2 className="text-white font-bold">{t('premiumTitle')}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-slate-300 text-sm">{t('premiumSub')}</p>

          {/* Plan selector */}
          <div className="grid grid-cols-2 gap-3">
            {(['expat', 'thai'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`rounded-xl p-4 border text-left transition-all ${plan === p ? 'bg-amber-900/30 border-amber-600/60' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
              >
                <p className={`font-bold text-lg ${plan === p ? 'text-amber-300' : 'text-white'}`}>
                  ฿{p === 'expat' ? '499' : '199'}
                </p>
                <p className="text-slate-400 text-xs mt-1">{p === 'expat' ? 'Expat Plan' : 'Thai National Plan'}</p>
              </button>
            ))}
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-3">
            <p className="text-slate-800 font-bold text-sm">PromptPay QR — ฿{amount}</p>
            <div className="w-40 h-40 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-slate-300">
              {/* PromptPay QR placeholder — replace with real QR in production */}
              <div className="text-center p-4">
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`w-5 h-5 rounded-sm ${Math.random() > 0.5 ? 'bg-slate-800' : 'bg-white border border-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-700 text-xs font-medium">PromptPay</p>
                <p className="text-slate-900 text-sm font-bold">฿{amount}</p>
              </div>
            </div>
            <p className="text-slate-600 text-xs text-center">Scan with any Thai banking app<br/>PromptPay ID: 099-XXX-XXXX</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Your Email <span className="text-red-400">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Upload Payment Receipt</label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`w-full flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3 transition-all text-sm ${receipt ? 'border-amber-600/60 bg-amber-900/10 text-amber-300' : 'border-slate-700 text-slate-400 hover:border-amber-700/50 hover:text-slate-300'}`}
            >
              <Upload size={16} />
              {receipt ? receipt.name : 'Click to upload screenshot of transfer'}
            </button>
            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} className="hidden" />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-950/40 border border-red-700/50 rounded-xl p-3">
              <AlertTriangle size={13} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}

          {submitted ? (
            <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-700/50 rounded-xl p-4 justify-center">
              <CheckCircle size={18} className="text-emerald-400" />
              <p className="text-emerald-300 font-semibold text-sm">Payment received! Unlocking access...</p>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !email}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
            >
              {submitting ? <><Loader2 size={16} className="animate-spin" />Processing...</> : <><Crown size={16} />{t('premiumPay')}</>}
            </button>
          )}

          <p className="text-slate-500 text-xs text-center">Access is granted after manual receipt verification (within 24h). For urgent access, contact support.</p>
        </div>
      </div>
    </div>
  );
}
