'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DistributionPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the hierarchical distribution view
    router.push('/dashboard/distribution/all');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading distribution map...</p>
      </div>
    </div>
  );
} 