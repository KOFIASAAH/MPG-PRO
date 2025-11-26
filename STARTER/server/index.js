const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const { calculatePayroll } = require('./payroll');

app.post('/calculate-payroll', (req, res) => {
  const { grossSalary } = req.body;

  if (typeof grossSalary !== 'number' || grossSalary < 0) {
    return res.status(400).json({ error: 'Invalid gross salary' });
  }

  const payroll = calculatePayroll(grossSalary);
  res.json(payroll);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
