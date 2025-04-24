// Consolidated mock data for Vestiva Investment Platform

// ==========================================
// ACCOUNTS
// ==========================================

// Mock instruments data
const mockInstruments = {
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
function calculateAccountValues(accountId) {
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
const mockAccounts = {
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

// ==========================================
// PORTFOLIOS
// ==========================================

const portfolioFamilies = [
  {
    id: 'blackrock',
    name: 'BlackRock Long-Horizon',
    portfolios: [
      {
        id: 'blackrock-conservador',
        name: 'Conservador',
        type: 'RENTA FIJA',
        stocksPercentage: 21.5,
        bondsPercentage: 78.5,
        allocation: [
          { symbol: 'CSPX', name: 'US Stocks', percentage: 15.60, color: '#3B9AE1' },
          { symbol: 'IJPA', name: 'Japan Stocks', percentage: 1.60, color: '#64B5F6' },
          { symbol: 'LQDA', name: 'US Bonds', percentage: 23.80, color: '#4CAF50' },
          { symbol: 'CSBGU0', name: 'Global Bonds', percentage: 23.70, color: '#2E7D32' },
          { symbol: 'IBTA', name: 'Treasury Bonds', percentage: 21.10, color: '#81C784' },
          { symbol: 'IHYA', name: 'High Yield Bonds', percentage: 5.60, color: '#A5D6A7' }
        ]
      },
      {
        id: 'blackrock-balanceado',
        name: 'Balanceado',
        type: 'RENTA MIXTA',
        stocksPercentage: 41.5,
        bondsPercentage: 58.5,
        allocation: [
          { symbol: 'CSPX', name: 'US Stocks', percentage: 29.40, color: '#3B9AE1' },
          { symbol: 'EIMI', name: 'Emerging Markets', percentage: 4.60, color: '#0066CC' },
          { symbol: 'CEUU', name: 'European Stocks', percentage: 2.60, color: '#41C9E2' },
          { symbol: 'IBTA', name: 'Treasury Bonds', percentage: 14.90, color: '#81C784' },
          { symbol: 'LQDA', name: 'US Bonds', percentage: 17.80, color: '#4CAF50' },
          { symbol: 'CSBGU0', name: 'Global Bonds', percentage: 18.30, color: '#2E7D32' },
          { symbol: 'IHYA', name: 'High Yield Bonds', percentage: 4.60, color: '#A5D6A7' }
        ]
      },
      {
        id: 'blackrock-moderado',
        name: 'Moderado',
        type: 'RENTA MIXTA',
        stocksPercentage: 61.5,
        bondsPercentage: 38.5,
        allocation: [
          { symbol: 'CSPX', name: 'US Stocks', percentage: 43.20, color: '#3B9AE1' },
          { symbol: 'EIMI', name: 'Emerging Markets', percentage: 7.10, color: '#0066CC' },
          { symbol: 'CEUU', name: 'European Stocks', percentage: 4.40, color: '#41C9E2' },
          { symbol: 'IBTA', name: 'Treasury Bonds', percentage: 8.70, color: '#81C784' },
          { symbol: 'LQDA', name: 'US Bonds', percentage: 11.80, color: '#4CAF50' },
          { symbol: 'CSBGU0', name: 'Global Bonds', percentage: 12.80, color: '#2E7D32' },
          { symbol: 'IHYA', name: 'High Yield Bonds', percentage: 3.60, color: '#A5D6A7' }
        ]
      },
      {
        id: 'blackrock-crecimiento',
        name: 'Crecimiento',
        type: 'RENTA VARIABLE',
        stocksPercentage: 81.5,
        bondsPercentage: 18.5,
        allocation: [
          { symbol: 'CSPX', name: 'US Stocks', percentage: 57.00, color: '#3B9AE1' },
          { symbol: 'EIMI', name: 'Emerging Markets', percentage: 9.50, color: '#0066CC' },
          { symbol: 'IJPA', name: 'Japan Stocks', percentage: 4.90, color: '#64B5F6' },
          { symbol: 'CEUU', name: 'European Stocks', percentage: 6.20, color: '#41C9E2' },
          { symbol: 'LQDA', name: 'US Bonds', percentage: 5.80, color: '#4CAF50' },
          { symbol: 'CSBGU0', name: 'Global Bonds', percentage: 7.30, color: '#2E7D32' },
          { symbol: 'IHYA', name: 'High Yield Bonds', percentage: 2.50, color: '#81C784' }
        ]
      },
      {
        id: 'blackrock-renta-variable',
        name: 'Renta Variable',
        type: 'RENTA VARIABLE',
        stocksPercentage: 100,
        bondsPercentage: 0,
        allocation: [
          { symbol: 'CSPX', name: 'US Stocks', percentage: 70.90, color: '#3B9AE1' },
          { symbol: 'EIMI', name: 'Emerging Markets', percentage: 10.70, color: '#0066CC' },
          { symbol: 'IJPA', name: 'Japan Stocks', percentage: 6.20, color: '#64B5F6' },
          { symbol: 'CEUU', name: 'European Stocks', percentage: 7.40, color: '#41C9E2' }
        ]
      }
    ]
  },
  {
    id: 'bcp',
    name: 'BCP Portfolios',
    portfolios: [
      {
        id: 'bcp-growth',
        name: 'Crecimiento',
        type: 'RENTA VARIABLE',
        stocksPercentage: 100,
        bondsPercentage: 0,
        allocation: [
          { symbol: 'VTI', name: 'US Total Market', percentage: 60.00, color: '#3B9AE1' },
          { symbol: 'VEA', name: 'Developed Markets', percentage: 25.00, color: '#41C9E2' },
          { symbol: 'VWO', name: 'Emerging Markets', percentage: 15.00, color: '#64B5F6' }
        ]
      },
      {
        id: 'bcp-balanced',
        name: 'Balanceado',
        type: 'RENTA MIXTA',
        stocksPercentage: 65,
        bondsPercentage: 35,
        allocation: [
          { symbol: 'VTI', name: 'US Total Market', percentage: 40.00, color: '#3B9AE1' },
          { symbol: 'VEA', name: 'Developed Markets', percentage: 15.00, color: '#41C9E2' },
          { symbol: 'VWO', name: 'Emerging Markets', percentage: 10.00, color: '#64B5F6' },
          { symbol: 'BND', name: 'US Bonds', percentage: 25.00, color: '#4CAF50' },
          { symbol: 'BNDX', name: 'International Bonds', percentage: 10.00, color: '#2E7D32' }
        ]
      }
    ]
  }
];

// ==========================================
// PORTFOLIO CHANGES
// ==========================================

// Mock portfolio changes data per investment account
const mockPortfolioChanges = {
  // Joaco's portfolio changes
  'U13186484': [
    {
      id: 'PC003',
      fromPortfolio: portfolioFamilies[0].portfolios[4], // BlackRock Renta Variable
      toPortfolio: portfolioFamilies[1].portfolios[0], // BCP Growth
      requestDate: '2024-04-15',
      status: 'in_progress',
      effectiveDate: '2024-04-22'
    },
    {
      id: 'PC001',
      fromPortfolio: portfolioFamilies[0].portfolios[3], // BlackRock Growth
      toPortfolio: portfolioFamilies[0].portfolios[4], // BlackRock Renta Variable
      requestDate: '2024-04-01',
      status: 'completed',
      completionDate: '2024-04-05',
      effectiveDate: '2024-04-05'
    }
  ],
  
  // Manu's portfolio changes
  'U15043437': [
    {
      id: 'PC004',
      fromPortfolio: portfolioFamilies[0].portfolios[4], // BlackRock Renta Variable
      toPortfolio: portfolioFamilies[1].portfolios[1], // BCP Balanced
      requestDate: '2024-04-15',
      status: 'in_progress',
      effectiveDate: '2024-04-22'
    }
  ]
};

// ==========================================
// WITHDRAWAL ACCOUNTS
// ==========================================

// Mock withdrawal accounts data per investment account
const mockWithdrawalAccounts = {
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

// ==========================================
// TRANSACTIONS
// ==========================================

// Mock transactions for both accounts
const mockTransactions = {
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

// ==========================================
// STATEMENTS
// ==========================================

// Mock data for statements with download URLs
const mockStatements = [
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

const mockTaxDocuments = [
  { 
    type: 'tax', 
    date: '2024-12-31', 
    year: '2024', 
    accountId: 'U13186484',
    documentId: 'F1042S',
    url: 'https://example.com/tax/2024/F1042S.pdf'
  },
];

// ==========================================
// PERFORMANCE DATA
// ==========================================

const monthlyData = [
  { month: 'ABR 2025', value: -5.36 },
  { month: 'MAR 2025', value: -4.03 },
  { month: 'FEB 2025', value: -2.11 },
  { month: 'ENE 2025', value: 3.34 },
  { month: 'DIC 2024', value: -1.3 },
  { month: 'NOV 2024', value: 3.69 },
  { month: 'OCT 2024', value: -1.33 },
  { month: 'SEP 2024', value: 5.71 },
  { month: 'AGO 2024', value: 3.25 },
  { month: 'JUL 2024', value: 2.31 },
];

const historicalDataByYear = {
  '2024': [
    { date: '2024-07', value: 2.31 },
    { date: '2024-08', value: 3.25 },
    { date: '2024-09', value: 5.71 },
    { date: '2024-10', value: -1.33 },
    { date: '2024-11', value: 3.69 },
    { date: '2024-12', value: -1.3 },
  ],
  '2025': [
    { date: '2025-01', value: 3.34 },
    { date: '2025-02', value: -2.11 },
    { date: '2025-03', value: -4.03 },
    { date: '2025-04', value: -5.36 },
  ]
};

const historicalDataByPeriod = {
  '6M': [
    { date: '2024-11', value: 3.69 },
    { date: '2024-12', value: 2.39 },
    { date: '2025-01', value: 5.73 },
    { date: '2025-02', value: 3.62 },
    { date: '2025-03', value: -0.41 },
    { date: '2025-04', value: -5.36 },
  ],
  '1Y': [
    { date: '2024-05', value: 1.25 },
    { date: '2024-06', value: 2.31 },
    { date: '2024-07', value: 3.25 },
    { date: '2024-08', value: 5.71 },
    { date: '2024-09', value: 4.38 },
    { date: '2024-10', value: 7.82 },
    { date: '2024-11', value: 6.52 },
    { date: '2024-12', value: 9.86 },
    { date: '2025-01', value: 7.95 },
    { date: '2025-02', value: 4.92 },
    { date: '2025-03', value: -0.41 },
    { date: '2025-04', value: -5.36 },
  ],
  'inception': [
    { date: '2024-01', value: 0 },
    { date: '2024-02', value: 1.52 },
    { date: '2024-03', value: 2.83 },
    { date: '2024-04', value: 3.91 },
    { date: '2024-05', value: 1.25 },
    { date: '2024-06', value: 2.31 },
    { date: '2024-07', value: 3.25 },
    { date: '2024-08', value: 5.71 },
    { date: '2024-09', value: 4.38 },
    { date: '2024-10', value: 7.82 },
    { date: '2024-11', value: 6.52 },
    { date: '2024-12', value: 9.86 },
    { date: '2025-01', value: 7.95 },
    { date: '2025-02', value: 4.92 },
    { date: '2025-03', value: -0.41 },
    { date: '2025-04', value: -5.36 },
  ],
};

// ==========================================
// THEME CONFIGURATION
// ==========================================

const operators = [
  {
    id: 'vestiva',
    name: 'Vestiva',
    appName: 'Vestiva Investment Platform',
    logoUrl: 'https://example.com/vestiva-logo.png',
    theme: {
      id: 'vestiva',
      name: 'Vestiva',
      colors: {
        primary: '#002060',
        secondary: '#003087',
        accent: '#0047BB',
        primaryRgb: '0, 32, 96',
        secondaryRgb: '0, 48, 135',
        accentRgb: '0, 71, 187',
      },
      logoBackground: 'white'
    }
  },
  {
    id: 'invex',
    name: 'Invex',
    appName: 'Invex Investments',
    logoUrl: 'https://example.com/invex-logo.png',
    theme: {
      id: 'invex',
      name: 'Invex',
      colors: {
        primary: '#EF4444',
        secondary: '#DC2626',
        accent: '#B91C1C',
        primaryRgb: '239, 68, 68',
        secondaryRgb: '220, 38, 38',
        accentRgb: '185, 28, 28',
      },
      logoBackground: 'white'
    }
  }
];

const colorThemes = [
  {
    id: 'vestiva',
    name: 'Vestiva',
    colors: {
      primary: '#002060',
      secondary: '#003087',
      accent: '#0047BB',
      primaryRgb: '0, 32, 96',
      secondaryRgb: '0, 48, 135',
      accentRgb: '0, 71, 187',
    },
    logoBackground: 'white'
  },
  {
    id: 'invex',
    name: 'Invex',
    colors: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#B91C1C',
      primaryRgb: '239, 68, 68',
      secondaryRgb: '220, 38, 38',
      accentRgb: '185, 28, 28',
    },
    logoBackground: 'white'
  },
  {
    id: 'dolarapp',
    name: 'DolarApp',
    colors: {
      primary: '#34D399',
      secondary: '#059669',
      accent: '#047857',
      primaryRgb: '52, 211, 153',
      secondaryRgb: '5, 150, 105',
      accentRgb: '4, 120, 87',
    },
    logoBackground: 'primary'
  },
  {
    id: 'azul',
    name: 'Azul',
    colors: {
      primary: '#60A5FA',
      secondary: '#3B82F6',
      accent: '#1D4ED8',
      primaryRgb: '96, 165, 250',
      secondaryRgb: '59, 130, 246',
      accentRgb: '29, 78, 216',
    },
    logoBackground: 'white'
  },
  {
    id: 'verde',
    name: 'Verde',
    colors: {
      primary: '#34D399',
      secondary: '#059669',
      accent: '#047857',
      primaryRgb: '52, 211, 153',
      secondaryRgb: '5, 150, 105',
      accentRgb: '4, 120, 87',
    },
    logoBackground: 'primary'
  },
  {
    id: 'purpura',
    name: 'Púrpura',
    colors: {
      primary: '#A78BFA',
      secondary: '#7C3AED',
      accent: '#6D28D9',
      primaryRgb: '167, 139, 250',
      secondaryRgb: '124, 58, 237',
      accentRgb: '109, 40, 217',
    },
    logoBackground: 'white'
  },
  {
    id: 'escala-grises',
    name: 'Escala de Grises',
    colors: {
      primary: '#6B7280',
      secondary: '#4B5563',
      accent: '#374151',
      primaryRgb: '107, 114, 128',
      secondaryRgb: '75, 85, 99',
      accentRgb: '55, 65, 81',
    },
    logoBackground: 'white'
  },
  {
    id: 'negro-total',
    name: 'Negro Total',
    colors: {
      primary: '#1F2937',
      secondary: '#111827',
      accent: '#030712',
      primaryRgb: '31, 41, 55',
      secondaryRgb: '17, 24, 39',
      accentRgb: '3, 7, 18',
    },
    logoBackground: 'white'
  },
];

// ==========================================
// USERS
// ==========================================

// Simulated user data
const MOCK_USERS = [
  { id: '1', email: 'demo@example.com', password: 'demo123', name: 'Demo User' }
];

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  mockInstruments,
  mockAccounts,
  portfolioFamilies,
  mockPortfolioChanges,
  mockWithdrawalAccounts,
  mockTransactions,
  mockStatements,
  mockTaxDocuments,
  monthlyData,
  historicalDataByYear,
  historicalDataByPeriod,
  operators,
  colorThemes,
  MOCK_USERS
};