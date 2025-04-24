import type { WithdrawalAccount } from '../types/account';

// Mock withdrawal accounts data per investment account
export const mockWithdrawalAccounts: Record<string, WithdrawalAccount[]> = {
  // Joaco's withdrawal accounts
  'U13186484': [
    {
      id: 'WA001',
      alias: 'BANK OF AMERICA, N...1213',
      type: 'bank',
      accountNumber: '****1213',
      status: 'active',
      country: 'US',
      currency: 'USD',
      routingNumber: '026009593'
    },
    {
      id: 'WA002',
      alias: 'PERSHING LLC, A...5678',
      type: 'financial',
      accountNumber: '****5678',
      status: 'pending_client_approval',
      country: 'US',
      currency: 'USD',
      approvalUrl: 'https://www.interactivebrokers.com/sso/Login'
    },
    {
      id: 'WA006',
      alias: 'CITIBANK, N...9876',
      type: 'bank',
      accountNumber: '****9876',
      status: 'pending_review',
      country: 'US',
      currency: 'USD',
      routingNumber: '021000089'
    },
    {
      id: 'WA007',
      alias: 'FIDELITY, A...4321',
      type: 'financial',
      accountNumber: '****4321',
      status: 'approval_in_progress',
      country: 'US',
      currency: 'USD'
    },
    {
      id: 'WA008',
      alias: 'CHASE BANK, N...7890',
      type: 'bank',
      accountNumber: '****7890',
      status: 'active',
      country: 'US',
      currency: 'USD',
      routingNumber: '021000021'
    }
  ],
  
  // Manu's withdrawal accounts
  'U15043437': [
    {
      id: 'WA003',
      alias: 'BBVA BANCOMER, N...9876',
      type: 'bank',
      accountNumber: '****9876',
      status: 'active',
      country: 'MX',
      currency: 'MXN',
      routingNumber: 'BBVAMXMM'
    },
    {
      id: 'WA004',
      alias: 'MORGAN STANLEY, A...4321',
      type: 'financial',
      accountNumber: '****4321',
      status: 'pending_client_approval',
      country: 'US',
      currency: 'USD',
      approvalUrl: 'https://www.interactivebrokers.com/sso/Login'
    }
  ],

  // Market Hub withdrawal accounts
  'U10246500': [
    {
      id: 'WA005',
      alias: 'CHASE BANK, N...5432',
      type: 'bank',
      accountNumber: '****5432',
      status: 'active',
      country: 'US',
      currency: 'USD',
      routingNumber: '021000021'
    }
  ],

  // Empty accounts for unfunded accounts
  'U20231201': [],
  'U20231202': []
};