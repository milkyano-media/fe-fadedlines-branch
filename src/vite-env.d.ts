/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEW_API: string
  readonly VITE_API_WEB_BASE_URL: string
  readonly VITE_API_KEY_SQUARE: string
  readonly VITE_SQUARE_LOCATION_ID: string
  readonly VITE_DASHBOARD_KEY: string
  readonly VITE_BASE_URL_MINIO: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_MAINTENANCE_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
