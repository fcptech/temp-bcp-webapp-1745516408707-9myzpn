import React from 'react';
import { Skeleton } from './Skeleton';

export function StatementsViewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {['statements', 'tax'].map((tab) => (
            <Skeleton key={tab} className="flex-1 h-10" />
          ))}
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-start gap-3">
                <div className="text-center min-w-[3rem]">
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8" variant="rectangular" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}