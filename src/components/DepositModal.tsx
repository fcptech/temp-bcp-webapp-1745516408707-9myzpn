import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Share2, Copy, Building2, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  accountHolder: string;
}

interface BankInfo {
  bankName: string;
  aba: string;
  swift: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface BeneficiaryInfo {
  name: string;
  accountNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const bankInfo: BankInfo = {
  bankName: "JPMORGAN CHASE BANK, N.A.",
  aba: "021000021",
  swift: "CHASUS33XXX",
  address: {
    street: "383 Madison Avenue",
    city: "New York",
    state: "NY",
    zip: "10179",
    country: "USA"
  }
};

const beneficiaryInfo: BeneficiaryInfo = {
  name: "Interactive Brokers LLC.",
  accountNumber: "633736902",
  address: {
    street: "One Pickwick Plaza",
    city: "Greenwich",
    state: "CT",
    zip: "06830",
    country: "USA"
  }
};

export function DepositModal({ 
  isOpen, 
  onClose, 
  accountId,
  accountHolder 
}: DepositModalProps) {
  const { t } = useTranslation();
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareError, setShareError] = useState(false);

  if (!isOpen) return null;

  const getInstructions = () => `
${t('deposit.bankInfo.title')}
${t('deposit.bankInfo.name')}: ${bankInfo.bankName}
${t('deposit.bankInfo.aba')}: ${bankInfo.aba}
${t('deposit.bankInfo.swift')}: ${bankInfo.swift}
${t('deposit.bankInfo.address')}:
- ${bankInfo.address.street}
- ${bankInfo.address.city}, ${bankInfo.address.state} ${bankInfo.address.zip}
- ${bankInfo.address.country}

${t('deposit.beneficiary.title')}
${t('deposit.beneficiary.name')}: ${beneficiaryInfo.name}
${t('deposit.beneficiary.accountNumber')}: ${beneficiaryInfo.accountNumber}
${t('deposit.beneficiary.address')}:
- ${beneficiaryInfo.address.street}
- ${beneficiaryInfo.address.city}, ${beneficiaryInfo.address.state} ${beneficiaryInfo.address.zip}
- ${beneficiaryInfo.address.country}

${t('deposit.reference.title')}: ${accountId} - ${accountHolder}
  `.trim();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getInstructions());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShare = async () => {
    setShareError(false);
    
    try {
      await navigator.share({
        title: t('deposit.title'),
        text: getInstructions()
      });
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        handleCopyToClipboard();
      }
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(t('deposit.title'));
    const body = encodeURIComponent(getInstructions());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const InfoField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );

  const AddressSection = ({ address }: { address: BankInfo['address'] | BeneficiaryInfo['address'] }) => (
    <div className="mt-1 space-y-0.5 pl-3 text-xs text-gray-600 dark:text-gray-300">
      <p>- {address.street}</p>
      <p>- {address.city}, {address.state} {address.zip}</p>
      <p>- {address.country}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('deposit.title')}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {t('deposit.subtitle')}
            </p>

            <div className="space-y-3">
              {/* Bank Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20">
                    <Building2 className="w-4 h-4 text-theme-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('deposit.bankInfo.title')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('deposit.bankInfo.subtitle')}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <InfoField label={t('deposit.bankInfo.name')} value={bankInfo.bankName} />
                  <InfoField label={t('deposit.bankInfo.aba')} value={bankInfo.aba} />
                  <InfoField label={t('deposit.bankInfo.swift')} value={bankInfo.swift} />
                  <div className="pt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t('deposit.bankInfo.address')}</span>
                    <AddressSection address={bankInfo.address} />
                  </div>
                </div>
              </div>

              {/* Beneficiary Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20">
                    <CreditCard className="w-4 h-4 text-theme-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('deposit.beneficiary.title')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('deposit.beneficiary.subtitle')}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <InfoField label={t('deposit.beneficiary.name')} value={beneficiaryInfo.name} />
                  <InfoField label={t('deposit.beneficiary.accountNumber')} value={beneficiaryInfo.accountNumber} />
                  <div className="pt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t('deposit.beneficiary.address')}</span>
                    <AddressSection address={beneficiaryInfo.address} />
                  </div>
                </div>
              </div>

              {/* Reference */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20">
                    <ArrowRight className="w-4 h-4 text-theme-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('deposit.reference.title')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('deposit.reference.subtitle')}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {accountId} - {accountHolder}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-2">
                <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                  {t('deposit.reference.processing')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleEmail}
                className="flex flex-col items-center justify-center px-3 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-secondary transition-colors relative overflow-hidden group"
              >
                <Mail className="w-4 h-4 mb-0.5 transition-transform group-hover:-translate-y-0.5" />
                <span className="text-xs transition-transform group-hover:-translate-y-0.5">{t('deposit.actions.email')}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex flex-col items-center justify-center px-3 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-secondary transition-colors relative overflow-hidden group"
              >
                {shareError ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mb-0.5 transition-transform group-hover:-translate-y-0.5" />
                    <span className="text-xs transition-transform group-hover:-translate-y-0.5">{t('deposit.actions.copied')}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mb-0.5 transition-transform group-hover:-translate-y-0.5" />
                    <span className="text-xs transition-transform group-hover:-translate-y-0.5">{t('deposit.actions.share')}</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="flex flex-col items-center justify-center px-3 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-secondary transition-colors relative overflow-hidden group"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mb-0.5 transition-transform group-hover:-translate-y-0.5" />
                    <span className="text-xs transition-transform group-hover:-translate-y-0.5">{t('deposit.actions.copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mb-0.5 transition-transform group-hover:-translate-y-0.5" />
                    <span className="text-xs transition-transform group-hover:-translate-y-0.5">{t('deposit.actions.copy')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}