export type RawBookmarkNode = {
  id: string;
  title: string;
  url?: string;
  parentTitle?: string;
};

const flattenBookmarkNodes = (
  nodes: chrome.bookmarks.BookmarkTreeNode[],
  parentTitle?: string,
): RawBookmarkNode[] => {
  return nodes.flatMap((node) => {
    const nextParentTitle = node.url ? parentTitle : node.title || parentTitle;
    const children = node.children
      ? flattenBookmarkNodes(node.children, nextParentTitle)
      : [];

    if (!node.url) {
      return children;
    }

    return [
      {
        id: node.id,
        title: node.title,
        url: node.url,
        parentTitle,
      },
      ...children,
    ];
  });
};

export const getAllBrowserBookmarks = async (): Promise<RawBookmarkNode[]> => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((nodes) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve(flattenBookmarkNodes(nodes));
    });
  });
};
