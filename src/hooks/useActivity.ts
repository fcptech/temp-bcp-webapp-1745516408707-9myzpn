import { useQuery } from '@tanstack/react-query';
import { ActivityService } from '../services/activity.service';

export function useTransactions(accountId: string, params?: {
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['transactions', accountId, params],
    queryFn: () => ActivityService.getTransactions(accountId, params),
    enabled: !!accountId
  });
}

export function useTransaction(accountId: string, transactionId: string) {
  return useQuery({
    queryKey: ['transaction', accountId, transactionId],
    queryFn: () => ActivityService.getTransaction(accountId, transactionId),
    enabled: !!accountId && !!transactionId
  });
}