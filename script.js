// Data sementara (dummy)
const cars = [
  { id: 1, name: "Toyota Supra", base_price: 200000000, image: "images/car1.jpeg" },
  { id: 2, name: "Honda Civic", base_price: 180000000, image: "images/car1.jpeg" },
  { id: 3, name: "Mazda RX-8", base_price: 210000000, image: "images/car1.jpeg" }
];

// Menampilkan daftar mobil
if (document.getElementById('car-list')) {
  const carList = document.getElementById('car-list');
  cars.forEach(car => {
    carList.innerHTML += `
      <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col text-center">
        <img src="${car.image}" alt="${car.name}" class="rounded-lg w-full h-40 object-cover mb-3">
        <h3 class="text-lg font-semibold mb-1">${car.name}</h3>
        <p class="text-gray-600 mb-2">Starting Price: Rp ${car.base_price.toLocaleString()}</p>
        <a href="car.html?id=${car.id}" class="bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition">View Details</a>
      </div>
    `;
  });
}

// Halaman detail mobil
if (window.location.pathname.includes('car.html')) {
  const params = new URLSearchParams(window.location.search);
  const carId = params.get('id');
  const car = cars.find(c => c.id == carId);

  if (car) {
    document.getElementById('car-image').src = car.image;
    document.getElementById('car-name').innerText = car.name;
    document.getElementById('car-desc').innerText = `This is a ${car.name} available for auction.`;
    document.getElementById('current-bid').innerText = `Rp ${car.base_price.toLocaleString()}`;

    document.getElementById('place-bid-btn').addEventListener('click', () => {
      const bid = document.getElementById('bid-input').value;
      const message = document.getElementById('bid-message');
      if (bid > car.base_price) {
        message.innerText = "✅ Bid placed successfully!";
        message.className = "text-green-600 font-semibold";
      } else {
        message.innerText = "❌ Your bid must be higher than the current price.";
        message.className = "text-red-600 font-semibold";
      }
    });
  }
}
