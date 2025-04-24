import type { PortfolioFamily } from '../types/portfolio';

export const portfolioFamilies: PortfolioFamily[] = [
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