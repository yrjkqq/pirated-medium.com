import contentType from 'content-type';
import { bLog } from './b-log';
import { JSON_CONTENT_TYPE, CONTENT_TYPE_HEADER } from './constants';
import {
  isJsonContentType,
  isFormContentType,
  serializeFormData,
} from './tools';

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
          const responseType = xhr.getResponseHeader(
            CONTENT_TYPE_HEADER.toLowerCase(),
          );
          bLog.debug(responseType);
          const { type } = contentType.parse(responseType);
          if (type === JSON_CONTENT_TYPE[CONTENT_TYPE_HEADER]) {
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
          bLog.error(xhr.responseText);
          reject(xhr.status);
        }
      }
    };
    xhr.open(method, `${baseUrl}/${url}`, true);
    xhr.timeout = timeout;
    xhr.ontimeout = function () {
      bLog.error('request timeout!');
    };
    if (data && data instanceof FormData) {
      // 上传文件时不能手动设置 multipart/form-data 需要浏览器自动设置, 此时会自动带上 boundary 才能上传成功;
      // Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryEydSvjBLSg3RBw6B
      xhr.send(data);
      return;
    }
    for (const key of Object.keys(headers)) {
      xhr.setRequestHeader(key, headers[key]);
    }
    if (isJsonContentType({ headers })) {
      xhr.send(JSON.stringify(data));
    } else if (isFormContentType({ headers })) {
      xhr.send(serializeFormData(data));
    } else {
      xhr.send(data);
    }
  });
}
