import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all children data
    const { data: allChildren, error } = await supabase
      .from('children_data')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Deduplicate by NIK - keep only the latest record for each NIK
    const uniqueChildren = new Map();
    const noNikChildren: any[] = [];

    allChildren?.forEach((child) => {
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

