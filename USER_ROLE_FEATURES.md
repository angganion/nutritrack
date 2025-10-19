# Fitur User dan Role - PANTAU+

## Ringkasan
Sistem PANTAU+ sekarang mendukung 2 jenis user role:
- **Admin**: Akses penuh ke semua data dan fitur manajemen user
- **Puskesmas**: Akses terbatas hanya ke data sesuai kecamatan yang ditugaskan

## Database Schema

### Tabel Users
```sql
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'puskesmas')),
    kecamatan VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Fitur yang Diimplementasikan

### 1. Login System
- **File**: `/src/app/login/page.tsx`
- **Service**: `/src/services/user.service.ts`
- **Context**: `/src/contexts/UserContext.tsx`
- Login langsung ke Supabase tanpa API
- Default admin: username: `admin`, password: `admin123`

### 2. User Management (Admin Only)
- **File**: `/src/components/dashboard/user-management.tsx`
- Admin dapat membuat user puskesmas baru
- Form input: username, password, kecamatan
- Daftar semua user yang terdaftar

### 3. Data Filtering by Role
Semua data di dashboard otomatis difilter berdasarkan role:

#### Admin
- Melihat semua data tanpa filter
- Akses ke semua fitur dashboard
- Dapat mengelola user puskesmas

#### Puskesmas
- Data difilter berdasarkan kecamatan yang ditugaskan
- Hanya melihat data anak dari kecamatan tersebut
- Tidak dapat mengelola user lain

### 4. API Routes yang Dimodifikasi
- `/api/dashboard/stats` - Menerima parameter `userRole` dan `userKecamatan`
- `/api/children/unique` - Filter data berdasarkan role dan kecamatan
- `/api/dashboard/age-analysis` - Filter analisis usia berdasarkan role

### 5. Komponen yang Diupdate
- `DataTable` - Mengirim parameter role ke API
- `StuntingPrevalenceChart` - Filter data tren stunting
- `AgeDistributionChart` - Filter distribusi usia
- `DistributionChart` - Filter distribusi status stunting
- `OverviewCards` - Menampilkan data sesuai role

## Cara Penggunaan

### 1. Setup Database
Jalankan migration SQL di Supabase:
```sql
-- File: supabase-migration-users.sql
```

### 2. Login sebagai Admin
1. Buka `/login`
2. Username: `admin`
3. Password: `admin123`
4. Akan redirect ke `/dashboard`

### 3. Membuat User Puskesmas (Admin)
1. Login sebagai admin
2. Scroll ke bawah dashboard
3. Klik "Tambah User Puskesmas"
4. Isi form: username, password, kecamatan
5. Klik "Simpan"

### 4. Login sebagai Puskesmas
1. Buka `/login`
2. Masukkan username dan password yang dibuat admin
3. Akan melihat data hanya dari kecamatan yang ditugaskan

## Keamanan
- Password disimpan plain text (sesuai permintaan)
- Tidak ada hashing atau enkripsi
- Filter data dilakukan di level API dan komponen
- User context tersimpan di localStorage

## File yang Dibuat/Dimodifikasi

### File Baru
- `src/contexts/UserContext.tsx`
- `src/services/user.service.ts`
- `src/app/login/page.tsx`
- `src/components/dashboard/user-management.tsx`
- `supabase-migration-users.sql`

### File yang Dimodifikasi
- `src/app/layout.tsx` - Menambahkan UserProvider
- `src/app/page.tsx` - Redirect ke login
- `src/app/dashboard/page.tsx` - Client-side data fetching dengan role
- `src/app/api/dashboard/stats/route.ts` - Filter berdasarkan role
- `src/app/api/children/unique/route.ts` - Filter berdasarkan role
- `src/app/api/dashboard/age-analysis/route.ts` - Filter berdasarkan role
- `src/services/child.service.ts` - Update getStuntingDistribution
- Semua komponen chart - Menggunakan UserContext

## Catatan Penting
- Semua pendekatan menggunakan direct Supabase query (tidak ada API login)
- Filter data dilakukan di level query dan komponen
- Tidak ada perubahan pada desain UI yang sudah ada
- Fitur user management hanya muncul untuk admin
