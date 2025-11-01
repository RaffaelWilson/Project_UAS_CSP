// Payment processing
let countdownTimer;
let timeLeft = 15 * 60; // 15 minutes in seconds

document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    loadPaymentData();
    startCountdown();
});

function loadPaymentData() {
    const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment'));
    
    if (!pendingPayment) {
        alert('Data pembayaran tidak ditemukan');
        window.location.href = 'topup.html';
        return;
    }

    // Display payment info
    document.getElementById('order-id').textContent = pendingPayment.orderId;
    document.getElementById('payment-amount').textContent = `Rp ${pendingPayment.amount.toLocaleString()}`;
    
    // Load payment method specific instructions
    loadPaymentInstructions(pendingPayment.method, pendingPayment.amount);
}

function loadPaymentInstructions(method, amount) {
    const instructionsDiv = document.getElementById('payment-instructions');
    const methodName = getPaymentMethodName(method);
    
    document.getElementById('payment-method').textContent = methodName;
    
    let instructions = '';
    
    switch(method) {
        case 'qris':
            instructions = `
                <div class="text-center">
                    <div class="bg-white border-2 border-gray-300 rounded-lg p-4 mb-4">
                        <div class="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                            <span class="text-4xl">📱</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-2">QR Code QRIS</p>
                    </div>
                    <p class="text-sm text-gray-600">Scan QR code dengan aplikasi e-wallet atau mobile banking Anda</p>
                </div>
            `;
            break;
            
        case 'ovo':
            instructions = `
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h5 class="font-semibold text-purple-800 mb-2">Cara Pembayaran OVO:</h5>
                    <ol class="text-sm text-purple-700 space-y-1">
                        <li>1. Buka aplikasi OVO</li>
                        <li>2. Pilih "Bayar" atau "Pay"</li>
                        <li>3. Masukkan kode merchant: <strong>LELANG001</strong></li>
                        <li>4. Konfirmasi pembayaran Rp ${amount.toLocaleString()}</li>
                    </ol>
                </div>
            `;
            break;
            
        case 'bca':
            const vaNumber = '70012' + Math.random().toString().substr(2, 8);
            instructions = `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 class="font-semibold text-blue-800 mb-2">Virtual Account BCA:</h5>
                    <div class="bg-white rounded p-3 mb-3">
                        <p class="text-sm text-gray-600">Nomor Virtual Account:</p>
                        <p class="text-lg font-bold text-blue-600">${vaNumber}</p>
                    </div>
                    <p class="text-sm text-blue-700">Transfer ke nomor VA di atas melalui ATM, mobile banking, atau internet banking BCA</p>
                </div>
            `;
            break;
            
        case 'mandiri':
            const mandiriVA = '88810' + Math.random().toString().substr(2, 8);
            instructions = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 class="font-semibold text-yellow-800 mb-2">Virtual Account Mandiri:</h5>
                    <div class="bg-white rounded p-3 mb-3">
                        <p class="text-sm text-gray-600">Nomor Virtual Account:</p>
                        <p class="text-lg font-bold text-yellow-600">${mandiriVA}</p>
                    </div>
                    <p class="text-sm text-yellow-700">Transfer ke nomor VA di atas melalui ATM, Livin', atau internet banking Mandiri</p>
                </div>
            `;
            break;
            
        case 'bri':
            const briVA = '26215' + Math.random().toString().substr(2, 8);
            instructions = `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 class="font-semibold text-blue-800 mb-2">Virtual Account BRI:</h5>
                    <div class="bg-white rounded p-3 mb-3">
                        <p class="text-sm text-gray-600">Nomor Virtual Account:</p>
                        <p class="text-lg font-bold text-blue-600">${briVA}</p>
                    </div>
                    <p class="text-sm text-blue-700">Transfer ke nomor VA di atas melalui ATM, BRImo, atau internet banking BRI</p>
                </div>
            `;
            break;
            
        case 'bni':
            const bniVA = '98810' + Math.random().toString().substr(2, 8);
            instructions = `
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h5 class="font-semibold text-orange-800 mb-2">Virtual Account BNI:</h5>
                    <div class="bg-white rounded p-3 mb-3">
                        <p class="text-sm text-gray-600">Nomor Virtual Account:</p>
                        <p class="text-lg font-bold text-orange-600">${bniVA}</p>
                    </div>
                    <p class="text-sm text-orange-700">Transfer ke nomor VA di atas melalui ATM, BNI Mobile, atau internet banking BNI</p>
                </div>
            `;
            break;
    }
    
    instructionsDiv.innerHTML = instructions;
}

function getPaymentMethodName(method) {
    const names = {
        'qris': 'QRIS',
        'ovo': 'OVO',
        'bca': 'Virtual Account BCA',
        'mandiri': 'Virtual Account Mandiri',
        'bri': 'Virtual Account BRI',
        'bni': 'Virtual Account BNI'
    };
    return names[method] || method.toUpperCase();
}

function startCountdown() {
    countdownTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('countdown').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            alert('Waktu pembayaran habis');
            cancelPayment();
        }
        
        timeLeft--;
    }, 1000);
}

function simulatePayment() {
    const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment'));
    
    if (!pendingPayment) {
        alert('Data pembayaran tidak ditemukan');
        return;
    }
    
    // Process the top-up
    if (auth.topUpBalance(pendingPayment.amount)) {
        // Clear pending payment
        localStorage.removeItem('pendingPayment');
        clearInterval(countdownTimer);
        
        alert(`Pembayaran berhasil! Saldo Anda bertambah Rp ${pendingPayment.amount.toLocaleString()}`);
        window.location.href = 'dashboard.html';
    } else {
        alert('Gagal memproses pembayaran');
    }
}

function cancelPayment() {
    localStorage.removeItem('pendingPayment');
    clearInterval(countdownTimer);
    window.location.href = 'topup.html';
}