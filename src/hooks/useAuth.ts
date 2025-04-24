import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthService, type ResetRequest, type ResetPassword } from '../services/auth.service';

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: ResetRequest) => AuthService.requestPasswordReset(data)
  });
}

export function useValidateResetToken(token: string) {
  return useQuery({
    queryKey: ['reset-token', token],
    queryFn: () => AuthService.validateResetToken(token),
    enabled: !!token
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPassword) => AuthService.resetPassword(data)
  });
}