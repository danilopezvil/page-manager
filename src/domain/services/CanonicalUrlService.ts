const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
]);

export function canonicalizeUrl(url: string): string {
  let normalized = url.toLowerCase();

  normalized = normalized.replace(/^https?:\/\//, '');
  normalized = normalized.replace(/^www\./, '');

  const hashIndex = normalized.indexOf('#');
  const hash = hashIndex >= 0 ? normalized.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? normalized.slice(0, hashIndex) : normalized;

  const queryIndex = withoutHash.indexOf('?');
  let main = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : '';

  main = main.replace(/\/+$/, '');

  if (!query) {
    return `${main}${hash}`;
  }

  const params = new URLSearchParams(query);
  for (const param of TRACKING_PARAMS) {
    params.delete(param);
  }

  const filteredQuery = params.toString();

  return filteredQuery ? `${main}?${filteredQuery}${hash}` : `${main}${hash}`;
}

export const testCases: Array<{ input: string; expected: string }> = [
  {
    input: 'HTTPS://WWW.Example.COM/Path/',
    expected: 'example.com/path',
  },
  {
    input: 'https://www.example.com/?utm_source=google&utm_medium=cpc&id=123',
    expected: 'example.com?id=123',
  },
  {
    input: 'http://example.com/path/?gclid=abc&fbclid=def&ref=home',
    expected: 'example.com/path?ref=home',
  },
  {
    input: 'www.example.com/path/?utm_campaign=spring&utm_content=banner',
    expected: 'example.com/path',
  },
  {
    input: 'https://example.com/path/?q=test#Section',
    expected: 'example.com/path?q=test#section',
  },
];
