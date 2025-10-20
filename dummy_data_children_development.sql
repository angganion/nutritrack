-- =====================================================
-- SQL COMMANDS UNTUK DATA DUMMY - APLIKASI PANTAU+
-- =====================================================
-- File ini berisi SQL commands untuk memasukkan data dummy
-- yang mencerminkan alamat dan data anak dengan perkembangan berulang

-- =====================================================
-- 1. DATA ALAMAT (Lokasi Geografis)
-- =====================================================

INSERT INTO alamat (id, latitude, longitude, state, city, city_district, village, created_at) 
VALUES 
  -- Jakarta Selatan
  ('650e8400-e29b-41d4-a716-446655440001', -6.2615, 106.8106, 'DKI Jakarta', 'Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', NOW()),
  ('650e8400-e29b-41d4-a716-446655440002', -6.2663, 106.7976, 'DKI Jakarta', 'Jakarta', 'Jakarta Selatan', 'Pasar Minggu', NOW()),
  ('650e8400-e29b-41d4-a716-446655440003', -6.3157, 106.7963, 'DKI Jakarta', 'Jakarta', 'Jakarta Selatan', 'Tebet', NOW()),
  ('650e8400-e29b-41d4-a716-446655440004', -6.2874, 106.8174, 'DKI Jakarta', 'Jakarta', 'Jakarta Selatan', 'Mampang Prapatan', NOW()),
  ('650e8400-e29b-41d4-a716-446655440005', -6.2615, 106.7989, 'DKI Jakarta', 'Jakarta', 'Jakarta Selatan', 'Setiabudi', NOW()),
  
  -- Jakarta Utara
  ('650e8400-e29b-41d4-a716-446655440006', -6.1384, 106.8669, 'DKI Jakarta', 'Jakarta', 'Jakarta Utara', 'Koja', NOW()),
  ('650e8400-e29b-41d4-a716-446655440007', -6.1237, 106.8145, 'DKI Jakarta', 'Jakarta', 'Jakarta Utara', 'Kelapa Gading', NOW()),
  ('650e8400-e29b-41d4-a716-446655440008', -6.1352, 106.8133, 'DKI Jakarta', 'Jakarta', 'Jakarta Utara', 'Cilincing', NOW()),
  ('650e8400-e29b-41d4-a716-446655440009', -6.1299, 106.8334, 'DKI Jakarta', 'Jakarta', 'Jakarta Utara', 'Penjaringan', NOW()),
  ('650e8400-e29b-41d4-a716-446655440010', -6.1484, 106.8345, 'DKI Jakarta', 'Jakarta', 'Jakarta Utara', 'Pademangan', NOW()),
  
  -- Jakarta Barat
  ('650e8400-e29b-41d4-a716-446655440011', -6.1352, 106.8133, 'DKI Jakarta', 'Jakarta', 'Jakarta Barat', 'Kebon Jeruk', NOW()),
  ('650e8400-e29b-41d4-a716-446655440012', -6.1237, 106.8145, 'DKI Jakarta', 'Jakarta', 'Jakarta Barat', 'Kembangan', NOW()),
  ('650e8400-e29b-41d4-a716-446655440013', -6.1299, 106.8334, 'DKI Jakarta', 'Jakarta', 'Jakarta Barat', 'Palmerah', NOW()),
  ('650e8400-e29b-41d4-a716-446655440014', -6.1484, 106.8345, 'DKI Jakarta', 'Jakarta', 'Jakarta Barat', 'Grogol Petamburan', NOW()),
  ('650e8400-e29b-41d4-a716-446655440015', -6.1352, 106.8133, 'DKI Jakarta', 'Jakarta', 'Jakarta Barat', 'Taman Sari', NOW()),
  
  -- Jakarta Timur
  ('650e8400-e29b-41d4-a716-446655440016', -6.2250, 106.9004, 'DKI Jakarta', 'Jakarta', 'Jakarta Timur', 'Matraman', NOW()),
  ('650e8400-e29b-41d4-a716-446655440017', -6.2347, 106.8917, 'DKI Jakarta', 'Jakarta', 'Jakarta Timur', 'Pulo Gadung', NOW()),
  ('650e8400-e29b-41d4-a716-446655440018', -6.2434, 106.8830, 'DKI Jakarta', 'Jakarta', 'Jakarta Timur', 'Jatinegara', NOW()),
  ('650e8400-e29b-41d4-a716-446655440019', -6.2521, 106.8743, 'DKI Jakarta', 'Jakarta', 'Jakarta Timur', 'Duren Sawit', NOW()),
  ('650e8400-e29b-41d4-a716-446655440020', -6.2608, 106.8656, 'DKI Jakarta', 'Jakarta', 'Jakarta Timur', 'Makasar', NOW()),
  
  -- Bandung
  ('650e8400-e29b-41d4-a716-446655440021', -6.9175, 107.6191, 'Jawa Barat', 'Bandung', 'Bandung', 'Coblong', NOW()),
  ('650e8400-e29b-41d4-a716-446655440022', -6.9175, 107.6191, 'Jawa Barat', 'Bandung', 'Bandung', 'Sukajadi', NOW()),
  ('650e8400-e29b-41d4-a716-446655440023', -6.9175, 107.6191, 'Jawa Barat', 'Bandung', 'Bandung', 'Cicendo', NOW()),
  ('650e8400-e29b-41d4-a716-446655440024', -6.9175, 107.6191, 'Jawa Barat', 'Bandung', 'Bandung', 'Bandung Wetan', NOW()),
  ('650e8400-e29b-41d4-a716-446655440025', -6.9175, 107.6191, 'Jawa Barat', 'Bandung', 'Bandung', 'Sumur Bandung', NOW()),
  
  -- Surabaya
  ('650e8400-e29b-41d4-a716-446655440026', -7.2575, 112.7521, 'Jawa Timur', 'Surabaya', 'Surabaya', 'Gubeng', NOW()),
  ('650e8400-e29b-41d4-a716-446655440027', -7.2575, 112.7521, 'Jawa Timur', 'Surabaya', 'Surabaya', 'Sawahan', NOW()),
  ('650e8400-e29b-41d4-a716-446655440028', -7.2575, 112.7521, 'Jawa Timur', 'Surabaya', 'Surabaya', 'Tegalsari', NOW()),
  ('650e8400-e29b-41d4-a716-446655440029', -7.2575, 112.7521, 'Jawa Timur', 'Surabaya', 'Surabaya', 'Genteng', NOW()),
  ('650e8400-e29b-41d4-a716-446655440030', -7.2575, 112.7521, 'Jawa Timur', 'Surabaya', 'Surabaya', 'Bubutan', NOW()),
  
  -- Yogyakarta
  ('650e8400-e29b-41d4-a716-446655440031', -7.7956, 110.3695, 'DI Yogyakarta', 'Yogyakarta', 'Yogyakarta', 'Mergangsan', NOW()),
  ('650e8400-e29b-41d4-a716-446655440032', -7.7956, 110.3695, 'DI Yogyakarta', 'Yogyakarta', 'Yogyakarta', 'Umbulharjo', NOW()),
  ('650e8400-e29b-41d4-a716-446655440033', -7.7956, 110.3695, 'DI Yogyakarta', 'Yogyakarta', 'Yogyakarta', 'Kotagede', NOW()),
  ('650e8400-e29b-41d4-a716-446655440034', -7.7956, 110.3695, 'DI Yogyakarta', 'Yogyakarta', 'Yogyakarta', 'Gondokusuman', NOW()),
  ('650e8400-e29b-41d4-a716-446655440035', -7.7956, 110.3695, 'DI Yogyakarta', 'Yogyakarta', 'Yogyakarta', 'Danurejan', NOW()),
  
  -- Semarang
  ('650e8400-e29b-41d4-a716-446655440036', -6.9667, 110.4167, 'Jawa Tengah', 'Semarang', 'Semarang', 'Semarang Tengah', NOW()),
  ('650e8400-e29b-41d4-a716-446655440037', -6.9667, 110.4167, 'Jawa Tengah', 'Semarang', 'Semarang', 'Semarang Utara', NOW()),
  ('650e8400-e29b-41d4-a716-446655440038', -6.9667, 110.4167, 'Jawa Tengah', 'Semarang', 'Semarang', 'Semarang Selatan', NOW()),
  ('650e8400-e29b-41d4-a716-446655440039', -6.9667, 110.4167, 'Jawa Tengah', 'Semarang', 'Semarang', 'Semarang Timur', NOW()),
  ('650e8400-e29b-41d4-a716-446655440040', -6.9667, 110.4167, 'Jawa Tengah', 'Semarang', 'Semarang', 'Semarang Barat', NOW()),
  
  -- Medan
  ('650e8400-e29b-41d4-a716-446655440041', 3.5952, 98.6722, 'Sumatera Utara', 'Medan', 'Medan', 'Medan Helvetia', NOW()),
  ('650e8400-e29b-41d4-a716-446655440042', 3.5952, 98.6722, 'Sumatera Utara', 'Medan', 'Medan', 'Medan Denai', NOW()),
  ('650e8400-e29b-41d4-a716-446655440043', 3.5952, 98.6722, 'Sumatera Utara', 'Medan', 'Medan', 'Medan Area', NOW()),
  ('650e8400-e29b-41d4-a716-446655440044', 3.5952, 98.6722, 'Sumatera Utara', 'Medan', 'Medan', 'Medan Kota', NOW()),
  ('650e8400-e29b-41d4-a716-446655440045', 3.5952, 98.6722, 'Sumatera Utara', 'Medan', 'Medan', 'Medan Barat', NOW()),
  
  -- Palembang
  ('650e8400-e29b-41d4-a716-446655440046', -2.9761, 104.7754, 'Sumatera Selatan', 'Palembang', 'Palembang', 'Ilir Barat I', NOW()),
  ('650e8400-e29b-41d4-a716-446655440047', -2.9761, 104.7754, 'Sumatera Selatan', 'Palembang', 'Palembang', 'Ilir Barat II', NOW()),
  ('650e8400-e29b-41d4-a716-446655440048', -2.9761, 104.7754, 'Sumatera Selatan', 'Palembang', 'Palembang', 'Seberang Ulu I', NOW()),
  ('650e8400-e29b-41d4-a716-446655440049', -2.9761, 104.7754, 'Sumatera Selatan', 'Palembang', 'Palembang', 'Seberang Ulu II', NOW()),
  ('650e8400-e29b-41d4-a716-446655440050', -2.9761, 104.7754, 'Sumatera Selatan', 'Palembang', 'Palembang', 'Sukarami', NOW());

