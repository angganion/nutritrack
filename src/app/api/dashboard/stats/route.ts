import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const province = searchParams.get('province');
    const city = searchParams.get('city');

    // Build query with location filters
    let query = supabase
      .from('children_data')
      .select(`
        id, 
        nik, 
        stunting, 
        breast_feeding, 
        created_at,
        alamat:alamat_id (
          state,
          city
        )
      `)
      .order('created_at', { ascending: false });

    // Apply location filters if provided
    if (province || city) {
      query = query.not('alamat_id', 'is', null);
    }

    const { data: allChildren, error: allError } = await query;

    if (allError) throw allError;

    // Filter by location after fetch (because of join)
    let filteredChildren = allChildren;
    if (province) {
      filteredChildren = filteredChildren.filter((child: any) => 
        child.alamat && child.alamat.state.toLowerCase().includes(province.toLowerCase())
      );
    }
    if (city) {
      filteredChildren = filteredChildren.filter((child: any) => 
        child.alamat && child.alamat.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Calculate current period stats
    const currentDate = new Date();
    const periodDays = parseInt(period);
    const periodStart = new Date(currentDate.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(periodStart.getTime() - periodDays * 24 * 60 * 60 * 1000);

    // Deduplicate by NIK for accurate stats
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

    // Current period data
    const currentPeriodData = filteredChildren.filter(child => 
      new Date(child.created_at) >= periodStart
    );
    const currentDeduped = deduplicateByNIK(currentPeriodData);

    // Previous period data  
    const previousPeriodData = filteredChildren.filter(child => {
      const createdDate = new Date(child.created_at);
      return createdDate >= previousPeriodStart && createdDate < periodStart;
    });
    const previousDeduped = deduplicateByNIK(previousPeriodData);

    // Overall deduped data
    const allDeduped = deduplicateByNIK(filteredChildren);

    // Calculate stats
    const totalChildren = allDeduped.length;
    const stuntingCases = allDeduped.filter(c => c.stunting).length;
    const nonStuntingCases = totalChildren - stuntingCases;
    
    const todayData = filteredChildren.filter(child => 
      new Date(child.created_at).toDateString() === currentDate.toDateString()
    ).length;

    // Calculate changes (compared to previous period)
    const prevTotal = previousDeduped.length;
    const prevStunting = previousDeduped.filter(c => c.stunting).length;
    const prevNonStunting = prevTotal - prevStunting;

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? '+100' : '0';
      const change = ((current - previous) / previous * 100).toFixed(1);
      return change.startsWith('-') ? change : `+${change}`;
    };

    const totalChange = calculateChange(totalChildren, prevTotal);
    const stuntingChange = calculateChange(stuntingCases, prevStunting);
    const nonStuntingChange = calculateChange(nonStuntingCases, prevNonStunting);
    
    // Today's data change
    const yesterdayData = filteredChildren.filter(child => {
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      return new Date(child.created_at).toDateString() === yesterday.toDateString();
    }).length;
    const todayChange = calculateChange(todayData, yesterdayData);

    // Calculate breast feeding rate
    const breastFeedingCount = allDeduped.filter(c => c.breast_feeding).length;
    const breastFeedingRate = totalChildren > 0 
      ? ((breastFeedingCount / totalChildren) * 100).toFixed(1)
      : '0';

    // Stunting rate
    const stuntingRate = totalChildren > 0
      ? ((stuntingCases / totalChildren) * 100).toFixed(1)
      : '0';

    // Get high risk areas (need address data)
    const { data: childrenWithAddress } = await supabase
      .from('children_data')
      .select(`
        id,
        nik,
        stunting,
        created_at,
        alamat:alamat_id (
          state,
          city
        )
      `)
      .not('alamat_id', 'is', null);

    // Deduplicate with address
    const dedupedWithAddress = deduplicateByNIK(childrenWithAddress || []);

    // Group by province
    const provinceStats = dedupedWithAddress.reduce((acc: any, child: any) => {
      if (!child.alamat) return acc;
      
      const province = child.alamat.state;
      if (!acc[province]) {
        acc[province] = { total: 0, stunting: 0 };
      }
      acc[province].total++;
      if (child.stunting) acc[province].stunting++;
      return acc;
    }, {});

    const highRiskAreas = Object.entries(provinceStats)
      .map(([province, stats]: [string, any]) => ({
        province,
        rate: ((stats.stunting / stats.total) * 100).toFixed(1),
        total: stats.total,
        stunting: stats.stunting
      }))
      .filter(area => parseFloat(area.rate) > 30)
      .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
      .slice(0, 5);

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);

      const monthData = filteredChildren.filter(child => {
        const createdDate = new Date(child.created_at);
        return createdDate >= monthStart && createdDate <= monthEnd;
      });

      const monthDeduped = deduplicateByNIK(monthData);
      const monthStunting = monthDeduped.filter(c => c.stunting).length;
      const monthTotal = monthDeduped.length;

      monthlyTrend.push({
        month: monthDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        total: monthTotal,
        stunting: monthStunting,
        rate: monthTotal > 0 ? ((monthStunting / monthTotal) * 100).toFixed(1) : '0'
      });
    }

    return NextResponse.json({
      overview: {
        totalChildren: { value: totalChildren, change: totalChange },
        stuntingCases: { value: stuntingCases, change: stuntingChange },
        nonStuntingCases: { value: nonStuntingCases, change: nonStuntingChange },
        todayData: { value: todayData, change: todayChange },
      },
      analysis: {
        stuntingRate,
        breastFeedingRate,
        period: `${periodDays} hari terakhir`,
      },
      highRiskAreas,
      monthlyTrend,
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

