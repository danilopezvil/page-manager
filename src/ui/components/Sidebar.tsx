import React from 'react';

interface SidebarItem {
  id: string;
  label: string;
  count?: number;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ items, activeId, onSelect }: SidebarProps): JSX.Element {
  return (
    <aside className="side-nav" aria-label="Contextos">
      <p className="side-nav__heading">Contextos</p>
      <ul className="side-nav__list">
        {items.map((item) => {
          const isActive = activeId === item.id;

          return (
            <li key={item.id}>
              <button
                type="button"
                className={`side-nav__item ${isActive ? 'side-nav__item--active' : ''}`.trim()}
                onClick={() => onSelect(item.id)}
              >
                <span>{item.label}</span>
                {typeof item.count === 'number' && <span className="side-nav__count">{item.count}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
