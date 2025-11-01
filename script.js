// Data lelang mobil
const cars = [
  { 
    id: 1, 
    name: "Toyota Avanza 1.3 G MT", 
    year: 2019,
    mileage: "45.000 km",
    base_price: 145000000, 
    current_bid: 145000000,
    location: "Jakarta Selatan",
    auction_start: "2025-01-18 09:00:00",
    auction_end: "2025-01-25 15:30:00",
    condition: "Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 2, 
    name: "Honda Brio 1.2 E CVT", 
    year: 2020,
    mileage: "32.000 km",
    base_price: 135000000, 
    current_bid: 138000000,
    location: "Bandung",
    auction_start: "2025-01-17 10:00:00",
    auction_end: "2025-01-26 16:00:00",
    condition: "Sangat Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 3, 
    name: "Daihatsu Xenia 1.3 R MT", 
    year: 2018,
    mileage: "58.000 km",
    base_price: 125000000, 
    current_bid: 127000000,
    location: "Surabaya",
    auction_start: "2025-01-16 08:00:00",
    auction_end: "2025-12-31 14:45:00",
    condition: "Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 4, 
    name: "Suzuki Ertiga 1.5 GX AT", 
    year: 2021,
    mileage: "28.000 km",
    base_price: 185000000, 
    current_bid: 185000000,
    location: "Medan",
    auction_start: "2025-01-19 09:30:00",
    auction_end: "2025-01-27 17:15:00",
    condition: "Sangat Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 5, 
    name: "Mitsubishi Pajero Sport 2.5 Dakar", 
    year: 2017,
    mileage: "75.000 km",
    base_price: 285000000, 
    current_bid: 290000000,
    location: "Jakarta Utara",
    auction_start: "2025-01-18 11:00:00",
    auction_end: "2025-12-31 18:00:00",
    condition: "Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 6, 
    name: "Toyota Innova 2.4 V AT", 
    year: 2019,
    mileage: "42.000 km",
    base_price: 245000000, 
    current_bid: 248000000,
    location: "Yogyakarta",
    auction_start: "2025-01-17 14:00:00",
    auction_end: "2025-01-24 16:30:00",
    condition: "Sangat Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 7, 
    name: "Honda CR-V 1.5 Turbo Prestige", 
    year: 2020,
    mileage: "35.000 km",
    base_price: 385000000, 
    current_bid: 385000000,
    location: "Jakarta Barat",
    auction_start: "2025-01-20 10:00:00",
    auction_end: "2025-12-31 18:00:00",
    condition: "Sangat Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 8, 
    name: "Toyota Fortuner 2.4 VRZ AT", 
    year: 2019,
    mileage: "48.000 km",
    base_price: 425000000, 
    current_bid: 430000000,
    location: "Surabaya",
    auction_start: "2025-01-19 09:00:00",
    auction_end: "2025-12-31 17:30:00",
    condition: "Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 9, 
    name: "Mazda CX-5 2.5 Elite AT", 
    year: 2021,
    mileage: "25.000 km",
    base_price: 365000000, 
    current_bid: 365000000,
    location: "Bandung",
    auction_start: "2025-01-21 11:00:00",
    auction_end: "2025-12-31 16:00:00",
    condition: "Sangat Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 10, 
    name: "Nissan X-Trail 2.5 CVT", 
    year: 2018,
    mileage: "62.000 km",
    base_price: 285000000, 
    current_bid: 290000000,
    location: "Medan",
    auction_start: "2025-01-18 14:30:00",
    auction_end: "2025-01-28 15:45:00",
    condition: "Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 11, 
    name: "BMW X1 sDrive18i Executive", 
    year: 2020,
    mileage: "38.000 km",
    base_price: 485000000, 
    current_bid: 485000000,
    location: "Jakarta Selatan",
    auction_start: "2025-01-22 13:00:00",
    auction_end: "2025-12-31 19:00:00",
    condition: "Sangat Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 12, 
    name: "Hyundai Tucson 2.0 GLS AT", 
    year: 2019,
    mileage: "44.000 km",
    base_price: 295000000, 
    current_bid: 298000000,
    location: "Semarang",
    auction_start: "2025-01-20 08:00:00",
    auction_end: "2025-12-31 14:30:00",
    condition: "Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 13, 
    name: "Wuling Almaz 1.5 Turbo Exclusive", 
    year: 2021,
    mileage: "22.000 km",
    base_price: 245000000, 
    current_bid: 245000000,
    location: "Malang",
    auction_start: "2025-01-23 10:30:00",
    auction_end: "2025-12-31 17:00:00",
    condition: "Sangat Baik",
    image: "images/car1.jpeg" 
  },
  { 
    id: 14, 
    name: "Isuzu MU-X 2.5 Premier AT", 
    year: 2018,
    mileage: "55.000 km",
    base_price: 315000000, 
    current_bid: 320000000,
    location: "Palembang",
    auction_start: "2025-01-19 15:00:00",
    auction_end: "2025-12-31 12:00:00",
    condition: "Baik",
    image: "images/car1.jpeg" 
  }
];

