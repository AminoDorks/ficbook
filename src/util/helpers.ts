import { LETTERS, PERSONAL_INFO_REGEX, SLUG_ID_REGEX } from '../constants';

export const generateBoundary = () =>
  Array.from(
    { length: 16 },
    () => LETTERS[Math.floor(Math.random() * 62)],
  ).join('');

export const mapToString = (cookies: Map<string, string>): string =>
  Array.from(cookies.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');

export const matchSlugIds = (html: string): string[] => [
  ...new Set(html.matchAll(SLUG_ID_REGEX).map((match) => match[1]!)),
];

export const matchToken = (html: string): string =>
  html.match(PERSONAL_INFO_REGEX)![1]!;

export const generateDate = (): string =>
  new Date().toISOString().replace('T', ' ').slice(0, 16);
