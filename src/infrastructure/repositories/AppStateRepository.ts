import type { AppState } from '../../domain/models';
import { StorageAdapter } from '../adapters/StorageAdapter';

export const getDefaultAppState = (): AppState => ({
  schemaVersion: 1,
  sections: [
    {
      id: 'general',
      name: 'General',
      order: 0,
      system: true,
      collapsed: false
    }
  ],
  bookmarks: [],
  recents: [],
  settings: {
    maxRecentItems: 10,
    captureExternalNavigation: false,
    deduplicateByUrl: true,
    markImportedAsPending: true
  }
});

export class AppStateRepository {
  constructor(private readonly storageAdapter: StorageAdapter = new StorageAdapter()) {}

  async load(): Promise<AppState> {
    const appState = await this.storageAdapter.getAppState();
    return appState ?? getDefaultAppState();
  }

  async save(state: AppState): Promise<void> {
    await this.storageAdapter.saveAppState(state);
  }
}
