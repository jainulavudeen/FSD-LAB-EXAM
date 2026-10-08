const form = document.getElementById('orderForm');
const confirmation = document.getElementById('confirmation');
const orderDetails = document.getElementById('orderDetails');
const newOrderBtn = document.getElementById('newOrderBtn');

const ids = ['name', 'phone', 'food', 'quantity', 'address', 'payment'];

function setError(id, msg) {
  document.getElementById(id + 'Error').textContent = msg;
  document.getElementById(id).classList.toggle('invalid', !!msg);
  return !msg;
}

function validate() {
  let ok = true;
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const food = document.getElementById('food').value;
  const qty = Number(document.getElementById('quantity').value);
  const address = document.getElementById('address').value.trim();
  const payment = document.getElementById('payment').value;

  ok = setError('name', /^[A-Za-z ]{3,}$/.test(name) ? '' : 'Enter a valid name (letters only, min 3).') && ok;
  ok = setError('phone', /^[6-9]\d{9}$/.test(phone) ? '' : 'Enter a valid 10-digit phone number.') && ok;
  ok = setError('food', food ? '' : 'Please select a food item.') && ok;
  ok = setError('quantity', Number.isInteger(qty) && qty >= 1 && qty <= 20 ? '' : 'Quantity must be between 1 and 20.') && ok;
  ok = setError('address', address.length >= 10 ? '' : 'Enter a complete address (min 10 characters).') && ok;
  ok = setError('payment', payment ? '' : 'Please select a payment method.') && ok;
  return ok;
}

form.addEventListener('submit', function (e) {
  e.preventDefault(); // no page refresh
  if (!validate()) return;

  orderDetails.innerHTML = `
    <b>Name:</b> ${escapeHtml(document.getElementById('name').value.trim())}<br>
    <b>Phone:</b> ${escapeHtml(document.getElementById('phone').value.trim())}<br>
    <b>Food Item:</b> ${escapeHtml(document.getElementById('food').value)}<br>
    <b>Quantity:</b> ${escapeHtml(document.getElementById('quantity').value)}<br>
    <b>Address:</b> ${escapeHtml(document.getElementById('address').value.trim())}<br>
    <b>Payment:</b> ${escapeHtml(document.getElementById('payment').value)}
  `;
  form.classList.add('hidden');
  confirmation.classList.remove('hidden');
});

function resetAll() {
  form.reset();
  ids.forEach(id => setError(id, ''));
}

form.addEventListener('reset', function () {
  setTimeout(() => ids.forEach(id => setError(id, '')), 0);
});

newOrderBtn.addEventListener('click', function () {
  resetAll();
  confirmation.classList.add('hidden');
  form.classList.remove('hidden');
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
