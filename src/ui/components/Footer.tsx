import React from 'react';

export interface FooterProps {
  onExport: () => void;
  onImport: () => void;
  onSettings: () => void;
}

export function Footer({ onExport, onImport, onSettings }: FooterProps): JSX.Element {
  return (
    <footer className="app-footer">
      <nav className="app-footer__actions" aria-label="Acciones de pie de página">
        <button className="app-footer__button" type="button" onClick={onExport}>
          Exportar
        </button>
        <button className="app-footer__button" type="button" onClick={onImport}>
          Importar
        </button>
        <button className="app-footer__button" type="button" onClick={onSettings}>
          Configuración
        </button>
      </nav>
    </footer>
  );
}
