import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateChildRecommendations } from '@/lib/gemini';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch child data
    const { data: childData, error } = await supabase
      .from('children_data')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !childData) {
      return NextResponse.json(
        { error: 'Child data not found' },
        { status: 404 }
      );
    }

    // Generate recommendations using AI
    const recommendations = await generateChildRecommendations(childData);

    return NextResponse.json({
      success: true,
      child: {
        id: childData.id,
        nik: childData.nik,
        age: childData.age,
        gender: childData.gender,
        bodyWeight: childData.body_weight,
        bodyLength: childData.body_length,
        birthWeight: childData.birth_weight,
        birthLength: childData.birth_length,
        breastFeeding: childData.breast_feeding,
        stunting: childData.stunting,
        imageIsStunting: childData.image_is_stunting,
        createdAt: childData.created_at,
      },
      recommendations,
    });
  } catch (error) {
    console.error('Error generating child recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

