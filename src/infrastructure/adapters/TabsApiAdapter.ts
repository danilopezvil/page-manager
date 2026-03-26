export const openUrl = async (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve();
    });
  });
};

export const getCurrentTabInfo = async (): Promise<{
  url: string;
  title: string;
} | null> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      const activeTab = tabs[0];
      if (!activeTab?.url || !activeTab.title) {
        resolve(null);
        return;
      }

      resolve({
        url: activeTab.url,
        title: activeTab.title,
      });
    });
  });
};