// Global variables for filtering
let filteredCars = [...cars];
let currentFilters = {
  location: '',
  priceRange: '',
  year: '',
  endingSoon: false
};

// Load auth section
if (document.getElementById('auth-section')) {
  loadAuthSection();
}

// Menampilkan daftar mobil dengan filter dan sorting
if (document.getElementById('car-list')) {
  // Load real-time car data
  const storedCars = localStorage.getItem('carsData');
  if (storedCars) {
    const updatedCars = JSON.parse(storedCars);
    // Update the cars array with stored data
    updatedCars.forEach(storedCar => {
      const carIndex = cars.findIndex(c => c.id === storedCar.id);
      if (carIndex !== -1) {
        cars[carIndex].current_bid = storedCar.current_bid;
      }
    });
  }
  filteredCars = [...cars];
  loadCarsWithFilters();
}

function loadCarsWithFilters() {
  // Sort cars by auction end time (ending soon first)
  const sortedCars = [...filteredCars].sort((a, b) => {
    const timeLeftA = getTimeLeft(a.auction_end).total;
    const timeLeftB = getTimeLeft(b.auction_end).total;
    
    // If both are active, sort by time left (ascending - ending soon first)
    if (timeLeftA > 0 && timeLeftB > 0) {
      return timeLeftA - timeLeftB;
    }
    // If one is ended, put active ones first
    if (timeLeftA <= 0 && timeLeftB > 0) return 1;
    if (timeLeftA > 0 && timeLeftB <= 0) return -1;
    // If both ended, sort by end time (most recent first)
    return new Date(b.auction_end) - new Date(a.auction_end);
  });

  const carList = document.getElementById('car-list');
  carList.innerHTML = '';
  
  sortedCars.forEach(car => {
    const timeLeft = getTimeLeft(car.auction_end);
    const isActive = timeLeft.total > 0;
    
    carList.innerHTML += `
      <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col border border-gray-200 hover:scale-105">
        <div class="relative mb-4">
          <img src="${car.image}" alt="${car.name}" class="rounded-xl w-full h-48 object-cover shadow-lg">
          <div class="absolute top-2 right-2 bg-${isActive ? 'green' : 'red'}-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            ${isActive ? 'AKTIF' : 'BERAKHIR'}
          </div>
          ${timeLeft.total > 0 && timeLeft.total < 86400000 ? '<div class="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold animate-pulse">SEGERA BERAKHIR</div>' : ''}
        </div>
        
        <h3 class="text-lg font-bold mb-1 text-gray-800">${car.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${car.year} • ${car.mileage} • ${car.location}</p>
        <p class="text-xs text-gray-500 mb-3">Kondisi: ${car.condition}</p>
        
        <div class="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-3 mb-3">
          <p class="text-xs text-gray-600">Bid Tertinggi</p>
          <p class="text-lg font-bold text-blue-600">Rp ${car.current_bid.toLocaleString()}</p>
        </div>
        
        <div class="bg-gray-100 rounded-lg p-2 mb-4 text-center">
          <p class="text-xs text-gray-600">Periode Lelang</p>
          <p class="text-xs text-gray-700">${formatDate(car.auction_start)} - ${formatDate(car.auction_end)}</p>
          <p class="text-sm font-bold ${isActive ? 'text-red-600' : 'text-gray-500'} mt-1">
            ${isActive ? `Berakhir: ${timeLeft.days > 0 ? timeLeft.days + 'h ' : ''}${timeLeft.hours}j ${timeLeft.minutes}m` : 'Lelang Berakhir'}
          </p>
        </div>
        
        <a href="car.html?id=${car.id}" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-4 py-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg font-semibold text-sm">
          ${isActive ? '🔥 Ikut Lelang' : '📋 Lihat Detail'}
        </a>
      </div>
    `;
  });
}

