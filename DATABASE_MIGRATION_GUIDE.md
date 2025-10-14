# Panduan Migrasi Database - Menambah Tabel Alamat

## Ringkasan Perubahan

Berdasarkan export class baru di `child.service.ts`, kami telah memperbarui struktur database untuk menambahkan:

1. **Tabel baru `alamat`** dengan kolom:
   - `id` (UUID, Primary Key)
   - `latitude` (DECIMAL)
   - `longitude` (DECIMAL)
   - `state` (VARCHAR)
   - `city` (VARCHAR)
   - `city_district` (VARCHAR)
   - `village` (VARCHAR)
   - `created_at` (TIMESTAMP)

2. **Kolom baru `alamat_id`** di tabel `children_data` untuk relasi

## Langkah-langkah Migrasi

### 1. Jalankan SQL Migration di Supabase

Buka Supabase Dashboard → SQL Editor dan jalankan file `supabase-migration.sql`:

```sql
-- Migration untuk menambah tabel alamat dan kolom alamat di tabel children

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
```

### 2. Update Prisma Schema

File `prisma/schema.prisma` telah diperbarui dengan:
- Model `Alamat` baru
- Model `ChildData` (menggunakan tabel `children_data`)
- Relasi `alamat` di model `ChildData`
- Field `alamatId` di model `ChildData`

### 3. Generate Prisma Client (jika menggunakan Prisma)

```bash
npx prisma generate
```

## API Endpoints Baru

### 1. Alamat Endpoints

#### GET `/api/alamat`
- **Query Parameters** (opsional):
  - `latitude`: Filter berdasarkan latitude
  - `longitude`: Filter berdasarkan longitude  
  - `radius`: Radius pencarian (default: 1)

**Contoh:**
```bash
GET /api/alamat?latitude=-6.2088&longitude=106.8456&radius=0.5
```

#### POST `/api/alamat`
**Body:**
```json
{
  "latitude": -6.2088,
  "longitude": 106.8456,
  "state": "DKI Jakarta",
  "city": "Jakarta",
  "city_district": "Jakarta Selatan",
  "village": "Kebayoran Baru"
}
```

#### GET `/api/alamat/[id]`
- Ambil alamat berdasarkan ID

#### PUT `/api/alamat/[id]`
- Update alamat berdasarkan ID

#### DELETE `/api/alamat/[id]`
- Hapus alamat (hanya jika tidak digunakan oleh children)

### 2. Submit Endpoint yang Diperbarui

#### POST `/api/submit`
**Body yang diperbarui:**
```json
{
  "gender": "male",
  "age": 24,
  "birth_weight": 3.2,
  "birth_length": 50.0,
  "body_weight": 12.5,
  "body_length": 85.0,
  "breast_feeding": true,
  "stunting": false,
  "image_is_stunting": false,
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

**Catatan**: Alamat akan otomatis dibuat dari latitude/longitude menggunakan reverse geocoding dari OpenStreetMap Nominatim API.

## Fungsi Service yang Diperbarui

### Child Service Functions

1. **`getChildren()`** - Sekarang include relasi alamat
2. **`getChildById()`** - Sekarang include relasi alamat
3. **`createAlamat()`** - Fungsi baru untuk membuat alamat
4. **`getAlamatById()`** - Fungsi baru untuk mengambil alamat
5. **`updateAlamat()`** - Fungsi baru untuk update alamat
6. **`deleteAlamat()`** - Fungsi baru untuk hapus alamat
7. **`getAlamatByLocation()`** - Fungsi baru untuk pencarian berdasarkan lokasi

## Interface TypeScript

### Child Interface (Updated)
```typescript
export interface Child {
  id: string;
  gender: 'male' | 'female';
  age: number;
  birth_weight: number;
  birth_length: number;
  body_weight: number;
  body_length: number;
  breast_feeding: boolean;
  stunting: boolean;
  image_is_stunting: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  alamat: Alamat; // Relasi ke alamat
}
```

### Alamat Interface (New)
```typescript
export interface Alamat {
  id: string;
  latitude: number;
  longitude: number;
  state: string;
  city: string;
  city_district: string;
  village: string;
  created_at: string;
}
```

## Testing

### 1. Test API Endpoints

```bash
# Test create alamat
curl -X POST http://localhost:3000/api/alamat \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -6.2088,
    "longitude": 106.8456,
    "state": "DKI Jakarta",
    "city": "Jakarta",
    "city_district": "Jakarta Selatan",
    "village": "Kebayoran Baru"
  }'

# Test get alamat
curl http://localhost:3000/api/alamat

# Test submit dengan alamat
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Child",
    "birth_date": "2020-01-01",
    "gender": "male",
    "age": 24,
    "birth_weight": 3.2,
    "birth_length": 50.0,
    "body_weight": 12.5,
    "body_length": 85.0,
    "breast_feeding": true,
    "stunting": false,
    "image_is_stunting": false,
    "alamat": {
      "latitude": -6.2088,
      "longitude": 106.8456,
      "state": "DKI Jakarta",
      "city": "Jakarta",
      "city_district": "Jakarta Selatan",
      "village": "Kebayoran Baru"
    }
  }'
```

### 2. Test Service Functions

```typescript
import { getChildren, createAlamat } from '@/services/child.service';

// Test get children dengan alamat
const children = await getChildren();
console.log(children[0].alamat); // Should show alamat data

// Test create alamat
const newAlamat = await createAlamat({
  latitude: -6.2088,
  longitude: 106.8456,
  state: "DKI Jakarta",
  city: "Jakarta",
  city_district: "Jakarta Selatan",
  village: "Kebayoran Baru"
});
console.log(newAlamat);
```

## Catatan Penting

1. **Backup Database**: Selalu backup database sebelum menjalankan migration
2. **RLS Policies**: Sesuaikan Row Level Security policies sesuai kebutuhan aplikasi
3. **Index Performance**: Index telah dibuat untuk optimasi query lokasi
4. **Data Validation**: API endpoints sudah include validasi untuk latitude/longitude
5. **Error Handling**: Semua fungsi sudah include error handling yang proper

## Troubleshooting

### Error: "relation 'alamat' does not exist"
- Pastikan migration SQL sudah dijalankan di Supabase

### Error: "column 'alamat_id' does not exist"
- Pastikan kolom alamat_id sudah ditambahkan ke tabel children

### Error: "Failed to fetch alamat data"
- Periksa RLS policies di Supabase Dashboard
- Pastikan API key memiliki permission yang tepat

### Error: "Invalid latitude/longitude value"
- Pastikan nilai latitude antara -90 sampai 90
- Pastikan nilai longitude antara -180 sampai 180
