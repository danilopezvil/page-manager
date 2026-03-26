export type BookmarkStatus = 'pending' | 'read' | 'archived';

export type BookmarkPriority = 'high' | 'medium' | 'low';

export type BookmarkSource = 'imported' | 'manual' | 'recent';

export interface BookmarkItem {
  id: string;
  browserBookmarkId?: string;
  title: string;
  url: string;
  canonicalUrl: string;
  domain: string;
  sectionId: string;
  status: BookmarkStatus;
  isFavorite: boolean;
  priority?: BookmarkPriority;
  note?: string;
  tags?: string[];
  source: BookmarkSource;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt?: number;
  openCount: number;
}
