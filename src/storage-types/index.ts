import { storage as dirStorage } from './dir';
import { storage as fileStorage } from './file';
import { storage as httpStorage } from './http';

export interface Storage {
  read(): Promise<any>;
}
export type StorageInitializer = (opts: any) => Storage

export const storageTypes: {[type: string]: StorageInitializer} = {
  dir: dirStorage,
  file: fileStorage,
  http: httpStorage
};
