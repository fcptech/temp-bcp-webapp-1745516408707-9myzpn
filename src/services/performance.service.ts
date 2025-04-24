import { api } from '../config/api';
import { z } from 'zod';

const performanceDataSchema = z.object({
  period: z.string(),
  data: z.array(z.object({
    date: z.string(),
    value: z.number(),
    percentage: z.number()
  }))
});

const performanceStatsSchema = z.object({
  netGains: z.number(),
  totalReturn: z.number(),
  lastUpdate: z.string()
});

export class PerformanceService {
  static async getPerformanceData(accountId: string, period: string) {
    const response = await api.get(`/accounts/${accountId}/performance`, {
      params: { period }
    });
    return performanceDataSchema.parse(response.data);
  }

  static async getPerformanceStats(accountId: string) {
    const response = await api.get(`/accounts/${accountId}/performance/stats`);
    return performanceStatsSchema.parse(response.data);
  }

  static async getMonthlyReturns(accountId: string) {
    const response = await api.get(`/accounts/${accountId}/performance/monthly`);
    return z.array(z.object({
      month: z.string(),
      value: z.number()
    })).parse(response.data);
  }
}