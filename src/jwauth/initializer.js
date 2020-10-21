import { getConfig, setConfig } from './config';
import receivers from './receivers';
import { store } from './store';

function onDocumentReady(callback) {
  /* eslint-disable prefer-arrow-callback, eqeqeq, curly, func-names */
  // in case the document is already rendered
  if (document.readyState != 'loading') callback();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function () {
    if (document.readyState == 'complete') callback();
  });
  /* eslint-enable */
}

function forEachHtmlToken(callback) {
  const config = getConfig();
  Object.entries(config.tokens || {}).forEach(([tokenName, tokenOptions]) => {
    if (tokenOptions.sources && tokenOptions.sources.html) callback(tokenName, tokenOptions);
  });
}

function storeTokensFromHTML() {
  const tokenNames = [];
  const metaTagNames = [];
  forEachHtmlToken((tokenName, tokenOptions) => {
    tokenNames.push(tokenName);
    metaTagNames.push(tokenOptions.sources.html);
  });
  const tokenValues = receivers.html(...metaTagNames);

  tokenNames.forEach((name, index) => store(name, tokenValues[index]));
}

function refetchHtmlTokens() {
  const requests = [];

  forEachHtmlToken((tokenName, tokenOptions) => {
    const shouldRefetch = (typeof tokenOptions.refetchAtInit === 'function') ?
      tokenOptions.refetchAtInit() : tokenOptions.refetchAtInit;
    if (!shouldRefetch) return;
    requests.push(
      receivers.api(tokenOptions.sources.api).then((tokenValue) => store(tokenName, tokenValue)),
    );
  });

  return Promise.all(requests);
}

export default function initialize(newConfig) {
  setConfig(newConfig);
  return new Promise((resolve) => onDocumentReady(() => {
    storeTokensFromHTML();
    refetchHtmlTokens().then(resolve);
  }));
}
