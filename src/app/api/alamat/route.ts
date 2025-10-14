import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil semua alamat atau alamat berdasarkan query
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const radius = searchParams.get('radius');

    let query = supabase.from('alamat').select('*');

    // Jika ada parameter lokasi, filter berdasarkan radius
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = radius ? parseFloat(radius) : 1;

      query = query
        .gte('latitude', lat - rad)
        .lte('latitude', lat + rad)
        .gte('longitude', lng - rad)
        .lte('longitude', lng + rad);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch alamat data');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching alamat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alamat data' },
      { status: 500 }
    );
  }
}

// POST - Buat alamat baru
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'latitude',
      'longitude',
      'state',
      'city',
      'city_district',
      'village'
    ];

    for (const field of requiredFields) {
      if (!(field in data)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate latitude and longitude
    if (data.latitude < -90 || data.latitude > 90) {
      return NextResponse.json(
        { error: 'Invalid latitude value' },
        { status: 400 }
      );
    }

    if (data.longitude < -180 || data.longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid longitude value' },
        { status: 400 }
      );
    }

    const { data: result, error } = await supabase
      .from('alamat')
      .insert([{
        latitude: data.latitude,
        longitude: data.longitude,
        state: data.state,
        city: data.city,
        city_district: data.city_district,
        village: data.village,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating alamat:', error);
      return NextResponse.json(
        { error: 'Failed to create alamat' },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error processing alamat creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
