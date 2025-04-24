import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Line, Doughnut } from 'react-chartjs-2';
import { BarChart2, Activity, FileText, Download, Settings, Menu, X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MarketHubActions from '../../components/MarketHubActions';
import { WithdrawalModal } from '../../components/WithdrawalModal';
import { DepositModal } from '../../components/DepositModal';
import { InstrumentList } from '../../components/InstrumentList';
import { getAccountValueChartData, accountValueChartOptions } from '../../config/charts/accountValueChart';
import { PerformanceView } from '../../components/PerformanceView';
import { ActivityView } from '../../components/ActivityView';
import { StatementsView } from '../../components/StatementsView';
import { AccountSettings } from '../../components/AccountSettings';
import { useTheme } from '../../contexts/ThemeContext';
import { useAccountInstruments } from '../../hooks/useAccounts';
import type { Account } from '../../types/account';

interface MarketHubAccountProps {
  account: Account;
  embedded?: boolean;
  enabledSections?: string[];
  initialTab?: string;
  openWithdrawalAccounts?: boolean;
}

export function MarketHubAccount({ 
  account,
  embedded = false,
  enabledSections = [],
  initialTab = 'summary',
  openWithdrawalAccounts = false
}: MarketHubAccountProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || initialTab);
  const [activeSummaryTab, setActiveSummaryTab] = useState('evolution');
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const { data: instruments = [] } = useAccountInstruments(account.id);

  // Sync URL params with active tab
  useEffect(() => {
    if (!embedded) {
      const currentTab = searchParams.get('tab');
      if (currentTab !== activeTab) {
        setSearchParams({ tab: activeTab }, { replace: true });
      }
    }
  }, [activeTab, embedded]);

  // Handle withdrawal modal reopening after adding an account
  const handleWithdrawalAccountsClose = () => {
    const savedState = sessionStorage.getItem('withdrawalModalState');
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.returnToWithdrawal) {
        sessionStorage.removeItem('withdrawalModalState');
        setIsWithdrawalModalOpen(true);
      }
    }
  };

  const handleAddAccount = () => {
    setIsWithdrawalModalOpen(false);
    setActiveTab('settings');
    
    // Update URL to reflect the settings tab and withdrawal accounts modal state
    if (!embedded) {
      setSearchParams({ 
        tab: 'settings', 
        openWithdrawalAccounts: 'true' 
      }, { replace: true });
    }
  };

  const periods = [
    { label: '1M', value: '1M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'Max', value: 'Max' },
  ];

  const allTabs = [
    { id: 'summary', label: t('account.tabs.summary'), icon: BarChart2 },
    { id: 'performance', label: t('account.tabs.performance'), icon: Activity },
    { id: 'activity', label: t('account.tabs.activity'), icon: FileText },
    { id: 'statements', label: t('account.tabs.statements'), icon: Download },
    { id: 'settings', label: t('account.tabs.settings'), icon: Settings }
  ];

  const navigationTabs = enabledSections.length === 0 
    ? allTabs 
    : allTabs.filter(tab => tab.id === 'summary' || enabledSections.includes(tab.id));

  const summaryTabs = [
    { id: 'evolution', label: t('account.evolution') },
    { id: 'composition', label: t('account.composition') },
  ];

  const handleFundingAction = (action: 'deposit' | 'withdraw') => {
    if (action === 'withdraw') {
      setIsWithdrawalModalOpen(true);
    } else {
      setIsDepositModalOpen(true);
    }
  };

  const isEnabled = (sectionId: string) => {
    return enabledSections.length === 0 || enabledSections.includes(sectionId);
  };

  const handleAction = (action: string) => {
    console.log('Action:', action);
  };

  const handleInstrumentClick = (instrument: any) => {
    console.log('Instrument clicked:', instrument);
  };

  const handleInstrumentAction = (action: string, instrument: any) => {
    console.log('Instrument action:', action, instrument);
  };

  const donutData = {
    labels: instruments.map(instrument => instrument.symbol),
    datasets: [
      {
        data: instruments.map(instrument => instrument.percentage),
        backgroundColor: [
          `rgba(${colorTheme.colors.primaryRgb}, 0.8)`,
          `rgba(${colorTheme.colors.secondaryRgb}, 0.8)`,
          `rgba(${colorTheme.colors.accentRgb}, 0.8)`,
        ],
        borderWidth: 0,
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}%`
        }
      }
    }
  };

  const activeTabData = navigationTabs.find(tab => tab.id === activeTab);
  const showNavigation = isEnabled('navigation');
  const showFundingButtons = isEnabled('funding-buttons');

  return (
    <div className="space-y-6">
      {/* Mobile Menu Button - Only show if navigation is enabled */}
      {showNavigation && (
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="flex items-center space-x-2">
              {activeTabData?.icon && <activeTabData.icon className="w-5 h-5" />}
              <span>{activeTabData?.label}</span>
            </div>
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 w-full px-4 py-3 text-left ${
                      activeTab === tab.id
                        ? 'bg-gray-100 dark:bg-gray-700 text-theme-primary dark:text-theme-accent'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              {showFundingButtons && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleFundingAction('deposit')}
                      className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-secondary transition-colors text-sm font-medium"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <ArrowDownCircle className="w-4 h-4" />
                        <span>{t('dashboard.deposit')}</span>
                      </div>
                    </button>
                    {account.funded && (
                      <button
                        onClick={() => handleFundingAction('withdraw')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <ArrowUpCircle className="w-4 h-4" />
                          <span>{t('dashboard.withdraw')}</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Desktop Navigation */}
      {showNavigation && (
        <div className="hidden lg:block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-1">
                {navigationTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-theme-primary text-theme-primary dark:text-theme-accent dark:border-theme-accent'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {showFundingButtons && (
                <div className="flex items-center gap-2 px-4">
                  <button
                    onClick={() => handleFundingAction('deposit')}
                    className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-secondary transition-colors text-sm font-medium"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowDownCircle className="w-4 h-4" />
                      <span>{t('dashboard.deposit')}</span>
                    </div>
                  </button>
                  {account.funded && (
                    <button
                      onClick={() => handleFundingAction('withdraw')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <ArrowUpCircle className="w-4 h-4" />
                        <span>{t('dashboard.withdraw')}</span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Account Value Chart */}
          {isEnabled('summary-graph') && (
            <div className="col-span-12 lg:col-span-8 bg-white dark:bg-gray-800 rounded-lg shadow">
              {!account.funded ? (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
                    <BarChart2 className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('dashboard.unfundedAccount')}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {t('dashboard.fundAccountMessage')}
                  </p>
                  <button
                    onClick={() => handleFundingAction('deposit')}
                    className="inline-flex items-center px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-secondary transition-colors"
                  >
                    {t('dashboard.deposit')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex">
                      {summaryTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSummaryTab(tab.id)}
                          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeSummaryTab === tab.id
                              ? 'border-theme-primary text-theme-primary'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    {activeSummaryTab === 'evolution' ? (
                      <>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {t('account.accountValue')}
                            </h3>
                            <div>
                              <p className="text-2xl font-bold text-theme-primary dark:text-theme-accent">
                                ${account.value.toLocaleString()}
                              </p>
                              <p className={`text-sm ${
                                account.performance.total >= 0 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {account.performance.total >= 0 ? '+' : ''}
                                ${account.performance.total.toLocaleString()} ({account.performance.percentage}%)
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
                        <div className="w-full h-[300px] sm:h-[350px]">
                          <Line data={getAccountValueChartData(colorTheme)} options={accountValueChartOptions} />
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative h-64 min-h-[16rem]">
                          <Doughnut data={donutData} options={donutOptions} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {instruments.length}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Posiciones
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-3 py-4">
                          {instruments.map((instrument, index) => (
                            <div key={instrument.symbol} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{ 
                                    backgroundColor: [
                                      `rgba(${colorTheme.colors.primaryRgb}, 0.8)`,
                                      `rgba(${colorTheme.colors.secondaryRgb}, 0.8)`,
                                      `rgba(${colorTheme.colors.accentRgb}, 0.8)`,
                                    ][index]
                                  }}
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {instrument.symbol}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {instrument.name}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-theme-primary dark:text-theme-accent">
                                  {instrument.percentage.toFixed(2)}%
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ${instrument.value.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Market Hub Actions */}
          {isEnabled('summary-actions') && (
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Market Hub
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {account.id} • {account.alias}
                  </p>
                  {account.buyingPower !== undefined && (
                    <p className="text-sm text-theme-primary dark:text-theme-accent mt-1">
                      {t('account.buyingPower')}: ${account.buyingPower.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="p-4">
                  <MarketHubActions onAction={handleAction} />
                </div>
              </div>
            </div>
          )}

          {/* Instruments List */}
          {isEnabled('summary-instruments') && account.funded && (
            <div className="col-span-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {t('account.assetAllocation')}
                </h3>
                <InstrumentList
                  accountId={account.id}
                  onInstrumentClick={handleInstrumentClick}
                  type="MARKET_HUB"
                  onInstrumentAction={handleInstrumentAction}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show other tabs content */}
      {activeTab === 'performance' && isEnabled('performance') && (
        <PerformanceView 
          accountId={account.id}
          hasFunds={account.funded}
          hasData={account.funded}
        />
      )}
      {activeTab === 'activity' && isEnabled('activity') && (
        <ActivityView 
          accountId={account.id}
          hasFunds={account.funded}
          hasData={account.funded}
        />
      )}
      {activeTab === 'statements' && isEnabled('statements') && (
        <StatementsView 
          accountId={account.id}
          hasFunds={account.funded}
          hasData={account.funded}
        />
      )}
      {activeTab === 'settings' && (
        <AccountSettings 
          account={account} 
          onWithdrawalAccountsClose={handleWithdrawalAccountsClose}
          openWithdrawalAccounts={openWithdrawalAccounts || searchParams.get('openWithdrawalAccounts') === 'true'}
        />
      )}

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        accountId={account.id}
        accountAlias={account.alias}
        maxAmount={account.buyingPower || 0}
        onAddAccount={handleAddAccount}
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        accountId={account.id}
        accountHolder={account.alias}
      />
    </div>
  );
}