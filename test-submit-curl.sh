#!/bin/bash

# Test script untuk API POST /api/submit menggunakan curl
# Jalankan dengan: bash test-submit-curl.sh

API_URL="http://localhost:3000/api/submit"

echo "🚀 NUTRITRACK API TESTING - CURL VERSION"
echo "========================================="
echo ""

# Test Case 1: Anak laki-laki normal
echo "📋 Test Case 1: Anak laki-laki normal"
echo "📤 Mengirim data..."

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmad Rizki",
    "birth_date": "2020-01-15",
    "gender": "male",
    "age": 24,
    "birth_weight": 3.2,
    "birth_length": 50.0,
    "body_weight": 15.5,
    "body_length": 85.0,
    "breast_feeding": true,
    "stunting": false,
    "image_is_stunting": false,
    "latitude": -6.2088,
    "longitude": 106.8456
  }' \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test Case 2: Anak perempuan dengan stunting
echo "📋 Test Case 2: Anak perempuan dengan stunting"
echo "📤 Mengirim data..."

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Siti Nurhaliza",
    "birth_date": "2019-06-20",
    "gender": "female",
    "age": 30,
    "birth_weight": 2.8,
    "birth_length": 48.0,
    "body_weight": 10.2,
    "body_length": 78.0,
    "breast_feeding": false,
    "stunting": true,
    "image_is_stunting": true,
    "latitude": -7.7956,
    "longitude": 110.3695
  }' \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test Case 3: Anak tanpa koordinat
echo "📋 Test Case 3: Anak tanpa koordinat"
echo "📤 Mengirim data..."

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Budi Santoso",
    "birth_date": "2021-03-10",
    "gender": "male",
    "age": 18,
    "birth_weight": 3.5,
    "birth_length": 52.0,
    "body_weight": 11.8,
    "body_length": 82.0,
    "breast_feeding": true,
    "stunting": false,
    "image_is_stunting": false
  }' \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"


# Test Case 4: Data invalid - missing gender
echo "📋 Test Case 4: Data invalid - missing gender"
echo "📤 Mengirim data..."

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Child",
    "birth_date": "2020-01-01",
    "age": 24,
    "birth_weight": 3.2,
    "birth_length": 50.0,
    "body_weight": 12.5,
    "body_length": 85.0,
    "breast_feeding": true,
    "stunting": false,
    "image_is_stunting": false
  }' \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"


# Test Case 5: Invalid latitude
echo "📋 Test Case 5: Invalid latitude"
echo "📤 Mengirim data..."

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Invalid",
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
    "latitude": 200,
    "longitude": 106.8456
  }' \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"



# Test untuk mengambil data alamat
echo "📋 Test Case 6: Get alamat data"
echo "📤 Mengambil data alamat..."

curl -X GET "http://localhost:3000/api/alamat" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Response Time: %{time_total}s\n"

echo ""
echo "✅ Semua test selesai!"
