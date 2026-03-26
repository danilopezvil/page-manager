import React, { useState } from 'react';
import type { BookmarkItem } from '../../domain/models';

export interface BookmarkListProps {
  title: string;
  items: BookmarkItem[];
  onOpen: (id: string) => void;
  onMarkRead: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function BookmarkList({ title, items, onOpen, onMarkRead, onToggleFavorite }: BookmarkListProps): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <section className="bookmark-list">
      <header className="bookmark-list__header">
        <button
          className="bookmark-list__collapse-toggle"
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
        >
          {collapsed ? 'Mostrar' : 'Ocultar'}
        </button>
        <h2 className="bookmark-list__title">{title}</h2>
      </header>

      {!collapsed && (
        <ul className="bookmark-list__items">
          {items.map((item) => (
            <li className="bookmark-list__item" key={item.id}>
              <div className="bookmark-list__item-main">
                <h3 className="bookmark-list__item-title">{item.title}</h3>
                <p className="bookmark-list__item-domain">{item.domain}</p>
                {item.priority && <span className="bookmark-list__priority-badge">{item.priority}</span>}
              </div>

              <div className="bookmark-list__item-actions">
                <button className="bookmark-list__action-button" type="button" onClick={() => onOpen(item.id)}>
                  Abrir
                </button>
                <button className="bookmark-list__action-button" type="button" onClick={() => onMarkRead(item.id)}>
                  Marcar leído
                </button>
                <button className="bookmark-list__action-button" type="button" onClick={() => onToggleFavorite(item.id)}>
                  {item.isFavorite ? 'Quitar favorito' : 'Favorito'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
