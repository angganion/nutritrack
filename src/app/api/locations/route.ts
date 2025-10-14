import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil daftar semua provinsi, kota, dan kecamatan yang tersedia
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level') || 'all'; // all, provinces, cities, districts

    if (level === 'provinces' || level === 'all') {
      // Ambil daftar provinsi
      const { data: provinces, error: provinceError } = await supabase
        .from('children_data')
        .select(`
          alamat:alamat_id (
            state
          )
        `)
        .not('alamat_id', 'is', null);

      if (provinceError) {
        throw new Error('Failed to fetch provinces');
      }

      // Ambil unique provinces
      const uniqueProvinces = [...new Set(
        provinces
          .filter(item => item.alamat?.state)
          .map(item => item.alamat.state)
      )].sort();

      if (level === 'provinces') {
        return NextResponse.json({
          level: 'provinces',
          data: uniqueProvinces.map(province => ({
            name: province,
            url: `/api/stats/${encodeURIComponent(province)}`
          }))
        });
      }

      // Jika level === 'all', lanjut ke cities dan districts
      const result: any = {
        provinces: uniqueProvinces.map(province => ({
          name: province,
          url: `/api/stats/${encodeURIComponent(province)}`
        })),
        cities: [],
        districts: []
      };

      // Ambil daftar kota
      const { data: cities, error: cityError } = await supabase
        .from('children_data')
        .select(`
          alamat:alamat_id (
            state,
            city
          )
        `)
        .not('alamat_id', 'is', null);

      if (cityError) {
        throw new Error('Failed to fetch cities');
      }

      // Group cities by province
      const citiesByProvince: { [key: string]: string[] } = {};
      cities
        .filter(item => item.alamat?.state && item.alamat?.city)
        .forEach(item => {
          const province = item.alamat.state;
          const city = item.alamat.city;
          if (!citiesByProvince[province]) {
            citiesByProvince[province] = [];
          }
          if (!citiesByProvince[province].includes(city)) {
            citiesByProvince[province].push(city);
          }
        });

      result.cities = Object.entries(citiesByProvince).map(([province, cities]) => ({
        province,
        cities: cities.map(city => ({
          name: city,
          url: `/api/stats/${encodeURIComponent(province)}/${encodeURIComponent(city)}`
        }))
      }));

      // Ambil daftar kecamatan
      const { data: districts, error: districtError } = await supabase
        .from('children_data')
        .select(`
          alamat:alamat_id (
            state,
            city,
            city_district
          )
        `)
        .not('alamat_id', 'is', null);

      if (districtError) {
        throw new Error('Failed to fetch districts');
      }

      // Group districts by province and city
      const districtsByLocation: { [key: string]: { [key: string]: string[] } } = {};
      districts
        .filter(item => item.alamat?.state && item.alamat?.city && item.alamat?.city_district)
        .forEach(item => {
          const province = item.alamat.state;
          const city = item.alamat.city;
          const district = item.alamat.city_district;
          
          if (!districtsByLocation[province]) {
            districtsByLocation[province] = {};
          }
          if (!districtsByLocation[province][city]) {
            districtsByLocation[province][city] = [];
          }
          if (!districtsByLocation[province][city].includes(district)) {
            districtsByLocation[province][city].push(district);
          }
        });

      result.districts = Object.entries(districtsByLocation).map(([province, cities]) => ({
        province,
        cities: Object.entries(cities).map(([city, districts]) => ({
          city,
          districts: districts.map(district => ({
            name: district,
            url: `/api/stats/${encodeURIComponent(province)}/${encodeURIComponent(city)}/${encodeURIComponent(district)}`
          }))
        }))
      }));

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid level parameter' }, { status: 400 });

  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
