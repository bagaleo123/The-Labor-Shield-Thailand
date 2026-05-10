export const LABOR_LAW_2026 = {
  SSO_WAGE_CEILING: 17500,
  SSO_CONTRIBUTION_RATE: 0.05,
  SSO_MAX_CONTRIBUTION: 875,
  SICK_LEAVE_PAID_DAYS: 30,
  SICK_LEAVE_SSO_RATE: 0.5,
  NOTICE_PERIOD_MONTHS: 1,
};

export type DismissalReason =
  | 'redundancy'
  | 'restructuring'
  | 'misconduct'
  | 'illness'
  | 'resignation'
  | 'contract_end'
  | 'unfair';

export type SeveranceResult = {
  severanceDays: number;
  severancePay: number;
  noticePay: number;
  unpaidSickLeavePay: number;
  totalCompensation: number;
  isUnfairDismissal: boolean;
  warnings: string[];
  breakdown: { label: string; amount: number; note: string }[];
};

export function calculateSeverance(
  monthlySalary: number,
  startDate: Date,
  endDate: Date,
  dismissalReason: DismissalReason,
  usedSickDays: number = 0
): SeveranceResult {
  const warnings: string[] = [];
  const breakdown: { label: string; amount: number; note: string }[] = [];

  const dailySalary = monthlySalary / 30;
  const yearsWorked = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const daysWorked = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  let severanceDays = 0;
  if (daysWorked >= 120 && yearsWorked < 1) {
    severanceDays = 30;
  } else if (yearsWorked >= 1 && yearsWorked < 3) {
    severanceDays = 90;
  } else if (yearsWorked >= 3 && yearsWorked < 6) {
    severanceDays = 180;
  } else if (yearsWorked >= 6 && yearsWorked < 10) {
    severanceDays = 240;
  } else if (yearsWorked >= 10 && yearsWorked < 20) {
    severanceDays = 300;
  } else if (yearsWorked >= 20) {
    severanceDays = 400;
  }

  const isUnfairDismissal = dismissalReason === 'illness' || dismissalReason === 'unfair';

  if (dismissalReason === 'misconduct') {
    severanceDays = 0;
    warnings.push('Termination for misconduct may waive severance rights. Seek legal advice to verify the grounds.');
  }

  if (dismissalReason === 'resignation') {
    severanceDays = 0;
    warnings.push('Resignation typically forfeits severance unless constructive dismissal can be proven.');
  }

  if (isUnfairDismissal) {
    warnings.push('Termination due to illness is ILLEGAL under Thai Labor Law 2026. You are entitled to additional compensation.');
    warnings.push('File a complaint with the Department of Labour Protection (DLPW) immediately.');
  }

  if (daysWorked < 120 && dismissalReason !== 'resignation') {
    warnings.push('Employment less than 120 days: No statutory severance entitlement, but notice pay still applies.');
  }

  const severancePay = severanceDays * dailySalary;
  breakdown.push({
    label: 'Severance Pay',
    amount: severancePay,
    note: `${severanceDays} days × ฿${dailySalary.toFixed(0)}/day (${yearsWorked.toFixed(1)} years service)`,
  });

  let noticePay = 0;
  if (dismissalReason !== 'resignation' && dismissalReason !== 'misconduct') {
    noticePay = monthlySalary;
    breakdown.push({
      label: 'Notice Pay (in lieu)',
      amount: noticePay,
      note: 'Minimum 1 full pay cycle (30 days) per Thai Labor Law 2026',
    });
  }

  let unpaidSickLeavePay = 0;
  const paidDaysUsed = Math.min(usedSickDays, LABOR_LAW_2026.SICK_LEAVE_PAID_DAYS);
  const excessSickDays = Math.max(0, usedSickDays - LABOR_LAW_2026.SICK_LEAVE_PAID_DAYS);
  if (excessSickDays > 0) {
    unpaidSickLeavePay = excessSickDays * dailySalary * LABOR_LAW_2026.SICK_LEAVE_SSO_RATE;
    breakdown.push({
      label: 'SSO Sick Leave Benefit',
      amount: unpaidSickLeavePay,
      note: `${excessSickDays} days beyond 30-day paid limit × 50% daily rate (SSO covers)`,
    });
  }

  if (paidDaysUsed > 0) {
    breakdown.push({
      label: 'Sick Leave (already paid by employer)',
      amount: paidDaysUsed * dailySalary,
      note: `${paidDaysUsed} of 30 fully paid sick days used — employer cannot deduct from annual leave`,
    });
  }

  const totalCompensation = severancePay + noticePay + unpaidSickLeavePay;

  return {
    severanceDays,
    severancePay,
    noticePay,
    unpaidSickLeavePay,
    totalCompensation,
    isUnfairDismissal,
    warnings,
    breakdown,
  };
}

export type RedFlag = {
  type: 'illegal' | 'warning' | 'missing';
  clause: string;
  excerpt: string;
  explanation: string;
  legalRef: string;
};

