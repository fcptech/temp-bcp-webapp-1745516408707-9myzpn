import { api } from '../config/api';
import { z } from 'zod';
import { mockAccounts, mockInstruments } from '../mocks/accounts';

// Validation schemas
const accountSchema = z.object({
  id: z.string(),
  alias: z.string(),
  type: z.string(),
  value: z.number(),
  percentage: z.number(),
  performance: z.object({
    total: z.number(),
    percentage: z.number(),
    period: z.string()
  })
});

export type Account = z.infer<typeof accountSchema>;

const portfolioSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  allocation: z.array(z.object({
    symbol: z.string(),
    name: z.string(),
    percentage: z.number(),
    color: z.string()
  }))
});

export type Portfolio = z.infer<typeof portfolioSchema>;

export class AccountsService {
  static async getAccounts() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return Object.values(mockAccounts);
  }

  static async getAccount(id: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAccounts[id];
  }

  static async getAccountInstruments(id: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInstruments[id] || [];
  }

  static async getAccountPerformance(id: string, period: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: [], // Add mock performance data here
      period
    };
  }

  static async getPortfolio(id: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const account = mockAccounts[id];
    const instruments = mockInstruments[id] || [];
    
    return {
      id: `portfolio-${id}`,
      name: account.type === 'MARKET_HUB' ? 'Market Hub' : 'Renta Variable',
      type: account.type,
      allocation: instruments.map(inst => ({
        symbol: inst.symbol,
        name: inst.name,
        percentage: inst.percentage,
        color: inst.color
      }))
    };
  }

  static async updatePortfolio(accountId: string, portfolioId: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: portfolioId,
      accountId,
      status: 'pending'
    };
  }
}