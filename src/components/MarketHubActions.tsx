import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, Eye, List, Clock, LineChart } from 'lucide-react';

interface MarketHubActionsProps {
  onAction: (action: string) => void;
}

export function MarketHubActions({ onAction }: MarketHubActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Buy/Sell Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onAction('buy')}
          className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <span className="font-medium">{t('marketHub.actions.buy')}</span>
        </button>
        <button
          onClick={() => onAction('sell')}
          className="flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <span className="font-medium">{t('marketHub.actions.sell')}</span>
        </button>
      </div>

      {/* Other Actions */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            id: 'watchlists',
            icon: Eye,
            label: t('marketHub.actions.watchlists'),
            description: t('marketHub.actions.watchlistsDescription')
          },
          {
            id: 'instruments',
            icon: List,
            label: t('marketHub.actions.instruments'),
            description: t('marketHub.actions.instrumentsDescription')
          },
          {
            id: 'orders',
            icon: Clock,
            label: t('marketHub.actions.orders'),
            description: t('marketHub.actions.ordersDescription')
          },
          {
            id: 'analytics',
            icon: LineChart,
            label: t('marketHub.actions.analytics'),
            description: t('marketHub.actions.analyticsDescription')
          }
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-theme-accent dark:hover:border-theme-accent transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-theme-accent/10 dark:bg-theme-accent/20 mb-3">
                <Icon className="w-6 h-6 text-theme-accent" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {action.label}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MarketHubActions