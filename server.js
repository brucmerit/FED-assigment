const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // parse JSON body
app.use(express.static(path.join(__dirname, 'public'))); // serve the html/tailwind frontend

let expenses = [
  { id: 1, title: 'Flight to Seoul', category: 'Transport', amount: 450.00, date: '2026-06-01' },
  { id: 2, title: 'JW Marriott (3 nights)', category: 'Lodging', amount: 600.00, date: '2026-06-02' },
  { id: 3, title: 'Ramen & Kimchi', category: 'Food', amount: 65.50, date: '2026-06-03' }
];

// getTotal: calculate total sum of all expenses
function getTotal(list) {
  return list.reduce((sum, e) => sum + Number(e.amount), 0);
}

//GET all expenses + total sum
app.get('/api/expenses', (req, res) => {
  res.json({
    expenses: expenses,
    total: getTotal(expenses)
  });
});

//GET single expense by id
app.get('/api/expenses/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let expense = expenses.find(e => e.id === id);
  if (expense) {
    res.json(expense);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

//POST new expense
app.post('/api/expenses', (req, res) => {
  let newExpense = { id: Date.now(), ...req.body };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

//PUT update existing expense
app.put('/api/expenses/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...req.body };
    res.json(expenses[index]);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

//DELETE existing expense
app.delete('/api/expenses/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses = expenses.filter(e => e.id !== id);
    res.json({ message: 'Deleted successfully' });
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});