export type RecentItemSource = 'dashboard' | 'external';

export interface RecentItem {
  id: string;
  url: string;
  canonicalUrl: string;
  title: string;
  domain: string;
  lastOpenedAt: number;
  openCount: number;
  source: RecentItemSource;
  linkedBookmarkId?: string;
  dismissed: boolean;
}
