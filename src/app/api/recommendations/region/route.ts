import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getStuntingRecommendations } from '@/lib/gemini';

// Helper function untuk decode URL dan clean nama
function decodeAndClean(param: string): string {
  return decodeURIComponent(param).replace(/[^a-zA-Z0-9\s\-]/g, '').trim();
}

// Helper function untuk normalize nama provinsi
function normalizeProvince(province: string): string {
  const provinceMap: { [key: string]: string } = {
    'dki jakarta': 'Daerah Khusus Ibukota Jakarta',
    'jakarta': 'Daerah Khusus Ibukota Jakarta',
    'diy': 'Daerah Istimewa Yogyakarta',
    'yogyakarta': 'Daerah Istimewa Yogyakarta',
    'jawa barat': 'Jawa Barat',
    'jawa tengah': 'Jawa Tengah',
    'jawa timur': 'Jawa Timur',
    'banten': 'Banten',
    'bali': 'Bali',
    'aceh': 'Aceh',
    'sumatera utara': 'Sumatera Utara',
    'sumatera barat': 'Sumatera Barat',
    'riau': 'Riau',
    'kepulauan riau': 'Kepulauan Riau',
    'jambi': 'Jambi',
    'sumatera selatan': 'Sumatera Selatan',
    'bengkulu': 'Bengkulu',
    'kepulauan bangka belitung': 'Kepulauan Bangka Belitung',
    'lampung': 'Lampung',
    'kalimantan barat': 'Kalimantan Barat',
    'kalimantan tengah': 'Kalimantan Tengah',
    'kalimantan selatan': 'Kalimantan Selatan',
    'kalimantan timur': 'Kalimantan Timur',
    'kalimantan utara': 'Kalimantan Utara',
    'sulawesi utara': 'Sulawesi Utara',
    'gorontalo': 'Gorontalo',
    'sulawesi tengah': 'Sulawesi Tengah',
    'sulawesi barat': 'Sulawesi Barat',
    'sulawesi selatan': 'Sulawesi Selatan',
    'sulawesi tenggara': 'Sulawesi Tenggara',
    'nusa tenggara barat': 'Nusa Tenggara Barat',
    'nusa tenggara timur': 'Nusa Tenggara Timur',
    'maluku': 'Maluku',
    'maluku utara': 'Maluku Utara',
    'papua': 'Papua',
    'papua barat': 'Papua Barat',
    'papua selatan': 'Papua Selatan',
    'papua tengah': 'Papua Tengah',
    'papua pegunungan': 'Papua Pegunungan',
    'papua barat daya': 'Papua Barat Daya',
  };

  const normalized = province.toLowerCase().trim();
  return provinceMap[normalized] || province;
}

// Helper function untuk normalize nama kota
function normalizeCity(city: string): string {
  return city.replace(/\b(kota|kabupaten|kab)\b/gi, '').trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const province = searchParams.get('province');
    const city = searchParams.get('city');
    const district = searchParams.get('district');

    if (!province) {
      return NextResponse.json(
        { error: 'Province parameter is required' },
        { status: 400 }
      );
    }

    // Build query based on parameters
    let query = supabase
      .from('children_data')
      .select(`
        id,
        stunting,
        age,
        gender,
        birth_weight,
        birth_length,
        body_weight,
        body_length,
        breast_feeding,
        alamat_id,
        alamat:alamat_id (
          longitude,
          latitude,
          state,
          city,
          city_district
        )
      `)
      .not('alamat_id', 'is', null);

    const normalizedProvince = normalizeProvince(province);
    query = query.ilike('alamat.state', `%${normalizedProvince}%`);

    if (city) {
      const normalizedCity = normalizeCity(city);
      query = query.ilike('alamat.city', `%${normalizedCity}%`);
    }

    if (district) {
      query = query.ilike('alamat.city_district', `%${district}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch region data');
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data found for the specified region' },
        { status: 404 }
      );
    }

    // Calculate region statistics
    const totalChildren = data.length;
    const totalStunting = data.filter(child => child.stunting === true).length;
    const stuntingRate = totalChildren > 0 ? ((totalStunting / totalChildren) * 100).toFixed(2) : '0.00';

    // Calculate average values for representative data
    const avgAge = data.reduce((sum, child) => sum + child.age, 0) / totalChildren;
    const avgBirthWeight = data.reduce((sum, child) => sum + child.birth_weight, 0) / totalChildren;
    const avgBirthLength = data.reduce((sum, child) => sum + child.birth_length, 0) / totalChildren;
    const avgBodyWeight = data.reduce((sum, child) => sum + child.body_weight, 0) / totalChildren;
    const avgBodyLength = data.reduce((sum, child) => sum + child.body_length, 0) / totalChildren;
    const breastFeedingRate = data.filter(child => child.breast_feeding === true).length / totalChildren;

    // Get location info
    const location = {
      province: normalizedProvince,
      city: city ? normalizeCity(city) : undefined,
      district: district || undefined
    };

    // Generate recommendations using Gemini
    const recommendations = await getStuntingRecommendations({
      stunting: parseFloat(stuntingRate) > 20, // Consider stunting if rate > 20%
      age: Math.round(avgAge),
      gender: 'mixed', // Mixed gender for regional analysis
      birthWeight: parseFloat(avgBirthWeight.toFixed(2)),
      birthLength: parseFloat(avgBirthLength.toFixed(2)),
      bodyWeight: parseFloat(avgBodyWeight.toFixed(2)),
      bodyLength: parseFloat(avgBodyLength.toFixed(2)),
      breastFeeding: breastFeedingRate > 0.5,
      location
    });

    return NextResponse.json({
      region: {
        level: district ? 'district' : city ? 'city' : 'province',
        location,
        totalChildren,
        totalStunting,
        stuntingRate,
        statistics: {
          avgAge: parseFloat(avgAge.toFixed(1)),
          avgBirthWeight: parseFloat(avgBirthWeight.toFixed(2)),
          avgBirthLength: parseFloat(avgBirthLength.toFixed(2)),
          avgBodyWeight: parseFloat(avgBodyWeight.toFixed(2)),
          avgBodyLength: parseFloat(avgBodyLength.toFixed(2)),
          breastFeedingRate: parseFloat((breastFeedingRate * 100).toFixed(2))
        }
      },
      recommendations
    });

  } catch (error) {
    console.error('Error getting region recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get region recommendations' },
      { status: 500 }
    );
  }
}
