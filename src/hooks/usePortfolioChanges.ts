import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockPortfolioChanges } from '../mocks/portfolioChanges';
import type { PortfolioChange } from '../types/portfolio';

export function usePortfolioChanges(accountId: string) {
  return useQuery({
    queryKey: ['portfolio-changes', accountId],
    queryFn: () => Promise.resolve(mockPortfolioChanges[accountId] || [])
  });
}

export function useLatestPortfolioChange(accountId: string) {
  return useQuery({
    queryKey: ['latest-portfolio-change', accountId],
    queryFn: () => {
      const changes = mockPortfolioChanges[accountId] || [];
      const activeChange = changes.find(change => 
        change.status === 'pending' || change.status === 'in_progress'
      );
      return Promise.resolve(activeChange || null);
    }
  });
}

export function useCancelPortfolioChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, changeId }: { accountId: string; changeId: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update mock data
      const changes = mockPortfolioChanges[accountId] || [];
      const change = changes.find(c => c.id === changeId);
      if (change) {
        change.status = 'cancelled';
      }

      return change;
    },
    onSuccess: (_, { accountId }) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-changes', accountId] });
      queryClient.invalidateQueries({ queryKey: ['latest-portfolio-change', accountId] });
    }
  });
}