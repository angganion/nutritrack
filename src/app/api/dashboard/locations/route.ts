import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const province = searchParams.get('province');

    if (province) {
      // Get cities for specific province
      const { data: cities, error } = await supabase
        .from('alamat')
        .select('city')
        .ilike('state', `%${province}%`)
        .order('city');

      if (error) throw error;

      // Get unique cities
      const uniqueCities = [...new Set(cities.map(item => item.city))];

      return NextResponse.json({
        province,
        cities: uniqueCities.sort()
      });

    } else {
      // Get all provinces
      const { data: provinces, error } = await supabase
        .from('alamat')
        .select('state')
        .order('state');

      if (error) throw error;

      // Get unique provinces
      const uniqueProvinces = [...new Set(provinces.map(item => item.state))];

      return NextResponse.json({
        provinces: uniqueProvinces.sort()
      });
    }

  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}


