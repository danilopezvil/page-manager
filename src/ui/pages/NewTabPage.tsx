import React, { useMemo, useState } from 'react';
import type { BookmarkItem } from '../../domain/models';
import { BookmarkList, FilterBar, type FilterTab, Footer, Header, RecentList } from '../components';
import { useAppState } from '../hooks';

function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function applyFilter(bookmarks: BookmarkItem[], filter: FilterTab): BookmarkItem[] {
  switch (filter) {
    case 'read_today':
      return bookmarks.filter((bookmark) => bookmark.status === 'read' && isToday(bookmark.updatedAt));
    case 'favorites':
      return bookmarks.filter((bookmark) => bookmark.isFavorite);
    case 'pending':
      return bookmarks.filter((bookmark) => bookmark.status === 'pending');
    case 'recents':
      return bookmarks;
    default:
      return bookmarks;
  }
}

export function NewTabPage(): JSX.Element {
  const {
    bookmarks,
    recents,
    sections,
    loading,
    importBookmarks,
    openBookmark,
    markAsRead,
    toggleFavorite,
    saveRecent,
    exportBackup,
  } = useAppState();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('pending');
  const [search, setSearch] = useState<string>('');

  const pendingItems = useMemo(
    () => bookmarks.filter((bookmark) => bookmark.status === 'pending'),
    [bookmarks],
  );

  const filteredBookmarks = useMemo(() => {
    const locallyFiltered = applyFilter(bookmarks, activeFilter);
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return locallyFiltered;
    }

    return locallyFiltered.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(normalizedSearch) ||
        bookmark.domain.toLowerCase().includes(normalizedSearch),
    );
  }, [activeFilter, bookmarks, search]);

  const favoriteItems = useMemo(
    () => filteredBookmarks.filter((bookmark) => bookmark.isFavorite),
    [filteredBookmarks],
  );

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <main>
      <Header
        pendingCount={pendingItems.length}
        onSearch={setSearch}
        onAdd={() => undefined}
        onImport={() => {
          void importBookmarks();
        }}
      />

      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <BookmarkList
        title="Pendientes"
        items={pendingItems}
        onOpen={(id) => {
          void openBookmark(id);
        }}
        onMarkRead={(id) => {
          void markAsRead(id);
        }}
        onToggleFavorite={(id) => {
          void toggleFavorite(id);
        }}
      />

      {(recents.length > 0 || activeFilter === 'recents') && (
        <RecentList
          items={recents}
          onOpen={() => undefined}
          onSave={(id) => {
            void saveRecent(id);
          }}
          onDismiss={() => undefined}
        />
      )}

      <BookmarkList
        title="Favoritos"
        items={favoriteItems}
        onOpen={(id) => {
          void openBookmark(id);
        }}
        onMarkRead={(id) => {
          void markAsRead(id);
        }}
        onToggleFavorite={(id) => {
          void toggleFavorite(id);
        }}
      />

      {sections.map((section) => (
        <BookmarkList
          key={section.id}
          title={section.name}
          items={filteredBookmarks.filter((bookmark) => bookmark.sectionId === section.id)}
          onOpen={(id) => {
            void openBookmark(id);
          }}
          onMarkRead={(id) => {
            void markAsRead(id);
          }}
          onToggleFavorite={(id) => {
            void toggleFavorite(id);
          }}
        />
      ))}

      <Footer
        onExport={() => {
          void exportBackup();
        }}
        onImport={() => {
          void importBookmarks();
        }}
        onSettings={() => undefined}
      />
    </main>
  );
}
