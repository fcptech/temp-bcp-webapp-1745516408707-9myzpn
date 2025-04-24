import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useTranslation } from 'react-i18next';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'error' | 'warning';
  module: string;
  message: string;
  details?: any;
}

export default function Debug() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Listen for debug events
    const handleDebugEvent = (event: CustomEvent<LogEntry>) => {
      setLogs(prev => [...prev, event.detail].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    };

    window.addEventListener('debug:log' as any, handleDebugEvent);

    return () => {
      window.removeEventListener('debug:log' as any, handleDebugEvent);
    };
  }, []);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  return (
    <MainLayout title="Debug">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Debug Log</h2>
          </div>
          <div className="p-4">
            {logs.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No logs available. Perform some actions to see debug information.
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`font-medium ${getLogColor(log.type)}`}>
                        {log.module}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {log.message}
                    </div>
                    {log.details && (
                      <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}