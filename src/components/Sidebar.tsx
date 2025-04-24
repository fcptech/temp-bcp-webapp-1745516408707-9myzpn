import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, PieChart, HelpCircle, Book, Scale, Layout, Bug, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// First account ID to redirect to
const FIRST_ACCOUNT_ID = 'U13186484';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

  const navigationItems = [
    { icon: Home, path: '/', translationKey: 'nav.home' },
    { icon: PieChart, path: `/account/${FIRST_ACCOUNT_ID}`, translationKey: 'nav.investments' },
    { icon: Scale, path: '/insurance', translationKey: 'nav.insurance' },
    { icon: HelpCircle, path: '/faq', translationKey: 'nav.faq' },
    { icon: Book, path: '/legal', translationKey: 'nav.legal' },
    { icon: FileText, path: '/api-docs', label: 'API DOCS' },
    { type: 'separator' },
    { icon: Layout, path: '/widget-demo', label: 'WIDGET DEMO' },
    { type: 'separator' },
    { icon: Bug, path: '/debug', label: 'DEBUG' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path, { replace: true });
  };

  const isActive = (path: string) => {
    if (path.startsWith('/account/')) {
      return location.pathname.startsWith('/account/');
    }
    return location.pathname === path;
  };

  const logoBackgroundClass = colorTheme.logoBackground === 'white' 
    ? 'bg-white dark:bg-gray-800' 
    : 'bg-theme-primary dark:bg-gray-900';

  const logoTextClass = colorTheme.logoBackground === 'white'
    ? 'text-theme-primary dark:text-theme-accent'
    : 'text-white';

  return (
    <div className="h-full bg-theme-primary dark:bg-gray-900">
      {/* Logo Area */}
      <div className={`h-16 flex items-center px-6 ${logoBackgroundClass}`}>
        <div className="flex items-center gap-2">
          <div className={logoTextClass}>
            <PieChart className="w-8 h-8" />
          </div>
          <span className={`text-2xl font-bold ${logoTextClass}`}>
            Vestiva
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-2 px-2">
        {navigationItems.map((item) => {
          if (item.type === 'separator') {
            return <div key="separator" className="my-2 border-t border-blue-900 dark:border-gray-700" />;
          }

          const Icon = item.icon;
          return (
            <button
              key={item.translationKey || item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center w-full px-4 py-3 text-sm rounded-md mb-1 transition-colors ${
                isActive(item.path)
                  ? 'bg-theme-secondary text-white'
                  : 'text-blue-100 dark:text-gray-300 hover:bg-theme-secondary hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.translationKey ? t(item.translationKey) : item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}