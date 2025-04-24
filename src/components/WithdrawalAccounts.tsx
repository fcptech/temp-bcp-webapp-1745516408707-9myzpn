import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X, ArrowLeft, HelpCircle, Folder, Check, MoreVertical, Upload, PenSquare, Building, Trash2, Landmark, PieChart, Clock } from 'lucide-react';
import { useWithdrawalAccounts, useDeleteWithdrawalAccount, useAddWithdrawalAccount } from '../hooks/useSettings';
import type { WithdrawalAccountStatus } from '../types/account';

interface WithdrawalAccountsProps {
  accountId: string;
  onClose: () => void;
}

interface WithdrawalAccount {
  id: string;
  type: 'bank' | 'financial';
  status: WithdrawalAccountStatus;
  alias: string;
  country: string;
  currency: string;
  approvalUrl?: string;
}

const getStatusIcon = (status: WithdrawalAccountStatus) => {
  switch (status) {
    case 'active':
      return Check;
    case 'pending_review':
      return Clock;
    case 'pending_client_approval':
      return Clock;
    case 'approval_in_progress':
      return Clock;
    case 'accepted':
      return Check;
    default:
      return Check;
  }
};

const getStatusColor = (status: WithdrawalAccountStatus) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
    case 'pending_review':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400';
    case 'pending_client_approval':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
    case 'approval_in_progress':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
    case 'accepted':
      return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
    default:
      return 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400';
  }
};

