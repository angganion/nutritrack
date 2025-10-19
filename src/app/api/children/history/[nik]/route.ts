import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ nik: string }> }
) {
  try {
    const { nik } = await params;
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('userRole');
    const userKecamatan = searchParams.get('userKecamatan');

    // First, try to find records by NIK
    let { data: history, error } = await supabase
      .from('children_data')
      .select(`
        *,
        alamat:alamat_id (
          state,
          city,
          city_district
        )
      `)
      .eq('nik', nik)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter by user role and kecamatan
    if (userRole === 'puskesmas' && userKecamatan) {
      history = history.filter((child: any) => 
        child.alamat && child.alamat.city_district && child.alamat.city_district.toLowerCase().includes(userKecamatan.toLowerCase())
      );
    }

    // If no records found by NIK, try to find by ID (for children without NIK)
    if (!history || history.length === 0) {
      const { data: singleRecord, error: idError } = await supabase
        .from('children_data')
        .select(`
          *,
          alamat:alamat_id (
            state,
            city,
            city_district
          )
        `)
        .eq('id', nik)
        .single();

      if (idError) {
        return NextResponse.json(
          { error: 'No records found' },
          { status: 404 }
        );
      }

      // Filter single record by user role and kecamatan
      if (userRole === 'puskesmas' && userKecamatan) {
        if (!singleRecord.alamat || !singleRecord.alamat.city_district || 
            !singleRecord.alamat.city_district.toLowerCase().includes(userKecamatan.toLowerCase())) {
          return NextResponse.json(
            { error: 'No records found' },
            { status: 404 }
          );
        }
      }

      // Return single record as history (child without NIK)
      return NextResponse.json({
        nik: null,
        recordCount: 1,
        latestRecord: singleRecord,
        history: [singleRecord],
        isIdBased: true,
      });
    }

    // Return NIK-based history
    return NextResponse.json({
      nik,
      recordCount: history.length,
      latestRecord: history[0],
      history: history,
      isIdBased: false,
    });
  } catch (error) {
    console.error('Error fetching child history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch child history' },
      { status: 500 }
    );
  }
}

