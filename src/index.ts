/** @module connie */

var ConnieLang = require('connie-lang');

import { storageTypes } from './storage-types';
import { HttpUrlObject } from './storage-types/http';

function connie(type: 'dir', dirname: string): connie.Connie;
function connie(type: 'file', filename: string): connie.Connie;
function connie(type: 'http', url: string | HttpUrlObject): connie.Connie;
function connie(type: string, opts: any): connie.Connie {
  const storageType = storageTypes[type];
  if (!storageType) { throw new Error(`Unknown config storage type: ${type}`) }
  
  const storage = storageType(opts);

  return {
    async read<T>(): Promise<T> {
      const config = await storage.read();
      return ConnieLang.parse(config || {}, process.env);
    }
  }
}

declare namespace connie {
  export interface Connie {
    read<T>(): Promise<T>;
  }
}

export = connie;
