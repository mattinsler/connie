import * as fs from 'fs';
import * as path from 'path';

import { extensions } from '../parsers';

export function exists(filename: string): Promise<boolean> {
  return new Promise(resolve => fs.exists(filename, resolve));
}

export function readdir(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err){ return reject(err); }
      resolve(files);
    });
  });
}

export function readFile(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) { return reject(err); }
      resolve(data.toString());
    });
  });
}

export async function resolve(filename: string): Promise<{ ext: string; file: string; }> {
  filename = path.resolve(process.cwd(), filename);

  if (~extensions.indexOf(path.extname(filename))) {
    return {
      ext: path.extname(filename),
      file: filename
    };
  }

  for (const ext of extensions) {
    if (await exists(filename + ext)) {
      return {
        ext,
        file: filename + ext
      };
    }
  }

  throw new Error(`Could not resolve a with a supported extension at ${filename}`);
}

export function stat(filename: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(filename, (err, stats) => {
      if (err) { return reject(err); }
      resolve(stats);
    });
  });
}
