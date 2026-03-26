import type { BookmarkItem, BookmarkSource } from '../models';
import { canonicalizeUrl } from './CanonicalUrlService';

export interface CreateBookmarkParams {
  title: string;
  url: string;
  sectionId: string;
  source: BookmarkSource;
  isFavorite?: boolean;
}

function extractDomain(url: string): string {
  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return new URL(normalizedUrl).hostname.toLowerCase().replace(/^www\./, '');
}

export function createBookmark(params: CreateBookmarkParams): BookmarkItem {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    title: params.title,
    url: params.url,
    canonicalUrl: canonicalizeUrl(params.url),
    domain: extractDomain(params.url),
    sectionId: params.sectionId,
    status: 'pending',
    isFavorite: params.isFavorite ?? false,
    source: params.source,
    createdAt: now,
    updatedAt: now,
    openCount: 0,
  };
}

export function markAsRead(bookmark: BookmarkItem): BookmarkItem {
  return {
    ...bookmark,
    status: 'read',
    updatedAt: Date.now(),
  };
}

export function toggleFavorite(bookmark: BookmarkItem): BookmarkItem {
  return {
    ...bookmark,
    isFavorite: !bookmark.isFavorite,
  };
}

export function openBookmark(bookmark: BookmarkItem): BookmarkItem {
  return {
    ...bookmark,
    openCount: bookmark.openCount + 1,
    lastOpenedAt: Date.now(),
  };
}
