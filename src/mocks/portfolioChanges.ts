import type { PortfolioChange } from '../types/portfolio';
import { portfolioFamilies } from './portfolios';

// Mock portfolio changes data per investment account
export const mockPortfolioChanges: Record<string, PortfolioChange[]> = {
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