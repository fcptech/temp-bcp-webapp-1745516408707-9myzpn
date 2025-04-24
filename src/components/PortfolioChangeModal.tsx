import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, ArrowRight, Clock, Check, Ban, History } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';
import { portfolioFamilies } from '../mocks/portfolios';
import { mockPortfolioChanges } from '../mocks/portfolioChanges';
import { useCancelPortfolioChange } from '../hooks/usePortfolioChanges';
import type { Portfolio, PortfolioChange } from '../types/portfolio';

interface PortfolioChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (portfolioId: string) => void;
  currentPortfolio: Portfolio;
  pendingChange?: PortfolioChange;
  accountId: string;
}

export function PortfolioChangeModal({ 
  isOpen, 
  onClose, 
  onSave,
  currentPortfolio,
  pendingChange,
  accountId
}: PortfolioChangeModalProps) {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'change' | 'history'>('change');
  const [selectedFamilyId, setSelectedFamilyId] = useState(portfolioFamilies[0].id);
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState(0);
  const cancelChange = useCancelPortfolioChange();

  if (!isOpen) return null;

  const selectedFamily = portfolioFamilies.find(f => f.id === selectedFamilyId)!;
  const selectedPortfolio = selectedFamily.portfolios[selectedPortfolioIndex];

  const navigatePortfolio = (direction: 'prev' | 'next') => {
    const totalPortfolios = selectedFamily.portfolios.length;
    setSelectedPortfolioIndex(current => {
      if (direction === 'next') {
        return (current + 1) % totalPortfolios;
      } else {
        return (current - 1 + totalPortfolios) % totalPortfolios;
      }
    });
  };

  const handleCancelChange = async () => {
    if (!pendingChange) return;
    
    try {
      await cancelChange.mutateAsync({
        accountId,
        changeId: pendingChange.id
      });
      onClose();
    } catch (error) {
      console.error('Failed to cancel portfolio change:', error);
    }
  };

  const getDonutData = (portfolio: Portfolio) => ({
    labels: portfolio.allocation.map(asset => asset.name),
    datasets: [
      {
        data: portfolio.allocation.map(asset => asset.percentage),
        backgroundColor: portfolio.allocation.map(asset => asset.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ]
  });

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return ` ${label}: ${value}%`;
          },
          labelColor: function(context: any) {
            return {
              backgroundColor: selectedPortfolio.allocation[context.dataIndex].color,
              borderColor: selectedPortfolio.allocation[context.dataIndex].color,
            };
          },
        },
      },
    },
  };

  const getStatusColor = (status: PortfolioChange['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400';
      case 'in_progress':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: PortfolioChange['status']) => {
    switch (status) {
      case 'completed':
        return Check;
      case 'cancelled':
        return Ban;
      default:
        return Clock;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl rounded-lg bg-white dark:bg-gray-800 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('portfolio.changePortfolio')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('change')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'change'
                    ? 'border-theme-primary text-theme-primary dark:text-theme-accent dark:border-theme-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {t('portfolio.changePortfolio')}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-theme-primary text-theme-primary dark:text-theme-accent dark:border-theme-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {t('portfolio.history.title')}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === 'change' ? (
              pendingChange ? (
                /* Show Current and Future Portfolio View */
                <div className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">{t('portfolio.changeInProgress')}</span>
                        </div>
                        <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                          {t('portfolio.requestedOn')} {formatDate(pendingChange.requestDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Portfolio */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {t('portfolio.currentPortfolioTitle')}
                      </h3>
                      <div className="relative h-48">
                        <Doughnut 
                          data={getDonutData(pendingChange.fromPortfolio)} 
                          options={donutOptions}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-base text-gray-900 dark:text-white">
                              <span className="font-medium">{pendingChange.fromPortfolio.stocksPercentage}% {t('portfolio.stocks')}</span>
                              <br />
                              <span className="font-medium">{pendingChange.fromPortfolio.bondsPercentage}% {t('portfolio.bonds')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        {pendingChange.fromPortfolio.allocation.map((asset) => (
                          <div key={asset.symbol} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: asset.color }}
                              />
                              <span className="text-xs text-gray-600 dark:text-gray-300">
                                {asset.symbol} - {asset.name}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-theme-primary dark:text-theme-accent">
                              {asset.percentage.toFixed(2)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Future Portfolio */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {t('portfolio.futurePortfolioTitle')}
                      </h3>
                      <div className="relative h-48">
                        <Doughnut 
                          data={getDonutData(pendingChange.toPortfolio)} 
                          options={donutOptions}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-base text-gray-900 dark:text-white">
                              <span className="font-medium">{pendingChange.toPortfolio.stocksPercentage}% {t('portfolio.stocks')}</span>
                              <br />
                              <span className="font-medium">{pendingChange.toPortfolio.bondsPercentage}% {t('portfolio.bonds')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        {pendingChange.toPortfolio.allocation.map((asset) => (
                          <div key={asset.symbol} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: asset.color }}
                              />
                              <span className="text-xs text-gray-600 dark:text-gray-300">
                                {asset.symbol} - {asset.name}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-theme-primary dark:text-theme-accent">
                              {asset.percentage.toFixed(2)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCancelChange}
                    disabled={cancelChange.isPending}
                    className="w-full mt-6 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {cancelChange.isPending ? t('portfolio.cancelling') : t('portfolio.cancel')}
                  </button>
                </div>
              ) : (
                /* Portfolio Selection View */
                <>
                  {/* Portfolio Families */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
                    {portfolioFamilies.map((family) => (
                      <button
                        key={family.id}
                        onClick={() => {
                          setSelectedFamilyId(family.id);
                          setSelectedPortfolioIndex(0);
                        }}
                        className={`p-3 rounded-lg border transition-colors ${
                          selectedFamilyId === family.id
                            ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-theme-accent dark:hover:border-theme-accent'
                        }`}
                      >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {family.name}
                        </h3>
                      </button>
                    ))}
                  </div>

                  {/* Portfolio Details */}
                  {selectedPortfolio && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-sm text-gray-500 dark:text-gray-400">
                            {t('portfolio.changePortfolioTo')}
                          </h4>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {selectedPortfolio.name}
                          </h3>
                          <h4 className="text-sm text-theme-primary dark:text-theme-accent">
                            {selectedFamily.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => onSave(selectedPortfolio.id)}
                          className="px-4 py-2 bg-theme-primary text-white text-sm rounded-md hover:bg-theme-secondary transition-colors"
                        >
                          {t('common.saveChanges')}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Navigation Arrows and Donut Chart */}
                        <div className="relative h-48">
                          {selectedFamily.portfolios.length > 1 && (
                            <>
                              {/* Left Arrow */}
                              <button
                                onClick={() => navigatePortfolio('prev')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 p-1.5 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                              </button>

                              {/* Right Arrow */}
                              <button
                                onClick={() => navigatePortfolio('next')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 p-1.5 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              >
                                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                              </button>
                            </>
                          )}

                          {/* Donut Chart */}
                          <Doughnut data={getDonutData(selectedPortfolio)} options={donutOptions} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-base text-gray-900 dark:text-white">
                                <span className="font-medium">{selectedPortfolio.stocksPercentage}% {t('portfolio.stocks')}</span>
                                <br />
                                <span className="font-medium">{selectedPortfolio.bondsPercentage}% {t('portfolio.bonds')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Asset List */}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {selectedPortfolio.allocation.map((asset) => (
                            <div key={asset.symbol} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{ backgroundColor: asset.color }}
                                />
                                <span className="text-xs text-gray-600 dark:text-gray-300">
                                  {asset.symbol} - {asset.name}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-theme-primary dark:text-theme-accent">
                                {asset.percentage.toFixed(2)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )
            ) : (
              /* Portfolio Change History View */
              <div className="space-y-4">
                {!mockPortfolioChanges[accountId] || mockPortfolioChanges[accountId].length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                      <History className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t('portfolio.history.empty.title')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      {t('portfolio.history.empty.description')}
                    </p>
                  </div>
                ) : (
                  mockPortfolioChanges[accountId].map((change) => (
                    <div 
                      key={change.id}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const StatusIcon = getStatusIcon(change.status);
                              return (
                                <StatusIcon 
                                  className={`w-5 h-5 ${getStatusColor(change.status)}`} 
                                />
                              );
                            })()}
                            <span className={`font-medium ${getStatusColor(change.status)}`}>
                              {t(`portfolio.status.${change.status}`)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t('portfolio.requestedOn')} {formatDate(change.requestDate)}
                          </p>
                          {change.completionDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t('portfolio.completedOn')} {formatDate(change.completionDate)}
                            </p>
                          )}
                        </div>
                        {(change.status === 'pending' || change.status === 'in_progress') && (
                          <button
                            onClick={() => handleCancelChange()}
                            disabled={cancelChange.isPending}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {cancelChange.isPending ? t('portfolio.cancelling') : t('portfolio.cancel')}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {change.fromPortfolio.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {change.fromPortfolio.stocksPercentage}% {t('portfolio.stocks')}, {change.fromPortfolio.bondsPercentage}% {t('portfolio.bonds')}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {change.toPortfolio.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {change.toPortfolio.stocksPercentage}% {t('portfolio.stocks')}, {change.toPortfolio.bondsPercentage}% {t('portfolio.bonds')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {activeTab === 'change' && !pendingChange && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {selectedFamily.portfolios.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i === selectedPortfolioIndex
                          ? 'bg-theme-primary dark:bg-theme-accent'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}