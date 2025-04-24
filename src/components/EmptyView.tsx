import React from 'react';
import { FileQuestion, Scale, Book } from 'lucide-react';

interface EmptyViewProps {
  type: 'insurance' | 'faq' | 'legal';
}

export function EmptyView({ type }: EmptyViewProps) {
  const config = {
    insurance: {
      icon: Scale,
      title: 'Insurance',
      description: 'Insurance services coming soon',
    },
    faq: {
      icon: FileQuestion,
      title: 'FAQ',
      description: 'Frequently asked questions will be available soon',
    },
    legal: {
      icon: Book,
      title: 'Legal',
      description: 'Legal documents and information will be available soon',
    },
  };

  const { icon: Icon, title, description } = config[type];

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-theme-accent/10 dark:bg-theme-accent/20 mb-4">
          <Icon className="w-8 h-8 text-theme-accent" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}