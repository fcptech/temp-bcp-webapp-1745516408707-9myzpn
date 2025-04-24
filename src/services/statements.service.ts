import { api } from '../config/api';
import { z } from 'zod';

const statementSchema = z.object({
  id: z.string(),
  type: z.enum(['monthly', 'annual', 'tax']),
  date: z.string(),
  year: z.string(),
  month: z.string().optional(),
  accountId: z.string(),
  documentId: z.string().optional(),
  url: z.string().url()
});

export class StatementsService {
  static async getStatements(accountId: string, params?: {
    type?: string;
    year?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get(`/accounts/${accountId}/statements`, { params });
    return {
      data: z.array(statementSchema).parse(response.data.statements),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit
    };
  }

  static async getTaxDocuments(accountId: string, year?: string) {
    const response = await api.get(`/accounts/${accountId}/tax-documents`, {
      params: { year }
    });
    return z.array(statementSchema).parse(response.data);
  }

  static async downloadStatement(statement: z.infer<typeof statementSchema>) {
    const response = await api.get(`/statements/${statement.id}/download`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${statement.accountId}_${statement.date.replace(/-/g, '')}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}