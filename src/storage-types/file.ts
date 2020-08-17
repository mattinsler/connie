import { parsers } from '../parsers';
import { readFile, resolve } from './utils';

export function storage(filename: string) {
  return {
    async read(): Promise<any> {
      const { ext, file } = await resolve(filename);
      const parser = parsers[ext];

      let content;

      try {
        content = await readFile(file);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
        content = '';
      }

      return parser(content);
    },
  };
}
