import * as path from 'path';

import { parsers, extensions } from '../parsers';
import { readdir, readFile, resolve, stat, exists } from './utils';

interface LsItem {
  ext: string;
  keyPath: string[];
}

async function ls(root: string, extensions: string[], keyPath: string[] = []): Promise<LsItem[]> {
  const res: LsItem[] = [];
  const files = await readdir(path.join(root, ...keyPath));

  await Promise.all(files.map(async (file) => {
    const fileKeyPath = [...keyPath, file];

    if ((await stat(path.join(root, ...fileKeyPath))).isDirectory()) {
      res.push(...(await ls(root, extensions, fileKeyPath)));
    } else {
      const ext = path.extname(file);
      if (~extensions.indexOf(ext)) {
        res.push({
          ext,
          keyPath: [...keyPath, file.slice(0, -ext.length)]
        });
      }
    }
  }));

  return res;
}

function setKey(obj: any, keyPath: string[], value: any) {
  let current = obj;

  for (const key of keyPath.slice(0, -1)) {
    if (!current[key]) {
      current[key] = {};
    }

    current = current[key];
  }

  current[keyPath[keyPath.length - 1]] = value;

  return obj;
}

export function storage(dirname: string) {
  return {
    async read(): Promise<any> {
      const res: any = {};
      const root = path.resolve(process.cwd(), dirname);
      if (!(await exists(root)) || !(await stat(root)).isDirectory()) {
        return {};
      }

      const files = await ls(root, extensions);
      files.sort((lhs, rhs) => {
        let cmp = lhs.keyPath.length - rhs.keyPath.length;
        if (cmp !== 0) { return cmp; }

        cmp = path.join(...lhs.keyPath).localeCompare(path.join(...rhs.keyPath));
        if (cmp !== 0) { return cmp; }

        return extensions.indexOf(lhs.ext) - extensions.indexOf(rhs.ext);
      });

      for (let x = 0; x < files.length; ++x) {
        const { ext, keyPath } = files[x];
        if (x > 0 && path.join(...keyPath) === path.join(...files[x - 1].keyPath)) {
          continue;
        }

        const value = parsers[ext](await readFile(path.join(root, ...keyPath) + ext));
        setKey(res, keyPath, value);
      }

      return res;
    }
  };
}
