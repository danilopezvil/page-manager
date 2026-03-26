import type { AppState } from '../../domain/models/AppState';
import type { AppStateRepository } from '../../infrastructure/repositories/AppStateRepository';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`ImportBackupUseCase: ${message}`);
  }
}

function validateAppStateShape(value: unknown): AppState {
  assert(typeof value === 'object' && value !== null, 'el respaldo debe ser un objeto JSON.');

  const state = value as Partial<AppState>;

  assert(typeof state.schemaVersion === 'number', 'schemaVersion debe ser number.');
  assert(Array.isArray(state.sections), 'sections debe ser un arreglo.');
  assert(Array.isArray(state.bookmarks), 'bookmarks debe ser un arreglo.');
  assert(Array.isArray(state.recents), 'recents debe ser un arreglo.');
  assert(typeof state.settings === 'object' && state.settings !== null, 'settings es requerido.');

  for (const [index, section] of state.sections.entries()) {
    assert(typeof section?.id === 'string', `sections[${index}].id debe ser string.`);
    assert(typeof section?.name === 'string', `sections[${index}].name debe ser string.`);
    assert(typeof section?.order === 'number', `sections[${index}].order debe ser number.`);
    assert(typeof section?.system === 'boolean', `sections[${index}].system debe ser boolean.`);
    assert(typeof section?.collapsed === 'boolean', `sections[${index}].collapsed debe ser boolean.`);
  }

  for (const [index, bookmark] of state.bookmarks.entries()) {
    assert(typeof bookmark?.id === 'string', `bookmarks[${index}].id debe ser string.`);
    assert(typeof bookmark?.title === 'string', `bookmarks[${index}].title debe ser string.`);
    assert(typeof bookmark?.url === 'string', `bookmarks[${index}].url debe ser string.`);
    assert(typeof bookmark?.canonicalUrl === 'string', `bookmarks[${index}].canonicalUrl debe ser string.`);
    assert(typeof bookmark?.domain === 'string', `bookmarks[${index}].domain debe ser string.`);
    assert(typeof bookmark?.sectionId === 'string', `bookmarks[${index}].sectionId debe ser string.`);
    assert(typeof bookmark?.status === 'string', `bookmarks[${index}].status debe ser string.`);
    assert(typeof bookmark?.isFavorite === 'boolean', `bookmarks[${index}].isFavorite debe ser boolean.`);
    assert(typeof bookmark?.source === 'string', `bookmarks[${index}].source debe ser string.`);
    assert(typeof bookmark?.createdAt === 'number', `bookmarks[${index}].createdAt debe ser number.`);
    assert(typeof bookmark?.updatedAt === 'number', `bookmarks[${index}].updatedAt debe ser number.`);
    assert(typeof bookmark?.openCount === 'number', `bookmarks[${index}].openCount debe ser number.`);
  }

  for (const [index, recent] of state.recents.entries()) {
    assert(typeof recent?.id === 'string', `recents[${index}].id debe ser string.`);
    assert(typeof recent?.url === 'string', `recents[${index}].url debe ser string.`);
    assert(typeof recent?.canonicalUrl === 'string', `recents[${index}].canonicalUrl debe ser string.`);
    assert(typeof recent?.title === 'string', `recents[${index}].title debe ser string.`);
    assert(typeof recent?.domain === 'string', `recents[${index}].domain debe ser string.`);
    assert(typeof recent?.lastOpenedAt === 'number', `recents[${index}].lastOpenedAt debe ser number.`);
    assert(typeof recent?.openCount === 'number', `recents[${index}].openCount debe ser number.`);
    assert(typeof recent?.source === 'string', `recents[${index}].source debe ser string.`);
    assert(typeof recent?.dismissed === 'boolean', `recents[${index}].dismissed debe ser boolean.`);
  }

  const settings = state.settings as Record<string, unknown>;
  assert(typeof settings.maxRecentItems === 'number', 'settings.maxRecentItems debe ser number.');
  assert(
    typeof settings.captureExternalNavigation === 'boolean',
    'settings.captureExternalNavigation debe ser boolean.',
  );
  assert(typeof settings.deduplicateByUrl === 'boolean', 'settings.deduplicateByUrl debe ser boolean.');
  assert(typeof settings.markImportedAsPending === 'boolean', 'settings.markImportedAsPending debe ser boolean.');

  return state as AppState;
}

export class ImportBackupUseCase {
  async execute(jsonString: string, repo: AppStateRepository): Promise<void> {
    let parsed: unknown;

    try {
      parsed = JSON.parse(jsonString);
    } catch {
      throw new Error('ImportBackupUseCase: JSON inválido.');
    }

    const validatedState = validateAppStateShape(parsed);
    await repo.save(validatedState);
  }
}
