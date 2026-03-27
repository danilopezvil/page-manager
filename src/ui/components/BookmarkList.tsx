import React, { useState } from 'react';
import type { BookmarkItem } from '../../domain/models';

export interface BookmarkListProps {
  title: string;
  items: BookmarkItem[];
  onOpen: (id: string) => void;
  onMarkRead: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

function sectionTone(title: string): string {
  if (title.toLowerCase().includes('favorito')) {
    return 'bookmark-list--favorites';
  }

  if (title.toLowerCase().includes('pendiente')) {
    return 'bookmark-list--pending';
  }

  return 'bookmark-list--context';
}

export function BookmarkList({ title, items, onOpen, onMarkRead, onToggleFavorite }: BookmarkListProps): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <section className={`bookmark-list ${sectionTone(title)}`}>
      <header className="bookmark-list__header">
        <h2 className="bookmark-list__title">{title}</h2>
        <button
          className="bookmark-list__collapse-toggle"
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
        >
          {collapsed ? 'Mostrar' : 'Ocultar'}
        </button>
      </header>

      {!collapsed && (
        <ul className="bookmark-list__items">
          {items.map((item) => (
            <li className="bookmark-list__item" key={item.id}>
              <div className="bookmark-list__status-strip" aria-hidden="true" />

              <div className="bookmark-list__item-main">
                <h3 className="bookmark-list__item-title">{item.title}</h3>
                <p className="bookmark-list__item-domain">{item.domain}</p>
              </div>

              <div className="bookmark-list__item-actions">
                <button className="bookmark-list__action-button bookmark-list__action-button--primary" type="button" onClick={() => onOpen(item.id)}>
                  Abrir
                </button>
                <button className="bookmark-list__action-button" type="button" onClick={() => onMarkRead(item.id)}>
                  Leído
                </button>
                <button className="bookmark-list__action-button" type="button" onClick={() => onToggleFavorite(item.id)}>
                  {item.isFavorite ? '★' : '☆'}
                </button>
              </div>
            </li>
          ))}

          {items.length === 0 && <li className="bookmark-list__empty">Sin elementos.</li>}
        </ul>
      )}
    </section>
  );
}
