import React from 'react';

export type FilterTab = 'pending' | 'read_today' | 'favorites' | 'recents';

const FILTER_TABS: Array<{ key: FilterTab; label: string }> = [
  { key: 'pending', label: 'Pendientes' },
  { key: 'read_today', label: 'Leídos hoy' },
  { key: 'favorites', label: 'Favoritos' },
  { key: 'recents', label: 'Recientes' },
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
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
