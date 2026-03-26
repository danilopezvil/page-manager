import type { Section } from '../models';

export interface ClassifyInput {
  folderName?: string;
  domain: string;
  url: string;
  title: string;
}

function normalize(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function buildNamePatterns(sectionName: string): string[] {
  const normalized = normalize(sectionName);
  if (!normalized) {
    return [];
  }

  const compact = normalized.replace(/\s+/g, '');
  const kebab = normalized.replace(/\s+/g, '-');
  const snake = normalized.replace(/\s+/g, '_');

  return Array.from(new Set([normalized, compact, kebab, snake]));
}

export function classifyBookmark(input: ClassifyInput, sections: Section[]): string {
  const folderName = normalize(input.folderName);
  const domain = normalize(input.domain);
  const url = normalize(input.url);
  const title = normalize(input.title);

  if (folderName) {
    const sectionByFolder = sections.find((section) => normalize(section.name) === folderName);
    if (sectionByFolder) {
      return sectionByFolder.id;
    }
  }

  const sectionByDomain = sections.find((section) => normalize(section.name) === domain);
  if (sectionByDomain) {
    return sectionByDomain.id;
  }

  const sectionByUrlPattern = sections.find((section) => {
    const patterns = buildNamePatterns(section.name);
    return patterns.some((pattern) => url.includes(pattern));
  });
  if (sectionByUrlPattern) {
    return sectionByUrlPattern.id;
  }

  const sectionByTitle = sections.find((section) => {
    const name = normalize(section.name);
    return Boolean(name) && title.includes(name);
  });
  if (sectionByTitle) {
    return sectionByTitle.id;
  }

  const systemSection = sections.find((section) => section.system);
  if (!systemSection) {
    throw new Error(
      'ClassificationService: no se encontró una sección general (system === true) para asignar el bookmark.'
    );
  }

  return systemSection.id;
}

export const testCases: Array<{
  description: string;
  input: ClassifyInput;
  sections: Section[];
  expected?: string;
  expectedError?: string;
}> = [
  {
    description: 'prioriza folderName cuando coincide con una sección',
    input: {
      folderName: 'Work',
      domain: 'github.com',
      url: 'https://github.com/org/repo',
      title: 'Repository',
    },
    sections: [
      { id: 'general', name: 'General', order: 0, system: true, collapsed: false },
      { id: 'work', name: 'Work', order: 1, system: false, collapsed: false },
    ],
    expected: 'work',
  },
  {
    description: 'usa domain si folderName no coincide',
    input: {
      folderName: 'Unknown',
      domain: 'github.com',
      url: 'https://github.com/org/repo',
      title: 'Repository',
    },
    sections: [
      { id: 'general', name: 'General', order: 0, system: true, collapsed: false },
      { id: 'github', name: 'github.com', order: 1, system: false, collapsed: false },
    ],
    expected: 'github',
  },
  {
    description: 'usa patrón del nombre de sección dentro del URL',
    input: {
      domain: 'unknown.com',
      url: 'https://news.ycombinator.com',
      title: 'Hacker News',
    },
    sections: [
      { id: 'general', name: 'General', order: 0, system: true, collapsed: false },
      { id: 'hn', name: 'ycombinator', order: 1, system: false, collapsed: false },
    ],
    expected: 'hn',
  },
  {
    description: 'usa nombre de sección dentro del título',
    input: {
      domain: 'unknown.com',
      url: 'https://example.org/post',
      title: 'React hooks advanced guide',
    },
    sections: [
      { id: 'general', name: 'General', order: 0, system: true, collapsed: false },
      { id: 'react', name: 'React', order: 1, system: false, collapsed: false },
    ],
    expected: 'react',
  },
  {
    description: 'cae en sección system por defecto',
    input: {
      domain: 'unknown.com',
      url: 'https://example.org/post',
      title: 'Some article',
    },
    sections: [
      { id: 'general', name: 'General', order: 0, system: true, collapsed: false },
      { id: 'other', name: 'Other', order: 1, system: false, collapsed: false },
    ],
    expected: 'general',
  },
  {
    description: 'lanza error si no existe sección system',
    input: {
      domain: 'unknown.com',
      url: 'https://example.org/post',
      title: 'Some article',
    },
    sections: [{ id: 'other', name: 'Other', order: 1, system: false, collapsed: false }],
    expectedError:
      'ClassificationService: no se encontró una sección general (system === true) para asignar el bookmark.',
  },
];
