import React from 'react';

export interface HeaderProps {
  pendingCount: number;
  onSearch: (value: string) => void;
  onAdd: () => void;
  onImport: () => void;
}

export function Header({ pendingCount, onSearch, onAdd, onImport }: HeaderProps): JSX.Element {
  return (
    <header className="app-header">
      <div className="app-header__top-row">
        <div className="app-header__brand">
          <span className="app-header__brand-mark" aria-hidden="true">
            ⊞
          </span>
          <h1 className="app-header__title">The Precision Editor</h1>
        </div>

        <button className="app-header__add-btn" type="button" onClick={onAdd}>
          + Add
        </button>
      </div>

      <div className="app-header__controls-row">
        <label className="sr-only" htmlFor="bookmark-search">
          Buscar en contextos
        </label>
        <input
          id="bookmark-search"
          className="app-header__search-input"
          type="search"
          placeholder="Buscar en contextos..."
          onChange={(event) => onSearch(event.target.value)}
        />

        <button className="app-header__pending-badge" type="button" onClick={onImport}>
          {pendingCount} Pendientes
        </button>
      </div>
    </header>
  );
}
