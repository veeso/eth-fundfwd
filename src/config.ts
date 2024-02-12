import { readFileSync } from 'fs';

export default interface Config {
  [key: string]: string;
}

export const readConfigFile = (path: string): Config => {
  const data = readFileSync(path, 'utf8');
  return JSON.parse(data);
};
