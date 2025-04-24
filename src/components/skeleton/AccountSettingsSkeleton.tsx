import React from 'react';
import { Skeleton } from './Skeleton';

export function AccountSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-48 mb-2" />
        </div>
        <div className="p-6 space-y-6">
          {/* Account Details */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-2" variant="circular" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          ))}

          {/* Withdrawal Accounts Management */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Skeleton className="h-4 w-64 mb-2" />
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10" variant="rectangular" />
                  <div>
                    <Skeleton className="h-5 w-48 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Documents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-3" />
                  <div>
                    <Skeleton className="h-5 w-48 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2].map((i) => (
            <div key={i} className="p-6">
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-3" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}