import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './contexts/QueryProvider';
import { WidgetAuthProvider } from './contexts/WidgetAuthContext';
import Dashboard from './pages/Dashboard';
import AccountDetail from './pages/AccountDetail';
import i18n from './i18n';
import './styles/index.css';

interface WidgetConfig {
  containerId: string;
  clientId: string;      // Required client ID
  clientToken: string;   // Required client token
  theme?: 'light' | 'dark';
  language?: 'en' | 'es' | 'pt';
  mode?: 'standalone' | 'embedded';
  view?: 'dashboard' | 'account';
  accountId?: string;
  enabledSections?: string[];
  onError?: (error: Error) => void;
}

class VestivaWidget {
  private container: HTMLElement | null = null;
  private root: ReturnType<typeof createRoot> | null = null;
  private config: WidgetConfig;
  private authToken: string | null = null;

  constructor(config: WidgetConfig) {
    this.config = config;
    this.init();
  }

  private async init() {
    try {
      // 1. Validate required config
      if (!this.config.clientId || !this.config.clientToken) {
        throw new Error('Missing required authentication credentials');
      }

      // 2. Validate domain
      const domainValid = await this.validateDomain();
      if (!domainValid) {
        throw new Error('Unauthorized domain');
      }

      // 3. Get auth token
      const token = await this.authenticate();
      if (!token) {
        throw new Error('Authentication failed');
      }
      this.authToken = token;

      // 4. Initialize i18next
      if (this.config.language) {
        await i18n.changeLanguage(this.config.language);
      }

      // 5. Get container
      const container = document.getElementById(this.config.containerId);
      if (!container) {
        throw new Error(`Container with id "${this.config.containerId}" not found`);
      }

      this.container = container;
      this.root = createRoot(container);
      this.render();

      // Listen for config updates
      window.addEventListener('message', (event) => {
        if (event.data?.type === 'config-update') {
          this.config = { ...this.config, ...event.data.config };
          this.render();
        }
      });

      window.dispatchEvent(new CustomEvent('vestiva:ready', {
        detail: { containerId: this.config.containerId }
      }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Widget initialization failed');
      this.config.onError?.(err);
      window.dispatchEvent(new CustomEvent('vestiva:error', {
        detail: { error: err }
      }));
      throw err;
    }
  }

  private async validateDomain(): Promise<boolean> {
    try {
      const response = await fetch('https://leafy-selkie-648752.netlify.app/api/widget/validate-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.clientToken}`
        },
        body: JSON.stringify({
          clientId: this.config.clientId,
          domain: window.location.origin
        })
      });

      if (!response.ok) {
        return false;
      }

      const { valid } = await response.json();
      return valid;
    } catch (error) {
      return false;
    }
  }

  private async authenticate(): Promise<string | null> {
    try {
      const response = await fetch('https://leafy-selkie-648752.netlify.app/api/widget/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.clientToken}`
        },
        body: JSON.stringify({
          clientId: this.config.clientId,
          domain: window.location.origin
        })
      });

      if (!response.ok) {
        return null;
      }

      const { token } = await response.json();
      return token;
    } catch (error) {
      return null;
    }
  }

  private render() {
    if (!this.root || !this.authToken) return;

    const { view = 'dashboard', accountId, mode = 'embedded', enabledSections } = this.config;

    try {
      this.root.render(
        <React.StrictMode>
          <MemoryRouter>
            <QueryProvider>
              <ThemeProvider initialTheme={this.config.theme}>
                <WidgetAuthProvider token={this.authToken}>
                  {view === 'dashboard' ? (
                    <Dashboard 
                      embedded={mode === 'embedded'} 
                      enabledSections={enabledSections}
                    />
                  ) : (
                    <AccountDetail 
                      embedded={mode === 'embedded'} 
                      accountId={accountId}
                      enabledSections={enabledSections}
                    />
                  )}
                </WidgetAuthProvider>
              </ThemeProvider>
            </QueryProvider>
          </MemoryRouter>
        </React.StrictMode>
      );
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Widget render failed');
      this.config.onError?.(err);
      window.dispatchEvent(new CustomEvent('vestiva:error', {
        detail: { error: err }
      }));
      throw err;
    }
  }

  public destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}

// Export for IIFE bundle
if (typeof window !== 'undefined') {
  (window as any).VestivaWidget = VestivaWidget;
}

// Export for module usage
export default VestivaWidget;