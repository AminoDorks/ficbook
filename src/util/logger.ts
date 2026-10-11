import { pino, type Logger } from 'pino';
import prettifier from 'pino-pretty';

export const createLogger = (enabled: boolean): Logger =>
  pino(
    {
      enabled,
    },
    prettifier({ colorize: true, sync: true }),
  );
