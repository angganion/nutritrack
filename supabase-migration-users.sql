-- Migration untuk menambahkan tabel users dengan role admin dan puskesmas
-- Tanggal: 2025-01-27

-- 1. Buat tabel users
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'puskesmas')),
    kecamatan VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_kecamatan ON users(kecamatan);

-- 3. Insert admin default
INSERT INTO users (username, password, role, kecamatan) 
VALUES ('admin', 'admin123', 'admin', NULL)
ON CONFLICT (username) DO NOTHING;

-- 4. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Buat policy untuk users
CREATE POLICY "Allow public read access on users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on users" ON users
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on users" ON users
    FOR DELETE USING (true);
