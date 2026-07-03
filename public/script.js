// This is the base URL for our API (defined in server.js)
const API = '/api/expenses';

// Grab the HTML elements we need to work with
const expenseForm = document.getElementById('expenseForm');
const expenseContainer = document.getElementById('expenseContainer');
const totalAmount = document.getElementById('totalAmount');

// When the page loads, get all expenses and show them
window.onload = function () {
  loadExpenses();
};

// GET all expenses from the server and display them
function loadExpenses() {
  fetch(API)
    .then(response => response.json())
    .then(data => {
      // data looks like: { expenses: [...], total: 123.45 }
      showExpenses(data.expenses);
      totalAmount.textContent = '$' + data.total.toFixed(2);
    });
}

// Take the list of expenses and turn them into HTML cards
function showExpenses(expenses) {
  // clear out whatever was there before
  expenseContainer.innerHTML = '';

  // loop through each expense and build a card for it
  for (let i = 0; i < expenses.length; i++) {
    const expense = expenses[i];

    const card = document.createElement('div');
    card.className = 'bg-white rounded shadow p-4';

    card.innerHTML = `
      <h4 class="font-bold text-lg">${expense.title}</h4>
      <p class="text-gray-500">${expense.category} — ${expense.date}</p>
      <p class="text-blue-600 font-semibold">$${expense.amount}</p>
      <button onclick="deleteExpense(${expense.id})" class="bg-red-100 text-red-700 text-sm py-1 px-3 rounded mt-2">
        Delete
      </button>
    `;

    expenseContainer.appendChild(card);
  }
}

// POST a new expense when the form is submitted
expenseForm.addEventListener('submit', function (event) {
  event.preventDefault(); // stop the page from refreshing

  const newExpense = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    amount: document.getElementById('amount').value,
    date: document.getElementById('date').value
  };

  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newExpense)
  }).then(function () {
    expenseForm.reset(); // clear the form
    loadExpenses();      // refresh the list
  });
});

// DELETE an expense by id
function deleteExpense(id) {
  fetch(API + '/' + id, {
    method: 'DELETE'
  }).then(function () {
    loadExpenses(); // refresh the list
  });
}
