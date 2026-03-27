import React from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Inicio', icon: '⌂' },
  { id: 'browse', label: 'Browse', icon: '⌕' },
  { id: 'track', label: 'Track', icon: '◫' },
  { id: 'profile', label: 'Perfil', icon: '◌' },
] as const;

export function BottomNav(): JSX.Element {
  return (
    <nav className="mobile-nav" aria-label="Navegación principal móvil">
      {NAV_ITEMS.map((item) => (
        <button
          type="button"
          className={`mobile-nav__item ${item.id === 'browse' ? 'mobile-nav__item--active' : ''}`.trim()}
          key={item.id}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
