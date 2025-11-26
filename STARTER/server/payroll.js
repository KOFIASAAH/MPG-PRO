const SSNIT_RATE = 0.055;

const TAX_BANDS = [
  { limit: 490, rate: 0 },
  { limit: 110, rate: 0.05 },
  { limit: 130, rate: 0.10 },
  { limit: 3166.67, rate: 0.175 },
  { limit: 16000, rate: 0.25 },
  { limit: 30520, rate: 0.30 },
  { limit: Infinity, rate: 0.35 },
];

function calculatePayroll(grossSalary) {
  const ssnit = grossSalary * SSNIT_RATE;
  const taxableIncome = grossSalary - ssnit;

  let paye = 0;
  let remainingIncome = taxableIncome;

  for (const band of TAX_BANDS) {
    if (remainingIncome <= 0) {
      break;
    }

    const taxableAtBand = Math.min(remainingIncome, band.limit);
    paye += taxableAtBand * band.rate;
    remainingIncome -= taxableAtBand;
  }

  const netSalary = grossSalary - ssnit - paye;

  return {
    grossSalary,
    ssnit: ssnit.toFixed(2),
    taxableIncome: taxableIncome.toFixed(2),
    paye: paye.toFixed(2),
    netSalary: netSalary.toFixed(2),
  };
}

module.exports = { calculatePayroll };
