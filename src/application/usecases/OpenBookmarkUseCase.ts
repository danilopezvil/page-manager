import { openBookmark } from '../../domain/services/BookmarkService';
import { createRecent, deduplicateRecents, updateRecentOnOpen } from '../../domain/services/RecentService';
import type { AppStateRepository } from '../../infrastructure/repositories/AppStateRepository';
import type { TabsApiAdapter } from '../../infrastructure/adapters/TabsApiAdapter';

export class OpenBookmarkUseCase {
  async execute(
    bookmarkId: string,
    repo: AppStateRepository,
    tabsAdapter: TabsApiAdapter,
  ): Promise<void> {
    const appState = await repo.load();
    const bookmark = appState.bookmarks.find((item) => item.id === bookmarkId);

    if (!bookmark) {
      throw new Error(`OpenBookmarkUseCase: bookmark no encontrado con id "${bookmarkId}".`);
    }

    await tabsAdapter.openUrl(bookmark.url);

    const updatedBookmark = openBookmark(bookmark);
    const updatedBookmarks = appState.bookmarks.map((item) =>
      item.id === updatedBookmark.id ? updatedBookmark : item,
    );

    const existingRecent = appState.recents.find(
      (recent) => recent.canonicalUrl === bookmark.canonicalUrl,
    );

    const updatedRecent = existingRecent
      ? {
          ...updateRecentOnOpen(existingRecent),
          linkedBookmarkId: bookmark.id,
        }
      : {
          ...createRecent(bookmark.url, bookmark.title, 'dashboard'),
          linkedBookmarkId: bookmark.id,
        };

    const recentsWithoutCurrent = appState.recents.filter((recent) => recent.id !== updatedRecent.id);
    const deduplicatedRecents = deduplicateRecents(
      [updatedRecent, ...recentsWithoutCurrent],
      appState.settings.maxRecentItems,
    );

    await repo.save({
      ...appState,
      bookmarks: updatedBookmarks,
      recents: deduplicatedRecents,
    });
  }
}
