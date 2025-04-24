import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SettingsWheel } from './SettingsWheel';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  embedded?: boolean;
}

export function Header({ title, onMenuClick, embedded = false }: HeaderProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {!embedded && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden -ml-1 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-2 lg:ml-0 truncate">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <SettingsWheel />
            {!embedded && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-5 w-5" />
                </button>

                {showUserMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                          {user?.email}
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {t('common.signOut')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}