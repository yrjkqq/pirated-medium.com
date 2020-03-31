import contentType from 'content-type';
import { bLog } from './b-log';
import { JSON_CONTENT_TYPE } from './constants';
import { isJsonContentType, serializeFormData } from './tools';

/**
 * create ajax
 */
export function createXHR(): XMLHttpRequest {
  if (typeof XMLHttpRequest != 'undefined') {
    // >= IE7
    return new XMLHttpRequest();
  } else if (typeof ActiveXObject != 'undefined') {
    // support IE6
    // @ts-ignore
    if (typeof arguments.callee.activeXString != 'string') {
      const versions = [
        'MSXML2.XMLHttp.6.0',
        'MSXML2.XMLHttp.3.0',
        'MSXML2.XMLHttp',
      ];
      for (let i = 0; i < versions.length; i++) {
        try {
          new ActiveXObject(versions[i]);
          // @ts-ignore
          arguments.callee.activeXString = versions[i];
          break;
        } catch (error) {
          bLog.error(error);
        }
      }
    }
    // @ts-ignore
    return new ActiveXObject(arguments.callee.activeXString);
  } else {
    throw new Error('No XHR is available.');
  }
}

interface RequestConfig {
  url: string;
  baseUrl?: string;
  method?: string;
  data?: any;
  params?: {
    [key: string]: any;
  };
  headers?: {
    [key: string]: string;
  };
  timeout?: number;
}

function addURLParams(
  url: string,
  params: {
    [key: string]: any;
  },
): string {
  url += url.indexOf('?') === -1 ? '?' : '';
  for (const key of Object.keys(params)) {
    url += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }
  return url;
}

const apiUrl = String(process.env.REST_URL);
export function request({
  url,
  baseUrl = apiUrl,
  method = 'get',
  data,
  params,
  headers = {},
  timeout = 3000,
}: RequestConfig): Promise<any> {
  headers = {
    ...JSON_CONTENT_TYPE,
    ...headers,
  };
  return new Promise((resolve, reject) => {
    const xhr = createXHR();
    if (params) {
      url = addURLParams(url, params);
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          const responseType = xhr.getResponseHeader('content-type');
          bLog.debug(responseType);
          const { type } = contentType.parse(responseType);
          if (type === 'application/json') {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (error) {
              bLog.error(error);
              reject(error);
            }
          } else {
            resolve({
              data: xhr.responseText,
            });
          }
        } else {
          bLog.error(xhr.status);
          reject(xhr.status);
        }
      }
    };
    xhr.open(method, `${baseUrl}/${url}`, true);
    for (const key of Object.keys(headers)) {
      xhr.setRequestHeader(key, headers[key]);
    }
    xhr.timeout = timeout;
    xhr.ontimeout = function () {
      bLog.error('request timeout!');
    };
    if (isJsonContentType({ headers })) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send(serializeFormData({ params: data }));
    }
  });
}
