import * as got from 'got';

export interface HttpUrlObject {
  url: string;

  auth?: string;
  headers?: {
    [header: string]: string;
  };
  method?: string;
  query?: {
    [param: string]: string | number;
  };
  timeout?: number;
}

export function storage(url: string | HttpUrlObject) {
  const opts: got.GotJSONOptions = {
    agent: false,
    headers: {
      'User-Agent': 'connie'
    },
    json: true,
    method: 'GET'
  };

  if (typeof url !== 'string') {
    if (url.auth) { opts.auth = url.auth }
    if (url.headers) { opts.headers = { ...opts.headers, ...url.headers } }
    if (url.method) { opts.method = url.method }
    if (url.query) { opts.query = url.query }
    if (url.timeout) { opts.timeout = url.timeout }
    url = url.url;
  }

  return {
    read(): Promise<any> {
      return got(url, opts).then(res => res.body);
    }
  };
}
