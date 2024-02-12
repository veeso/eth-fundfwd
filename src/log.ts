const log = (
  level: 'INFO' | 'ERROR' | 'DEBUG' | 'WARN',
  ...args: any[]
): void => {
  console.log(new Date().toISOString(), level, ...args);
};

export const debug = (...args: any[]): void => log('DEBUG', ...args);
export const info = (...args: any[]): void => log('INFO', ...args);
export const warn = (...args: any[]): void => log('WARN', ...args);
export const error = (...args: any[]): void => log('ERROR', ...args);
