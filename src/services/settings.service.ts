import { api } from '../config/api';
import { z } from 'zod';

const withdrawalAccountSchema = z.object({
  id: z.string(),
  alias: z.string(),
  type: z.enum(['bank', 'financial']),
  accountNumber: z.string(),
  status: z.enum(['active', 'pending', 'rejected']),
  country: z.string(),
  currency: z.string(),
  routingNumber: z.string().optional()
});

const accountSettingsSchema = z.object({
  id: z.string(),
  alias: z.string(),
  type: z.enum(['AUTOMATED_INVESTMENT', 'MARKET_HUB']),
  accountType: z.string(),
  holders: z.array(z.string()),
  documents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    date: z.string(),
    url: z.string()
  })),
  support: z.object({
    email: z.string(),
    phone: z.string()
  })
});

export class SettingsService {
  static async getAccountSettings(accountId: string) {
    const response = await api.get(`/accounts/${accountId}/settings`);
    return accountSettingsSchema.parse(response.data);
  }

  static async updateAccountAlias(accountId: string, alias: string) {
    const response = await api.put(`/accounts/${accountId}/alias`, { alias });
    return accountSettingsSchema.parse(response.data);
  }

  static async getWithdrawalAccounts(accountId: string) {
    const response = await api.get(`/accounts/${accountId}/withdrawal-accounts`);
    return z.array(withdrawalAccountSchema).parse(response.data);
  }

  static async addWithdrawalAccount(accountId: string, data: {
    alias: string;
    type: 'bank' | 'financial';
    accountNumber: string;
    country: string;
    currency: string;
    routingNumber?: string;
    documents: File[];
  }) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'documents') {
        formData.append(key, value);
      }
    });
    
    data.documents.forEach(file => {
      formData.append('documents', file);
    });

    const response = await api.post(
      `/accounts/${accountId}/withdrawal-accounts`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return withdrawalAccountSchema.parse(response.data);
  }

  static async deleteWithdrawalAccount(accountId: string, withdrawalAccountId: string) {
    await api.delete(`/accounts/${accountId}/withdrawal-accounts/${withdrawalAccountId}`);
  }

  static async downloadDocument(accountId: string, documentId: string) {
    const response = await api.get(
      `/accounts/${accountId}/documents/${documentId}/download`,
      { responseType: 'blob' }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `document_${documentId}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}