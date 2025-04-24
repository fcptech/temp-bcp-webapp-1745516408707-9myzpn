import React from 'react';
import { Activity, FileText, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyStateMessageProps {
  type: 'performance' | 'activity' | 'statements';
}

export function EmptyStateMessage({ type }: EmptyStateMessageProps) {
  const { t } = useTranslation();
  
  const config = {
    performance: {
      icon: Activity,
      title: t('common.noData'),
    },
    activity: {
      icon: FileText,
      title: t('common.noData'),
    },
    statements: {
      icon: Download,
      title: t('common.noData'),
    }
  };

  const { icon: Icon, title } = config[type];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
          <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
    </div>
  );
}