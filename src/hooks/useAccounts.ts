import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountsService } from '../services/accounts.service';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => AccountsService.getAccounts()
  });
}

export function useAccount(id?: string) {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => AccountsService.getAccount(id || ''),
    enabled: !!id
  });
}

export function useAccountInstruments(id: string) {
  return useQuery({
    queryKey: ['accounts', id, 'instruments'],
    queryFn: () => AccountsService.getAccountInstruments(id),
    enabled: !!id
  });
}

export function useAccountPerformance(id: string, period: string) {
  return useQuery({
    queryKey: ['accounts', id, 'performance', period],
    queryFn: () => AccountsService.getAccountPerformance(id, period),
    enabled: !!id
  });
}

export function usePortfolio(id: string) {
  return useQuery({
    queryKey: ['accounts', id, 'portfolio'],
    queryFn: () => AccountsService.getPortfolio(id),
    enabled: !!id
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, portfolioId }: { accountId: string, portfolioId: string }) =>
      AccountsService.updatePortfolio(accountId, portfolioId),
    onSuccess: (data, { accountId }) => {
      queryClient.invalidateQueries({ queryKey: ['accounts', accountId, 'portfolio'] });
    }
  });
}