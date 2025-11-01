// Authentication and user management
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
    }

    login(userData) {
        // Check if user exists, if not create new user
        let user = this.users.find(u => u.email === userData.email);
        
        if (!user) {
            user = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                balance: 0,
                bids: [],
                transactions: [],
                joinDate: new Date().toISOString()
            };
            this.users.push(user);
            this.saveUsers();
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateUser(userData) {
        if (this.currentUser) {
            Object.assign(this.currentUser, userData);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Update in users array
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex] = this.currentUser;
                this.saveUsers();
            }
        }
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    topUpBalance(amount) {
        if (this.currentUser && amount >= 50000000) {
            this.currentUser.balance += amount;
            this.currentUser.transactions.push({
                id: Date.now(),
                type: 'topup',
                amount: amount,
                description: 'Top Up Saldo',
                date: new Date().toISOString()
            });
            this.updateUser(this.currentUser);
            return true;
        }
        return false;
    }

    deductBalance(amount, description) {
        if (this.currentUser && this.currentUser.balance >= amount) {
            this.currentUser.balance -= amount;
            this.currentUser.transactions.push({
                id: Date.now(),
                type: 'deduction',
                amount: amount,
                description: description,
                date: new Date().toISOString()
            });
            this.updateUser(this.currentUser);
            return true;
        }
        return false;
    }

    addBid(carId, bidAmount) {
        if (this.currentUser) {
            const existingBidIndex = this.currentUser.bids.findIndex(b => b.carId === carId);
            
            if (existingBidIndex !== -1) {
                this.currentUser.bids[existingBidIndex] = {
                    carId: carId,
                    amount: bidAmount,
                    date: new Date().toISOString(),
                    status: 'active'
                };
            } else {
                this.currentUser.bids.push({
                    carId: carId,
                    amount: bidAmount,
                    date: new Date().toISOString(),
                    status: 'active'
                });
            }
            this.updateUser(this.currentUser);
        }
    }

    sendNotification(message) {
        // Simulate email and WhatsApp notification
        console.log(`📧 Email sent to ${this.currentUser.email}: ${message}`);
        console.log(`📱 WhatsApp sent to ${this.currentUser.phone}: ${message}`);
        
        // In real implementation, this would call actual email/SMS APIs
        alert(`Notifikasi terkirim!\n📧 Email: ${this.currentUser.email}\n📱 WhatsApp: ${this.currentUser.phone}\n\nPesan: ${message}`);
    }
}

// Global auth manager instance
const auth = new AuthManager();

// Login form handler
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        const user = auth.login(userData);
        if (user) {
            alert(`Selamat datang, ${user.name}!`);
            window.location.href = 'dashboard.html';
        }
    });
}

// Check authentication on protected pages
function requireAuth() {
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    auth.logout();
}

// Redirect to login if not authenticated (for protected pages)
if (window.location.pathname.includes('dashboard.html') || 
    window.location.pathname.includes('car.html')) {
    requireAuth();
}