import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download } from 'lucide-react';
import { EmptyStateMessage } from './EmptyStateMessage';

interface Statement {
  type: 'monthly' | 'annual' | 'tax';
  date: string;
  year: string;
  month?: string;
  accountId: string;
  documentId?: string;
  url: string;
}

// Mock data for statements with download URLs
const mockStatements: Statement[] = [
  { 
    type: 'monthly', 
    date: '2025-03-01', 
    year: '2025', 
    month: 'MAR', 
    accountId: 'U13186484',
    url: 'https://example.com/statements/202503.pdf'
  },
  { 
    type: 'monthly', 
    date: '2025-02-01', 
    year: '2025', 
    month: 'FEB', 
    accountId: 'U13186484',
    url: 'https://example.com/statements/202502.pdf'
  },
  { 
    type: 'monthly', 
    date: '2025-01-01', 
    year: '2025', 
    month: 'ENE', 
    accountId: 'U13186484',
    url: 'https://example.com/statements/202501.pdf'
  },
  { 
    type: 'annual', 
    date: '2024-12-31', 
    year: '2024', 
    accountId: 'U13186484',
    url: 'https://example.com/statements/2024.pdf'
  },
  { 
    type: 'monthly', 
    date: '2024-12-01', 
    year: '2024', 
    month: 'DIC', 
    accountId: 'U13186484',
    url: 'https://example.com/statements/202412.pdf'
  },
  { 
    type: 'monthly', 
    date: '2024-11-01', 
    year: '2024', 
    month: 'NOV', 
    accountId: 'U13186484',
    url: 'https://example.com/statements/202411.pdf'
  },
];

const mockTaxDocuments: Statement[] = [
  { 
    type: 'tax', 
    date: '2024-12-31', 
    year: '2024', 
    accountId: 'U13186484',
    documentId: 'F1042S',
    url: 'https://example.com/tax/2024/F1042S.pdf'
  },
];

interface StatementsViewProps {
  accountId: string;
  hasFunds: boolean;
  hasData?: boolean;
}

export function StatementsView({ accountId, hasFunds, hasData = true }: StatementsViewProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'statements' | 'tax'>('statements');
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const tabs = [
    { id: 'statements', label: t('statements.tabs.statements') },
    { id: 'tax', label: t('statements.tabs.tax') },
  ];

  const getStatementTitle = (statement: Statement) => {
    if (statement.type === 'annual') {
      return t('statements.types.annual');
    } else if (statement.type === 'tax') {
      return `${t('statements.types.tax')} ${statement.documentId}`;
    }
    return t('statements.types.monthly');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('es', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return { month, year };
  };

  const handleDownload = async (statement: Statement, index: number) => {
    try {
      setDownloadingIndex(index);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = statement.url;
      link.target = '_blank';
      link.download = `${statement.accountId}_${statement.date.replace(/-/g, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading statement:', error);
    } finally {
      setDownloadingIndex(null);
    }
  };

  const renderStatementList = (statements: Statement[]) => (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {statements.map((statement, index) => {
        const { month, year } = formatDate(statement.date);
        return (
          <div
            key={index}
            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="text-center min-w-[3rem]">
                {statement.type === 'annual' || statement.type === 'tax' ? (
                  <div className="text-base font-medium text-gray-900 dark:text-white">
                    {year}
                  </div>
                ) : (
                  <>
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {month}
                    </div>
                    <div className="text-xs text-gray-500">
                      {year}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-theme-accent/10 dark:bg-theme-accent/20">
                  <FileText className="w-4 h-4 text-theme-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {getStatementTitle(statement)}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {statement.accountId}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDownload(statement, index)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
              disabled={downloadingIndex === index}
            >
              {downloadingIndex === index ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-theme-primary dark:border-t-theme-accent rounded-full animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );

  if (!hasFunds) {
    return <EmptyStateMessage type="statements" />;
  }

  if (!hasData) {
    return <EmptyStateMessage type="statements" noData />;
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'statements' | 'tax')}
              className={`flex-1 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-theme-primary text-theme-primary dark:text-theme-accent dark:border-theme-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'statements' && renderStatementList(mockStatements)}
          {activeTab === 'tax' && renderStatementList(mockTaxDocuments)}
        </div>
      </div>
    </div>
  );
}