function applyFilters() {
  filteredCars = cars.filter(car => {
    // Location filter
    if (currentFilters.location && car.location !== currentFilters.location) {
      return false;
    }
    
    // Price range filter
    if (currentFilters.priceRange) {
      const price = car.current_bid;
      switch (currentFilters.priceRange) {
        case 'under-200':
          if (price >= 200000000) return false;
          break;
        case '200-300':
          if (price < 200000000 || price >= 300000000) return false;
          break;
        case '300-400':
          if (price < 300000000 || price >= 400000000) return false;
          break;
        case 'over-400':
          if (price < 400000000) return false;
          break;
      }
    }
    
    // Year filter
    if (currentFilters.year) {
      switch (currentFilters.year) {
        case '2021-2025':
          if (car.year < 2021) return false;
          break;
        case '2018-2020':
          if (car.year < 2018 || car.year > 2020) return false;
          break;
        case 'under-2018':
          if (car.year >= 2018) return false;
          break;
      }
    }
    
    // Ending soon filter
    if (currentFilters.endingSoon) {
      const timeLeft = getTimeLeft(car.auction_end);
      if (timeLeft.total <= 0 || timeLeft.total > 86400000) return false; // More than 24 hours
    }
    
    return true;
  });
  
  loadCarsWithFilters();
}

