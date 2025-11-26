document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payroll-form');
  const resultsDiv = document.getElementById('results');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const employeeName = document.getElementById('employee-name').value;
    const grossSalary = document.getElementById('gross-salary').value;

    const response = await fetch('/calculate-payroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employeeName, grossSalary: parseFloat(grossSalary) }),
    });

    const results = await response.json();

    if (response.ok) {
      resultsDiv.innerHTML = `
        <h3>Payroll for ${employeeName}</h3>
        <p><strong>Gross Salary:</strong> ${results.grossSalary}</p>
        <p><strong>SSNIT Contribution:</strong> ${results.ssnit}</p>
        <p><strong>Taxable Income:</strong> ${results.taxableIncome}</p>
        <p><strong>PAYE:</strong> ${results.paye}</p>
        <p><strong>Net Salary:</strong> ${results.netSalary}</p>
      `;
    } else {
      resultsDiv.innerHTML = `<p style="color: red;">${results.error}</p>`;
    }
  });
});
