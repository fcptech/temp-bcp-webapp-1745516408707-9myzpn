import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart2, Eye, EyeOff, XCircle, ArrowLeft } from 'lucide-react';
import { useRequestPasswordReset, useValidateResetToken, useResetPassword } from '../hooks/useAuth';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Request reset states
  const [email, setEmail] = useState('');
  
  // Reset password states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mutations
  const requestReset = useRequestPasswordReset();
  const resetPassword = useResetPassword();
  
  // Token validation
  const { data: isValidToken, isLoading: validatingToken } = useValidateResetToken(token || '');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestReset.mutateAsync({ email });
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await resetPassword.mutateAsync({
        token,
        password,
        confirmPassword
      });
      navigate('/login');
    } catch (error) {
      // Handle error
    }
  };

  if (token) {
    if (validatingToken) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-theme-primary to-theme-secondary dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-theme-accent/10 dark:bg-theme-accent/20 rounded-full mb-4">
              <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('auth.resetPassword.validating')}
            </h2>
          </div>
        </div>
      );
    }

    if (!isValidToken) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-theme-primary to-theme-secondary dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('auth.resetPassword.invalidToken')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t('auth.resetPassword.invalidTokenMessage')}
            </p>
            <button
              onClick={() => navigate('/reset-password')}
              className="w-full px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-secondary transition-colors"
            >
              {t('auth.resetPassword.requestNew')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-theme-primary to-theme-secondary dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-theme-accent/10 dark:bg-theme-accent/20 rounded-full mb-4">
              <BarChart2 className="w-8 h-8 text-theme-accent" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('auth.resetPassword.title')}
            </h2>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.resetPassword.newPassword')}
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-theme-accent focus:border-theme-accent dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.resetPassword.confirmPassword')}
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-theme-accent focus:border-theme-accent dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={resetPassword.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-primary hover:bg-theme-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent disabled:opacity-50 dark:focus:ring-offset-gray-800"
            >
              {resetPassword.isPending ? t('common.loading') : t('auth.resetPassword.submit')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-primary to-theme-secondary dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/login"
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {t('common.back')}
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-theme-accent/10 dark:bg-theme-accent/20 rounded-full">
            <BarChart2 className="w-8 h-8 text-theme-accent" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.resetPassword.request')}
          </h2>
        </div>

        <form onSubmit={handleRequestReset} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('common.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-theme-accent focus:border-theme-accent dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={requestReset.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-primary hover:bg-theme-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent disabled:opacity-50 dark:focus:ring-offset-gray-800"
          >
            {requestReset.isPending ? t('common.loading') : t('auth.resetPassword.requestSubmit')}
          </button>
        </form>
      </div>
    </div>
  );
}