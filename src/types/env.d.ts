/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AUTH_TOKEN: string
  readonly VITE_ENVIRONMENT: 'development' | 'staging' | 'production'
  readonly VITE_OPERATOR_ID: string
  readonly VITE_OPERATOR_NAME: string
  readonly VITE_APP_NAME: string
  readonly VITE_LOGO_URL: string
  readonly VITE_PRIMARY_COLOR: string
  readonly VITE_SECONDARY_COLOR: string
  readonly VITE_ACCENT_COLOR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}