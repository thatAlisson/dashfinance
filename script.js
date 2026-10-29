// Seleção dos elementos do DOM
const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionsList = document.getElementById('transactions-list');

const totalIncomesEl = document.getElementById('total-incomes');
const totalExpensesEl = document.getElementById('total-expenses');
const totalBalanceEl = document.getElementById('total-balance');

// Carrega do LocalStorage ou inicia com array vazio
let transactions = JSON.parse(localStorage.getItem('dashfinance_items')) || [];

// Função para atualizar o LocalStorage
function updateLocalStorage() {
  localStorage.setItem('dashfinance_items', JSON.stringify(transactions));
}

// Formatar valores para Moeda BRL
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Calcular os totais
function updateValues() {
  const incomes = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const total = incomes - expenses;

  totalIncomesEl.textContent = formatCurrency(incomes);
  totalExpensesEl.textContent = formatCurrency(expenses);
  totalBalanceEl.textContent = formatCurrency(total);
}

// Adicionar item na tela
function addTransactionToDOM(transaction) {
  const li = document.createElement('li');
  li.classList.add(transaction.type);

  li.innerHTML = `
    <span>${transaction.desc}</span>
    <span>${formatCurrency(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  transactionsList.appendChild(li);
}

// Remover transação
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// Adicionar nova transação
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!desc || isNaN(amount)) return;

  const newTransaction = {
    id: Date.now(),
    desc,
    amount,
    type
  };

  transactions.push(newTransaction);
  updateLocalStorage();
  init();

  descInput.value = '';
  amountInput.value = '';
});

// Inicializar aplicação
function init() {
  transactionsList.innerHTML = '';
  transactions.forEach(addTransactionToDOM);
  updateValues();
}

init();