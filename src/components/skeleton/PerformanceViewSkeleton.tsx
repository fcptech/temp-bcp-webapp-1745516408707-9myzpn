import React from 'react';
import { Skeleton } from './Skeleton';

export function PerformanceViewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <Skeleton className="h-5 w-32 mx-auto mb-2" />
          <Skeleton className="h-8 w-40 mx-auto mb-2" />
          <div className="flex items-center justify-center gap-2 mt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-48 mx-auto mt-2" />
        </div>
        <Skeleton className="h-64 w-full" variant="rectangular" />
      </div>

      {/* Historical Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-16" />
            ))}
          </div>
        </div>
        <Skeleton className="h-64 w-full mb-6" variant="rectangular" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}