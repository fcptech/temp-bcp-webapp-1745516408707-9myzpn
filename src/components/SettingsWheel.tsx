import React, { useState } from 'react';
import { Settings, Globe, Sun, Moon, Palette, Layout, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme, colorThemes, operators } from '../contexts/ThemeContext';

export function SettingsWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'language' | 'colors' | 'operator'>('operator');
  const { i18n } = useTranslation();
  const { theme, colorTheme, operator, toggleTheme, setColorTheme, setOperator, toggleLogoBackground } = useTheme();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
  ];

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all duration-300 ${
          isOpen
            ? 'bg-theme-primary text-white rotate-180'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('operator')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'operator'
                    ? 'border-b-2 border-theme-primary text-theme-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Building2 className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'theme'
                    ? 'border-b-2 border-theme-primary text-theme-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {theme === 'light' ? <Sun className="w-4 h-4 mx-auto" /> : <Moon className="w-4 h-4 mx-auto" />}
              </button>
              <button
                onClick={() => setActiveTab('language')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'language'
                    ? 'border-b-2 border-theme-primary text-theme-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Globe className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'colors'
                    ? 'border-b-2 border-theme-primary text-theme-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Palette className="w-4 h-4 mx-auto" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === 'operator' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Operator</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {operators.map((op) => (
                      <button
                        key={op.id}
                        onClick={() => setOperator(op.id)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          operator.id === op.id
                            ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-theme-accent'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700" />
                          <span className={`text-xs font-medium ${
                            operator.id === op.id
                              ? 'text-theme-primary'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {op.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Theme Mode</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                        theme === 'light'
                          ? 'border-theme-primary bg-theme-accent/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Sun className="w-5 h-5 text-gray-900 dark:text-white" />
                    </button>
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'border-theme-primary bg-theme-accent/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Logo Background</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => colorTheme.logoBackground === 'primary' && toggleLogoBackground()}
                        className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                          colorTheme.logoBackground === 'white'
                            ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <Layout className="w-5 h-5 text-gray-900 dark:text-white" />
                        <span className="ml-2 text-sm">White</span>
                      </button>
                      <button
                        onClick={() => colorTheme.logoBackground === 'white' && toggleLogoBackground()}
                        className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                          colorTheme.logoBackground === 'primary'
                            ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <Layout className="w-5 h-5 text-gray-900 dark:text-white" />
                        <span className="ml-2 text-sm">Theme</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Language</h3>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                          i18n.language === lang.code
                            ? 'bg-theme-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Color Theme</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setColorTheme(theme.id)}
                        className={`group p-3 rounded-lg border-2 transition-colors ${
                          colorTheme.id === theme.id
                            ? 'border-theme-primary bg-theme-accent/10 dark:bg-theme-accent/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-theme-accent'
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          {Object.values(theme.colors).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-medium ${
                          colorTheme.id === theme.id
                            ? 'text-theme-primary'
                            : 'text-gray-700 dark:text-gray-300 group-hover:text-theme-accent'
                        }`}>
                          {theme.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}