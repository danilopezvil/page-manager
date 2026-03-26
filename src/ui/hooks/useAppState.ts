import { useEffect, useState } from 'react';
import type { AppSettings, BookmarkItem, RecentItem, Section } from '../../domain/models';
import {
  ExportBackupUseCase,
  ImportBackupUseCase,
  ImportBookmarksUseCase,
  MarkAsReadUseCase,
  OpenBookmarkUseCase,
  SaveRecentUseCase,
  ToggleFavoriteUseCase,
} from '../../application/usecases';
import { bookmarksApiAdapter, tabsApiAdapter } from '../../infrastructure/adapters';
import { AppStateRepository, getDefaultAppState } from '../../infrastructure/repositories/AppStateRepository';

export interface UseAppStateResult {
  bookmarks: BookmarkItem[];
  recents: RecentItem[];
  sections: Section[];
  settings: AppSettings;
  loading: boolean;
  importBookmarks: () => Promise<void>;
  openBookmark: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  saveRecent: (recentId: string) => Promise<void>;
  exportBackup: () => Promise<string>;
  importBackup: (json: string) => Promise<void>;
}

export function useAppState(): UseAppStateResult {
  const defaultState = getDefaultAppState();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(defaultState.bookmarks);
  const [recents, setRecents] = useState<RecentItem[]>(defaultState.recents);
  const [sections, setSections] = useState<Section[]>(defaultState.sections);
  const [settings, setSettings] = useState<AppSettings>(defaultState.settings);
  const [loading, setLoading] = useState<boolean>(true);

  const repo = new AppStateRepository();
  const importBookmarksUseCase = new ImportBookmarksUseCase();
  const openBookmarkUseCase = new OpenBookmarkUseCase();
  const markAsReadUseCase = new MarkAsReadUseCase();
  const toggleFavoriteUseCase = new ToggleFavoriteUseCase();
  const saveRecentUseCase = new SaveRecentUseCase();
  const exportBackupUseCase = new ExportBackupUseCase();
  const importBackupUseCase = new ImportBackupUseCase();

  const refreshState = async (): Promise<void> => {
    const appState = await repo.load();
    setBookmarks(appState.bookmarks);
    setRecents(appState.recents);
    setSections(appState.sections);
    setSettings(appState.settings);
  };

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        await refreshState();
      } finally {
        setLoading(false);
      }
    };

    void initialize();
  }, []);

  const executeAndRefresh = async (action: () => Promise<void>): Promise<void> => {
    setLoading(true);
    try {
      await action();
      await refreshState();
    } finally {
      setLoading(false);
    }
  };

  return {
    bookmarks,
    recents,
    sections,
    settings,
    loading,
    importBookmarks: async () => {
      await executeAndRefresh(() => importBookmarksUseCase.execute(repo, bookmarksApiAdapter));
    },
    openBookmark: async (id: string) => {
      await executeAndRefresh(() => openBookmarkUseCase.execute(id, repo, tabsApiAdapter));
    },
    markAsRead: async (id: string) => {
      await executeAndRefresh(() => markAsReadUseCase.execute(id, repo));
    },
    toggleFavorite: async (id: string) => {
      await executeAndRefresh(() => toggleFavoriteUseCase.execute(id, repo));
    },
    saveRecent: async (recentId: string) => {
      await executeAndRefresh(() => saveRecentUseCase.execute(recentId, repo));
    },
    exportBackup: async () => {
      return exportBackupUseCase.execute(repo);
    },
    importBackup: async (json: string) => {
      await executeAndRefresh(() => importBackupUseCase.execute(json, repo));
    },
  };
}
