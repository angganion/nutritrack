import { StuntingPrevalenceChart } from '@/components/dashboard/stunting-prevalence-chart';
import { AgeDistributionChart } from '@/components/dashboard/age-distribution-chart';
import { DistributionChart } from '@/components/dashboard/distribution-chart';
import { TrendingUp, TrendingDown, MapPin, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStatisticsData() {
  try {
    // Get base URL - use relative for server components
    const isServer = typeof window === 'undefined';
    let baseUrl = '';
    
    if (isServer) {
      // On server (build/runtime), construct full URL
      if (process.env.NEXT_PUBLIC_APP_URL) {
        baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      } else if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      } else {
        baseUrl = 'http://localhost:3000';
      }
    }
    
    const response = await fetch(`${baseUrl}/api/dashboard/stats?period=30`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch statistics:', response.status, response.statusText);
      return null;
    }
    return await response.json();
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