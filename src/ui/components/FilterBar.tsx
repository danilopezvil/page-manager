import React from 'react';

export type FilterTab = 'pending' | 'read_today' | 'favorites' | 'recents';

const FILTER_TABS: Array<{ key: FilterTab; label: string; icon: string }> = [
  { key: 'pending', label: 'Pendientes', icon: '◫' },
  { key: 'read_today', label: 'Leídos hoy', icon: '◷' },
  { key: 'favorites', label: 'Favoritos', icon: '★' },
  { key: 'recents', label: 'Recientes', icon: '↺' },
];

export interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: FilterTab) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps): JSX.Element {
  return (
    <nav className="filter-bar" aria-label="Filtros de bookmarks">
      <ul className="filter-bar__tabs">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;

          return (
            <li className="filter-bar__tab-item" key={tab.key}>
              <button
                className={`filter-bar__tab ${isActive ? 'filter-bar__tab--active' : ''}`.trim()}
                type="button"
                onClick={() => onFilterChange(tab.key)}
                aria-pressed={isActive}
              >
                <span aria-hidden="true" className="filter-bar__icon">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
