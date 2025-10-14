-- Migration untuk menambahkan kolom NIK pada children_data
-- Tanggal: 2025-10-13

-- KONSEP:
-- - id tetap auto-generated (CUID) sebagai Primary Key untuk setiap pemeriksaan
-- - nik adalah kolom terpisah (optional) yang bisa duplicate
-- - Satu anak (NIK) bisa punya banyak record pemeriksaan stunting di waktu berbeda

-- 1. Tambahkan kolom NIK (optional, bisa duplicate)
ALTER TABLE children_data 
ADD COLUMN IF NOT EXISTS nik VARCHAR(16);

-- 2. Tambahkan index untuk performa pencarian berdasarkan NIK
CREATE INDEX IF NOT EXISTS idx_children_data_nik ON children_data(nik);

-- 3. Tambahkan constraint untuk validasi format NIK (16 digit angka)
-- Constraint ini akan memastikan NIK valid jika diisi
ALTER TABLE children_data 
ADD CONSTRAINT check_nik_format CHECK (nik IS NULL OR (nik ~ '^\d{16}$'));

-- 4. Verifikasi perubahan
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'children_data' AND column_name IN ('id', 'nik');

-- CATATAN PENTING:
-- - ID tetap auto-generated untuk setiap pemeriksaan (unique)
-- - NIK optional dan boleh duplicate (satu anak bisa dicek berkali-kali)
-- - Struktur ini memungkinkan tracking riwayat pemeriksaan stunting per anak
-- - Query untuk melihat semua pemeriksaan satu anak: SELECT * FROM children_data WHERE nik = '1234567890123456' ORDER BY created_at DESC;

