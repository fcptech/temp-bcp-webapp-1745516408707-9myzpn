import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '../layouts/MainLayout';
import { getDashboardChartData, dashboardChartOptions } from '../config/charts/dashboardChart';
import { useTheme } from '../contexts/ThemeContext';
import type { Account } from '../types/account';
import { useAccounts } from '../hooks/useAccounts';
import { usePortfolio } from '../hooks/useAccounts';

interface DashboardProps {
  embedded?: boolean;
  enabledSections?: string[];
}

const periods = [
  { label: '1M', value: '1M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
  { label: 'Max', value: 'Max' },
];

export default function Dashboard({ embedded = false, enabledSections }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const { data: accounts = [] } = useAccounts();

  const isEnabled = (sectionId: string) => {
    return !enabledSections || enabledSections.includes(sectionId);
  };

  const accountColors = [
    `rgba(${colorTheme.colors.primaryRgb}, 0.8)`,
    `rgba(${colorTheme.colors.secondaryRgb}, 0.8)`,
    `rgba(${colorTheme.colors.accentRgb}, 0.8)`,
    `rgba(${colorTheme.colors.primaryRgb}, 0.4)`,
    `rgba(${colorTheme.colors.secondaryRgb}, 0.4)`,
  ];

  const distributionData = {
    labels: accounts.map(account => `${account.id} - ${account.alias}`),
    datasets: [{
      data: accounts.map(account => account.percentage),
      backgroundColor: accountColors,
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const distributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: (context: any) => {
            const account = accounts[context.dataIndex];
            return `${account.id} - ${account.alias}: $${account.value.toLocaleString()} (${account.percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    elements: {
      arc: {
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff'
      }
    }
  };

  const totalValue = accounts.reduce((sum, account) => sum + account.value, 0);

  const handleFundingAction = (action: 'deposit' | 'withdraw', accountId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${action} for account:`, accountId);
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'AUTOMATED_INVESTMENT':
        return t('withdrawalAccounts.accountType.automatedInvestment');
      case 'MARKET_HUB':
        return 'Market Hub';
      default:
        return type;
    }
  };

  const AccountItem = ({ account, index }: { account: Account; index: number }) => {
    const { data: portfolio } = usePortfolio(account.id);
    const showPortfolio = account.type === 'AUTOMATED_INVESTMENT' && portfolio;

    const content = (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-16 rounded-sm"
            style={{ backgroundColor: accountColors[index] }}
          />
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {getAccountTypeLabel(account.type)}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {account.id} • {account.alias}
            </p>
            {account.type === 'MARKET_HUB' && account.buyingPower !== undefined && account.funded && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('account.buyingPower')}: ${account.buyingPower.toLocaleString()}
              </p>
            )}
            {showPortfolio && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <p className="font-medium text-theme-primary dark:text-theme-accent">
                  {portfolio.name}
                </p>
                <p>BlackRock Long-Horizon</p>
              </div>
            )}
            {!account.funded && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                {t('dashboard.unfundedAccount')}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
          <div className="text-right">
            <p className="text-lg font-semibold text-theme-primary dark:text-theme-accent">
              ${account.value.toLocaleString()}
            </p>
            {account.funded && (
              <p className={`text-sm ${
                account.performance.total >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {account.performance.total >= 0 ? '+' : ''}
                ${account.performance.total.toLocaleString()} ({account.performance.percentage}%)
              </p>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={(e) => handleFundingAction('deposit', account.id, e)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !account.funded
                  ? 'bg-theme-primary text-white hover:bg-theme-secondary'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('dashboard.deposit')}
            </button>
            {account.funded && (
              <button
                onClick={(e) => handleFundingAction('withdraw', account.id, e)}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
              >
                {t('dashboard.withdraw')}
              </button>
            )}
          </div>
        </div>
      </div>
    );

    if (embedded) {
      return (
        <div className="block p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          {content}
        </div>
      );
    }

    return (
      <Link
        to={`/account/${account.id}`}
        className="block p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {content}
      </Link>
    );
  };

  return (
    <MainLayout title={t('dashboard.title')} embedded={embedded}>
      <div className="space-y-8">
        {/* Investment Summary and Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investment Summary */}
          {isEnabled('summary') && (
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('dashboard.summary')}
                    </h3>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.totalCurrent')}</p>
                      <p className="text-2xl font-bold text-theme-primary dark:text-theme-accent">
                        ${totalValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto mt-4 sm:mt-0">
                    {periods.map((period) => (
                      <button
                        key={period.value}
                        onClick={() => setSelectedPeriod(period.value)}
                        className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded transition-colors ${
                          selectedPeriod === period.value
                            ? 'bg-theme-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="w-full h-[300px] sm:h-[350px]">
                  <Line data={getDashboardChartData(colorTheme)} options={dashboardChartOptions} />
                </div>
              </div>
            </div>
          )}

          {/* Account Distribution */}
          {isEnabled('distribution') && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Account Distribution
              </h3>
              <div className="relative h-[200px] sm:h-[250px]">
                <Doughnut data={distributionData} options={distributionOptions} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {accounts.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Accounts
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {accounts.map((account, index) => (
                  <div key={account.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: accountColors[index] }}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {account.id} - {account.alias}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getAccountTypeLabel(account.type)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-theme-primary dark:text-theme-accent">
                      ${account.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Investment Accounts */}
        {isEnabled('accounts') && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.accounts')}
                </h3>
                {!embedded && (
                  <button className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-secondary transition-colors w-full sm:w-auto">
                    {t('dashboard.openAccount')}
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {accounts.map((account, index) => (
                <AccountItem key={account.id} account={account} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}