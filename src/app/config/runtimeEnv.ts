const readOptionalEnv = (value: string | undefined): string | undefined => {
  const normalized = value?.trim();
  return normalized != null && normalized.length > 0 ? normalized : undefined;
};

export const runtimeEnv = {
  webfontBaseUrl: readOptionalEnv(import.meta.env.VITE_WEBFONT_BASE_URL),
  fathomTrackerUrl: readOptionalEnv(import.meta.env.VITE_FATHOM_TRACKER_URL),
  fathomSiteId: readOptionalEnv(import.meta.env.VITE_FATHOM_SITE_ID)
} as const;
