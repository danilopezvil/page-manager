import { createBookmark } from '../../domain/services/BookmarkService';
import { classifyBookmark } from '../../domain/services/ClassificationService';
import type { AppStateRepository } from '../../infrastructure/repositories/AppStateRepository';

export class SaveRecentUseCase {
  async execute(recentId: string, repo: AppStateRepository): Promise<void> {
    const appState = await repo.load();
    const recent = appState.recents.find((item) => item.id === recentId);

    if (!recent) {
      throw new Error(`SaveRecentUseCase: recent no encontrado con id "${recentId}".`);
    }

    const existingBookmark = appState.bookmarks.find(
      (bookmark) => bookmark.canonicalUrl === recent.canonicalUrl,
    );

    if (existingBookmark) {
      await repo.save({
        ...appState,
        recents: appState.recents.filter((item) => item.id !== recentId),
      });
      return;
    }

    const sectionId = classifyBookmark(
      {
        domain: recent.domain,
        url: recent.url,
        title: recent.title,
      },
      appState.sections,
    );

    const bookmark = createBookmark({
      title: recent.title,
      url: recent.url,
      sectionId,
      source: 'recent',
    });

    await repo.save({
      ...appState,
      bookmarks: [...appState.bookmarks, bookmark],
      recents: appState.recents.filter((item) => item.id !== recentId),
    });
  }
}
