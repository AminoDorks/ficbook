import type { Headers } from './types/http';

export const SLUG_ID_REGEX =
  /class="visit-link"[^>]*href="\/readfic\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi;

export const PERSONAL_INFO_REGEX = /name="token"\s+value="([^"]+)"/;

export const BASE_URL = 'https://fanficlets.xyz';

export const MOBILE_HEADERS: Headers = {
  'Accept-Encoding': 'gzip',
  baggage:
    'sentry-environment=production,sentry-release=ficbook%401.6.0%2Bc43e6c8,sentry-public_key=0d1586540cbe31f202a9e27decdf4a98,sentry-trace_id=5faeb8fcb6ca42e8a5e7a7bdbeba91d9,sentry-org_id=4509389216219136',
  Connection: 'keep-alive',
  'Content-Type': 'application/json',
  Host: 'fanficlets.xyz',
  'sentry-trace': '5faeb8fcb6ca42e8a5e7a7bdbeba91d9-908cf925a9bdb247',
  'user-agent':
    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.102 Mobile Safari/537.36 ||| ficbook (1.6.0) | Android (33) | WayDroid x86_64 Device | ao2gvvnhkv0t22lo',
};

export const CHROMIUM_HEADERS: Headers = {
  Accept: '/*/',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  Host: 'fanficlets.xyz',
  Origin: 'https://fanficlets.xyz',
  Pragma: 'no-cache',
  'sec-ch-ua':
    '"Chromium";v="154", "Android WebView";v="154", "Not A(Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Android"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.102 Mobile Safari/537.36 ||| ficbook (1.6.0) | Android (33) | WayDroid x86_64 Device | ao2gvvnhkv0t22lo',
  'X-Requested-With': 'com.breakpoint.ficbook',
};

export const LETTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
