import { toggleFavorite } from '../../domain/services/BookmarkService';
import type { AppStateRepository } from '../../infrastructure/repositories/AppStateRepository';

export class ToggleFavoriteUseCase {
  async execute(bookmarkId: string, repo: AppStateRepository): Promise<void> {
    const appState = await repo.load();
    const bookmark = appState.bookmarks.find((item) => item.id === bookmarkId);

    if (!bookmark) {
      throw new Error(`ToggleFavoriteUseCase: bookmark no encontrado con id "${bookmarkId}".`);
    }

    await repo.save({
      ...appState,
      bookmarks: appState.bookmarks.map((item) =>
        item.id === bookmarkId ? toggleFavorite(item) : item,
      ),
    });
  }
}
