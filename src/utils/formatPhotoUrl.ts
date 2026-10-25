/**
 * Utility helper to ensure photo URLs resolve correctly across
 * local development (localhost) and subpath deployments (GitHub Pages).
 */
export const formatPhotoUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  // External or data URLs are already absolute
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // Strip leading slash to prevent resolving to root domain
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  
  // Ensure base URL ends with a slash
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${base}${cleanPath}`;
};
