import React from 'react';
import { Skeleton } from './Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Investment Summary and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Investment Summary */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-8 w-48" />
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-16 flex-1 sm:flex-none" />
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <Skeleton className="h-[300px] sm:h-[350px] w-full" variant="rectangular" />
          </div>
        </div>

        {/* Account Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-[200px] sm:h-[250px] w-full mb-6" variant="rectangular" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-3 w-3 rounded-full mr-2" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Accounts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-full sm:w-40" />
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-2" />
                  <div>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Skeleton className="h-9 w-full sm:w-24" />
                    <Skeleton className="h-9 w-full sm:w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}