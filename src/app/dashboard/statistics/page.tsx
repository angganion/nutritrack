import { StuntingChart } from '@/components/dashboard/stunting-chart';
import { DistributionChart } from '@/components/dashboard/distribution-chart';

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Statistik Stunting</h1>
        <div className="flex items-center space-x-4">
          <select className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option>7 Hari Terakhir</option>
            <option>30 Hari Terakhir</option>
            <option>3 Bulan Terakhir</option>
            <option>1 Tahun Terakhir</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="group relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
          </div>
          
          <div className="relative">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Tren Pertumbuhan</h2>
            <StuntingChart />
          </div>
          
          {/* Subtle accent line */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <div className="group relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
          </div>
          
          <div className="relative">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Distribusi Status</h2>
            <DistributionChart />
          </div>
          
          {/* Subtle accent line */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        <div className="relative">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Analisis Faktor Risiko</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Gizi Buruk', value: '15%', change: '+2.3%', status: 'negative', color: 'red' },
              { label: 'ASI Eksklusif', value: '78%', change: '+5.1%', status: 'positive', color: 'green' },
              { label: 'Imunisasi Lengkap', value: '92%', change: '+1.2%', status: 'positive', color: 'blue' },
              { label: 'Sanitasi Buruk', value: '8%', change: '-3.4%', status: 'positive', color: 'orange' },
            ].map((stat) => (
              <div key={stat.label} className={`group/card relative overflow-hidden rounded-lg border border-${stat.color}-200 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md`}>
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 opacity-0 transition-opacity duration-300 group-hover/card:opacity-5`} />
                
                <div className="relative">
                  <h3 className="text-sm font-medium text-gray-600 group-hover/card:text-gray-800 transition-colors duration-300">{stat.label}</h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900 group-hover/card:text-gray-950 transition-colors duration-300">{stat.value}</p>
                    <p
                      className={`ml-2 text-sm font-medium ${
                        stat.status === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
                
                {/* Subtle accent line */}
                <div className={`absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100`} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Subtle accent line */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  );
}