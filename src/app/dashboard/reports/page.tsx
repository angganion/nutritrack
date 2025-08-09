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
          <button className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
                          <Printer className="mr-2 h-5 w-5 text-gray-600" />
            Print
          </button>
          <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            <Download className="mr-2 h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.name}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <report.icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Terakhir dibuat: {new Date(report.lastGenerated).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">{report.description}</p>
            <div className="mt-4 flex space-x-3">
              <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                Preview
              </button>
              <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}