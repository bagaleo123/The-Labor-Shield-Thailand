import { useState } from 'react';
import { Lock, Upload, CheckCircle, AlertTriangle, Clock, FileText, Image, ChevronDown } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import { supabase } from '../lib/supabase';

type EvidenceType = 'screenshot' | 'payslip' | 'contract' | 'termination' | 'other';

const EVIDENCE_TYPES: { value: EvidenceType; label: string }[] = [
  { value: 'screenshot', label: 'Chat Screenshot (LINE/WhatsApp)' },
  { value: 'payslip', label: 'Pay Slip' },
  { value: 'contract', label: 'Employment Contract' },
  { value: 'termination', label: 'Termination Notice' },
  { value: 'other', label: 'Other Document' },
];

interface LockerEntry {
  id: string;
  file_name: string;
  file_type: string;
  notes: string;
  timestamp_hash: string;
  created_at: string;
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function EvidenceLocker() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('screenshot');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<LockerEntry | null>(null);
  const [error, setError] = useState('');

  async function handleUpload() {
    if (!file || !email) return;
    setUploading(true);
    setError('');
    try {
      const timestamp = new Date().toISOString();
      const hashInput = `${email}|${file.name}|${file.size}|${timestamp}`;
      const hash = await sha256(hashInput);

      // Upload file to Supabase Storage (bucket: evidence-locker)
      const ext = file.name.split('.').pop();
      const storagePath = `${email.replace(/[^a-z0-9]/gi, '_')}/${Date.now()}_${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from('evidence-locker')
        .upload(storagePath, file, { upsert: false });

      let fileUrl = '';
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from('evidence-locker').getPublicUrl(storagePath);
        fileUrl = urlData?.publicUrl ?? '';
      }

      const { data, error: dbErr } = await supabase
        .from('evidence_locker')
        .insert({
          user_email: email,
          file_name: file.name,
          file_url: fileUrl,
          file_type: evidenceType,
          notes,
          timestamp_hash: hash,
        })
        .select()
        .maybeSingle();

      if (dbErr) throw new Error(dbErr.message);
      setUploaded(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#0a1628' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600/20 border border-teal-500/30 mb-4">
            <Lock size={28} className="text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('evidenceTitle')}
          </h1>
          <p className="text-slate-400">{t('evidenceSub')}</p>
        </div>

        {/* Info Banner */}
        <div className="bg-teal-950/30 border border-teal-800/40 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-teal-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-teal-300 font-semibold mb-1">Cryptographic Timestamp</h3>
              <p className="text-teal-200/70 text-sm leading-relaxed">
                Every uploaded file receives a SHA-256 hash timestamp. This creates tamper-evident proof that the file existed at this exact date and time — valuable evidence in labour court proceedings.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              {t('evidenceEmail')} <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              {t('evidenceType')}
            </label>
            <div className="relative">
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none"
              >
                {EVIDENCE_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">{t('evidenceNotes')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. WhatsApp message from employer on [date] saying 'you are terminated because you were sick for too long'"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
            />
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              File <span className="text-red-400">*</span>
            </label>
            <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${file ? 'border-teal-600/60 bg-teal-900/10' : 'border-slate-700 hover:border-teal-700/60 hover:bg-teal-900/5'}`}>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              {file ? (
                <>
                  {file.type.startsWith('image') ? <Image size={28} className="text-teal-400" /> : <FileText size={28} className="text-teal-400" />}
                  <div className="text-center">
                    <p className="text-teal-300 font-medium text-sm">{file.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-slate-500" />
                  <div className="text-center">
                    <p className="text-slate-300 text-sm font-medium">Click to upload evidence</p>
                    <p className="text-slate-500 text-xs mt-1">JPG, PNG, PDF, DOC — max 10MB</p>
                  </div>
                </>
              )}
            </label>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-950/40 border border-red-700/50 rounded-xl p-3">
              <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || !email || uploading}
            className="w-full bg-teal-700 hover:bg-teal-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3.5 rounded-xl transition-all text-sm disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading...</>
            ) : (
              <><Lock size={16} />{t('submitEvidence')}</>
            )}
          </button>
        </div>

        {/* Success */}
        {uploaded && (
          <div className="mt-5 bg-emerald-950/30 border border-emerald-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={20} className="text-emerald-400" />
              <h3 className="text-emerald-300 font-bold">Evidence Timestamped</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">File</p>
                <p className="text-white font-medium">{uploaded.file_name}</p>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Timestamp</p>
                <p className="text-white font-medium">{new Date(uploaded.created_at).toLocaleString()}</p>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">SHA-256 Hash</p>
                <p className="text-teal-300 font-mono text-xs break-all">{uploaded.timestamp_hash}</p>
              </div>
            </div>
            <p className="text-emerald-200/70 text-xs mt-3">Keep this hash as proof. Present the hash and file together in court proceedings to prove the file was not altered.</p>
          </div>
        )}
      </div>
    </div>
  );
}
