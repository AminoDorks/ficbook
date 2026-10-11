import { LETTERS } from '../constants';

export const generateBoundary = () =>
  Array.from(
    { length: 16 },
    () => LETTERS[Math.floor(Math.random() * 62)],
  ).join('');

export const mapToString = (cookies: Map<string, string>): string =>
  Array.from(cookies.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
