import { NextResponse } from 'next/server';
import { getStuntingRecommendations } from '@/lib/gemini';

export async function GET() {
  try {
    const result = await getStuntingRecommendations({
      stunting: true,
      age: 18,
      gender: 'male',
      birthWeight: 2.6,
      birthLength: 48,
      bodyWeight: 8.2,
      bodyLength: 72,
      breastFeeding: false,
      location: {
        province: 'Daerah Khusus Ibukota Jakarta',
        city: 'Jakarta Selatan',
        district: 'Setiabudi',
      },
    });

    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Unknown error' }, { status: 500 });
  }
}


