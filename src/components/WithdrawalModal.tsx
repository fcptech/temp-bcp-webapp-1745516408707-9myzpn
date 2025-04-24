import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight, Plus } from 'lucide-react';
import { useWithdrawalAccounts } from '../hooks/useSettings';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  accountAlias: string;
  maxAmount: number;
  onAddAccount?: () => void;
}

export function WithdrawalModal({ 
  isOpen, 
  onClose, 
  accountId,
  accountAlias,
  maxAmount,
  onAddAccount
}: WithdrawalModalProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(0);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [showReasons, setShowReasons] = useState(false);
  const { data: withdrawalAccounts = [] } = useWithdrawalAccounts(accountId);
  const [selectedAccount, setSelectedAccount] = useState('');

  if (!isOpen) return null;

  const handleAmountChange = (value: string) => {
    // Remove all non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d,]/g, '').replace(',', '.');
    
    // Parse the cleaned value as a number
    let newAmount = parseFloat(cleanValue);
    
    // Handle NaN case
    if (isNaN(newAmount)) {
      newAmount = 0;
    }

    // Ensure the amount doesn't exceed maxAmount
    if (newAmount > maxAmount) {
      newAmount = maxAmount;
    }

    // Update state with the new amount
    setAmount(newAmount);
  };

  const handlePercentageSelect = (percentage: number) => {
    const newAmount = (maxAmount * percentage) / 100;
    setAmount(Math.floor(newAmount * 100) / 100); // Round to 2 decimal places
  };

  const formatAmount = (value: number) => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const isFormValid = selectedAccount && selectedReason && amount > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    // TODO: Handle withdrawal request
    console.log({
      accountId,
      withdrawalAccountId: selectedAccount,
      amount,
      reason: selectedReason,
      comment
    });

    onClose();
  };

  const handleAddAccount = () => {
    // Store current withdrawal modal state
    sessionStorage.setItem('withdrawalModalState', JSON.stringify({
      amount,
      reason: selectedReason,
      comment,
      returnToWithdrawal: true
    }));
    
    onClose();
    onAddAccount?.();
  };

  const withdrawalReasons = [
    t('withdrawal.reasons.liquidityNeed'),
    t('withdrawal.reasons.alternativeInvestment'),
    t('withdrawal.reasons.portfolioPerformance'),
    t('withdrawal.reasons.serviceExperience'),
    t('withdrawal.reasons.accountClosure')
  ];

  const percentageOptions = [25, 50, 75, 100];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('activity.types.withdrawal')}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* From Account */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t('withdrawal.from')}
              </label>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-900 dark:text-white">
                  {accountId}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {accountAlias}
                </div>
              </div>
            </div>

            {/* To Account */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t('withdrawal.to')}
              </label>
              {withdrawalAccounts.length === 0 ? (
                <button
                  onClick={handleAddAccount}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 text-theme-primary dark:text-theme-accent hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('withdrawalAccounts.addAccount')}</span>
                </button>
              ) : (
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-accent"
                >
                  <option value="">{t('common.selectAccount')}</option>
                  {withdrawalAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.alias}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t('withdrawal.amount')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formatAmount(amount)}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full pl-8 pr-3 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-right text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-accent"
                />
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('withdrawal.balance')} ${formatAmount(maxAmount)}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {percentageOptions.map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handlePercentageSelect(percentage)}
                    className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>

            {/* Withdrawal Reason */}
            <div>
              <button
                onClick={() => setShowReasons(true)}
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-left text-sm text-gray-900 dark:text-white"
              >
                {selectedReason || t('withdrawal.reason')}
              </button>
            </div>

            {/* Optional Comment */}
            <div>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('withdrawal.comment')}
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-accent"
              />
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {t('withdrawal.processing')}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full px-4 py-3 bg-theme-primary text-white rounded-lg font-medium hover:bg-theme-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('withdrawal.submit')}
            </button>
          </div>
        </div>

        {/* Reasons Modal */}
        {showReasons && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowReasons(false)} />
              <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('withdrawal.reasons.title')}
                  </h3>
                  <button
                    onClick={() => setShowReasons(false)}
                    className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4">
                  {withdrawalReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => {
                        setSelectedReason(reason);
                        setShowReasons(false);
                      }}
                      className="w-full p-4 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}