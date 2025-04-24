import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { EmptyStateMessage } from './EmptyStateMessage';

interface Transaction {
  date: string;
  type: 'RETIRO' | 'DEPÓSITO';
  accountId: string;
  alias: string;
  amount: number;
  status: 'Cancelado' | 'Completado';
  reason?: string;
  comment?: string;
}

// Mock transactions for both accounts
const mockTransactions: Record<string, Transaction[]> = {
  'U13186484': [
    {
      date: '2024-11-06',
      type: 'RETIRO',
      accountId: 'U13186484',
      alias: 'Joaco',
      amount: -10.00,
      status: 'Cancelado',
      reason: 'Necesidad de liquidez',
      comment: 'Test'
    },
    {
      date: '2024-09-04',
      type: 'RETIRO',
      accountId: 'U13186484',
      alias: 'Joaco',
      amount: -500.00,
      status: 'Cancelado',
      reason: 'Necesidad de liquidez',
      comment: 'Retiro parcial'
    },
    {
      date: '2024-07-26',
      type: 'DEPÓSITO',
      accountId: 'U13186484',
      alias: 'Joaco',
      amount: 15000.00,
      status: 'Completado'
    }
  ],
  'U15043437': [
    {
      date: '2024-11-05',
      type: 'DEPÓSITO',
      accountId: 'U15043437',
      alias: 'Manu',
      amount: 5000.00,
      status: 'Completado'
    },
    {
      date: '2024-10-15',
      type: 'RETIRO',
      accountId: 'U15043437',
      alias: 'Manu',
      amount: -1000.00,
      status: 'Cancelado',
      reason: 'Gastos personales',
      comment: 'Retiro mensual'
    },
    {
      date: '2024-10-01',
      type: 'DEPÓSITO',
      accountId: 'U15043437',
      alias: 'Manu',
      amount: 10000.00,
      status: 'Completado'
    }
  ]
};

interface ActivityViewProps {
  accountId: string;
  hasFunds: boolean;
  hasData?: boolean;
}

export function ActivityView({ accountId, hasFunds, hasData = true }: ActivityViewProps) {
  const { t } = useTranslation();
  const [expandedTransactionIndex, setExpandedTransactionIndex] = useState<number | null>(null);

  const transactions = mockTransactions[accountId] || [];

  const toggleTransaction = (index: number) => {
    setExpandedTransactionIndex(expandedTransactionIndex === index ? null : index);
  };

  const getTranslatedType = (type: string) => {
    return type === 'RETIRO' ? t('activity.types.withdrawal') : t('activity.types.deposit');
  };

  const getTranslatedStatus = (status: string) => {
    return status === 'Cancelado' ? t('activity.status.cancelled') : t('activity.status.completed');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('es', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    const day = date.getDate().toString().padStart(2, '0');
    return { day, month, year };
  };

  if (!hasFunds || !hasData || transactions.length === 0) {
    return <EmptyStateMessage type="activity" />;
  }

  return (
    <div className="space-y-6">
      {/* Transaction List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((transaction, index) => {
          const { day, month, year } = formatDate(transaction.date);
          return (
            <div key={index} className="transition-all duration-200 ease-in-out">
              {/* Transaction Header */}
              <div 
                className={`p-4 sm:p-6 ${
                  transaction.reason ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
                }`}
                onClick={() => transaction.reason && toggleTransaction(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {day}
                          </div>
                          <div className="text-xs text-gray-500">
                            {month} {year}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {getTranslatedType(transaction.type)}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {transaction.accountId} • {transaction.alias}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          transaction.amount >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          ${Math.abs(transaction.amount).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getTranslatedStatus(transaction.status)}
                        </div>
                      </div>
                    </div>
                    {transaction.reason && (
                      <div className="flex items-center text-xs text-theme-primary dark:text-theme-accent">
                        {expandedTransactionIndex === index ? (
                          <ChevronUp className="w-4 h-4 mr-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 mr-1" />
                        )}
                        {t('activity.details')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {transaction.reason && expandedTransactionIndex === index && (
                <div className="px-6 pb-6 space-y-4 bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">
                      {t('activity.reason')}
                    </label>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">
                      {transaction.reason}
                    </div>
                  </div>

                  {transaction.comment && (
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400">
                        {t('activity.comment')}
                      </label>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white">
                        {transaction.comment}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}