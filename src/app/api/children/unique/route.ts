import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('userRole');
    const userKecamatan = searchParams.get('userKecamatan');

    // Get all children data
    let query = supabase
      .from('children_data')
      .select(`
        *,
        alamat:alamat_id (
          state,
          city,
          city_district
        )
      `)
      .order('created_at', { ascending: false });

    const { data: allChildren, error } = await query;

    if (error) throw error;

    // Filter by user role and kecamatan first
    let filteredChildren = allChildren || [];
    
    if (userRole === 'puskesmas' && userKecamatan) {
      filteredChildren = filteredChildren.filter((child: any) => 
        child.alamat && child.alamat.city_district && child.alamat.city_district.toLowerCase().includes(userKecamatan.toLowerCase())
      );
    }

    // Deduplicate by NIK - keep only the latest record for each NIK
    const uniqueChildren = new Map();
    const noNikChildren: any[] = [];

    filteredChildren.forEach((child) => {
      if (child.nik) {
        // If NIK exists, only keep the latest record
        if (!uniqueChildren.has(child.nik)) {
          uniqueChildren.set(child.nik, child);
        }
      } else {
        // If no NIK, include all records
        noNikChildren.push(child);
      }
    });

    // Combine unique NIK children with no-NIK children
    const result = [...Array.from(uniqueChildren.values()), ...noNikChildren];

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching unique children:', error);
    return NextResponse.json(
      { error: 'Failed to fetch children data' },
      { status: 500 }
    );
  }
}

