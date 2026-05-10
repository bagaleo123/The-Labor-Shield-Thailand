import { useState } from 'react';
import { FileText, Copy, Check, Download, Globe, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

type DocType = 'severance_inquiry' | 'sick_pay_demand' | 'unfair_dismissal' | 'sso_complaint';

const DOC_TYPES: { value: DocType; label: string; desc: string }[] = [
  { value: 'severance_inquiry', label: 'Severance Pay Demand Letter', desc: 'Formally request unpaid severance from your employer' },
  { value: 'sick_pay_demand', label: 'Sick Pay Demand Letter', desc: 'Demand repayment of illegally withheld sick leave pay' },
  { value: 'unfair_dismissal', label: 'Unfair Dismissal Notice', desc: 'Put your employer on notice of illegal termination' },
  { value: 'sso_complaint', label: 'SSO Contribution Complaint', desc: 'Report employer failure to pay SSO contributions' },
];

interface FormData {
  employeeName: string;
  employeeNationality: string;
  employeeAddress: string;
  employerName: string;
  employerAddress: string;
  position: string;
  startDate: string;
  endDate: string;
  monthlySalary: string;
  specificIssue: string;
  amount: string;
}

function generateEnglishLetter(type: DocType, data: FormData, date: string): string {
  const header = `${data.employeeName}
${data.employeeAddress}

${date}

Human Resources Department
${data.employerName}
${data.employerAddress}

Subject: `;

  const templates: Record<DocType, string> = {
    severance_inquiry: `${header}Formal Demand for Statutory Severance Payment

Dear Sir/Madam,

I, ${data.employeeName} (${data.employeeNationality} national), was employed as ${data.position} at ${data.employerName} from ${data.startDate} until ${data.endDate}.

Upon termination of my employment, I have not received the statutory severance pay to which I am entitled under Section 118 of the Labour Protection Act B.E. 2541 (as amended 2026).

Based on my length of service and monthly salary of ฿${data.monthlySalary}, my entitlement is:

Severance Pay:        ฿${data.amount}
${data.specificIssue ? `Additional Notes: ${data.specificIssue}` : ''}

I hereby formally demand payment of the above amount within 15 days of the date of this letter.

Failure to comply will leave me no choice but to file a complaint with the Department of Labour Protection and Welfare (DLPW) at Hotline 1546, and to pursue all available legal remedies including filing a claim at the Labour Court.

I trust this matter can be resolved amicably.

Yours faithfully,

${data.employeeName}
Work Permit No.: [Your WP Number]
Contact: [Your Phone/Email]
`,
    sick_pay_demand: `${header}Demand for Unlawfully Withheld Sick Leave Pay

Dear Sir/Madam,

I, ${data.employeeName}, employed as ${data.position} at ${data.employerName} from ${data.startDate}, write to formally demand repayment of sick leave pay that was unlawfully withheld.

Under Section 32 of the Labour Protection Act B.E. 2541 (amended 2026), employees are entitled to 30 fully paid sick days per year. Sick leave CANNOT be deducted from annual leave entitlement.

Amount unlawfully withheld: ฿${data.amount}
${data.specificIssue ? `Circumstances: ${data.specificIssue}` : ''}

I demand payment of the above amount within 7 days. Continued non-payment constitutes a criminal offense under Section 144 of the Labour Protection Act, subject to imprisonment of up to 6 months and/or a fine.

Yours faithfully,

${data.employeeName}
`,
    unfair_dismissal: `${header}Notice of Unlawful Termination — Demand for Compensation

Dear Sir/Madam,

I, ${data.employeeName}, am writing to formally notify ${data.employerName} that my termination on ${data.endDate} constitutes an unfair and unlawful dismissal under Thai labor law.

Grounds for this claim:
${data.specificIssue}

Under the Labour Protection Act B.E. 2541 and relevant case law, I am entitled to:
• Full statutory severance pay
• Notice pay (minimum 1 pay cycle)
• Additional compensation for unfair dismissal
• Any other unpaid entitlements

Total Compensation Claimed: ฿${data.amount}

I demand reinstatement OR full compensation within 15 days. If this demand is not met, I will file complaints with the DLPW (1546) and initiate Labour Court proceedings.

This letter serves as formal notice and may be presented as evidence in legal proceedings.

Yours faithfully,

${data.employeeName}
`,
    sso_complaint: `${header}Report of Employer Failure to Remit SSO Contributions

Dear Sir/Madam,

I, ${data.employeeName}, employed at ${data.employerName} from ${data.startDate} to ${data.endDate} as ${data.position}, wish to formally report that my employer has failed to properly register me with the Social Security Office (SSO) and/or remit required contributions.

Details of Violation:
${data.specificIssue}

Monthly salary: ฿${data.monthlySalary}
Required employee contribution (5%): ฿${Math.min(Number(data.monthlySalary) * 0.05, 875).toFixed(0)}
Required employer contribution (5%): ฿${Math.min(Number(data.monthlySalary) * 0.05, 875).toFixed(0)}

I request immediate registration with SSO and payment of all outstanding contributions, penalties, and interest.

I will be filing a formal complaint with the Social Security Office (1506) if this is not rectified within 7 days.

Yours faithfully,

${data.employeeName}
`,
  };

  return templates[type];
}

function generateThaiLetter(type: DocType, data: FormData, date: string): string {
  const templates: Record<DocType, string> = {
    severance_inquiry: `${data.employeeName}
${data.employeeAddress}

${date}

ฝ่ายทรัพยากรบุคคล
${data.employerName}
${data.employerAddress}

เรื่อง: หนังสือเรียกร้องค่าชดเชยตามกฎหมาย

เรียน ผู้จัดการฝ่ายทรัพยากรบุคคล

ข้าพเจ้า ${data.employeeName} ได้ทำงานในตำแหน่ง ${data.position} กับบริษัท ${data.employerName} ตั้งแต่วันที่ ${data.startDate} ถึงวันที่ ${data.endDate}

หลังจากสิ้นสุดการจ้างงาน นายจ้างยังมิได้ชำระค่าชดเชยตามที่กฎหมายกำหนด ซึ่งข้าพเจ้ามีสิทธิได้รับตามมาตรา ๑๑๘ แห่งพระราชบัญญัติคุ้มครองแรงงาน พ.ศ. ๒๕๔๑ (แก้ไขเพิ่มเติม พ.ศ. ๒๕๖๙)

โดยอิงจากอายุงานและเงินเดือน ฿${data.monthlySalary} บาทต่อเดือน ข้าพเจ้ามีสิทธิได้รับค่าชดเชยเป็นจำนวน ฿${data.amount} บาท

ข้าพเจ้าขอให้นายจ้างชำระค่าชดเชยดังกล่าวภายใน ๑๕ วัน นับแต่วันที่ได้รับหนังสือฉบับนี้

หากไม่ได้รับการตอบสนองที่เหมาะสม ข้าพเจ้าจะดำเนินการยื่นเรื่องร้องเรียนต่อกรมสวัสดิการและคุ้มครองแรงงาน (กสร.) สายด่วน ๑๕๔๖ และดำเนินคดีตามกฎหมายต่อไป

ขอแสดงความนับถือ

${data.employeeName}
`,
    sick_pay_demand: `${data.employeeName}
${data.employeeAddress}

${date}

ฝ่ายทรัพยากรบุคคล
${data.employerName}

เรื่อง: เรียกร้องค่าจ้างในวันลาป่วยที่ถูกหักโดยมิชอบ

เรียน ผู้จัดการฝ่ายทรัพยากรบุคคล

ข้าพเจ้า ${data.employeeName} ตำแหน่ง ${data.position} ขอแจ้งให้ทราบว่า นายจ้างได้หักค่าจ้างในวันลาป่วยโดยมิชอบด้วยกฎหมาย

ตามมาตรา ๓๒ แห่งพระราชบัญญัติคุ้มครองแรงงาน พ.ศ. ๒๕๔๑ (แก้ไขเพิ่มเติม) ลูกจ้างมีสิทธิลาป่วยได้ไม่เกิน ๓๐ วันต่อปี โดยได้รับค่าจ้างเต็มจำนวน และนายจ้างไม่สามารถนำวันลาป่วยไปหักจากวันลาพักร้อนได้

จำนวนที่ถูกหักโดยมิชอบ: ฿${data.amount} บาท

ข้าพเจ้าขอให้ชำระเงินคืนภายใน ๗ วัน มิฉะนั้นจะเป็นความผิดทางอาญาตามมาตรา ๑๔๔ แห่งพระราชบัญญัติคุ้มครองแรงงาน

ขอแสดงความนับถือ

${data.employeeName}
`,
    unfair_dismissal: `${data.employeeName}
${data.employeeAddress}

${date}

${data.employerName}
${data.employerAddress}

เรื่อง: แจ้งการเลิกจ้างที่ไม่เป็นธรรม — เรียกร้องค่าเสียหาย

เรียน ผู้บริหาร / ฝ่ายทรัพยากรบุคคล

ข้าพเจ้า ${data.employeeName} ขอแจ้งว่าการเลิกจ้างเมื่อวันที่ ${data.endDate} เป็นการเลิกจ้างที่ไม่เป็นธรรมและขัดต่อกฎหมายแรงงานไทย

เหตุผล: ${data.specificIssue}

ข้าพเจ้าเรียกร้องค่าชดเชยรวม ฿${data.amount} บาท ภายใน ๑๕ วัน

หากไม่ได้รับการชำระ จะยื่นเรื่องต่อกรมสวัสดิการและคุ้มครองแรงงาน และศาลแรงงาน

ขอแสดงความนับถือ

${data.employeeName}
`,
    sso_complaint: `${data.employeeName}
${data.employeeAddress}

${date}

สำนักงานประกันสังคม
${data.employerAddress}

เรื่อง: แจ้งนายจ้างไม่นำส่งเงินสมทบประกันสังคม

เรียน ผู้อำนวยการสำนักงานประกันสังคม

ข้าพเจ้า ${data.employeeName} ลูกจ้างของ ${data.employerName} ตั้งแต่วันที่ ${data.startDate} ถึง ${data.endDate} ตำแหน่ง ${data.position} ขอแจ้งว่านายจ้างไม่ได้นำส่งเงินสมทบประกันสังคมตามที่กฎหมายกำหนด

รายละเอียด: ${data.specificIssue}

เงินเดือน: ฿${data.monthlySalary} บาท
เงินสมทบที่ต้องชำระ (ฝ่ายลูกจ้าง 5%): ฿${Math.min(Number(data.monthlySalary) * 0.05, 875).toFixed(0)} บาทต่อเดือน

ขอให้ดำเนินการตรวจสอบและบังคับให้นายจ้างชำระเงินสมทบค้างชำระพร้อมดอกเบี้ยโดยเร็ว

ขอแสดงความนับถือ

${data.employeeName}
`,
  };

  return templates[type];
}

export default function Documents() {
  const [docType, setDocType] = useState<DocType>('severance_inquiry');
  const [lang, setLang] = useState<'en' | 'th' | 'both'>('both');
  const [form, setForm] = useState<FormData>({
    employeeName: '',
    employeeNationality: '',
    employeeAddress: '',
    employerName: '',
    employerAddress: '',
    position: '',
    startDate: '',
    endDate: '',
    monthlySalary: '',
    specificIssue: '',
    amount: '',
  });
  const [generated, setGenerated] = useState<{ en: string; th: string } | null>(null);
  const [copied, setCopied] = useState<'en' | 'th' | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setGenerated(null);
    setSaved(false);
  }

  function handleGenerate() {
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const en = generateEnglishLetter(docType, form, date);
    const th = generateThaiLetter(docType, form, date);
    setGenerated({ en, th });
    setSaved(false);
    setTimeout(() => {
      document.getElementById('generated-docs')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  async function handleCopy(which: 'en' | 'th') {
    if (!generated) return;
    await navigator.clipboard.writeText(which === 'en' ? generated.en : generated.th);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleDownload(which: 'en' | 'th') {
    if (!generated) return;
    const content = which === 'en' ? generated.en : generated.th;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `labor-shield-${docType}-${which}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSave() {
    if (!generated) return;
    setSaving(true);
    try {
      await supabase.from('generated_documents').insert({
        type: docType,
        language: lang === 'both' ? 'en' : lang,
        content: generated.en + '\n\n---THAI---\n\n' + generated.th,
        employee_name: form.employeeName,
        employer_name: form.employerName,
      });
      setSaved(true);
    } catch (_) {
      // silently fail — offline use is fine
    } finally {
      setSaving(false);
    }
  }

  const isFormValid = form.employeeName && form.employerName && form.position && form.startDate;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#0a1628' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-500/30 mb-4">
            <FileText size={28} className="text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Document Generator
          </h1>
          <p className="text-slate-400">Generate formal demand letters in English and Legal Thai. Ready to send to HR.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          {/* Document Type */}
          <div className="mb-5">
            <label className="block text-slate-300 text-sm font-medium mb-2">Document Type</label>
            <div className="relative">
              <select
                value={docType}
                onChange={(e) => { setDocType(e.target.value as DocType); setGenerated(null); }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none"
              >
                {DOC_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-slate-500 text-xs mt-1">{DOC_TYPES.find((d) => d.value === docType)?.desc}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { field: 'employeeName', label: 'Your Full Name', required: true, placeholder: 'John Smith' },
              { field: 'employeeNationality', label: 'Nationality', required: false, placeholder: 'British' },
              { field: 'position', label: 'Job Title / Position', required: true, placeholder: 'Senior Software Engineer' },
              { field: 'monthlySalary', label: 'Monthly Salary (THB)', required: false, placeholder: '45000' },
              { field: 'startDate', label: 'Employment Start Date', required: true, placeholder: '', type: 'date' },
              { field: 'endDate', label: 'Termination / Issue Date', required: false, placeholder: '', type: 'date' },
              { field: 'amount', label: 'Amount Claimed (THB)', required: false, placeholder: '135000' },
            ].map(({ field, label, required, placeholder, type }) => (
              <div key={field}>
                <label className="block text-slate-300 text-xs font-medium mb-1.5">
                  {label} {required && <span className="text-red-400">*</span>}
                </label>
                <input
                  type={type || 'text'}
                  value={form[field as keyof FormData]}
                  onChange={(e) => update(field as keyof FormData, e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/60 transition-all"
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-slate-300 text-xs font-medium mb-1.5">Employer Name <span className="text-red-400">*</span></label>
            <input
              value={form.employerName}
              onChange={(e) => update('employerName', e.target.value)}
              placeholder="ABC Company Limited"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/60 transition-all"
            />
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">Your Address</label>
              <textarea
                value={form.employeeAddress}
                onChange={(e) => update('employeeAddress', e.target.value)}
                placeholder="123/45 Sukhumvit Rd, Bangkok 10110"
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">Employer Address</label>
              <textarea
                value={form.employerAddress}
                onChange={(e) => update('employerAddress', e.target.value)}
                placeholder="999 Silom Rd, Bangkok 10500"
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none transition-all"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-slate-300 text-xs font-medium mb-1.5">Specific Issue / Additional Details</label>
            <textarea
              value={form.specificIssue}
              onChange={(e) => update('specificIssue', e.target.value)}
              placeholder="Describe the specific violation, e.g.: 'I was terminated on [date] via WhatsApp message without written notice, citing illness as the reason...'"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-y transition-all"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!isFormValid}
            className="w-full mt-5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm disabled:cursor-not-allowed"
          >
            Generate Documents
          </button>
        </div>

        {/* Generated Documents */}
        {generated && (
          <div id="generated-docs" className="space-y-4">
            {/* Language tabs */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
              {(['both', 'en', 'th'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    lang === l ? 'bg-amber-600/20 text-amber-300 border border-amber-700/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l === 'both' ? 'Both Languages' : l === 'en' ? 'English' : 'Thai (ภาษาไทย)'}
                </button>
              ))}
            </div>

            {(lang === 'en' || lang === 'both') && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-slate-800/50 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-blue-400" />
                    <span className="text-white font-medium text-sm">English Version</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDownload('en')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1">
                      <Download size={12} />Download
                    </button>
                    <button onClick={() => handleCopy('en')} className="flex items-center gap-1.5 text-xs bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-700/50 rounded-lg px-3 py-1.5 transition-all">
                      {copied === 'en' ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
                    </button>
                  </div>
                </div>
                <pre className="px-5 py-4 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto">{generated.en}</pre>
              </div>
            )}

            {(lang === 'th' || lang === 'both') && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-slate-800/50 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-amber-400" />
                    <span className="text-white font-medium text-sm">Thai Version — ฉบับภาษาไทย</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDownload('th')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1">
                      <Download size={12} />Download
                    </button>
                    <button onClick={() => handleCopy('th')} className="flex items-center gap-1.5 text-xs bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-700/50 rounded-lg px-3 py-1.5 transition-all">
                      {copied === 'th' ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
                    </button>
                  </div>
                </div>
                <pre className="px-5 py-4 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans overflow-x-auto">{generated.th}</pre>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all border ${
                  saved
                    ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
                }`}
              >
                {saved ? <><Check size={14} />Saved</> : saving ? 'Saving...' : 'Save to History'}
              </button>
              <p className="text-slate-500 text-xs self-center">Documents saved locally for reference</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
