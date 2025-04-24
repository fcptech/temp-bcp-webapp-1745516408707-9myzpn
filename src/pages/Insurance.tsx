import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { Smartphone, Apple, QrCode } from 'lucide-react';

export default function Insurance() {
  const { t } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState<'android' | 'ios'>('android');

  const platforms = {
    android: {
      icon: Smartphone,
      name: 'Android',
      storeImage: 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.amedex.app',
      qrCode: true
    },
    ios: {
      icon: Apple,
      name: 'iOS',
      storeImage: 'https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg',
      storeUrl: 'https://apps.apple.com/app/amedex/id1234567890',
      qrCode: true
    }
  };

  return (
    <MainLayout title={t('nav.insurance')}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Gestiona tu seguro de vida desde la app móvil
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Descarga nuestra aplicación para gestionar tu seguro de vida de manera fácil y segura
            </p>
          </div>

          {/* Platform Selection */}
          <div className="flex justify-center gap-4 mb-8">
            {Object.entries(platforms).map(([key, platform]) => {
              const Icon = platform.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPlatform(key as 'android' | 'ios')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    selectedPlatform === key
                      ? 'bg-theme-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{platform.name}</span>
                </button>
              );
            })}
          </div>

          {/* Download Options */}
          <div className="space-y-6">
            {/* Store Badge */}
            <div className="flex justify-center">
              <a 
                href={platforms[selectedPlatform].storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img 
                  src={platforms[selectedPlatform].storeImage}
                  alt={`Download on ${platforms[selectedPlatform].name}`}
                  className="h-16"
                />
              </a>
            </div>

            {/* QR Code Section */}
            {platforms[selectedPlatform].qrCode && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <QrCode className="w-4 h-4" />
                  <span>o escanéa el QR</span>
                </div>
                <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(platforms[selectedPlatform].storeUrl)}`}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}