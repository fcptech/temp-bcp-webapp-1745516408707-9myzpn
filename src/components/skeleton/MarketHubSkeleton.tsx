import React from 'react';
import { Skeleton } from './Skeleton';

export function MarketHubSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Account Value Chart */}
      <div className="col-span-12 lg:col-span-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="flex-1 h-10" />
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <div>
                <Skeleton className="h-8 w-40 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-16 flex-1 sm:flex-none" />
              ))}
            </div>
          </div>
          <Skeleton className="h-[300px] sm:h-[350px] w-full" variant="rectangular" />
        </div>
      </div>

      {/* Market Hub Actions */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="p-4 space-y-4">
            {/* Buy/Sell Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-full mx-auto mb-3" />
                  <div className="text-center">
                    <Skeleton className="h-5 w-24 mx-auto mb-1" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div className="col-span-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8" variant="rectangular" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}