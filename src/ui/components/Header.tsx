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
      <div className="app-header__search">
        <label className="app-header__search-label" htmlFor="bookmark-search">
          Buscar
        </label>
        <input
          id="bookmark-search"
          className="app-header__search-input"
          type="search"
          placeholder="Buscar enlaces"
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>

      <div className="app-header__actions">
        <button className="app-header__button app-header__button--add" type="button" onClick={onAdd}>
          +
        </button>
        <button className="app-header__button app-header__button--import" type="button" onClick={onImport}>
          Importar
        </button>
      </div>

      <div className="app-header__status">
        <span className="app-header__badge">Pendientes: {pendingCount}</span>
      </div>
    </header>
  );
}
