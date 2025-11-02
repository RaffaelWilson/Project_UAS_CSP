# Used Car Sales Website

Website penjualan mobil bekas dengan fitur lengkap menggunakan Next.js, React, dan Supabase.

## Fitur

1. **Autentikasi**
   - Register & Login
   - Role user dan admin

2. **List Mobil**
   - Search berdasarkan brand/model
   - Filter berdasarkan tahun, harga, kota, KM
   - Sort berdasarkan harga dan tahun

3. **Detail Mobil**
   - Informasi lengkap mobil
   - Favorite functionality
   - WhatsApp contact
   - Booking system

4. **Dashboard Admin**
   - CRUD mobil (Create, Read, Update, Delete)
   - Manage status mobil

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase
1. Buat project baru di [Supabase](https://supabase.com)
2. Copy URL dan anon key ke file `.env.local`
3. Jalankan SQL schema di Supabase SQL Editor:
   ```sql
   -- Copy paste isi dari supabase-schema.sql
   ```

### 3. Environment Variables
Update file `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Database

### Tables:
- `profiles` - User profiles dengan role
- `cars` - Data mobil
- `favorites` - Mobil favorit user
- `bookings` - Booking requests

### Default Admin:
Setelah register user pertama, update role menjadi admin di Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'user-id';
```

## Teknologi
- Next.js 14
- React 18
- Supabase (Database & Auth)
- Lucide React (Icons)

## Pages
- `/` - Home (list mobil)
- `/auth/login` - Login
- `/auth/register` - Register
- `/cars/[id]` - Detail mobil
- `/favorites` - Mobil favorit
- `/admin` - Dashboard admin