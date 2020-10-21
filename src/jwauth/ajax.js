import { getConfig } from './config';
import { retrieve } from './store';

function parseJSON(response) {
  return response.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      if (!(e instanceof SyntaxError)) throw e;
      return { data: text };
    }
  });
}

function parseResponse(response) {
  return parseJSON(response).then(
    (json) => ({
      status: response.status,
      ok: response.ok,
      json,
    }),
  );
}

// WARNING: mutates the headers argument
function appendHeaders(headers = new Headers()) {
  const config = getConfig();

  if (!headers.get('Content-Type') && config.defaultContentType) {
    headers.append('Content-Type', config.defaultContentType);
  }

  Object.entries(config.tokens || {}).forEach(([tokenName, tokenOptions]) => {
    const { headerName, headerModifier } = tokenOptions;
    if (!headerName) return;
    const tokenContent = retrieve(tokenName);
    headers.append(
      headerName,
      typeof headerModifier === 'function' ? headerModifier(tokenContent) : tokenContent,
    );
  });

  return headers;
}

// WARNING: mutates the ajaxOptions argument
function lintAjaxOptions(ajaxOptions = {}) {
  /* eslint-disable no-param-reassign */
  ajaxOptions.headers = appendHeaders(ajaxOptions.headers);
  if (typeof ajaxOptions.body === 'object') ajaxOptions.body = JSON.stringify(ajaxOptions.body);
  /* eslint-enable */
  return ajaxOptions;
}

export default function ajax(url, ajaxOptions = {}) {
  // eslint-disable-next-line no-param-reassign
  ajaxOptions = lintAjaxOptions(ajaxOptions);

  return new Promise((resolve, reject) => {
    fetch(url, ajaxOptions)
      .then(parseResponse)
      .then((response) => (
        response.ok ? resolve(response.json.data) : reject(response.json)
      ))
      .catch((error) => reject(new Error(error.message)));
  });
}
