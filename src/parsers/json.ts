import * as stripComments from 'strip-json-comments';

export function parser(content: string): any {
  return JSON.parse(stripComments(content || '{}'));
}