export function WithdrawalAccounts({ accountId, onClose }: WithdrawalAccountsProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'add'>('list');
  const [accountType, setAccountType] = useState<'bank' | 'financial'>('bank');
  const [addMethod, setAddMethod] = useState<'upload' | 'manual' | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({
    instructions: null,
    statement: null
  });
  const fileInputRefs = {
    instructions: useRef<HTMLInputElement>(null),
    statement: useRef<HTMLInputElement>(null)
  };

  const { data: accounts = [] } = useWithdrawalAccounts(accountId);
  const deleteAccount = useDeleteWithdrawalAccount();
  const addAccount = useAddWithdrawalAccount();

  const handleDeleteAccount = async (withdrawalAccountId: string) => {
    try {
      await deleteAccount.mutateAsync({ accountId, withdrawalAccountId });
      setActiveMenu(null);
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const handleFileSelect = (type: 'instructions' | 'statement', file: File | null) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleFileClick = (type: 'instructions' | 'statement') => {
    fileInputRefs[type].current?.click();
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    if (selectedFiles.instructions) {
      formData.append('documents', selectedFiles.instructions);
    }
    if (selectedFiles.statement) {
      formData.append('documents', selectedFiles.statement);
    }

    try {
      await addAccount.mutateAsync({
        accountId,
        data: {
          alias: formData.get('alias') as string,
          type: accountType,
          accountNumber: formData.get('accountNumber') as string,
          country: formData.get('country') as string,
          currency: formData.get('currency') as string,
          routingNumber: formData.get('routingNumber') as string,
          documents: Object.values(selectedFiles).filter((file): file is File => file !== null)
        }
      });
      setView('list');
      setAddMethod(null);
    } catch (error) {
      console.error('Failed to add account:', error);
    }
  };

  const handleApprove = (account: WithdrawalAccount) => {
    if (account.approvalUrl) {
      window.open(account.approvalUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {view === 'add' && (
                <button
                  onClick={() => {
                    setView('list');
                    setAddMethod(null);
                  }}
                  className="mr-3 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('withdrawalAccounts.title')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHelp(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {view === 'list' ? (
              <>
                {/* Add Account Button */}
                <button
                  onClick={() => setView('add')}
                  className="flex items-center justify-center w-full p-4 mb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-theme-primary dark:hover:border-theme-accent transition-colors"
                >
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Plus className="w-5 h-5" />
                    <span>{t('withdrawalAccounts.addAccount')}</span>
                  </div>
                </button>

                {/* Accounts List */}
                <div className="space-y-4">
                  {accounts.map((account) => {
                    const StatusIcon = getStatusIcon(account.status);
                    const AccountIcon = account.type === 'bank' ? Landmark : PieChart;
                    const statusColor = getStatusColor(account.status);

                    return (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${statusColor}`}>
                            <AccountIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {account.alias}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {t(`withdrawalAccounts.accountType.${account.type}`)} • {account.country} • {account.currency}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                {t(`withdrawalAccounts.status.${account.status}`)}
                              </span>
                              {account.status === 'pending_client_approval' && (
                                <button
                                  onClick={() => handleApprove(account)}
                                  className="ml-2 px-3 py-1 text-xs font-medium text-white bg-theme-primary hover:bg-theme-secondary rounded transition-colors"
                                >
                                  {t('common.approve')}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === account.id ? null : account.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {activeMenu === account.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveMenu(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                <button
                                  onClick={() => handleDeleteAccount(account.id)}
                                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {t('common.deleteAccount')}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* Account Type Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => {
                      setAccountType('bank');
                      setAddMethod(null);
                    }}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      accountType === 'bank'
                        ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20">
                        <Landmark className="w-5 h-5 text-theme-accent" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('withdrawalAccounts.accountType.bank')}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setAccountType('financial');
                      setAddMethod('upload');
                    }}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      accountType === 'financial'
                        ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20">
                        <PieChart className="w-5 h-5 text-theme-accent" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('withdrawalAccounts.accountType.financial')}
                      </span>
                    </div>
                  </button>
                </div>

                {accountType === 'bank' ? (
                  /* Add Method Selection for Bank */
                  <div className="grid grid-cols-2 gap-4">
                    {/* Upload Option */}
                    <button
                      onClick={() => setAddMethod('upload')}
                      className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                        addMethod === 'upload'
                          ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-theme-accent'
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-theme-accent/10 dark:bg-theme-accent/20 mb-3">
                        <Upload className="w-6 h-6 text-theme-accent" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900 dark:text-white mb-1">
                          {t('withdrawalAccounts.uploadMethod.title')}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('withdrawalAccounts.uploadMethod.description')}
                        </p>
                      </div>
                    </button>

                    {/* Manual Option */}
                    <button
                      onClick={() => setAddMethod('manual')}
                      className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                        addMethod === 'manual'
                          ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-theme-accent'
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-theme-accent/10 dark:bg-theme-accent/20 mb-3">
                        <PenSquare className="w-6 h-6 text-theme-accent" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900 dark:text-white mb-1">
                          {t('withdrawalAccounts.manualMethod.title')}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('withdrawalAccounts.manualMethod.description')}
                        </p>
                      </div>
                    </button>
                  </div>
                ) : (
                  /* Upload Option for Financial Institution */
                  <button
                    onClick={() => setAddMethod('upload')}
                    className="flex flex-col items-center justify-center w-full p-6 rounded-lg border-2 border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-theme-accent/10 dark:bg-theme-accent/20 mb-3">
                      <Upload className="w-6 h-6 text-theme-accent" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                        {t('withdrawalAccounts.uploadMethod.title')}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('withdrawalAccounts.uploadMethod.description')}
                      </p>
                    </div>
                  </button>
                )}

                {/* Upload Form */}
                {(addMethod === 'upload' || accountType === 'financial') && (
                  <form onSubmit={handleAddAccount} className="mt-6 space-y-4">
                    <input
                      type="text"
                      name="alias"
                      placeholder={t('withdrawalAccounts.form.alias')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 dark:text-white"
                    />
                    
                    {/* Instructions File Input */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          ref={fileInputRefs.instructions}
                          onChange={(e) => handleFileSelect('instructions', e.target.files?.[0] || null)}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <div
                          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-left ${
                            selectedFiles.instructions
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400'
                          }`}
                        >
                          {selectedFiles.instructions?.name || t('withdrawalAccounts.form.instructionsFile')}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileClick('instructions')}
                        className="p-2 bg-theme-primary text-white rounded-lg"
                      >
                        <Folder className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Account Statement File Input */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          ref={fileInputRefs.statement}
                          onChange={(e) => handleFileSelect('statement', e.target.files?.[0] || null)}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <div
                          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-left ${
                            selectedFiles.statement
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400'
                          }`}
                        >
                          {selectedFiles.statement?.name || t('withdrawalAccounts.form.accountStatement')}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileClick('statement')}
                        className="p-2 bg-theme-primary text-white rounded-lg"
                      >
                        <Folder className="w-6 h-6" />
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 px-4 py-3 bg-theme-primary text-white rounded-lg font-medium hover:bg-theme-secondary transition-colors"
                    >
                      {t('common.send')}
                    </button>
                  </form>
                )}

                {/* Manual Form */}
                {addMethod === 'manual' && accountType === 'bank' && (
                  <form onSubmit={handleAddAccount} className="mt-6 space-y-4">
                    <input
                      type="text"
                      name="alias"
                      placeholder={t('withdrawalAccounts.form.alias')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 dark:text-white"
                    />

                    <select
                      name="country"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">{t('withdrawalAccounts.form.country')}</option>
                      <option value="us">United States</option>
                      <option value="mx">Mexico</option>
                    </select>

                    <select
                      name="currency"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">{t('withdrawalAccounts.form.currency')}</option>
                      <option value="usd">USD</option>
                      <option value="mxn">MXN</option>
                    </select>

                    <input
                      type="text"
                      name="accountNumber"
                      placeholder={t('withdrawalAccounts.form.accountNumber')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 dark:text-white"
                    />

                    <input
                      type="text"
                      name="confirmAccountNumber"
                      placeholder={t('withdrawalAccounts.form.confirmAccountNumber')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 dark:text-white"
                    />

                    <input
                      type="text"
                      name="routingNumber"
                      placeholder={t('withdrawalAccounts.form.routingNumber')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 dark:text-white"
                    />

                    <input
                      type="text"
                      name="accountHolders"
                      placeholder={t('withdrawalAccounts.form.accountHolders')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 dark:text-white"
                    />

                    {/* Account Statement File Input */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          ref={fileInputRefs.statement}
                          onChange={(e) => handleFileSelect('statement', e.target.files?.[0] || null)}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <div
                          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-left ${
                            selectedFiles.statement
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400'
                          }`}
                        >
                          {selectedFiles.statement?.name || t('withdrawalAccounts.form.accountStatement')}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileClick('statement')}
                        className="p-2 bg-theme-primary text-white rounded-lg"
                      >
                        <Folder className="w-6 h-6" />
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 px-4 py-3 bg-theme-primary text-white rounded-lg font-medium hover:bg-theme-secondary transition-colors"
                    >
                      {t('common.send')}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Help Modal */}
          {showHelp && (
            <div className="fixed inset-0 z-[60] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={() => setShowHelp(false)} />
                <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('withdrawalAccounts.help.title')}
                    </h3>
                    <button
                      onClick={() => setShowHelp(false)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-6">
                    {/* Bank Account Option */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20">
                          <Landmark className="w-5 h-5 text-theme-accent" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {t('withdrawalAccounts.help.bank.title')}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('withdrawalAccounts.help.bank.description')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Investment Account Option */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20">
                          <PieChart className="w-5 h-5 text-theme-accent" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {t('withdrawalAccounts.help.financial.title')}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('withdrawalAccounts.help.financial.description')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {t('withdrawalAccounts.help.alias.title')}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('withdrawalAccounts.help.alias.description')}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {t('withdrawalAccounts.help.country.title')}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('withdrawalAccounts.help.country.description')}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {t('withdrawalAccounts.help.accountNumber.title')}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('withdrawalAccounts.help.accountNumber.description')}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {t('withdrawalAccounts.help.routingCode.title')}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line">
                          {t('withdrawalAccounts.help.routingCode.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}