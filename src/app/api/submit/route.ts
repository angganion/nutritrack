import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'name',
      'birth_date',
      'gender',
      'age',
      'birth_weight',
      'birth_length',
      'body_weight',
      'body_length',
      'breast_feeding',
      'stunting',
      'image_is_stunting',
    ];

    const optionalFields = ['latitude', 'longitude'];

    for (const field of requiredFields) {
      if (!(field in data)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // First, create or get the child
    let { data: child, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('name', data.name)
      .single();

    if (!child) {
      const { data: newChild, error: createError } = await supabase
        .from('children')
        .insert([{
          name: data.name,
          birth_date: data.birth_date,
        }])
        .select()
        .single();

      if (createError) {
        throw createError;
      }
      child = newChild;
    }

    // Then create the record
    const { data: result, error } = await supabase
      .from('child_records')
      .insert([{
        child_id: child.id,
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