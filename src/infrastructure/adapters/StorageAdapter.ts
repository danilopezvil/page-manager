import type { AppState } from '../../domain/models';

const APP_STATE_STORAGE_KEY = 'navigator_app_state';

export class StorageAdapter {
  async getAppState(): Promise<AppState | null> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(APP_STATE_STORAGE_KEY, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        const appState = result[APP_STATE_STORAGE_KEY] as AppState | undefined;
        resolve(appState ?? null);
      });
    });
  }

  async saveAppState(state: AppState): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [APP_STATE_STORAGE_KEY]: state }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        resolve();
      });
    });
  }
}
