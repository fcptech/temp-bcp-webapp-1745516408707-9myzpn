import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import Dashboard from './Dashboard';
import AccountDetail from './AccountDetail';
import type { AccountType } from '../types/account';

/**
 * Widget Section Configuration
 * Defines the structure for configurable sections within widgets
 */
interface WidgetSection {
  id: string;        // Unique identifier for the section
  label: string;     // Display label
  enabled: boolean;  // Toggle state
}

interface WidgetConfig {
  sections: WidgetSection[];
}

/**
 * Demo Account IDs
 * Used for widget preview and testing
 */
const DEMO_ACCOUNTS = {
  AUTOMATED_INVESTMENT: 'U13186484', // Joaco's account
  MARKET_HUB: 'U10246500' // Market Hub account
};

/**
 * Widget Demo Component
 * 
 * This component serves as both a demo and documentation for widget integration.
 * It allows users to:
 * 1. Switch between Dashboard and Account widgets
 * 2. Configure which sections are visible
 * 3. Preview the widget with live data
 * 4. See the integration code
 */
export default function WidgetDemo() {
  // Active widget type and account configuration
  const [activeTab, setActiveTab] = useState<'dashboard' | 'account'>('dashboard');
  const [accountType, setAccountType] = useState<AccountType>('AUTOMATED_INVESTMENT');

  // Dashboard Widget Configuration
  const [dashboardConfig, setDashboardConfig] = useState<WidgetConfig>({
    sections: [
      { id: 'summary', label: 'Investment Summary', enabled: true },
      { id: 'distribution', label: 'Account Distribution', enabled: true },
      { id: 'accounts', label: 'Investment Accounts', enabled: true }
    ]
  });

  // Automated Investment Account Widget Configuration
  const [automatedInvestmentConfig, setAutomatedInvestmentConfig] = useState<WidgetConfig>({
    sections: [
      { id: 'navigation', label: 'Navigation Menu', enabled: true },
      { id: 'funding-buttons', label: 'Deposit/Withdraw Buttons', enabled: true },
      { id: 'summary', label: 'Summary', enabled: true },
      { id: 'performance', label: 'Performance', enabled: true },
      { id: 'activity', label: 'Activity', enabled: true },
      { id: 'statements', label: 'Statements', enabled: true },
      { id: 'settings', label: 'Settings', enabled: true },
      { id: 'summary-graph', label: 'Account Value Graph', enabled: true },
      { id: 'summary-portfolio', label: 'Portfolio Summary', enabled: true },
      { id: 'summary-instruments', label: 'Instruments List', enabled: true }
    ]
  });

  // Market Hub Account Widget Configuration
  const [marketHubConfig, setMarketHubConfig] = useState<WidgetConfig>({
    sections: [
      { id: 'navigation', label: 'Navigation Menu', enabled: true },
      { id: 'funding-buttons', label: 'Deposit/Withdraw Buttons', enabled: true },
      { id: 'summary', label: 'Summary', enabled: true },
      { id: 'performance', label: 'Performance', enabled: true },
      { id: 'activity', label: 'Activity', enabled: true },
      { id: 'statements', label: 'Statements', enabled: true },
      { id: 'settings', label: 'Settings', enabled: true },
      { id: 'summary-graph', label: 'Account Value Graph', enabled: true },
      { id: 'summary-actions', label: 'Trading Actions', enabled: true },
      { id: 'summary-instruments', label: 'Positions List', enabled: true }
    ]
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Widget' },
    { id: 'account', label: 'Account Widget' },
  ];

  const accountTypes = [
    { id: 'AUTOMATED_INVESTMENT', label: 'Automated Investment' },
    { id: 'MARKET_HUB', label: 'Market Hub' },
  ];

  /**
   * Toggles the visibility of a section in the current widget configuration
   * @param sectionId - ID of the section to toggle
   */
  const toggleSection = (sectionId: string) => {
    if (activeTab === 'dashboard') {
      setDashboardConfig(prev => ({
        ...prev,
        sections: prev.sections.map(section => 
          section.id === sectionId ? { ...section, enabled: !section.enabled } : section
        )
      }));
    } else if (accountType === 'MARKET_HUB') {
      setMarketHubConfig(prev => ({
        ...prev,
        sections: prev.sections.map(section => 
          section.id === sectionId ? { ...section, enabled: !section.enabled } : section
        )
      }));
    } else {
      setAutomatedInvestmentConfig(prev => ({
        ...prev,
        sections: prev.sections.map(section => 
          section.id === sectionId ? { ...section, enabled: !section.enabled } : section
        )
      }));
    }
  };

  /**
   * Gets the current widget configuration based on active tab and account type
   */
  const getCurrentConfig = () => {
    if (activeTab === 'dashboard') {
      return dashboardConfig;
    }
    return accountType === 'MARKET_HUB' ? marketHubConfig : automatedInvestmentConfig;
  };

  /**
   * Gets the list of enabled section IDs for the current configuration
   */
  const getEnabledSections = () => {
    const config = getCurrentConfig();
    return config.sections.filter(s => s.enabled).map(s => s.id);
  };

  return (
    <MainLayout title="Widget Demo">
      <div className="space-y-6">
        {/* Widget Type Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'dashboard' | 'account')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-theme-primary text-theme-primary dark:text-theme-accent dark:border-theme-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Account Type Selection */}
        {activeTab === 'account' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Account Type
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {accountTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setAccountType(type.id as AccountType)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    accountType === type.id
                      ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-theme-accent'
                  }`}
                >
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </h4>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Widget Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getCurrentConfig().sections.map((section) => (
              <div
                key={section.id}
                className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  section.enabled
                    ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {section.label}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      section.enabled
                        ? 'bg-theme-primary border-theme-primary'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {section.enabled && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Example */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="prose dark:prose-invert max-w-none mb-6">
            <h3>Widget Integration Example</h3>
            <p>
              This example demonstrates how to embed Vestiva widgets in your application.
              The widgets are fully responsive and inherit the theme from the parent application.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <code>
                {activeTab === 'dashboard' ? `
<vestiva-dashboard
  theme="light"
  language="es"
  sections={${JSON.stringify(getEnabledSections(), null, 2)}}
/>` : `
<vestiva-account
  account-id="${DEMO_ACCOUNTS[accountType]}"
  account-type="${accountType}"
  theme="light"
  language="es"
  sections={${JSON.stringify(getEnabledSections(), null, 2)}}
/>`}
              </code>
            </pre>
          </div>

          {/* Widget Preview */}
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Widget Preview:
            </div>
            {activeTab === 'dashboard' ? (
              <Dashboard 
                embedded 
                enabledSections={getEnabledSections()}
              />
            ) : (
              <AccountDetail 
                embedded 
                accountId={DEMO_ACCOUNTS[accountType]}
                enabledSections={getEnabledSections()}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}