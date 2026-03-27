import React, { useEffect, useMemo, useState } from 'react';
import type { BookmarkItem } from '../../domain/models';
import { BookmarkList, BottomNav, FilterBar, type FilterTab, Header, RecentList, Sidebar } from '../components';
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
    default:
      return bookmarks.filter((bookmark) => bookmark.status === 'pending');
  }
}

function useIsDesktop(breakpoint: number = 1024): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => window.innerWidth >= breakpoint);

  useEffect(() => {
    const onResize = (): void => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isDesktop;
}

export function NewTabPage(): JSX.Element {
  const {
    bookmarks,
    recents,
    sections,
    loading,
    openBookmark,
    markAsRead,
    toggleFavorite,
    saveRecent,
    importBookmarks,
  } = useAppState();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('pending');
  const [search, setSearch] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const isDesktop = useIsDesktop();

  const sidebarItems = useMemo(
    () => [
      { id: 'all', label: 'Todos', count: bookmarks.length },
      ...sections.map((section) => ({
        id: section.id,
        label: section.name,
        count: bookmarks.filter((bookmark) => bookmark.sectionId === section.id).length,
      })),
    ],
    [bookmarks, sections],
  );

  const pendingItems = useMemo(
    () => bookmarks.filter((bookmark) => bookmark.status === 'pending'),
    [bookmarks],
  );

  const filteredBookmarks = useMemo(() => {
    const byFilter = applyFilter(bookmarks, activeFilter);
    const bySection =
      selectedSectionId === 'all'
        ? byFilter
        : byFilter.filter((bookmark) => bookmark.sectionId === selectedSectionId);
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return bySection;
    }

    return bySection.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(normalizedSearch) ||
        bookmark.domain.toLowerCase().includes(normalizedSearch),
    );
  }, [activeFilter, bookmarks, search, selectedSectionId]);

  if (loading) {
    return <div className="page-shell">Cargando...</div>;
  }

  return (
    <main className="page-shell">
      <div className="app-layout">
        {isDesktop && (
          <Sidebar items={sidebarItems} activeId={selectedSectionId} onSelect={setSelectedSectionId} />
        )}

        <section className="content-view">
          <Header pendingCount={pendingItems.length} onSearch={setSearch} />
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {recents.length > 0 && (
            <RecentList
              items={recents.slice(0, 6)}
              onOpen={() => undefined}
              onSave={(id) => {
                void saveRecent(id);
              }}
            />
          )}

          <BookmarkList
            title="Pendientes"
            items={filteredBookmarks}
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

          <div className="content-actions">
            <button
              type="button"
              className="content-actions__button"
              onClick={() => {
                void importBookmarks();
              }}
            >
              Importar marcadores
            </button>
          </div>
        </section>
      </div>

      {!isDesktop && <BottomNav />}
    </main>
  );
}
