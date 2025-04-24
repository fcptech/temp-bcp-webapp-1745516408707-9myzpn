import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsService } from '../services/settings.service';
import { mockWithdrawalAccounts } from '../mocks/withdrawalAccounts';
import type { WithdrawalAccount } from '../types/account';

export function useAccountSettings(accountId: string) {
  return useQuery({
    queryKey: ['account-settings', accountId],
    queryFn: () => SettingsService.getAccountSettings(accountId),
    enabled: !!accountId
  });
}

export function useUpdateAccountAlias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, alias }: { accountId: string; alias: string }) =>
      SettingsService.updateAccountAlias(accountId, alias),
    onSuccess: (data, { accountId }) => {
      queryClient.invalidateQueries({ queryKey: ['account-settings', accountId] });
    }
  });
}

export function useWithdrawalAccounts(accountId: string) {
  return useQuery({
    queryKey: ['withdrawal-accounts', accountId],
    queryFn: () => {
      // Return mock data directly
      return mockWithdrawalAccounts[accountId] || [];
    },
    enabled: !!accountId
  });
}

export function useAddWithdrawalAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, data }: { 
      accountId: string; 
      data: Parameters<typeof SettingsService.addWithdrawalAccount>[1];
    }) => SettingsService.addWithdrawalAccount(accountId, data),
    onSuccess: (data, { accountId }) => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal-accounts', accountId] });
    }
  });
}

export function useDeleteWithdrawalAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, withdrawalAccountId }: { 
      accountId: string;
      withdrawalAccountId: string;
    }) => {
      // Log the deletion attempt
      window.dispatchEvent(new CustomEvent('debug:log', {
        detail: {
          timestamp: new Date().toISOString(),
          type: 'info',
          module: 'WithdrawalAccounts',
          message: `Attempting to delete withdrawal account`,
          details: { accountId, withdrawalAccountId }
        }
      }));

      try {
        // Get current accounts from localStorage or mock data
        const storedAccounts = localStorage.getItem('withdrawalAccounts');
        let accounts = storedAccounts ? JSON.parse(storedAccounts) : { ...mockWithdrawalAccounts };
        
        // If account list doesn't exist for this accountId, use mock data
        if (!accounts[accountId]) {
          accounts[accountId] = [...(mockWithdrawalAccounts[accountId] || [])];
        }

        // Filter out the account to delete
        accounts[accountId] = accounts[accountId].filter(
          (account: WithdrawalAccount) => account.id !== withdrawalAccountId
        );

        // Save updated accounts back to localStorage
        localStorage.setItem('withdrawalAccounts', JSON.stringify(accounts));

        // Log successful deletion
        window.dispatchEvent(new CustomEvent('debug:log', {
          detail: {
            timestamp: new Date().toISOString(),
            type: 'info',
            module: 'WithdrawalAccounts',
            message: 'Successfully deleted withdrawal account',
            details: { accountId, withdrawalAccountId }
          }
        }));

        // Return success
        return { success: true };
      } catch (error) {
        // Log error
        window.dispatchEvent(new CustomEvent('debug:log', {
          detail: {
            timestamp: new Date().toISOString(),
            type: 'error',
            module: 'WithdrawalAccounts',
            message: 'Failed to delete withdrawal account',
            details: { accountId, withdrawalAccountId, error }
          }
        }));
        throw error;
      }
    },
    onSuccess: (_, { accountId }) => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal-accounts', accountId] });
    }
  });
}