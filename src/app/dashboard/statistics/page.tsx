import { StuntingPrevalenceChart } from '@/components/dashboard/stunting-prevalence-chart';
import { AgeDistributionChart } from '@/components/dashboard/age-distribution-chart';
import { DistributionChart } from '@/components/dashboard/distribution-chart';
import { TrendingUp, TrendingDown, MapPin, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStatisticsData() {
  try {
    const period = '30'; // days
    
    // Build query
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

    const { data: allChildren, error: allError } = await query;

    if (allError) throw allError;

    let filteredChildren = allChildren;

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

    return {
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
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }
}

export default async function StatisticsPage() {
  const statsData = await getStatisticsData();
  
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Statistik</h1>
        <p className="text-sm text-gray-500 mt-1">Analisis data pemantauan stunting</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs text-gray-500">Tingkat Stunting</h3>
            <AlertTriangle className={`h-4 w-4 ${parseFloat(statsData?.analysis?.stuntingRate || '0') > 20 ? 'text-red-600' : 'text-gray-400'}`} />
          </div>
          <p className={`text-2xl font-semibold ${parseFloat(statsData?.analysis?.stuntingRate || '0') > 20 ? 'text-red-600' : 'text-gray-900'}`}>
            {statsData?.analysis?.stuntingRate || '0'}%
          </p>
          <p className="text-xs text-gray-400 mt-1">dari total yang dipantau</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs text-gray-500">ASI Eksklusif</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {statsData?.analysis?.breastFeedingRate || '0'}%
          </p>
          <p className="text-xs text-gray-400 mt-1">anak mendapat ASI</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs text-gray-500">Area Prioritas</h3>
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {statsData?.highRiskAreas?.length || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">wilayah prioritas</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-medium text-gray-900">Tren Prevalensi Stunting</h2>
          <p className="text-xs text-gray-500 mb-4">6 bulan terakhir (target WHO 20%)</p>
          <StuntingPrevalenceChart />
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-medium text-gray-900">Distribusi per Kelompok Usia</h2>
          <p className="text-xs text-gray-500 mb-4">Perbandingan per usia</p>
          <AgeDistributionChart />
        </div>
      </div>

      {/* Overall Distribution */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-medium text-gray-900">Distribusi Status</h2>
        <p className="text-xs text-gray-500 mb-4">Proporsi stunting vs normal</p>
        <DistributionChart />
      </div>

      {/* High Risk Areas */}
      {statsData?.highRiskAreas && statsData.highRiskAreas.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-medium text-gray-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            Wilayah Prioritas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {statsData.highRiskAreas.map((area: any, index: number) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-900">{area.province}</h3>
                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-medium rounded">
                    {area.rate}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {area.stunting} dari {area.total} anak
                </p>
                <p className="text-xs text-red-600 mt-1">Perlu perhatian</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Trend */}
      {statsData?.monthlyTrend && (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-medium text-gray-900">Tren 6 Bulan Terakhir</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Bulan</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">Total</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">Stunting</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">Tingkat</th>
                </tr>
              </thead>
              <tbody>
                {statsData.monthlyTrend.map((month: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-xs text-gray-900">{month.month}</td>
                    <td className="py-2 px-3 text-xs text-gray-900 text-right font-medium">{month.total}</td>
                    <td className="py-2 px-3 text-xs text-gray-900 text-right font-medium">{month.stunting}</td>
                    <td className="py-2 px-3 text-xs text-right">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        parseFloat(month.rate) > 30 ? 'bg-red-50 text-red-700' :
                        parseFloat(month.rate) > 20 ? 'bg-gray-100 text-gray-700' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {month.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}