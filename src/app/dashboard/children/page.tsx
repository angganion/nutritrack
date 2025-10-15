import { DataTable } from '@/components/dashboard/data-table';

export default function ChildrenPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Anak</h1>
        <p className="text-sm text-slate-500 mt-1">Daftar anak yang dipantau (unique by NIK)</p>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <div className="p-6">
          <DataTable />
        </div>
      </div>
    </div>
  );
}