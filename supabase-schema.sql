-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars table
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price BIGINT NOT NULL,
  km INTEGER NOT NULL,
  city TEXT NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Automatic')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Gasoline', 'Diesel', 'Hybrid', 'Electric')),
  color TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  seller_phone TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cars policies
CREATE POLICY "Anyone can view available cars" ON cars
  FOR SELECT USING (status = 'available');

CREATE POLICY "Admins can manage cars" ON cars
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Favorites policies
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Bookings policies
CREATE POLICY "Users can manage own bookings" ON bookings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Insert sample admin user (you'll need to register this user first)
-- INSERT INTO profiles (id, name, phone, role) 
-- VALUES ('your-admin-user-id', 'Admin User', '081234567890', 'admin');

-- Insert sample cars
INSERT INTO cars (brand, model, year, price, km, city, transmission, fuel_type, color, description, seller_phone) VALUES
('Toyota', 'Avanza', 2020, 150000000, 25000, 'Jakarta', 'Manual', 'Gasoline', 'Silver', 'Well maintained family car', '081234567890'),
('Honda', 'Jazz', 2019, 180000000, 30000, 'Bandung', 'Automatic', 'Gasoline', 'White', 'Low mileage, excellent condition', '081234567891'),
('Daihatsu', 'Xenia', 2021, 160000000, 15000, 'Surabaya', 'Manual', 'Gasoline', 'Black', 'Almost new condition', '081234567892'),
('Mitsubishi', 'Pajero', 2018, 350000000, 45000, 'Jakarta', 'Automatic', 'Diesel', 'Gray', 'Perfect for adventure', '081234567893'),
('Suzuki', 'Ertiga', 2020, 170000000, 20000, 'Yogyakarta', 'Manual', 'Gasoline', 'Blue', 'Spacious and comfortable', '081234567894');