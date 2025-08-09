import { DataTable } from '@/components/dashboard/data-table';
import { PlusCircle } from 'lucide-react';

export default function ChildrenPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Data Anak</h1>
        <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          <PlusCircle className="mr-2 h-5 w-5" />
          Tambah Data
        </button>
      </div>

      <div className="rounded-lg bg-white shadow-lg">
        <div className="p-6">
          <DataTable />
        </div>
      </div>
    </div>
  );
}