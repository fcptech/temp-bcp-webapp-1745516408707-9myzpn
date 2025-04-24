import { z } from 'zod';

export interface Portfolio {
  id: string;
  name: string;
  type: string;
  stocksPercentage: number;
  bondsPercentage: number;
  allocation: {
    symbol: string;
    name: string;
    percentage: number;
    color: string;
  }[];
}

export interface PortfolioFamily {
  id: string;
  name: string;
  portfolios: Portfolio[];
}

export interface PortfolioChange {
  id: string;
  fromPortfolio: Portfolio;
  toPortfolio: Portfolio;
  requestDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  completionDate?: string;
  effectiveDate?: string;
}

export const PortfolioChangeSchema = z.object({
  id: z.string(),
  fromPortfolio: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    stocksPercentage: z.number(),
    bondsPercentage: z.number(),
    allocation: z.array(z.object({
      symbol: z.string(),
      name: z.string(),
      percentage: z.number(),
      color: z.string()
    }))
  }),
  toPortfolio: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    stocksPercentage: z.number(),
    bondsPercentage: z.number(),
    allocation: z.array(z.object({
      symbol: z.string(),
      name: z.string(),
      percentage: z.number(),
      color: z.string()
    }))
  }),
  requestDate: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  completionDate: z.string().optional(),
  effectiveDate: z.string().optional()
});