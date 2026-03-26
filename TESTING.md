# Checklist de pruebas manuales

- [ ] Cargar extensión en Chrome (`chrome://extensions` → modo desarrollador → cargar descomprimida → carpeta `dist/`).
- [ ] Abrir nueva pestaña → verificar que carga en < 1s.
- [ ] Hacer clic en "Importar" → verificar bookmarks del navegador aparecen clasificados.
- [ ] Verificar que no hay duplicados al importar dos veces.
- [ ] Hacer clic en un bookmark → verificar que abre URL y aparece en Recientes.
- [ ] Marcar un item como leído → desaparece de Pendientes.
- [ ] Marcar favorito → aparece en sección Favoritos.
- [ ] Guardar un reciente → pasa a bookmarks.
- [ ] Exportar backup → descarga JSON válido.
- [ ] Importar backup → restaura estado correctamente.
- [ ] Refrescar nueva pestaña → estado persiste.