const RED_FLAG_PATTERNS: { pattern: RegExp; flag: Omit<RedFlag, 'excerpt'> }[] = [
  {
    pattern: /no\s+sick\s+(pay|leave)|sick\s+leave\s+(not|without)\s+pay|sick\s+days?\s+unpaid/i,
    flag: {
      type: 'illegal',
      clause: 'Zero Sick Pay',
      explanation: 'Thai Labor Law 2026 mandates 30 fully paid sick days per year. Any clause denying sick pay is void.',
      legalRef: 'Labor Protection Act B.E. 2541, Section 32 (amended 2026)',
    },
  },
  {
    pattern: /sick\s+leave\s+(deducted?\s+from|counted\s+as)\s+annual|annual\s+leave.*sick/i,
    flag: {
      type: 'illegal',
      clause: 'Sick Leave Counted as Annual Leave',
      explanation: 'Employers cannot deduct sick leave from annual leave entitlement under Thai law.',
      legalRef: 'Labor Protection Act Section 32 — sick leave and annual leave are separate entitlements',
    },
  },
  {
    pattern: /terminate.*without\s+(notice|cause)|immediate\s+termination|dismissed?\s+at\s+will/i,
    flag: {
      type: 'illegal',
      clause: 'Immediate Termination Without Notice',
      explanation: 'Termination without at least 1 full pay cycle notice (or pay in lieu) is illegal unless for proven gross misconduct.',
      legalRef: 'Labor Protection Act Section 17 — minimum notice period required',
    },
  },
  {
    pattern: /fine[sd]?\s+(for|of)|penalt(y|ies)\s+(of|up\s+to)|deduct.*salary.*for|salary.*deduct.*for/i,
    flag: {
      type: 'illegal',
      clause: 'Illegal Salary Fines / Deductions',
      explanation: 'Employers may only deduct salary for taxes, SSO contributions, union dues, or court-ordered amounts. Disciplinary fines from wages are illegal.',
      legalRef: 'Labor Protection Act Section 76 — permitted deductions are exhaustively listed',
    },
  },
  {
    pattern: /no\s+severance|waive.*severance|forfeit.*severance|severance\s+not\s+applicable/i,
    flag: {
      type: 'illegal',
      clause: 'Waiver of Severance Rights',
      explanation: 'Statutory severance rights cannot be waived by contract. Any such clause is legally void.',
      legalRef: 'Labor Protection Act Section 118 — severance is a statutory right',
    },
  },
  {
    pattern: /non[\s-]?compete|cannot\s+work\s+for|prohibited\s+from\s+(working|employment)/i,
    flag: {
      type: 'warning',
      clause: 'Non-Compete Clause',
      explanation: 'Non-compete clauses are enforceable in Thailand but must be reasonable in scope, geography, and duration. Overly broad clauses may be void.',
      legalRef: 'Civil and Commercial Code Section 150 — unreasonable restrictions may be unenforceable',
    },
  },
  {
    pattern: /probation.*\d+\s*month|trial\s+period.*\d+/i,
    flag: {
      type: 'warning',
      clause: 'Probation Period',
      explanation: 'Probation periods are allowed but employees still accrue labor rights from day 1. Termination during probation still requires notice if over 120 days.',
      legalRef: 'Labor Protection Act — probation does not suspend statutory protections',
    },
  },
  {
    pattern: /overtime.*not\s+(paid|compensated)|no\s+overtime\s+pay|overtime\s+included/i,
    flag: {
      type: 'illegal',
      clause: 'No Overtime Compensation',
      explanation: 'Overtime must be paid at 1.5x the hourly rate on working days and 3x on holidays. Blanket "overtime included" clauses are typically illegal.',
      legalRef: 'Labor Protection Act Section 61 — overtime rates are mandatory',
    },
  },
  {
    pattern: /work\s+permit\s+cost.*employee|employee.*pay.*work\s+permit/i,
    flag: {
      type: 'illegal',
      clause: 'Employee Pays Work Permit Cost',
      explanation: 'Work permit fees are the employer\'s legal responsibility. Passing this cost to the employee is unlawful.',
      legalRef: 'Foreigner Working Management Emergency Decree B.E. 2560',
    },
  },
  {
    pattern: /no\s+annual\s+leave|annual\s+leave\s+not\s+(applicable|provided|paid)/i,
    flag: {
      type: 'illegal',
      clause: 'No Annual Leave',
      explanation: 'Employees with 1+ year of service are entitled to minimum 6 days paid annual leave per year.',
      legalRef: 'Labor Protection Act Section 30 — annual leave is mandatory',
    },
  },
];

export function scanContract(contractText: string): { flags: RedFlag[]; score: number; summary: string } {
  const flags: RedFlag[] = [];

  for (const { pattern, flag } of RED_FLAG_PATTERNS) {
    const match = contractText.match(pattern);
    if (match) {
      const start = Math.max(0, contractText.indexOf(match[0]) - 40);
      const end = Math.min(contractText.length, contractText.indexOf(match[0]) + match[0].length + 40);
      const excerpt = '...' + contractText.slice(start, end) + '...';
      flags.push({ ...flag, excerpt });
    }
  }

  const illegalCount = flags.filter((f) => f.type === 'illegal').length;
  const warningCount = flags.filter((f) => f.type === 'warning').length;

  let score = 100 - illegalCount * 20 - warningCount * 5;
  score = Math.max(0, Math.min(100, score));

  let summary = '';
  if (flags.length === 0) {
    summary = 'No obvious red flags detected. However, always consult a qualified Thai labor lawyer before signing.';
  } else if (illegalCount > 0) {
    summary = `${illegalCount} potentially illegal clause${illegalCount > 1 ? 's' : ''} detected. These clauses are void under Thai law and cannot be enforced against you.`;
  } else {
    summary = `${warningCount} clause${warningCount > 1 ? 's' : ''} require${warningCount === 1 ? 's' : ''} careful review. Seek legal advice before signing.`;
  }

  return { flags, score, summary };
}
