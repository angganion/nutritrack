import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

// Helper function untuk validasi NIK (harus 16 digit angka)
function isValidNIK(nik: string): boolean {
  return /^\d{16}$/.test(nik);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'birth_date',
      'gender',
      'age',
      'body_weight',
      'body_length',
      'breast_feeding',
      'stunting',
      'stunting_confidence',
      'image_is_stunting',
      'image_is_stunting_confidence',
    ];

    const optionalFields = ['latitude', 'longitude', 'alamat', 'nik', 'birth_weight', 'birth_length'];

    for (const field of requiredFields) {
      if (!(field in data)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validasi NIK jika diberikan (optional)
    let nik = data.nik || null;
    if (nik && !isValidNIK(nik)) {
      return NextResponse.json(
        { error: 'NIK harus berupa 16 digit angka' },
        { status: 400 }
      );
    }

    // Handle alamat creation if provided
    let alamatId = null;
    if (data.latitude && data.longitude) {
      try {
        const reverseGeocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}`,
          {
            headers: {
              'User-Agent': 'NutriTrack-App/1.0 (stunting-monitoring)',
              'Accept': 'application/json'
            }
          }
        );
        
        if (!reverseGeocodeResponse.ok) {
          console.error('Reverse geocoding HTTP error:', reverseGeocodeResponse.status);
          throw new Error(`HTTP error! status: ${reverseGeocodeResponse.status}`);
        }
        
        const contentType = reverseGeocodeResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Invalid content type from Nominatim:', contentType);
          throw new Error('Invalid response type from geocoding service');
        }
        
        const reverseGeocodeData = await reverseGeocodeResponse.json();
        console.log('Reverse geocode data:', reverseGeocodeData);

      // Fungsi untuk mendapatkan nama provinsi dari berbagai kemungkinan label data
      const getState = (address: any) => {
        // Cek label 'state' atau 'province' terlebih dahulu (metode paling umum)
        if (address.state) return address.state;
        if (address.province) return address.province;

        // Jika tidak ada, cek dan petakan kode ISO 3166-2-lvl4
        if (address['ISO3166-2-lvl4']) {
          const isoCode = address['ISO3166-2-lvl4'];
          
          // Peta (map) semua kode ISO ke nama provinsi
          const isoMap = {
            'ID-AC': 'Aceh',
            'ID-SU': 'Sumatera Utara',
            'ID-SB': 'Sumatera Barat',
            'ID-RI': 'Riau',
            'ID-KR': 'Kepulauan Riau',
            'ID-JA': 'Jambi',
            'ID-SS': 'Sumatera Selatan',
            'ID-BE': 'Bengkulu',
            'ID-BB': 'Kepulauan Bangka Belitung',
            'ID-LA': 'Lampung',
            'ID-JK': 'Daerah Khusus Ibukota Jakarta',
            'ID-JB': 'Jawa Barat',
            'ID-BT': 'Banten',
            'ID-JT': 'Jawa Tengah',
            'ID-YO': 'Daerah Istimewa Yogyakarta',
            'ID-JI': 'Jawa Timur',
            'ID-KI': 'Kalimantan Timur',
            'ID-KS': 'Kalimantan Selatan',
            'ID-KT': 'Kalimantan Tengah',
            'ID-KB': 'Kalimantan Barat',
            'ID-KU': 'Kalimantan Utara',
            'ID-SN': 'Sulawesi Utara',
            'ID-SG': 'Gorontalo',
            'ID-ST': 'Sulawesi Tengah',
            'ID-SR': 'Sulawesi Barat',
            'ID-SL': 'Sulawesi Selatan', // Changed from SN to SL to avoid duplicate key
            'ID-SE': 'Sulawesi Tenggara',
            'ID-BA': 'Bali',
            'ID-NB': 'Nusa Tenggara Barat',
            'ID-NT': 'Nusa Tenggara Timur',
            'ID-MA': 'Maluku',
            'ID-MU': 'Maluku Utara',
            'ID-PP': 'Papua',
            'ID-PB': 'Papua Barat',
            'ID-PS': 'Papua Selatan',
            'ID-PT': 'Papua Tengah',
            'ID-PR': 'Papua Pegunungan',
            'ID-PA': 'Papua Barat Daya',
          };

          // Ambil nama provinsi dari peta, jika ada
          if (isoMap[isoCode as keyof typeof isoMap]) {
            return isoMap[isoCode as keyof typeof isoMap];
          }
        }

        // Jika semua metode di atas gagal, coba ambil dari 'region'
        if (address.region) return address.region;

        // Kembalikan 'Unknown' jika tidak ada data yang valid
        return 'Unknown';
      };

        // Check if reverse geocoding was successful
        if (!reverseGeocodeData.address || reverseGeocodeData.error) {
          console.error('Reverse geocoding failed:', reverseGeocodeData.error || 'No address data');
          // Skip alamat creation if reverse geocoding fails
          alamatId = null;
        } else {
          const province = getState(reverseGeocodeData.address);

          const { data: alamat, error: alamatError } = await supabase
            .from('alamat')
            .insert([{
              latitude: data.latitude,
              longitude: data.longitude,
              state: province,
              city: reverseGeocodeData.address?.city || reverseGeocodeData.address?.town || reverseGeocodeData.address?.municipality || 'Unknown',
              city_district: reverseGeocodeData.address?.city_district || reverseGeocodeData.address?.suburb || 'Unknown',
              village: reverseGeocodeData.address?.village || reverseGeocodeData.address?.hamlet || reverseGeocodeData.address?.neighbourhood || 'Unknown',
            }])
            .select()
            .single();

          if (alamatError) {
            console.error('Error creating alamat:', alamatError);
            throw alamatError;
          }
          alamatId = alamat.id;
        }
      } catch (geocodeError) {
        console.error('Geocoding error:', geocodeError);
        // Continue without alamat if geocoding fails
        alamatId = null;
      }
    }

    // Create new child record in children_data table
    const { data: result, error } = await supabase
      .from('children_data')
      .insert([{
        nik: nik,  // NIK anak (optional, bisa duplicate)
        gender: data.gender,
        age: data.age,
        birth_weight: data.birth_weight,
        birth_length: data.birth_length,
        body_weight: data.body_weight,
        body_length: data.body_length,
        breast_feeding: data.breast_feeding,
        stunting: data.stunting,
        image_is_stunting: data.image_is_stunting,
        latitude: data.latitude,
        longitude: data.longitude,
        alamat_id: alamatId,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving to Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to save data' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing IoT data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}