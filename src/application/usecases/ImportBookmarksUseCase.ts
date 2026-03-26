import { createBookmark } from '../../domain/services/BookmarkService';
import { classifyBookmark } from '../../domain/services/ClassificationService';
import type { AppStateRepository } from '../../infrastructure/repositories/AppStateRepository';
import type { BookmarksApiAdapter } from '../../infrastructure/adapters/BookmarksApiAdapter';

export class ImportBookmarksUseCase {
  async execute(
    repo: AppStateRepository,
    bookmarksAdapter: BookmarksApiAdapter,
  ): Promise<void> {
    const appState = await repo.load();
    const browserBookmarks = await bookmarksAdapter.getAllBrowserBookmarks();

    const existingCanonicalUrls = new Set(appState.bookmarks.map((bookmark) => bookmark.canonicalUrl));
    const newBookmarks = [];

    for (const rawBookmark of browserBookmarks) {
      if (!rawBookmark.url) {
        continue;
      }

      const tempBookmark = createBookmark({
        title: rawBookmark.title,
        url: rawBookmark.url,
        sectionId: appState.sections.find((section) => section.system)?.id ?? 'general',
        source: 'imported',
      });

      if (existingCanonicalUrls.has(tempBookmark.canonicalUrl)) {
        continue;
      }

      const sectionId = classifyBookmark(
        {
          folderName: rawBookmark.parentTitle,
          domain: tempBookmark.domain,
          url: tempBookmark.url,
          title: tempBookmark.title,
        },
        appState.sections,
      );

      newBookmarks.push({
        ...tempBookmark,
        browserBookmarkId: rawBookmark.id,
        sectionId,
      });
      existingCanonicalUrls.add(tempBookmark.canonicalUrl);
    }

    await repo.save({
      ...appState,
      bookmarks: [...appState.bookmarks, ...newBookmarks],
    });
  }
}
