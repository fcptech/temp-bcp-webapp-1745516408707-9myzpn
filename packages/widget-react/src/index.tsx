import { useEffect, useState, useCallback } from 'react';

interface VestivaWidgetConfig {
  clientName: string;
  token: string;
  theme?: 'light' | 'dark';
  language?: 'en' | 'es' | 'pt';
  products?: Array<'AUTOMATED_INVESTMENT' | 'MARKET_HUB'>;
  onSuccess?: (result: any) => void;
  onExit?: (metadata: any) => void;
  onEvent?: (eventName: string, metadata: any) => void;
  onError?: (error: Error) => void;
}

interface VestivaWidgetInstance {
  open: () => void;
  exit: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    VestivaWidget: {
      create: (config: VestivaWidgetConfig) => VestivaWidgetInstance;
    };
  }
}

export function useVestivaWidget(config: VestivaWidgetConfig) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [instance, setInstance] = useState<VestivaWidgetInstance | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://leafy-selkie-648752.netlify.app/widget/widget.js';
    script.async = true;

    script.onload = () => {
      try {
        const widgetInstance = window.VestivaWidget.create(config);
        setInstance(widgetInstance);
        setReady(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize widget'));
        config.onError?.(err instanceof Error ? err : new Error('Failed to initialize widget'));
      }
    };

    script.onerror = () => {
      const err = new Error('Failed to load widget script');
      setError(err);
      config.onError?.(err);
    };

    document.body.appendChild(script);

    return () => {
      instance?.destroy();
      document.body.removeChild(script);
    };
  }, []);

  const open = useCallback(() => {
    if (instance && ready) {
      instance.open();
    }
  }, [instance, ready]);

  const exit = useCallback(() => {
    if (instance) {
      instance.exit();
    }
  }, [instance]);

  return { open, exit, ready, error };
}

export type { VestivaWidgetConfig };