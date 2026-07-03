const API = '/api/expenses';

const expenseForm = document.getElementById('expenseForm');
const expenseContainer = document.getElementById('expenseContainer');
const totalAmount = document.getElementById('totalAmount');
const emptyMessage = document.getElementById('emptyMessage');
const editId = document.getElementById('editId');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// load all expenses + total on page load
document.addEventListener('DOMContentLoaded', loadExpenses);

// GET all expenses and render them
function loadExpenses() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      renderExpenses(data.expenses);
      totalAmount.textContent = formatMoney(data.total);
    });
}

// render expense cards into #expenseContainer
function renderExpenses(expenses) {
  expenseContainer.innerHTML = '';

  if (!expenses.length) {
    emptyMessage.classList.remove('hidden');
    return;
  }
  emptyMessage.classList.add('hidden');

  expenses.forEach(expense => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded shadow p-4 flex flex-col gap-2';
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-lg">${escapeHtml(expense.title)}</h4>
        <span class="text-blue-600 font-semibold">${formatMoney(expense.amount)}</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span class="bg-gray-200 px-2 py-1 rounded">${escapeHtml(expense.category || 'Other')}</span>
        <span>${formatDate(expense.date)}</span>
      </div>
      <div class="flex gap-2 mt-2">
        <button class="editBtn bg-gray-200 hover:bg-gray-300 text-sm font-semibold py-1 px-3 rounded" data-id="${expense.id}">Edit</button>
        <button class="deleteBtn bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold py-1 px-3 rounded" data-id="${expense.id}">Delete</button>
      </div>
    `;
    expenseContainer.appendChild(card);
  });

  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.addEventListener('click', () => startEdit(btn.dataset.id));
  });
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', () => deleteExpense(btn.dataset.id));
  });
}

// POST new expense / PUT updated expense
expenseForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const payload = {
    title: document.getElementById('title').value.trim(),
    category: document.getElementById('category').value,
    amount: parseFloat(document.getElementById('amount').value),
    date: document.getElementById('date').value
  };

  const id = editId.value;

  if (id) {
    fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      resetForm();
      loadExpenses();
    });
  } else {
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      resetForm();
      loadExpenses();
    });
  }
});

// GET single expense and fill the form for editing
function startEdit(id) {
  fetch(`${API}/${id}`)
    .then(res => res.json())
    .then(expense => {
      editId.value = expense.id;
      document.getElementById('title').value = expense.title || '';
      document.getElementById('category').value = expense.category || 'Other';
      document.getElementById('amount').value = expense.amount || '';
      document.getElementById('date').value = expense.date || '';
      submitBtn.textContent = 'Save Changes';
      cancelEditBtn.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

cancelEditBtn.addEventListener('click', resetForm);

function resetForm() {
  expenseForm.reset();
  editId.value = '';
  submitBtn.textContent = 'Add Expense';
  cancelEditBtn.classList.add('hidden');
}

// DELETE expense
function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;

  fetch(`${API}/${id}`, { method: 'DELETE' })
    .then(loadExpenses);
}

// helpers
function formatMoney(amount) {
  return '$' + Number(amount).toFixed(2);
}

function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
