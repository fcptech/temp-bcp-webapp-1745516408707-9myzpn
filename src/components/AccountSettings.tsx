import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Users, Building2, Wallet2, Edit2, ArrowRight, Building, Check, X, ExternalLink } from 'lucide-react';
import { WithdrawalAccounts } from './WithdrawalAccounts';
import { useUpdateAccountAlias } from '../hooks/useSettings';
import type { Account } from '../types/account';

interface AccountSettingsProps {
  account: Account;
  onWithdrawalAccountsClose?: () => void;
  openWithdrawalAccounts?: boolean;
}

export function AccountSettings({ 
  account,
  onWithdrawalAccountsClose,
  openWithdrawalAccounts = false
}: AccountSettingsProps) {
  const { t } = useTranslation();
  const [showWithdrawalAccounts, setShowWithdrawalAccounts] = useState(openWithdrawalAccounts);
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [newAlias, setNewAlias] = useState(account.alias);
  const [currentAlias, setCurrentAlias] = useState(account.alias);
  const updateAlias = useUpdateAccountAlias();

  const handleEditAlias = () => {
    setIsEditingAlias(true);
    setNewAlias(currentAlias);
  };

  const handleCancelEdit = () => {
    setIsEditingAlias(false);
    setNewAlias(currentAlias);
  };

  const handleSaveAlias = async () => {
    if (newAlias.trim() && newAlias !== currentAlias) {
      try {
        // Get existing accounts from localStorage
        const storedAccounts = localStorage.getItem('accounts');
        const accounts = storedAccounts ? JSON.parse(storedAccounts) : {};
        
        // Update the alias for this account
        accounts[account.id] = {
          ...accounts[account.id],
          alias: newAlias.trim()
        };
        
        // Save back to localStorage
        localStorage.setItem('accounts', JSON.stringify(accounts));
        
        // Update the current alias in component state
        setCurrentAlias(newAlias.trim());
        
        // Close edit mode
        setIsEditingAlias(false);
      } catch (error) {
        console.error('Failed to update alias in localStorage:', error);
        setNewAlias(currentAlias);
      }
    }
    setIsEditingAlias(false);
  };

  const handleOpenIBKR = () => {
    window.open('https://www.interactivebrokers.com/sso/Login', '_blank');
  };

  const handleCloseWithdrawalAccounts = () => {
    setShowWithdrawalAccounts(false);
    onWithdrawalAccountsClose?.();
  };

  const accountHolderType = 'Individual'; // This would come from the API
  const accountHolders = ['John Doe']; // This would come from the API
  const documents = [
    { 
      id: 'terms',
      name: 'Terms and Conditions',
      date: '2024-01-15',
      url: '#'
    },
    {
      id: 'privacy',
      name: 'Privacy Policy',
      date: '2024-01-15',
      url: '#'
    },
    {
      id: 'agreement',
      name: 'Investment Agreement',
      date: '2024-01-15',
      url: '#'
    }
  ];

  const supportChannels = [
    {
      id: 'email',
      name: 'Email Support',
      value: 'support@vestiva.com',
      icon: FileText
    },
    {
      id: 'phone',
      name: 'Phone Support',
      value: '+1 (800) 555-0123',
      icon: FileText
    }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('account.settings.title')}
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('account.settings.accountType')}
              </label>
              <div className="mt-1 flex items-center">
                <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">
                  {accountHolderType}
                </span>
              </div>
            </div>

            {/* Account Holders */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('account.settings.holders')}
              </label>
              <div className="mt-1 flex items-center">
                <Users className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">
                  {accountHolders.join(', ')}
                </span>
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('account.settings.investmentAccountNumber')}
              </label>
              <div className="mt-1 flex items-center">
                <Wallet2 className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">
                  {account.id}
                </span>
              </div>
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('account.settings.product')}
              </label>
              <div className="mt-1 flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">
                  {t('withdrawalAccounts.accountType.automatedInvestment')}
                </span>
              </div>
            </div>

            {/* Account Alias */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('account.settings.alias')}
              </label>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <Edit2 className="w-5 h-5 text-gray-400 mr-2" />
                  {isEditingAlias ? (
                    <input
                      type="text"
                      value={newAlias}
                      onChange={(e) => setNewAlias(e.target.value)}
                      className="flex-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-accent text-gray-900 dark:text-white"
                      autoFocus
                    />
                  ) : (
                    <span className="text-gray-900 dark:text-white">
                      {currentAlias}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {isEditingAlias ? (
                    <>
                      <button
                        onClick={handleSaveAlias}
                        disabled={!newAlias.trim() || newAlias === currentAlias}
                        className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditAlias}
                      className="p-1 text-theme-primary dark:text-theme-accent hover:text-theme-secondary dark:hover:text-theme-accent/80 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* IBKR Account */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('account.settings.ibkr.title')}
              </label>
              <button
                onClick={handleOpenIBKR}
                className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20 group-hover:bg-theme-accent/20 dark:group-hover:bg-theme-accent/30 transition-colors">
                    <ExternalLink className="w-5 h-5 text-theme-accent" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('account.settings.ibkr.button')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t('account.settings.ibkr.description')}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-theme-accent transition-colors" />
              </button>
            </div>

            {/* Withdrawal Accounts Management */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('account.settings.withdrawalAccounts.title')}
              </label>
              <button
                onClick={() => setShowWithdrawalAccounts(true)}
                className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20 group-hover:bg-theme-accent/20 dark:group-hover:bg-theme-accent/30 transition-colors">
                    <Building className="w-5 h-5 text-theme-accent" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('account.settings.withdrawalAccounts.registeredAccounts')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t('account.settings.withdrawalAccounts.manageAccounts')}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-theme-accent transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Legal Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('account.settings.sections.legal')}
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('account.settings.sections.support')}
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {supportChannels.map((channel) => (
              <div key={channel.id} className="p-6">
                <div className="flex items-center">
                  <channel.icon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {channel.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {channel.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdrawal Accounts Modal */}
      {showWithdrawalAccounts && (
        <WithdrawalAccounts
          accountId={account.id}
          onClose={handleCloseWithdrawalAccounts}
        />
      )}
    </>
  );
}