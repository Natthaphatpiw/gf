const DEFAULT_SITE_URL = "https://www.chordjai.life";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
const isLocalSiteUrl =
  configuredSiteUrl !== undefined &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredSiteUrl);

export const SITE_URL =
  configuredSiteUrl && !isLocalSiteUrl ? configuredSiteUrl : DEFAULT_SITE_URL;

export function siteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