// Halaman detail mobil
if (window.location.pathname.includes('car.html')) {
  const params = new URLSearchParams(window.location.search);
  const carId = params.get('id');
  const car = cars.find(c => c.id == carId);

  if (car) {
    document.getElementById('car-image').src = car.image;
    document.getElementById('car-name').innerText = car.name;
    document.getElementById('car-desc').innerHTML = `
      <div class="grid grid-cols-2 gap-4 text-left">
        <div><span class="font-semibold">Tahun:</span> ${car.year}</div>
        <div><span class="font-semibold">Kilometer:</span> ${car.mileage}</div>
        <div><span class="font-semibold">Lokasi:</span> ${car.location}</div>
        <div><span class="font-semibold">Kondisi:</span> ${car.condition}</div>
      </div>
    `;
    document.getElementById('current-bid').innerText = `Rp ${car.current_bid.toLocaleString()}`;
    
    const timeLeft = getTimeLeft(car.auction_end);
    const isActive = timeLeft.total > 0;
    document.getElementById('auction-status').innerHTML = `
      <div class="text-center mb-4">
        <div class="inline-block px-4 py-2 rounded-full text-white font-bold ${
          isActive ? 'bg-green-500' : 'bg-red-500'
        }">
          ${isActive ? '🟢 LELANG AKTIF' : '🔴 LELANG BERAKHIR'}
        </div>
        <div class="mt-3 bg-blue-50 rounded-lg p-3">
          <p class="text-sm text-gray-600">Periode Lelang Online</p>
          <p class="font-semibold text-gray-800">${formatDate(car.auction_start)} - ${formatDate(car.auction_end)}</p>
        </div>
        <p class="mt-2 text-lg font-semibold ${
          isActive ? 'text-red-600' : 'text-gray-500'
        }">
          ${isActive ? `Berakhir dalam: ${timeLeft.days > 0 ? timeLeft.days + 'h ' : ''}${timeLeft.hours}j ${timeLeft.minutes}m` : 'Lelang telah berakhir'}
        </p>
      </div>
    `;

    const bidInput = document.getElementById('bid-input');
    const message = document.getElementById('bid-message');
    const minimumBid = car.current_bid + 1000000;
    const upBidBtn = document.getElementById('up-bid-btn');
    const placeBidBtn = document.getElementById('place-bid-btn');
    
    if (isActive) {
      bidInput.value = minimumBid;
    } else {
      bidInput.disabled = true;
      bidInput.value = 'Lelang Berakhir';
      upBidBtn.disabled = true;
      placeBidBtn.disabled = true;
      upBidBtn.className = upBidBtn.className.replace('hover:from-emerald-600 hover:to-green-700', '') + ' opacity-50 cursor-not-allowed';
      placeBidBtn.className = placeBidBtn.className.replace('hover:from-purple-700 hover:to-pink-700', '') + ' opacity-50 cursor-not-allowed';
    }
    
    document.getElementById('up-bid-btn').addEventListener('click', () => {
      const currentValue = parseInt(bidInput.value) || minimumBid;
      bidInput.value = currentValue + 1000000;
    });
    
    document.getElementById('place-bid-btn').addEventListener('click', () => {
      // Check if user is logged in
      if (!auth.isLoggedIn()) {
        message.innerText = "❌ Silakan login terlebih dahulu!";
        message.className = "text-red-600 font-semibold";
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
        return;
      }
      
      const user = auth.getCurrentUser();
      const timeLeft = getTimeLeft(car.auction_end);
      const isActive = timeLeft.total > 0;
      
      if (!isActive) {
        message.innerText = "❌ Lelang sudah berakhir!";
        message.className = "text-red-600 font-semibold";
        return;
      }
      
      // Check minimum balance (50 million for deposit)
      if (user.balance < 50000000) {
        message.innerText = "❌ Saldo tidak mencukupi! Minimum Rp 50.000.000 untuk deposit.";
        message.className = "text-red-600 font-semibold";
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 3000);
        return;
      }
      
      const bid = parseInt(bidInput.value);
      if (bid >= minimumBid) {
        // Deduct deposit if this is user's first bid on this car
        const existingBid = user.bids.find(b => b.carId == car.id);
        if (!existingBid) {
          if (!auth.deductBalance(50000000, `Deposit lelang - ${car.name}`)) {
            message.innerText = "❌ Gagal memotong deposit!";
            message.className = "text-red-600 font-semibold";
            return;
          }
        }
        
        // Update car's current bid
        car.current_bid = bid;
        document.getElementById('current-bid').innerText = `Rp ${bid.toLocaleString()}`;
        
        // Save updated cars data to localStorage
        localStorage.setItem('carsData', JSON.stringify(cars));
        
        // Add bid to user's history
        auth.addBid(car.id, bid);
        
        // Send notification
        auth.sendNotification(`Bid Anda untuk ${car.name} sebesar Rp ${bid.toLocaleString()} berhasil ditempatkan!`);
        
        message.innerText = "✅ Bid berhasil ditempatkan! Deposit Rp 50jt telah dipotong.";
        message.className = "text-green-600 font-semibold";
        
        // Update minimum bid for next bidder
        const newMinimum = bid + 1000000;
        bidInput.value = newMinimum;
      } else {
        message.innerText = "❌ Bid harus lebih tinggi dari bid tertinggi saat ini.";
        message.className = "text-red-600 font-semibold";
      }
    });
  }
}

// Fungsi untuk menghitung waktu tersisa
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

// Fungsi untuk format tanggal
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

// Load authentication section
function loadAuthSection() {
  const authSection = document.getElementById('auth-section');
  
  if (auth.isLoggedIn()) {
    const user = auth.getCurrentUser();
    authSection.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-sm">Halo, ${user.name}</span>
        <span class="bg-green-500 px-3 py-1 rounded-lg text-sm font-semibold">Rp ${user.balance.toLocaleString()}</span>
        <a href="dashboard.html" class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition text-sm">Dashboard</a>
        <button onclick="logout()" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition text-sm">Logout</button>
      </div>
    `;
  } else {
    authSection.innerHTML = `
      <div class="flex gap-3">
        <a href="login.html" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold">Login</a>
      </div>
    `;
  }
}

// Filter functions
function updateFilter(filterType, value) {
  currentFilters[filterType] = value;
  applyFilters();
}

function resetFilters() {
  currentFilters = {
    location: '',
    priceRange: '',
    year: '',
    endingSoon: false
  };
  
  // Reset form elements
  document.getElementById('location-filter').value = '';
  document.getElementById('price-filter').value = '';
  document.getElementById('year-filter').value = '';
  document.getElementById('ending-soon-filter').checked = false;
  
  filteredCars = [...cars];
  loadCarsWithFilters();
}

// Update countdown setiap detik
setInterval(() => {
  if (document.getElementById('car-list')) {
    loadCarsWithFilters(); // Refresh with current filters
  }
}, 60000); // Update setiap menit