/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBFONT_BASE_URL?: string;
  readonly VITE_FATHOM_TRACKER_URL?: string;
  readonly VITE_FATHOM_SITE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
