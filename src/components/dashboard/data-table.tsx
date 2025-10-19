'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Download, ChevronLeft, ChevronRight, Loader2, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { Child, getChildren } from '@/services/child.service';
import { useUser } from '@/contexts/UserContext';

const columnHelper = createColumnHelper<Child>();

const columns = [
  columnHelper.display({
    id: 'nik',
    header: 'NIK',
    cell: (info) => {
      const child = info.row.original;
      const displayValue = child.nik || `ID: ${child.id.slice(0, 8)}`;
      const linkValue = child.nik || child.id;
      return (
        <Link href={`/dashboard/children/${linkValue}`} className="text-blue-600 hover:underline font-medium">
          {displayValue}
        </Link>
      );
    },
  }),
  columnHelper.accessor('gender', {
    header: 'Jenis Kelamin',
    cell: (info) => (info.getValue() === 'male' ? 'Laki-laki' : 'Perempuan'),
  }),
  columnHelper.accessor('age', {
    header: 'Usia (bulan)',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('body_weight', {
    header: 'Berat (kg)',
    cell: (info) => info.getValue().toFixed(1),
  }),
  columnHelper.accessor('body_length', {
    header: 'Tinggi (cm)',
    cell: (info) => info.getValue().toFixed(1),
  }),
  columnHelper.accessor('breast_feeding', {
    header: 'ASI',
    cell: (info) =>
      info.getValue() ? (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
          Ya
        </span>
      ) : (
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          Tidak
        </span>
      ),
  }),
  columnHelper.accessor('stunting', {
    header: 'Status Manual',
    cell: (info) =>
      info.getValue() ? (
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          Stunting
        </span>
      ) : (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
          Normal
        </span>
      ),
  }),
  columnHelper.accessor('image_is_stunting', {
    header: 'Status AI',
    cell: (info) =>
      info.getValue() ? (
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          Stunting
        </span>
      ) : (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
          Normal
        </span>
      ),
  }),
  columnHelper.accessor('created_at', {
    header: 'Tanggal',
    cell: (info) => new Date(info.getValue()).toLocaleDateString('id-ID'),
  }),
];

export function DataTable() {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [genderFilter, setGenderFilter] = React.useState('all');
  const { user } = useUser();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['children-unique', user?.role, user?.kecamatan],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (user?.role) params.append('userRole', user.role);
      if (user?.kecamatan) params.append('userKecamatan', user.kecamatan);
      
      const response = await fetch(`/api/children/unique?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch children');
      return response.json();
    },
  });

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    
    let filtered = [...data];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (statusFilter === 'stunting') return item.stunting;
        if (statusFilter === 'normal') return !item.stunting;
        return true;
      });
    }
    
    if (genderFilter !== 'all') {
      filtered = filtered.filter(item => item.gender === genderFilter);
    }
    
    return filtered;
  }, [data, statusFilter, genderFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-red-600">Gagal memuat data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-600" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan NIK, usia, berat, tinggi..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* Export Button */}
          <button
            type="button"
            className="inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="normal">Normal</option>
            <option value="stunting">Stunting</option>
          </select>
          
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Semua Gender</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
          
          {/* Clear Filters */}
          {(statusFilter !== 'all' || genderFilter !== 'all' || globalFilter) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setGenderFilter('all');
                setGlobalFilter('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-1 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-700' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="flex-shrink-0">
                            {header.column.getIsSorted() === 'desc' ? (
                              <ArrowDown className="h-4 w-4" />
                            ) : header.column.getIsSorted() === 'asc' ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4 opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Menampilkan{' '}
              <span className="font-medium">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{' '}
              sampai{' '}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </span>{' '}
              dari <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> data
              {(statusFilter !== 'all' || genderFilter !== 'all' || globalFilter) && (
                                    <span className="text-gray-600"> (difilter dari {data?.length || 0} total)</span>
              )}
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}