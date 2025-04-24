import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { EmptyView } from '../components/EmptyView';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <MainLayout title={t('nav.faq')}>
      <EmptyView type="faq" />
    </MainLayout>
  );
}