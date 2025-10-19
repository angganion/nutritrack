import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('userRole');
    const userKecamatan = searchParams.get('userKecamatan');

    // Get all children data with age
    let query = supabase
      .from('children_data')
      .select(`
        id, nik, age, stunting, created_at,
        alamat:alamat_id (
          state,
          city,
          city_district
        )
      `)
      .order('created_at', { ascending: false });

    const { data: allChildren, error } = await query;

    if (error) throw error;

    // Deduplicate by NIK
    const deduplicateByNIK = (data: any[]) => {
      const nikMap = new Map();
      const noNikData: any[] = [];

      data.forEach(item => {
        if (item.nik) {
          const existing = nikMap.get(item.nik);
          if (!existing || new Date(item.created_at) > new Date(existing.created_at)) {
            nikMap.set(item.nik, item);
          }
        } else {
          noNikData.push(item);
        }
      });

      return [...Array.from(nikMap.values()), ...noNikData];
    };

    // Filter by user role and kecamatan first
    let filteredChildren = allChildren || [];
    
    if (userRole === 'puskesmas' && userKecamatan) {
      filteredChildren = filteredChildren.filter((child: any) => 
        child.alamat && child.alamat.city_district && child.alamat.city_district.toLowerCase().includes(userKecamatan.toLowerCase())
      );
    }

    const deduped = deduplicateByNIK(filteredChildren);

    // Define age groups (in months)
    const ageGroups = [
      { label: '0-6', min: 0, max: 6 },
      { label: '7-12', min: 7, max: 12 },
      { label: '13-24', min: 13, max: 24 },
      { label: '25-36', min: 25, max: 36 },
      { label: '37-48', min: 37, max: 48 },
      { label: '49-60', min: 49, max: 60 },
    ];

    const ageDistribution = ageGroups.map(group => {
      const childrenInGroup = deduped.filter(
        child => child.age >= group.min && child.age <= group.max
      );

      const total = childrenInGroup.length;
      const stunting = childrenInGroup.filter(c => c.stunting).length;
      const normal = total - stunting;
      const rate = total > 0 ? ((stunting / total) * 100).toFixed(1) : '0';

      return {
        ageGroup: group.label,
        total,
        stunting,
        normal,
        rate,
      };
    });

    // Calculate correlation with breast feeding
    const { data: breastFeedingData } = await supabase
      .from('children_data')
      .select('nik, stunting, breast_feeding, created_at');

    const bfDeduped = deduplicateByNIK(breastFeedingData || []);

    const stuntingWithBF = bfDeduped.filter(c => c.stunting && c.breast_feeding).length;
    const stuntingWithoutBF = bfDeduped.filter(c => c.stunting && !c.breast_feeding).length;
    const normalWithBF = bfDeduped.filter(c => !c.stunting && c.breast_feeding).length;
    const normalWithoutBF = bfDeduped.filter(c => !c.stunting && !c.breast_feeding).length;

    const totalWithBF = stuntingWithBF + normalWithBF;
    const totalWithoutBF = stuntingWithoutBF + normalWithoutBF;

    const stuntingRateWithBF = totalWithBF > 0 ? ((stuntingWithBF / totalWithBF) * 100).toFixed(1) : '0';
    const stuntingRateWithoutBF = totalWithoutBF > 0 ? ((stuntingWithoutBF / totalWithoutBF) * 100).toFixed(1) : '0';

    return NextResponse.json({
      ageGroups: ageDistribution,
      breastFeedingCorrelation: {
        withBreastFeeding: {
          total: totalWithBF,
          stunting: stuntingWithBF,
          rate: stuntingRateWithBF,
        },
        withoutBreastFeeding: {
          total: totalWithoutBF,
          stunting: stuntingWithoutBF,
          rate: stuntingRateWithoutBF,
        },
      },
      summary: {
        totalChildren: deduped.length,
        averageAge: deduped.length > 0 
          ? (deduped.reduce((sum, c) => sum + c.age, 0) / deduped.length).toFixed(1)
          : '0',
        mostAffectedAgeGroup: ageDistribution.reduce((max, group) => 
          parseFloat(group.rate) > parseFloat(max.rate) ? group : max
        , ageDistribution[0]),
      }
    });

  } catch (error) {
    console.error('Error in age analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze age distribution' },
      { status: 500 }
    );
  }
}


