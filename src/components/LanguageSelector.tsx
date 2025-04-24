import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'ENG' },
    { code: 'es', name: 'ESP' },
    { code: 'pt', name: 'POR' }
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Globe className="w-4 h-4 hidden sm:block" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              i18n.language === lang.code
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}