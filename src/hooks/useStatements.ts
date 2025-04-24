import { useQuery } from '@tanstack/react-query';
import { StatementsService } from '../services/statements.service';

export function useStatements(accountId: string, params?: {
  type?: string;
  year?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['statements', accountId, params],
    queryFn: () => StatementsService.getStatements(accountId, params),
    enabled: !!accountId
  });
}

export function useTaxDocuments(accountId: string, year?: string) {
  return useQuery({
    queryKey: ['tax-documents', accountId, year],
    queryFn: () => StatementsService.getTaxDocuments(accountId, year),
    enabled: !!accountId
  });
}