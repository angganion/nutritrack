import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil alamat berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('alamat')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Alamat not found' },
          { status: 404 }
        );
      }
      throw error;
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

// PUT - Update alamat berdasarkan ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Validate latitude and longitude if provided
    if (data.latitude !== undefined) {
      if (data.latitude < -90 || data.latitude > 90) {
        return NextResponse.json(
          { error: 'Invalid latitude value' },
          { status: 400 }
        );
      }
    }

    if (data.longitude !== undefined) {
      if (data.longitude < -180 || data.longitude > 180) {
        return NextResponse.json(
          { error: 'Invalid longitude value' },
          { status: 400 }
        );
      }
    }

    const { data: result, error } = await supabase
      .from('alamat')
      .update(data)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Alamat not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating alamat:', error);
    return NextResponse.json(
      { error: 'Failed to update alamat' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus alamat berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if alamat is being used by any children_data
    const { data: children, error: checkError } = await supabase
      .from('children_data')
      .select('id')
      .eq('alamat_id', params.id)
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (children && children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete alamat that is being used by children_data' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('alamat')
      .delete()
      .eq('id', params.id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Alamat not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ message: 'Alamat deleted successfully' });
  } catch (error) {
    console.error('Error deleting alamat:', error);
    return NextResponse.json(
      { error: 'Failed to delete alamat' },
      { status: 500 }
    );
  }
}
