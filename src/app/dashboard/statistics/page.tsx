import { StuntingChart } from '@/components/dashboard/stunting-chart';
import { DistributionChart } from '@/components/dashboard/distribution-chart';

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Statistik Stunting</h1>
        <div className="flex items-center space-x-4">
          <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>7 Hari Terakhir</option>
            <option>30 Hari Terakhir</option>
            <option>3 Bulan Terakhir</option>
            <option>1 Tahun Terakhir</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Tren Pertumbuhan</h2>
          <StuntingChart />
        </div>
        
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Distribusi Status</h2>
          <DistributionChart />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Analisis Faktor Risiko</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Gizi Buruk', value: '15%', change: '+2.3%', status: 'negative', color: 'red' },
            { label: 'ASI Eksklusif', value: '78%', change: '+5.1%', status: 'positive', color: 'green' },
            { label: 'Imunisasi Lengkap', value: '92%', change: '+1.2%', status: 'positive', color: 'blue' },
            { label: 'Sanitasi Buruk', value: '8%', change: '-3.4%', status: 'positive', color: 'orange' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:shadow-sm">
              <h3 className="text-sm font-medium text-gray-700">{stat.label}</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`ml-2 text-sm font-medium ${
                    stat.status === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}