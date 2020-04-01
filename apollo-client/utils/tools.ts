import {
  FORM_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
} from './constants';

/**
 * is form or json content-type?
 */
export function isJsonContentType({
  headers,
}: {
  headers: { [key: string]: string };
}) {
  return (
    headers[CONTENT_TYPE_HEADER] === JSON_CONTENT_TYPE[CONTENT_TYPE_HEADER]
  );
}
export function isFormContentType({
  headers,
}: {
  headers: { [key: string]: string };
}) {
  return (
    headers[CONTENT_TYPE_HEADER] === FORM_CONTENT_TYPE[CONTENT_TYPE_HEADER]
  );
}

/**
 * serialize form data
 * @param param0 form data like json
 */
export function serializeFormData({
  params,
}: {
  params: {
    [key: string]: any;
  };
}) {
  const result = [];
  for (const key of Object.keys(params)) {
    result.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
    );
  }
  return result.join('&');
}
