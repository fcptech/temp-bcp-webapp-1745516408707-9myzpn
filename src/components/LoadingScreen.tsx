import React from 'react';
import { BarChart2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-theme-accent/10 dark:bg-theme-accent/20 rounded-full mb-4">
          <BarChart2 className="w-8 h-8 text-theme-accent animate-pulse" />
        </div>
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
}