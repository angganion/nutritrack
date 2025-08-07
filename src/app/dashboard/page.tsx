import { OverviewCards } from '@/components/dashboard/overview-cards';
import { StuntingChart } from '@/components/dashboard/stunting-chart';
import { DistributionChart } from '@/components/dashboard/distribution-chart';
import { DataTable } from '@/components/dashboard/data-table';

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-4">
          <img src="/garuda.png" alt="Logo Garuda" className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Pemantauan Stunting</h1>
            <p className="text-sm text-gray-600">Sistem Informasi Pemantauan Tumbuh Kembang Anak</p>
          </div>
        </div>
      </div>
      
      {/* Overview Cards */}
      <OverviewCards />
      
      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 shadow">
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Tren Pertumbuhan</h2>
              <div className="text-xs text-gray-500">Periode: 6 bulan terakhir</div>
            </div>
            <StuntingChart />
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 shadow">
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Distribusi Status Stunting</h2>
              <div className="text-xs text-gray-500">Data terkini</div>
            </div>
            <DistributionChart />
          </div>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 shadow">
        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Data Anak</h2>
            <div className="text-xs text-gray-500">Daftar lengkap data anak</div>
          </div>
          <DataTable />
        </div>
      </div>
    </div>
  );
}