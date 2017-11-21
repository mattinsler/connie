import { parser as txtParser } from './txt';
import { parser as jsonParser } from './json';

export const parsers: {[ext: string]: (content: string) => any} = {
  '.json': jsonParser,
  '.txt': txtParser
};

export const extensions = ['.json', '.txt'];
