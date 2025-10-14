#!/bin/bash

# Test script untuk API stats baru
# Jalankan dengan: bash test-stats-api.sh

BASE_URL="http://localhost:3000/api"

echo "🚀 NUTRITRACK STATS API TESTING"
echo "================================="
echo ""

# Test 1: Get all locations
echo "📋 Test 1: Get all locations"
echo "📤 Mengambil daftar semua lokasi..."

curl -X GET "$BASE_URL/locations" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test 2: Get provinces only
echo "📋 Test 2: Get provinces only"
echo "📤 Mengambil daftar provinsi..."

curl -X GET "$BASE_URL/locations?level=provinces" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test 3: Get stats by province (DKI Jakarta)
echo "📋 Test 3: Get stats by province - DKI Jakarta"
echo "📤 Mengambil statistik stunting di DKI Jakarta..."

curl -X GET "$BASE_URL/stats/DKI%20Jakarta" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test 4: Get stats by province (Daerah Istimewa Yogyakarta)
echo "📋 Test 4: Get stats by province - DIY"
echo "📤 Mengambil statistik stunting di DIY..."

curl -X GET "$BASE_URL/stats/Daerah%20Istimewa%20Yogyakarta" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test 5: Get stats by city (Jakarta Selatan)
echo "📋 Test 5: Get stats by city - Jakarta Selatan"
echo "📤 Mengambil statistik stunting di Jakarta Selatan..."

curl -X GET "$BASE_URL/stats/DKI%20Jakarta/Jakarta%20Selatan" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test 6: Get stats by city (Kota Yogyakarta)
echo "📋 Test 6: Get stats by city - Kota Yogyakarta"
echo "📤 Mengambil statistik stunting di Kota Yogyakarta..."

curl -X GET "$BASE_URL/stats/Daerah%20Istimewa%20Yogyakarta/Kota%20Yogyakarta" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test 7: Get stats by district (Setiabudi)
echo "📋 Test 7: Get stats by district - Setiabudi"
echo "📤 Mengambil statistik stunting di Kecamatan Setiabudi..."

curl -X GET "$BASE_URL/stats/DKI%20Jakarta/Jakarta%20Selatan/Setiabudi" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test 8: Get stats by district (Danurejan)
echo "📋 Test 8: Get stats by district - Danurejan"
echo "📤 Mengambil statistik stunting di Kecamatan Danurejan..."

curl -X GET "$BASE_URL/stats/Daerah%20Istimewa%20Yogyakarta/Kota%20Yogyakarta/Danurejan" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test 9: Invalid province
echo "📋 Test 9: Invalid province"
echo "📤 Test dengan provinsi yang tidak ada..."

curl -X GET "$BASE_URL/stats/Provinsi%20Tidak%20Ada" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test 10: Invalid URL format
echo "📋 Test 10: Invalid URL format (too many segments)"
echo "📤 Test dengan format URL yang salah..."

curl -X GET "$BASE_URL/stats/Provinsi/Kota/Kecamatan/Extra" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"

echo ""
echo "✅ Semua test selesai!"
echo ""
echo "📝 Catatan:"
echo "- URL harus menggunakan encodeURIComponent untuk nama yang mengandung spasi"
echo "- Format: /api/stats/{provinsi}/{kota}/{kecamatan}"
echo "- Maksimal 3 level: provinsi, kota, kecamatan"
echo "- API akan mengembalikan total children dan total stunting dengan stunting rate"