-- =====================================================
-- 2. DATA ANAK (Children Data) - Dengan Perkembangan Berulang
-- =====================================================
-- Data ini mencerminkan skenario perkembangan anak:
-- - Anak dengan NIK yang sama untuk menunjukkan perkembangan berulang
-- - Anak dengan stunting dan non-stunting
-- - Berbagai usia (0-60 bulan)
-- - Berbagai lokasi geografis
-- - Berbagai kondisi ASI dan gizi
-- - Data untuk analisis tren dan statistik

INSERT INTO children_data (id, nik, gender, age, birth_weight, birth_length, body_weight, body_length, breast_feeding, stunting, image_is_stunting, latitude, longitude, alamat_id, created_at) 
VALUES 
  -- ===== ANAK 1: NIK 3171010101010001 - Perkembangan dari Stunting ke Normal =====
  -- Pemeriksaan ke-1 (6 bulan) - Stunting
  ('750e8400-e29b-41d4-a716-446655440001', '3171010101010001', 'male', 6, 2.5, 48.0, 5.8, 62.5, true, true, true, -6.2615, 106.8106, '650e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '6 months'),
  -- Pemeriksaan ke-2 (12 bulan) - Masih Stunting
  ('750e8400-e29b-41d4-a716-446655440002', '3171010101010001', 'male', 12, 2.5, 48.0, 7.2, 68.2, true, true, true, -6.2615, 106.8106, '650e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 months'),
  -- Pemeriksaan ke-3 (18 bulan) - Mulai Membaik
  ('750e8400-e29b-41d4-a716-446655440003', '3171010101010001', 'male', 18, 2.5, 48.0, 9.1, 74.8, true, true, true, -6.2615, 106.8106, '650e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 month'),
  -- Pemeriksaan ke-4 (24 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440004', '3171010101010001', 'male', 24, 2.5, 48.0, 11.8, 82.5, true, false, false, -6.2615, 106.8106, '650e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 week'),

  -- ===== ANAK 2: NIK 3171010101010002 - Perkembangan Normal =====
  -- Pemeriksaan ke-1 (3 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440005', '3171010101010002', 'female', 3, 3.2, 50.5, 5.2, 58.3, true, false, false, -6.2663, 106.7976, '650e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '5 months'),
  -- Pemeriksaan ke-2 (9 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440006', '3171010101010002', 'female', 9, 3.2, 50.5, 8.1, 69.5, true, false, false, -6.2663, 106.7976, '650e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '2 months'),
  -- Pemeriksaan ke-3 (15 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440007', '3171010101010002', 'female', 15, 3.2, 50.5, 10.5, 78.4, true, false, false, -6.2663, 106.7976, '650e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '2 weeks'),
  -- Pemeriksaan ke-4 (21 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440008', '3171010101010002', 'female', 21, 3.2, 50.5, 12.8, 85.2, true, false, false, -6.2663, 106.7976, '650e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 days'),

  -- ===== ANAK 3: NIK 3171010101010003 - Perkembangan dari Normal ke Stunting =====
  -- Pemeriksaan ke-1 (6 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440009', '3171010101010003', 'female', 6, 2.8, 49.0, 6.8, 65.0, true, false, false, -6.3157, 106.7963, '650e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '4 months'),
  -- Pemeriksaan ke-2 (12 bulan) - Mulai Menurun
  ('750e8400-e29b-41d4-a716-446655440010', '3171010101010003', 'female', 12, 2.8, 49.0, 8.2, 70.1, false, false, false, -6.3157, 106.7963, '650e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '2 months'),
  -- Pemeriksaan ke-3 (18 bulan) - Stunting
  ('750e8400-e29b-41d4-a716-446655440011', '3171010101010003', 'female', 18, 2.8, 49.0, 9.1, 74.3, false, true, true, -6.3157, 106.7963, '650e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '3 weeks'),
  -- Pemeriksaan ke-4 (24 bulan) - Masih Stunting
  ('750e8400-e29b-41d4-a716-446655440012', '3171010101010003', 'female', 24, 2.8, 49.0, 10.1, 78.5, false, true, true, -6.3157, 106.7963, '650e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '5 days'),

  -- ===== ANAK 4: NIK 3171010101010004 - Perkembangan Stabil Normal =====
  -- Pemeriksaan ke-1 (9 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440013', '3171010101010004', 'male', 9, 3.5, 51.2, 8.5, 71.2, true, false, false, -6.2874, 106.8174, '650e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '3 months'),
  -- Pemeriksaan ke-2 (18 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440014', '3171010101010004', 'male', 18, 3.5, 51.2, 12.1, 81.5, true, false, false, -6.2874, 106.8174, '650e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '1 month'),
  -- Pemeriksaan ke-3 (27 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440015', '3171010101010004', 'male', 27, 3.5, 51.2, 15.8, 91.3, false, false, false, -6.2874, 106.8174, '650e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '2 weeks'),
  -- Pemeriksaan ke-4 (36 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440016', '3171010101010004', 'male', 36, 3.5, 51.2, 18.2, 98.7, false, false, false, -6.2874, 106.8174, '650e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '4 days'),

  -- ===== ANAK 5: NIK 3171010101010005 - Perkembangan Fluktuatif =====
  -- Pemeriksaan ke-1 (12 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440017', '3171010101010005', 'female', 12, 3.1, 50.0, 9.2, 74.6, true, false, false, -6.2615, 106.7989, '650e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '5 months'),
  -- Pemeriksaan ke-2 (18 bulan) - Stunting
  ('750e8400-e29b-41d4-a716-446655440018', '3171010101010005', 'female', 18, 3.1, 50.0, 10.1, 78.2, false, true, true, -6.2615, 106.7989, '650e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '2 months'),
  -- Pemeriksaan ke-3 (24 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440019', '3171010101010005', 'female', 24, 3.1, 50.0, 12.5, 85.3, true, false, false, -6.2615, 106.7989, '650e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '1 month'),
  -- Pemeriksaan ke-4 (30 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440020', '3171010101010005', 'female', 30, 3.1, 50.0, 14.8, 91.7, false, false, false, -6.2615, 106.7989, '650e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '1 week'),

  -- ===== ANAK 6: NIK 3171010101010006 - Perkembangan dari Bandung =====
  -- Pemeriksaan ke-1 (6 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440021', '3171010101010006', 'male', 6, 3.0, 49.5, 7.1, 65.5, true, false, false, -6.9175, 107.6191, '650e8400-e29b-41d4-a716-446655440021', NOW() - INTERVAL '4 months'),
  -- Pemeriksaan ke-2 (15 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440022', '3171010101010006', 'male', 15, 3.0, 49.5, 11.2, 79.8, true, false, false, -6.9175, 107.6191, '650e8400-e29b-41d4-a716-446655440021', NOW() - INTERVAL '2 months'),
  -- Pemeriksaan ke-3 (24 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440023', '3171010101010006', 'male', 24, 3.0, 49.5, 14.5, 88.2, false, false, false, -6.9175, 107.6191, '650e8400-e29b-41d4-a716-446655440021', NOW() - INTERVAL '3 weeks'),
  -- Pemeriksaan ke-4 (33 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440024', '3171010101010006', 'male', 33, 3.0, 49.5, 17.8, 96.5, false, false, false, -6.9175, 107.6191, '650e8400-e29b-41d4-a716-446655440021', NOW() - INTERVAL '5 days'),

  -- ===== ANAK 7: NIK 3171010101010007 - Perkembangan dari Surabaya =====
  -- Pemeriksaan ke-1 (9 bulan) - Stunting
  ('750e8400-e29b-41d4-a716-446655440025', '3171010101010007', 'female', 9, 2.4, 47.8, 7.8, 69.2, true, true, true, -7.2575, 112.7521, '650e8400-e29b-41d4-a716-446655440026', NOW() - INTERVAL '3 months'),
  -- Pemeriksaan ke-2 (18 bulan) - Masih Stunting
  ('750e8400-e29b-41d4-a716-446655440026', '3171010101010007', 'female', 18, 2.4, 47.8, 9.5, 75.1, false, true, true, -7.2575, 112.7521, '650e8400-e29b-41d4-a716-446655440026', NOW() - INTERVAL '1 month'),
  -- Pemeriksaan ke-3 (27 bulan) - Mulai Membaik
  ('750e8400-e29b-41d4-a716-446655440027', '3171010101010007', 'female', 27, 2.4, 47.8, 12.1, 82.6, false, true, true, -7.2575, 112.7521, '650e8400-e29b-41d4-a716-446655440026', NOW() - INTERVAL '2 weeks'),
  -- Pemeriksaan ke-4 (36 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440028', '3171010101010007', 'female', 36, 2.4, 47.8, 15.2, 90.3, false, false, false, -7.2575, 112.7521, '650e8400-e29b-41d4-a716-446655440026', NOW() - INTERVAL '4 days'),

  -- ===== ANAK 8: NIK 3171010101010008 - Perkembangan dari Yogyakarta =====
  -- Pemeriksaan ke-1 (3 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440029', '3171010101010008', 'male', 3, 3.3, 50.8, 5.5, 58.8, true, false, false, -7.7956, 110.3695, '650e8400-e29b-41d4-a716-446655440031', NOW() - INTERVAL '5 months'),
  -- Pemeriksaan ke-2 (12 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440030', '3171010101010008', 'male', 12, 3.3, 50.8, 9.8, 74.2, true, false, false, -7.7956, 110.3695, '650e8400-e29b-41d4-a716-446655440031', NOW() - INTERVAL '2 months'),
  -- Pemeriksaan ke-3 (21 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440031', '3171010101010008', 'male', 21, 3.3, 50.8, 13.2, 83.7, true, false, false, -7.7956, 110.3695, '650e8400-e29b-41d4-a716-446655440031', NOW() - INTERVAL '3 weeks'),
  -- Pemeriksaan ke-4 (30 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440032', '3171010101010008', 'male', 30, 3.3, 50.8, 16.5, 92.1, false, false, false, -7.7956, 110.3695, '650e8400-e29b-41d4-a716-446655440031', NOW() - INTERVAL '6 days'),

  -- ===== ANAK 9: NIK 3171010101010009 - Perkembangan dari Semarang =====
  -- Pemeriksaan ke-1 (6 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440033', '3171010101010009', 'female', 6, 2.9, 49.2, 6.8, 64.5, true, false, false, -6.9667, 110.4167, '650e8400-e29b-41d4-a716-446655440036', NOW() - INTERVAL '4 months'),
  -- Pemeriksaan ke-2 (18 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440034', '3171010101010009', 'female', 18, 2.9, 49.2, 10.8, 79.2, true, false, false, -6.9667, 110.4167, '650e8400-e29b-41d4-a716-446655440036', NOW() - INTERVAL '2 months'),
  -- Pemeriksaan ke-3 (30 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440035', '3171010101010009', 'female', 30, 2.9, 49.2, 14.2, 89.7, false, false, false, -6.9667, 110.4167, '650e8400-e29b-41d4-a716-446655440036', NOW() - INTERVAL '3 weeks'),
  -- Pemeriksaan ke-4 (42 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440036', '3171010101010009', 'female', 42, 2.9, 49.2, 17.8, 98.3, false, false, false, -6.9667, 110.4167, '650e8400-e29b-41d4-a716-446655440036', NOW() - INTERVAL '5 days'),

  -- ===== ANAK 10: NIK 3171010101010010 - Perkembangan dari Medan =====
  -- Pemeriksaan ke-1 (12 bulan) - Stunting
  ('750e8400-e29b-41d4-a716-446655440037', '3171010101010010', 'male', 12, 2.6, 48.3, 8.1, 70.8, true, true, true, 3.5952, 98.6722, '650e8400-e29b-41d4-a716-446655440041', NOW() - INTERVAL '3 months'),
  -- Pemeriksaan ke-2 (24 bulan) - Masih Stunting
  ('750e8400-e29b-41d4-a716-446655440038', '3171010101010010', 'male', 24, 2.6, 48.3, 10.5, 79.2, false, true, true, 3.5952, 98.6722, '650e8400-e29b-41d4-a716-446655440041', NOW() - INTERVAL '1 month'),
  -- Pemeriksaan ke-3 (36 bulan) - Mulai Membaik
  ('750e8400-e29b-41d4-a716-446655440039', '3171010101010010', 'male', 36, 2.6, 48.3, 13.8, 87.6, false, true, true, 3.5952, 98.6722, '650e8400-e29b-41d4-a716-446655440041', NOW() - INTERVAL '2 weeks'),
  -- Pemeriksaan ke-4 (48 bulan) - Normal
  ('750e8400-e29b-41d4-a716-446655440040', '3171010101010010', 'male', 48, 2.6, 48.3, 17.2, 95.1, false, false, false, 3.5952, 98.6722, '650e8400-e29b-41d4-a716-446655440041', NOW() - INTERVAL '4 days');

-- =====================================================
-- CATATAN PENTING:
-- =====================================================
-- 1. Data ini mencerminkan semua fungsi utama aplikasi PANTAU+:
--    - Deteksi stunting berdasarkan pengukuran antropometri
--    - Analisis berdasarkan usia (0-60 bulan)
--    - Analisis geografis (berbagai provinsi/kota/kecamatan)
--    - Analisis ASI vs non-ASI
--    - Data untuk analisis tren dan statistik
--    - Data untuk rekomendasi AI
--
-- 2. Distribusi Data:
--    - Total: 40 data anak (10 anak x 4 pemeriksaan)
--    - 10 anak dengan NIK yang sama untuk menunjukkan perkembangan berulang
--    - Berbagai skenario perkembangan: Stunting→Normal, Normal→Stunting, Fluktuatif
--    - Berbagai lokasi: Jakarta, Bandung, Surabaya, Yogyakarta, Semarang, Medan
--    - Berbagai usia: 3-48 bulan
--
-- 3. Data ini akan memungkinkan testing semua fitur:
--    - Dashboard statistics dengan data perkembangan
--    - Age distribution analysis
--    - Geographic analysis
--    - Stunting prevalence charts
--    - Breast feeding correlation
--    - AI recommendations
--    - Perkembangan anak berdasarkan NIK yang sama
--    - Monthly trends dan riwayat pemeriksaan
--
-- 4. Untuk menjalankan:
--    - Pastikan tabel alamat dan children_data sudah dibuat
--    - Jalankan script ini di Supabase SQL Editor
--    - Data akan tersimpan dengan timestamp yang berbeda untuk testing tren
-- =====================================================
