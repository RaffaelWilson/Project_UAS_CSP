// Get real-time car data from localStorage or use default
function getCarsData() {
  const storedCars = localStorage.getItem('carsData');
  if (storedCars) {
    return JSON.parse(storedCars);
  }
  
  // Default cars data
  return [
    { id: 1, name: "Toyota Avanza 1.3 G MT", year: 2019, location: "Jakarta Selatan", auction_end: "2025-01-25 15:30:00", image: "images/car1.jpeg", current_bid: 145000000 },
    { id: 2, name: "Honda Brio 1.2 E CVT", year: 2020, location: "Bandung", auction_end: "2025-01-26 16:00:00", image: "images/car1.jpeg", current_bid: 138000000 },
    { id: 3, name: "Daihatsu Xenia 1.3 R MT", year: 2018, location: "Surabaya", auction_end: "2025-12-31 14:45:00", image: "images/car1.jpeg", current_bid: 127000000 },
    { id: 4, name: "Suzuki Ertiga 1.5 GX AT", year: 2021, location: "Medan", auction_end: "2025-01-27 17:15:00", image: "images/car1.jpeg", current_bid: 185000000 },
    { id: 5, name: "Mitsubishi Pajero Sport 2.5 Dakar", year: 2017, location: "Jakarta Utara", auction_end: "2025-12-31 18:00:00", image: "images/car1.jpeg", current_bid: 290000000 },
    { id: 6, name: "Toyota Innova 2.4 V AT", year: 2019, location: "Yogyakarta", auction_end: "2025-01-24 16:30:00", image: "images/car1.jpeg", current_bid: 248000000 },
    { id: 7, name: "Honda CR-V 1.5 Turbo Prestige", year: 2020, location: "Jakarta Barat", auction_end: "2025-12-31 18:00:00", image: "images/car1.jpeg", current_bid: 385000000 },
    { id: 8, name: "Toyota Fortuner 2.4 VRZ AT", year: 2019, location: "Surabaya", auction_end: "2025-12-31 17:30:00", image: "images/car1.jpeg", current_bid: 430000000 },
    { id: 9, name: "Mazda CX-5 2.5 Elite AT", year: 2021, location: "Bandung", auction_end: "2025-12-31 16:00:00", image: "images/car1.jpeg", current_bid: 365000000 },
    { id: 10, name: "Nissan X-Trail 2.5 CVT", year: 2018, location: "Medan", auction_end: "2025-01-28 15:45:00", image: "images/car1.jpeg", current_bid: 290000000 },
    { id: 11, name: "BMW X1 sDrive18i Executive", year: 2020, location: "Jakarta Selatan", auction_end: "2025-12-31 19:00:00", image: "images/car1.jpeg", current_bid: 485000000 },
    { id: 12, name: "Hyundai Tucson 2.0 GLS AT", year: 2019, location: "Semarang", auction_end: "2025-12-31 14:30:00", image: "images/car1.jpeg", current_bid: 298000000 },
    { id: 13, name: "Wuling Almaz 1.5 Turbo Exclusive", year: 2021, location: "Malang", auction_end: "2025-12-31 17:00:00", image: "images/car1.jpeg", current_bid: 245000000 },
    { id: 14, name: "Isuzu MU-X 2.5 Premier AT", year: 2018, location: "Palembang", auction_end: "2025-12-31 12:00:00", image: "images/car1.jpeg", current_bid: 320000000 }
  ];
}

// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    loadDashboard();
});

function loadDashboard() {
    const user = auth.getCurrentUser();
    
    // Update user info
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-balance').textContent = `Rp ${user.balance.toLocaleString()}`;
    
    // Load bid statistics
    loadBidStats();
    loadMyBids();
    loadTransactionHistory();
}

function loadBidStats() {
    const user = auth.getCurrentUser();
    const cars = getCarsData();
    
    // Get unique cars user has bid on
    const uniqueCarIds = [...new Set(user.bids.map(bid => bid.carId))];
    
    let activeBids = 0;
    let winningBids = 0;
    
    uniqueCarIds.forEach(carId => {
        const car = cars.find(c => c.id == carId);
        if (!car) return;
        
        const timeLeft = getTimeLeft(car.auction_end);
        const isActive = timeLeft.total > 0;
        
        if (isActive) {
            activeBids++;
            
            // Get user's latest bid for this car
            const userLatestBid = user.bids
                .filter(b => b.carId == carId)
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            
            // Check if user is winning (has highest bid)
            if (car.current_bid == userLatestBid.amount) {
                winningBids++;
            }
        }
    });
    
    document.getElementById('active-bids').textContent = activeBids;
    document.getElementById('winning-bids').textContent = winningBids;
}

