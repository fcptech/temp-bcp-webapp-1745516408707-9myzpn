import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '../layouts/MainLayout';
import { MarketHubAccount } from './accounts/MarketHubAccount';
import { AutomatedInvestmentAccount } from './accounts/AutomatedInvestmentAccount';
import { LoadingScreen } from '../components/LoadingScreen';
import type { Account } from '../types/account';

// Mock account data
const mockAccounts: Record<string, Account> = {
  'U13186484': {
    id: 'U13186484',
    alias: 'Joaco',
    type: 'AUTOMATED_INVESTMENT',
    value: 14692.92,
    percentage: 35,
    funded: true,
    performance: {
      total: -307.08,
      percentage: -2.06,
      period: '1Y'
    }
  },
  'U15043437': {
    id: 'U15043437',
    alias: 'Manu',
    type: 'AUTOMATED_INVESTMENT',
    value: 14692.92,
    percentage: 35,
    funded: true,
    performance: {
      total: -307.08,
      percentage: -2.06,
      period: '1Y'
    }
  },
  'U10246500': {
    id: 'U10246500',
    alias: 'Market Hub',
    type: 'MARKET_HUB',
    value: 5297.48,
    buyingPower: 225.46,
    percentage: 15,
    funded: true,
    performance: {
      total: 317.23,
      percentage: 6.37,
      period: '1Y'
    }
  },
  'U20231201': {
    id: 'U20231201',
    alias: 'New Investment',
    type: 'AUTOMATED_INVESTMENT',
    value: 0,
    percentage: 7.5,
    funded: false,
    performance: {
      total: 0,
      percentage: 0,
      period: '1Y'
    }
  },
  'U20231202': {
    id: 'U20231202',
    alias: 'Trading Account',
    type: 'MARKET_HUB',
    value: 0,
    percentage: 7.5,
    funded: false,
    buyingPower: 0,
    performance: {
      total: 0,
      percentage: 0,
      period: '1Y'
    }
  }
};

interface AccountDetailProps {
  embedded?: boolean;
  accountId?: string;
  enabledSections?: string[];
}

export default function AccountDetail({ embedded = false, accountId: propAccountId, enabledSections }: AccountDetailProps) {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const id = propAccountId || paramId;
  const { t } = useTranslation();

  // Get tab and modal state from URL
  const activeTab = searchParams.get('tab') || 'summary';
  const openWithdrawalAccounts = searchParams.get('openWithdrawalAccounts') === 'true';

  // Loading state
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Get account data
  const account = id ? mockAccounts[id] : null;

  // If no account found, redirect to dashboard
  if (!account) {
    return <Navigate to="/" replace />;
  }

  const accountTitle = `${account.id} - ${account.alias}`;

  return (
    <MainLayout title={accountTitle} embedded={embedded}>
      {account.type === 'MARKET_HUB' ? (
        <MarketHubAccount 
          account={account} 
          embedded={embedded}
          enabledSections={enabledSections}
          initialTab={activeTab}
          openWithdrawalAccounts={openWithdrawalAccounts}
        />
      ) : (
        <AutomatedInvestmentAccount 
          account={account} 
          embedded={embedded}
          enabledSections={enabledSections}
          initialTab={activeTab}
          openWithdrawalAccounts={openWithdrawalAccounts}
        />
      )}
    </MainLayout>
  );
}