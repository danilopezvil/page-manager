import type { AppSettings } from './AppSettings';
import type { BookmarkItem } from './BookmarkItem';
import type { RecentItem } from './RecentItem';
import type { Section } from './Section';

export interface AppState {
  schemaVersion: number;
  sections: Section[];
  bookmarks: BookmarkItem[];
  recents: RecentItem[];
  settings: AppSettings;
}