function loadMyBids() {
    const user = auth.getCurrentUser();
    const myBidsContainer = document.getElementById('my-bids');
    const cars = getCarsData(); // Get real-time car data
    
    if (user.bids.length === 0) {
        myBidsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada bid yang dilakukan</p>';
        return;
    }

    // Sort bids by date (most recent first)
    const sortedBids = user.bids.sort((a, b) => new Date(b.date) - new Date(a.date));

    myBidsContainer.innerHTML = sortedBids.map(bid => {
        const car = cars.find(c => c.id == bid.carId);
        if (!car) return '';
        
        const timeLeft = getTimeLeft(car.auction_end);
        const isActive = timeLeft.total > 0;
        
        // Get user's latest bid for this car
        const userLatestBid = user.bids
            .filter(b => b.carId == bid.carId)
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        const isWinning = isActive && car.current_bid == userLatestBid.amount;
        
        let statusBadge = '';
        let statusText = '';
        
        if (!isActive) {
            statusBadge = 'bg-gray-500';
            statusText = 'Lelang Berakhir';
        } else if (isWinning) {
            statusBadge = 'bg-green-500';
            statusText = 'Bid Tertinggi Anda';
        } else {
            statusBadge = 'bg-red-500';
            statusText = 'Terkalahkan';
        }

        return `
            <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <img src="${car.image}" alt="${car.name}" class="w-16 h-12 object-cover rounded">
                            <div>
                                <h4 class="font-semibold text-gray-800">${car.name}</h4>
                                <p class="text-xs text-gray-500">${car.year} • ${car.location}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p class="text-gray-600">Bid Anda: <span class="font-semibold text-blue-600">Rp ${userLatestBid.amount.toLocaleString()}</span></p>
                                <p class="text-gray-600">Bid Tertinggi: <span class="font-semibold text-green-600">Rp ${car.current_bid.toLocaleString()}</span></p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500">Tanggal Bid: ${formatDate(userLatestBid.date)}</p>
                                <p class="text-xs text-gray-500">Berakhir: ${formatDate(car.auction_end)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="text-right ml-4">
                        <span class="inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${statusBadge}">
                            ${statusText}
                        </span>
                        <p class="text-xs text-gray-500 mt-1">
                            ${isActive ? `${timeLeft.days > 0 ? timeLeft.days + 'h ' : ''}${timeLeft.hours}j ${timeLeft.minutes}m` : 'Selesai'}
                        </p>
                        <a href="car.html?id=${car.id}" class="text-xs text-blue-600 hover:underline mt-1 block">Lihat Detail</a>
                    </div>
                </div>
            </div>
        `;
    }).filter(html => html !== '').join('');
}

function loadTransactionHistory() {
    const user = auth.getCurrentUser();
    const transactionContainer = document.getElementById('transaction-history');
    
    if (user.transactions.length === 0) {
        transactionContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada transaksi</p>';
        return;
    }

    transactionContainer.innerHTML = user.transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(transaction => {
            const isTopup = transaction.type === 'topup';
            const isDeduction = transaction.type === 'deduction';
            
            let iconClass = '';
            let bgClass = '';
            
            if (isTopup) {
                iconClass = '💰';
                bgClass = 'bg-green-50 border-green-200';
            } else if (isDeduction) {
                iconClass = '🏎️';
                bgClass = 'bg-red-50 border-red-200';
            }
            
            return `
                <div class="border rounded-lg p-4 ${bgClass}">
                    <div class="flex justify-between items-start">
                        <div class="flex items-start gap-3">
                            <div class="text-2xl">${iconClass}</div>
                            <div>
                                <p class="font-semibold text-gray-800">${transaction.description}</p>
                                <p class="text-sm text-gray-600">${formatDate(transaction.date)}</p>
                                ${transaction.type === 'deduction' ? '<p class="text-xs text-gray-500 mt-1">Deposit akan dikembalikan jika tidak menang</p>' : ''}
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold ${isTopup ? 'text-green-600' : 'text-red-600'}">
                                ${isTopup ? '+' : '-'}Rp ${transaction.amount.toLocaleString()}
                            </p>
                            <p class="text-xs text-gray-500">
                                ${isTopup ? 'Saldo Masuk' : 'Deposit Lelang'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
}



// Utility function for date formatting (if not already defined)
if (typeof formatDate === 'undefined') {
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        };
        return date.toLocaleDateString('id-ID', options).replace(',', '');
    }
}

// Utility function for time calculation (if not already defined)
if (typeof getTimeLeft === 'undefined') {
    function getTimeLeft(endTime) {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const total = end - now;
        
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((total % (1000 * 60)) / 1000);
        
        return { total, days, hours, minutes, seconds };
    }
}