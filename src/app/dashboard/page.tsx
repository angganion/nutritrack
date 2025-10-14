import { OverviewCards } from '@/components/dashboard/overview-cards';
import { StuntingPrevalenceChart } from '@/components/dashboard/stunting-prevalence-chart';
import { AgeDistributionChart } from '@/components/dashboard/age-distribution-chart';
import { DistributionChart } from '@/components/dashboard/distribution-chart';
import { DataTable } from '@/components/dashboard/data-table';
import { DashboardFilters } from '@/components/dashboard/dashboard-filters';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getDashboardStats(province?: string, city?: string) {
  try {
    const params = new URLSearchParams({ period: '30' });
    if (province) params.append('province', province);
    if (city) params.append('city', city);
    
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
    
    const response = await fetch(`${baseUrl}/api/dashboard/stats?${params.toString()}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch dashboard stats:', response.status, response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ province?: string; city?: string }>;
}) {
  const params = await searchParams;
  const dashboardData = await getDashboardStats(params.province, params.city);
  const lastUpdate = dashboardData?.lastUpdated 
    ? new Date(dashboardData.lastUpdated).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : 'N/A';
  
  const highRiskCount = dashboardData?.highRiskAreas?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Stunting</h1>
            <p className="mt-1 text-sm text-slate-500">Ringkasan data pemantauan stunting</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-600">{new Date().toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>
        
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-200/60 hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-900">Sistem Aktif</p>
              <p className="text-xs text-emerald-600">Layanan normal</p>
            </div>
          </div>
          
          <div className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-200/60 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900">Update Terakhir</p>
              <p className="text-xs text-blue-600">{lastUpdate}</p>
            </div>
          </div>
          
          <div className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 border border-amber-200/60 hover:shadow-lg hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-900">Area Prioritas</p>
              <p className="text-xs text-amber-600">{highRiskCount} wilayah</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan Data</h2>
          <div className="text-xs text-slate-500 px-3 py-1 rounded-full bg-slate-100">
            Periode: {dashboardData?.analysis?.period || '30 hari'}
          </div>
        </div>
         <OverviewCards data={dashboardData} />
      </div>
      
      {/* Charts Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Analisis Tren</h2>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Stunting:</span>
              <span className={`font-semibold ${parseFloat(dashboardData?.analysis?.stuntingRate || '0') > 20 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {dashboardData?.analysis?.stuntingRate || '0'}%
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">ASI:</span>
              <span className="font-semibold text-blue-600">
                {dashboardData?.analysis?.breastFeedingRate || '0'}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Tren Prevalensi Stunting</h3>
              <p className="text-xs text-slate-500 mt-1">6 bulan terakhir</p>
            </div>
            <StuntingPrevalenceChart />
          </div>
          
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Distribusi per Kelompok Usia</h3>
              <p className="text-xs text-slate-500 mt-1">Stunting berdasarkan umur</p>
            </div>
            <AgeDistributionChart />
          </div>
        </div>

        {/* Filter Wilayah */}
        <div className="mt-5">
          <DashboardFilters />
        </div>

        {/* Status Distribution */}
        <div className="mt-5 rounded-xl border border-slate-200/60 bg-white p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">Distribusi Status</h3>
            <p className="text-xs text-slate-500 mt-1">Proporsi stunting vs normal</p>
          </div>
          <DistributionChart />
        </div>
      </div>
      
      {/* Data Table */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Data Anak Terbaru</h2>
          <button className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors">
            Lihat Semua
          </button>
        </div>
        
        <div className="rounded-xl border border-slate-200/60 bg-white p-6">
          <DataTable />
        </div>
      </div>
    </div>
  );
}