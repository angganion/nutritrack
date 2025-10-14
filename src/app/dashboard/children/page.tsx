import { DataTable } from '@/components/dashboard/data-table';
import { PlusCircle } from 'lucide-react';

export default function ChildrenPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Anak</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar anak yang dipantau (unique by NIK)</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-700 hover:to-blue-700 transition-all duration-200">
          <PlusCircle className="h-4 w-4" />
          Tambah Data
        </button>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <div className="p-6">
          <DataTable />
        </div>
      </div>
    </div>
  );
}