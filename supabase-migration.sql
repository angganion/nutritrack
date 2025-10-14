-- Migration untuk menambah tabel alamat dan kolom alamat_id di tabel children_data

-- 1. Buat tabel alamat baru
CREATE TABLE IF NOT EXISTS alamat (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    city_district VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tambah kolom alamat_id di tabel children_data
ALTER TABLE children_data 
ADD COLUMN IF NOT EXISTS alamat_id UUID REFERENCES alamat(id);

-- 3. Buat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_alamat_lat_lng ON alamat(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_children_data_alamat_id ON children_data(alamat_id);

-- 4. Enable Row Level Security (RLS) jika diperlukan
ALTER TABLE alamat ENABLE ROW LEVEL SECURITY;

-- 5. Buat policy untuk alamat (sesuaikan dengan kebutuhan auth Anda)
CREATE POLICY "Allow public read access on alamat" ON alamat
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on alamat" ON alamat
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on alamat" ON alamat
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on alamat" ON alamat
    FOR DELETE USING (true);

-- 6. Buat policy untuk children_data jika belum ada
ALTER TABLE children_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on children_data" ON children_data
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on children_data" ON children_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on children_data" ON children_data
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on children_data" ON children_data
    FOR DELETE USING (true);