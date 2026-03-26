import type { RecentItem } from '../models';
import { canonicalizeUrl } from './CanonicalUrlService';

function extractDomain(url: string): string {
  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return new URL(normalizedUrl).hostname.toLowerCase().replace(/^www\./, '');
}

export function createRecent(url: string, title: string, source: RecentItem['source']): RecentItem {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    url,
    canonicalUrl: canonicalizeUrl(url),
    title,
    domain: extractDomain(url),
    lastOpenedAt: now,
    openCount: 1,
    source,
    dismissed: false,
  };
}

export function updateRecentOnOpen(recent: RecentItem): RecentItem {
  return {
    ...recent,
    openCount: recent.openCount + 1,
    lastOpenedAt: Date.now(),
  };
}

export function deduplicateRecents(recents: RecentItem[], maxItems: number): RecentItem[] {
  const recentsByCanonicalUrl = new Map<string, RecentItem>();

  for (const recent of recents) {
    const existing = recentsByCanonicalUrl.get(recent.canonicalUrl);
    if (!existing || recent.lastOpenedAt > existing.lastOpenedAt) {
      recentsByCanonicalUrl.set(recent.canonicalUrl, recent);
    }
  }

  return Array.from(recentsByCanonicalUrl.values())
    .sort((a, b) => b.lastOpenedAt - a.lastOpenedAt)
    .slice(0, maxItems);
}
