/**
 * is form or json content-type?
 */
export function isJsonContentType({
  headers,
}: {
  headers: { [key: string]: string };
}) {
  return headers['Content-Type'] === 'application/json';
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
