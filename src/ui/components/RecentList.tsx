import React from 'react';
import type { RecentItem } from '../../domain/models';

export interface RecentListProps {
  items: RecentItem[];
  onOpen: (id: string) => void;
  onSave: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function RecentList({ items, onOpen, onSave, onDismiss }: RecentListProps): JSX.Element {
  return (
    <section className="recent-list">
      <header className="recent-list__header">
        <h2 className="recent-list__title">Retomar</h2>
      </header>

      <ul className="recent-list__items">
        {items.map((item) => (
          <li className="recent-list__item" key={item.id}>
            <button className="recent-list__item-main" type="button" onClick={() => onOpen(item.id)}>
              <h3 className="recent-list__item-title">{item.title}</h3>
              <p className="recent-list__item-domain">{item.domain}</p>
            </button>

            <div className="recent-list__item-actions">
              <button className="recent-list__action-button" type="button" onClick={() => onSave(item.id)}>
                Guardar
              </button>
              <button className="recent-list__action-button recent-list__action-button--dismiss" type="button" onClick={() => onDismiss(item.id)}>
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
