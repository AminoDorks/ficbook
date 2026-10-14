import { randomBytes } from 'crypto';

export const generateTrace = (method: string = 'POST', path: string) => {
  const traceId = randomBytes(16).toString('hex');

  return {
    baggage: `sentry-environment=production,sentry-release=ficbook%401.6.0%2Bc43e6c8,sentry-public_key=0d1586540cbe31f202a9e27decdf4a98,sentry-trace_id=${traceId},sentry-org_id=4509389216219136,sentry-transaction=${encodeURIComponent(`${method.toUpperCase()} /api_mobile${path}`)},sentry-sampled=false,sentry-sample_rand=${Math.random().toFixed(16)},sentry-sample_rate=0.05`,
    'sentry-trace': `${traceId}-${randomBytes(8).toString('hex')}-0`,
    'user-agent': `Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.102 Mobile Safari/537.36 ||| ficbook (1.6.0) | Android (33) | WayDroid x86_64 Device | ao2gvvnhkv0t22lo`,
  };
};
