import { FileSpreadsheet, Download, Printer } from 'lucide-react';

const reports = [
  {
    name: 'Laporan Bulanan Stunting',
    description: 'Rangkuman data stunting bulanan termasuk statistik dan tren',
    icon: FileSpreadsheet,
    lastGenerated: '2024-03-15',
    color: 'blue',
  },
  {
    name: 'Analisis Faktor Risiko',
    description: 'Analisis mendalam tentang faktor-faktor risiko stunting',
    icon: FileSpreadsheet,
    lastGenerated: '2024-03-14',
    color: 'purple',
  },
  {
    name: 'Laporan Perkembangan Anak',
    description: 'Detail perkembangan setiap anak yang dipantau',
    icon: FileSpreadsheet,
    lastGenerated: '2024-03-13',
    color: 'green',
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <Printer className="mr-2 h-5 w-5 text-gray-400" />
            Print
          </button>
          <button className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
            <Download className="mr-2 h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.name}
            className={`group relative overflow-hidden rounded-xl border border-${report.color}-200 bg-gradient-to-br from-${report.color}-50 to-${report.color}-100 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${report.color}-500 to-${report.color}-600 opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
            </div>
            
            <div className="relative">
              <div className="flex items-center">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-md`}>
                  <report.icon className={`h-6 w-6 text-${report.color}-600 transition-all duration-300 group-hover:scale-110`} aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-950 transition-colors duration-300">{report.name}</h3>
                  <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{report.description}</p>
              <div className="mt-4 flex space-x-3">
                <button className={`inline-flex items-center text-sm font-medium text-${report.color}-600 hover:text-${report.color}-700 transition-colors duration-300`}>
                  Preview
                </button>
                <button className={`inline-flex items-center text-sm font-medium text-${report.color}-600 hover:text-${report.color}-700 transition-colors duration-300`}>
                  Download
                </button>
              </div>
            </div>
            
            {/* Subtle accent line */}
            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-${report.color}-500 to-${report.color}-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
          </div>
        ))}
      </div>
    </div>
  );
}