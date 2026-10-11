import { Cookie } from 'bun';
import { LETTERS } from '../constants';

export const extractCookie = (cookieHeaders: string[]) =>
  cookieHeaders
    .map((cookieHeader) => {
      const cookie = new Cookie(cookieHeader);
      return `${cookie.name}=${cookie.value}`;
    })
    .filter(Boolean)
    .join('; ');

export const generateBoundary = () =>
  Array.from(
    { length: 16 },
    () => LETTERS[Math.floor(Math.random() * 62)],
  ).join('');
