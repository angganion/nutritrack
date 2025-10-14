import { NextResponse } from 'next/server';
import { getPolicyRecommendations } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const statsData = await request.json();
    
    // Validate required fields from stats API response
    if (!statsData.totalChildren || !statsData.totalStunting || !statsData.stuntingRate) {
      return NextResponse.json(
        { error: 'Invalid stats data. Required fields: totalChildren, totalStunting, stuntingRate' },
        { status: 400 }
      );
    }

    // Extract location info from stats data
    const location = {
      level: statsData.level as 'country' | 'province' | 'city' | 'district',
      name: statsData.location || statsData.location?.province || statsData.location?.city || statsData.location?.district || 'Unknown',
      province: statsData.location?.province,
      city: statsData.location?.city,
      district: statsData.location?.district
    };

    // Prepare data for policy recommendations
    const policyData = {
      totalChildren: statsData.totalChildren,
      totalStunting: statsData.totalStunting,
      stuntingRate: parseFloat(statsData.stuntingRate),
      location,
      groupedData: statsData.groupedByProvince || statsData.groupedByCity || statsData.groupedByDistrict
    };

    // Get policy recommendations from Gemini
    const recommendations = await getPolicyRecommendations(policyData);

    return NextResponse.json({
      success: true,
      region: {
        level: statsData.level,
        location: statsData.location,
        totalChildren: statsData.totalChildren,
        totalStunting: statsData.totalStunting,
        stuntingRate: statsData.stuntingRate
      },
      recommendations
    });

  } catch (error) {
    console.error('Error getting policy recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get policy recommendations' },
      { status: 500 }
    );
  }
}
