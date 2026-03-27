import React from 'react';

export interface HeaderProps {
  pendingCount: number;
  onSearch: (value: string) => void;
}

export function Header({ pendingCount, onSearch }: HeaderProps): JSX.Element {
  return (
    <header className="app-header">
      <div className="app-header__top-row">
        <h1 className="app-header__title">TabPrecision</h1>
        <span className="app-header__pending-badge">{pendingCount} pendientes</span>
      </div>

      <label className="app-header__search-shell" htmlFor="bookmark-search">
        <span className="app-header__search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id="bookmark-search"
          className="app-header__search-input"
          type="search"
          placeholder="Buscar pestañas, dominios o notas..."
          onChange={(event) => onSearch(event.target.value)}
        />
      </label>
    </header>
  );
}
