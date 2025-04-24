import type { Account, Instrument } from '../types/account';

// Mock instruments data
export const mockInstruments: Record<string, Instrument[]> = {
  'U13186484': [
    {
      symbol: 'CEUU',
      name: 'Acciones Europeas',
      value: 1083.24,
      quantity: 17,
      performance: 58.82,
      percentage: 7.44,
      color: '#41C9E2'
    },
    {
      symbol: 'CSPX',
      name: 'Acciones EEUU S&P500',
      value: 10129.14,
      quantity: 49,
      performance: -237.88,
      percentage: 69.56,
      color: '#3B9AE1'
    },
    {
      symbol: 'EIMI',
      name: 'Acciones Merc. Emerg.',
      value: 1663.55,
      quantity: 95,
      performance: -4.23,
      percentage: 11.42,
      color: '#0066CC'
    },
    {
      symbol: 'IJPA',
      name: 'Acciones Japonesas',
      value: 953.36,
      quantity: 12,
      performance: 42.71,
      percentage: 6.55,
      color: '#64B5F6'
    },
    {
      symbol: 'ISFD',
      name: 'Acciones Reino Unido',
      value: 732.93,
      quantity: 8,
      performance: 25.37,
      percentage: 5.03,
      color: '#41C9E2'
    }
  ],
  'U15043437': [
    {
      symbol: 'CEUU',
      name: 'Acciones Europeas',
      value: 1083.24,
      quantity: 17,
      performance: 58.82,
      percentage: 7.44,
      color: '#41C9E2'
    },
    {
      symbol: 'CSPX',
      name: 'Acciones EEUU S&P500',
      value: 10129.14,
      quantity: 49,
      performance: -237.88,
      percentage: 69.56,
      color: '#3B9AE1'
    },
    {
      symbol: 'EIMI',
      name: 'Acciones Merc. Emerg.',
      value: 1663.55,
      quantity: 95,
      performance: -4.23,
      percentage: 11.42,
      color: '#0066CC'
    },
    {
      symbol: 'IJPA',
      name: 'Acciones Japonesas',
      value: 953.36,
      quantity: 12,
      performance: 42.71,
      percentage: 6.55,
      color: '#64B5F6'
    },
    {
      symbol: 'ISFD',
      name: 'Acciones Reino Unido',
      value: 732.93,
      quantity: 8,
      performance: 25.37,
      percentage: 5.03,
      color: '#41C9E2'
    }
  ],
  'U10246500': [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      price: 173.25,
      quantity: 10,
      value: 1732.50,
      performance: 125.30,
      percentage: 33.33,
      logoUrl: 'https://companieslogo.com/img/orig/AAPL-bf1a4314.png'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      sector: 'Technology',
      price: 338.11,
      quantity: 5,
      value: 1690.55,
      performance: 89.75,
      percentage: 33.33,
      logoUrl: 'https://companieslogo.com/img/orig/MSFT-6e6e6e96.png'
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      sector: 'Technology',
      price: 125.30,
      quantity: 15,
      value: 1879.50,
      performance: -45.20,
      percentage: 33.34,
      logoUrl: 'https://companieslogo.com/img/orig/GOOGL-0ed88f7c.png'
    }
  ]
};

// Calculate total values and performance based on instruments
function calculateAccountValues(accountId: string): { value: number; performance: { total: number; percentage: number } } {
  const instruments = mockInstruments[accountId] || [];
  const value = instruments.reduce((sum, inst) => sum + inst.value, 0);
  const totalPerformance = instruments.reduce((sum, inst) => sum + inst.performance, 0);
  const performancePercentage = value > 0 ? (totalPerformance / value) * 100 : 0;

  return {
    value,
    performance: {
      total: totalPerformance,
      percentage: Number(performancePercentage.toFixed(2))
    }
  };
}

// Mock accounts data
export const mockAccounts: Record<string, Account> = {
  'U13186484': {
    id: 'U13186484',
    alias: 'Joaco',
    type: 'AUTOMATED_INVESTMENT',
    ...calculateAccountValues('U13186484'),
    percentage: 35,
    funded: true,
    performance: {
      total: -115.21,
      percentage: -0.79,
      period: '1Y'
    }
  },
  'U15043437': {
    id: 'U15043437',
    alias: 'Manu',
    type: 'AUTOMATED_INVESTMENT',
    ...calculateAccountValues('U15043437'),
    percentage: 35,
    funded: true,
    performance: {
      total: -115.21,
      percentage: -0.79,
      period: '1Y'
    }
  },
  'U10246500': {
    id: 'U10246500',
    alias: 'Market Hub',
    type: 'MARKET_HUB',
    ...calculateAccountValues('U10246500'),
    percentage: 15,
    funded: true,
    buyingPower: 225.46,
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