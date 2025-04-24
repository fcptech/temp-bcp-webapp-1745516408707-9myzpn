// Vestiva Widget Loader
(function() {
  const debug = {
    log: (...args) => console.log('[Vestiva Widget]', ...args),
    error: (...args) => console.error('[Vestiva Widget Error]', ...args)
  };

  // Base URL for the deployed application
  const BASE_URL = 'https://leafy-selkie-648752.netlify.app';

  class VestivaWidget {
    constructor(config) {
      this.config = config;
      this.container = null;
      this.iframe = null;
      this.messageHandler = this.handleMessage.bind(this);
      this.init();
    }

    init() {
      try {
        // Get container
        this.container = document.getElementById(this.config.containerId);
        if (!this.container) {
          throw new Error(`Container with id "${this.config.containerId}" not found`);
        }

        // Create iframe if it doesn't exist
        if (!this.iframe) {
          this.iframe = document.createElement('iframe');
          this.iframe.style.width = '100%';
          this.iframe.style.height = '100%';
          this.iframe.style.border = 'none';
          this.iframe.style.borderRadius = 'inherit';
          
          // Add message listener
          window.addEventListener('message', this.messageHandler);
        }

        // Update iframe URL with current config
        this.updateIframeSrc();

        // Add iframe to container if not already added
        if (!this.iframe.parentNode) {
          this.container.appendChild(this.iframe);
        }

        debug.log('Widget initialized successfully');
        window.dispatchEvent(new CustomEvent('vestiva:ready', {
          detail: { containerId: this.config.containerId }
        }));
      } catch (error) {
        debug.error('Failed to initialize widget:', error);
        window.dispatchEvent(new CustomEvent('vestiva:error', {
          detail: { error }
        }));
        throw error;
      }
    }

    updateIframeSrc() {
      // Build URL with current config
      const params = new URLSearchParams();
      
      // Required parameters
      params.append('embedded', 'true');
      params.append('theme', this.config.theme || 'light');
      params.append('language', this.config.language || 'es');
      params.append('mode', this.config.mode || 'embedded');
      
      // View and account specific parameters
      if (this.config.view === 'account' && this.config.accountId) {
        params.append('view', 'account');
        params.append('accountId', this.config.accountId);
      } else {
        params.append('view', 'dashboard');
      }

      // Optional parameters
      if (Array.isArray(this.config.enabledSections) && this.config.enabledSections.length > 0) {
        params.append('sections', this.config.enabledSections.join(','));
      }

      // Set iframe src
      const url = `${BASE_URL}?${params.toString()}`;
      debug.log('Updating iframe URL:', url);
      
      if (this.iframe.src !== url) {
        this.iframe.src = url;
      }
    }

    handleMessage(event) {
      // Only accept messages from our iframe
      if (event.origin !== BASE_URL) return;

      const { type, data } = event.data;

      switch (type) {
        case 'height':
          // Update iframe height if needed
          if (data.height) {
            this.iframe.style.height = `${data.height}px`;
          }
          break;

        case 'ready':
          debug.log('Widget content ready');
          break;

        case 'error':
          debug.error('Widget error:', data.error);
          window.dispatchEvent(new CustomEvent('vestiva:error', {
            detail: { error: data.error }
          }));
          break;

        default:
          // Forward any other events
          window.dispatchEvent(new CustomEvent(`vestiva:${type}`, {
            detail: data
          }));
      }
    }

    updateConfig(newConfig) {
      try {
        debug.log('Updating widget config:', newConfig);
        
        // Merge new config with existing config
        this.config = { ...this.config, ...newConfig };
        
        // Update iframe with new configuration
        this.updateIframeSrc();

        debug.log('Widget config updated successfully');
      } catch (error) {
        debug.error('Failed to update widget config:', error);
        window.dispatchEvent(new CustomEvent('vestiva:error', {
          detail: { error }
        }));
        throw error;
      }
    }

    destroy() {
      if (this.iframe) {
        window.removeEventListener('message', this.messageHandler);
        this.iframe.remove();
        this.iframe = null;
      }
    }
  }

  // Export for global usage
  window.VestivaWidget = VestivaWidget;
  
  // Initialize widget function
  window.initVestivaWidget = async function(config) {
    try {
      return new VestivaWidget(config);
    } catch (error) {
      debug.error('Failed to initialize widget:', error);
      window.dispatchEvent(new CustomEvent('vestiva:error', {
        detail: { error }
      }));
      throw error;
    }
  };

  // Listen for widget events
  window.addEventListener('vestiva:ready', (e) => {
    debug.log('Widget ready:', e.detail);
  });

  window.addEventListener('vestiva:error', (e) => {
    debug.error('Widget error:', e.detail);
  });
})();