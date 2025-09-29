/**
 * Logger configurável para evitar logs sensíveis e permitir níveis
 * diferentes por ambiente.
 */

type Level = 'debug' | 'info' | 'warn' | 'error';

const level: Level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const logger = {
  debug: (...args: any[]) => {
    if (['debug'].includes(level)) console.debug(...args);
  },
  info: (...args: any[]) => {
    if (['debug','info'].includes(level)) console.info(...args);
  },
  warn: (...args: any[]) => {
    if (['debug','info','warn'].includes(level)) console.warn(...args);
  },
  error: (...args: any[]) => {
    console.error(...args); // sempre logar errors
  },
};

export default logger;