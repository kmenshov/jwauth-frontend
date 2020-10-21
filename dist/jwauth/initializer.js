function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { getConfig, setConfig } from './config';
import receivers from './receivers';
import { store } from './store';

function onDocumentReady(callback) {
  /* eslint-disable prefer-arrow-callback, eqeqeq, curly, func-names */
  // in case the document is already rendered
  if (document.readyState != 'loading') callback(); // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback); // IE <= 8
    else document.attachEvent('onreadystatechange', function () {
        if (document.readyState == 'complete') callback();
      });
  /* eslint-enable */
}

function forEachHtmlToken(callback) {
  var config = getConfig();
  Object.entries(config.tokens || {}).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        tokenName = _ref2[0],
        tokenOptions = _ref2[1];

    if (tokenOptions.sources && tokenOptions.sources.html) callback(tokenName, tokenOptions);
  });
}

function storeTokensFromHTML() {
  var tokenNames = [];
  var metaTagNames = [];
  forEachHtmlToken(function (tokenName, tokenOptions) {
    tokenNames.push(tokenName);
    metaTagNames.push(tokenOptions.sources.html);
  });
  var tokenValues = receivers.html.apply(receivers, metaTagNames);
  tokenNames.forEach(function (name, index) {
    return store(name, tokenValues[index]);
  });
}

function refetchHtmlTokens() {
  var requests = [];
  forEachHtmlToken(function (tokenName, tokenOptions) {
    var shouldRefetch = typeof tokenOptions.refetchAtInit === 'function' ? tokenOptions.refetchAtInit() : tokenOptions.refetchAtInit;
    if (!shouldRefetch) return;
    requests.push(receivers.api(tokenOptions.sources.api).then(function (tokenValue) {
      return store(tokenName, tokenValue);
    }));
  });
  return Promise.all(requests);
}

export default function initialize(newConfig) {
  setConfig(newConfig);
  return new Promise(function (resolve) {
    return onDocumentReady(function () {
      storeTokensFromHTML();
      refetchHtmlTokens().then(resolve);
    });
  });
}