// Top-up functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    loadCurrentBalance();
    setupEventListeners();
});

function loadCurrentBalance() {
    const user = auth.getCurrentUser();
    document.getElementById('current-balance').textContent = `Rp ${user.balance.toLocaleString()}`;
}

function setupEventListeners() {
    const amountInput = document.getElementById('topup-amount');
    
    // Update summary when amount changes
    amountInput.addEventListener('input', updateSummary);
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', updateSummary);
    });
}

function updateSummary() {
    const amount = parseInt(document.getElementById('topup-amount').value) || 0;
    document.getElementById('summary-amount').textContent = `Rp ${amount.toLocaleString()}`;
    document.getElementById('summary-total').textContent = `Rp ${amount.toLocaleString()}`;
}

function processTopup() {
    const amount = parseInt(document.getElementById('topup-amount').value);
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    // Validation
    if (!amount || amount < 50000000) {
        alert('Minimum top up adalah Rp 50.000.000');
        return;
    }
    
    if (!selectedPayment) {
        alert('Silakan pilih metode pembayaran');
        return;
    }
    
    // Show payment page
    showPaymentPage(amount, selectedPayment.value);
}

function showPaymentPage(amount, paymentMethod) {
    const paymentData = {
        amount: amount,
        method: paymentMethod,
        orderId: 'TU' + Date.now(),
        timestamp: new Date().toISOString()
    };
    
    // Store payment data for the payment page
    localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    
    // Redirect to payment page
    window.location.href = `payment.html?method=${paymentMethod}&amount=${amount}`;
}