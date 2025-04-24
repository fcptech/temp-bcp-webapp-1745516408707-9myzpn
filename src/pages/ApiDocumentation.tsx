import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useTranslation } from 'react-i18next';

export default function ApiDocumentation() {
  const { t } = useTranslation();

  return (
    <MainLayout title="API Documentation">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <iframe 
          src="/docs/api-documentation.html" 
          className="w-full h-[80vh] border-0"
          title="API Documentation"
        />
      </div>
      <iframe 
          src="/docs/api-documentation-express.html" 
          className="w-full h-[80vh] border-0"
          title="API Documentation"
        />
    </MainLayout>
  );
}