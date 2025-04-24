import { useQuery } from '@tanstack/react-query';
import { PerformanceService } from '../services/performance.service';

export function usePerformanceData(accountId: string, period: string) {
  return useQuery({
    queryKey: ['performance', accountId, period],
    queryFn: () => PerformanceService.getPerformanceData(accountId, period),
    enabled: !!accountId
  });
}

export function usePerformanceStats(accountId: string) {
  return useQuery({
    queryKey: ['performance-stats', accountId],
    queryFn: () => PerformanceService.getPerformanceStats(accountId),
    enabled: !!accountId
  });
}

export function useMonthlyReturns(accountId: string) {
  return useQuery({
    queryKey: ['monthly-returns', accountId],
    queryFn: () => PerformanceService.getMonthlyReturns(accountId),
    enabled: !!accountId
  });
}