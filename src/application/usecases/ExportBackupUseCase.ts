import type { AppStateRepository } from '../../infrastructure/repositories/AppStateRepository';

export class ExportBackupUseCase {
  async execute(repo: AppStateRepository): Promise<string> {
    const appState = await repo.load();
    return JSON.stringify(appState, null, 2);
  }
}
