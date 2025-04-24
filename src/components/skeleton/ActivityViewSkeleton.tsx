import React from 'react';
import { Skeleton } from './Skeleton';

export function ActivityViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <Skeleton className="h-6 w-8 mb-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}