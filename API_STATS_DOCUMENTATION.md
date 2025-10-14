# NutriTrack Stats API Documentation

## Overview

API ini menyediakan endpoint untuk mendapatkan statistik stunting berdasarkan hierarki geografis (Provinsi → Kota → Kecamatan).

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 1. Get All Locations

**GET** `/api/locations`

Mengambil daftar semua lokasi yang tersedia dalam database.

#### Query Parameters

- `level` (optional): `all` | `provinces` | `cities` | `districts`
  - Default: `all`
  - `provinces`: Hanya daftar provinsi
  - `all`: Semua level (provinces, cities, districts)

#### Response

```json
{
  "provinces": [
    {
      "name": "Daerah Khusus Ibukota Jakarta",
      "url": "/api/stats/Daerah%20Khusus%20Ibukota%20Jakarta"
    }
  ],
  "cities": [
    {
      "province": "Daerah Khusus Ibukota Jakarta",
      "cities": [
        {
          "name": "Jakarta Selatan",
          "url": "/api/stats/Daerah%20Khusus%20Ibukota%20Jakarta/Jakarta%20Selatan"
        }
      ]
    }
  ],
  "districts": [
    {
      "province": "Daerah Khusus Ibukota Jakarta",
      "cities": [
        {
          "city": "Jakarta Selatan",
          "districts": [
            {
              "name": "Setiabudi",
              "url": "/api/stats/Daerah%20Khusus%20Ibukota%20Jakarta/Jakarta%20Selatan/Setiabudi"
            }
          ]
        }
      ]
    }
  ]
}
```

### 2. Get Stunting Stats by Province

**GET** `/api/stats/{provinsi}`

Mengambil statistik stunting di level provinsi.

#### Example

```
GET /api/stats/DKI%20Jakarta
```

#### Response

```json
{
  "level": "province",
  "location": "Daerah Khusus Ibukota Jakarta",
  "totalChildren": 150,
  "totalStunting": 45,
  "stuntingRate": "30.00"
}
```

### 3. Get Stunting Stats by City

**GET** `/api/stats/{provinsi}/{kota}`

Mengambil statistik stunting di level kota.

#### Example

```
GET /api/stats/DKI%20Jakarta/Jakarta%20Selatan
```

#### Response

```json
{
  "level": "city",
  "location": {
    "province": "Daerah Khusus Ibukota Jakarta",
    "city": "Jakarta Selatan"
  },
  "totalChildren": 75,
  "totalStunting": 22,
  "stuntingRate": "29.33"
}
```

### 4. Get Stunting Stats by District

**GET** `/api/stats/{provinsi}/{kota}/{kecamatan}`

Mengambil statistik stunting di level kecamatan.

#### Example

```
GET /api/stats/DKI%20Jakarta/Jakarta%20Selatan/Setiabudi
```

#### Response

```json
{
  "level": "district",
  "location": {
    "province": "Daerah Khusus Ibukota Jakarta",
    "city": "Jakarta Selatan",
    "district": "Setiabudi"
  },
  "totalChildren": 25,
  "totalStunting": 8,
  "stuntingRate": "32.00"
}
```

## URL Encoding

Karena nama lokasi mungkin mengandung spasi atau karakter khusus, gunakan URL encoding:

### JavaScript

```javascript
const province = "Daerah Khusus Ibukota Jakarta";
const city = "Jakarta Selatan";
const district = "Setiabudi";

const url = `/api/stats/${encodeURIComponent(province)}/${encodeURIComponent(city)}/${encodeURIComponent(district)}`;
```

### cURL

```bash
curl "http://localhost:3000/api/stats/DKI%20Jakarta/Jakarta%20Selatan/Setiabudi"
```

## Province Name Mapping

API ini mendukung berbagai variasi nama provinsi:

| Input | Normalized Output |
|-------|------------------|
| `DKI Jakarta` | `Daerah Khusus Ibukota Jakarta` |
| `Jakarta` | `Daerah Khusus Ibukota Jakarta` |
| `DIY` | `Daerah Istimewa Yogyakarta` |
| `Yogyakarta` | `Daerah Istimewa Yogyakarta` |
| `Jawa Barat` | `Jawa Barat` |
| `jawa barat` | `Jawa Barat` |

## City Name Normalization

API akan otomatis menghapus prefix seperti "Kota", "Kabupaten", "Kab":

| Input | Normalized Output |
|-------|------------------|
| `Kota Jakarta Selatan` | `Jakarta Selatan` |
| `Kabupaten Bogor` | `Bogor` |
| `Kab Bandung` | `Bandung` |

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid URL format. Expected: /{provinsi}, /{provinsi}/{kota}, or /{provinsi}/{kota}/{kecamatan}"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to fetch stunting statistics"
}
```

## Testing

Gunakan script test yang tersedia:

```bash
# Test semua endpoint
bash test-stats-api.sh

# Test manual dengan curl
curl "http://localhost:3000/api/stats/DKI%20Jakarta"
```

## Data Structure

API ini mengandalkan struktur data:

- **children_data**: Tabel utama dengan data anak
- **alamat**: Tabel alamat dengan relasi ke children_data
- **stunting**: Field boolean di children_data yang menentukan status stunting

## Performance Notes

- Query menggunakan `ILIKE` untuk pencarian case-insensitive
- Menggunakan `count: 'exact'` untuk mendapatkan total yang akurat
- Index pada kolom alamat disarankan untuk performa optimal

## Examples

### Frontend Integration

```javascript
// Get stats by province
async function getProvinceStats(province) {
  const response = await fetch(`/api/stats/${encodeURIComponent(province)}`);
  const data = await response.json();
  return data;
}

// Get stats by city
async function getCityStats(province, city) {
  const response = await fetch(
    `/api/stats/${encodeURIComponent(province)}/${encodeURIComponent(city)}`
  );
  const data = await response.json();
  return data;
}

// Get stats by district
async function getDistrictStats(province, city, district) {
  const response = await fetch(
    `/api/stats/${encodeURIComponent(province)}/${encodeURIComponent(city)}/${encodeURIComponent(district)}`
  );
  const data = await response.json();
  return data;
}
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useStuntingStats(province, city, district) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let url = '/api/stats/';
        if (district) {
          url += `${encodeURIComponent(province)}/${encodeURIComponent(city)}/${encodeURIComponent(district)}`;
        } else if (city) {
          url += `${encodeURIComponent(province)}/${encodeURIComponent(city)}`;
        } else {
          url += encodeURIComponent(province);
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (province) {
      fetchStats();
    }
  }, [province, city, district]);

  return { stats, loading };
}
```
