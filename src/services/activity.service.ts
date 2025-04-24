import { api } from '../config/api';
import { z } from 'zod';

const transactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(['RETIRO', 'DEPÓSITO']),
  accountId: z.string(),
  alias: z.string(),
  amount: z.number(),
  status: z.enum(['Cancelado', 'Completado']),
  reason: z.string().optional(),
  comment: z.string().optional()
});

export class ActivityService {
  static async getTransactions(accountId: string, params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get(`/accounts/${accountId}/transactions`, { params });
    return {
      data: z.array(transactionSchema).parse(response.data.transactions),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit
    };
  }

  static async getTransaction(accountId: string, transactionId: string) {
    const response = await api.get(`/accounts/${accountId}/transactions/${transactionId}`);
    return transactionSchema.parse(response.data);
  }
}