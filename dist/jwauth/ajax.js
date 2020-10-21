function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { getConfig } from './config';
import { retrieve } from './store';

function parseJSON(response) {
  return response.text().then(function (text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      if (!(e instanceof SyntaxError)) throw e;
      return {
        data: text
      };
    }
  });
}

function parseResponse(response) {
  return parseJSON(response).then(function (json) {
    return {
      status: response.status,
      ok: response.ok,
      json: json
    };
  });
} // WARNING: mutates the headers argument


function appendHeaders() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Headers();
  var config = getConfig();

  if (!headers.get('Content-Type') && config.defaultContentType) {
    headers.append('Content-Type', config.defaultContentType);
  }

  Object.entries(config.tokens || {}).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        tokenName = _ref2[0],
        tokenOptions = _ref2[1];

    var headerName = tokenOptions.headerName,
        headerModifier = tokenOptions.headerModifier;
    if (!headerName) return;
    var tokenContent = retrieve(tokenName);
    headers.append(headerName, typeof headerModifier === 'function' ? headerModifier(tokenContent) : tokenContent);
  });
  return headers;
} // WARNING: mutates the ajaxOptions argument


function lintAjaxOptions() {
  var ajaxOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  /* eslint-disable no-param-reassign */
  ajaxOptions.headers = appendHeaders(ajaxOptions.headers);
  if (typeof ajaxOptions.body === 'object') ajaxOptions.body = JSON.stringify(ajaxOptions.body);
  /* eslint-enable */

  return ajaxOptions;
}

export default function ajax(url) {
  var ajaxOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // eslint-disable-next-line no-param-reassign
  ajaxOptions = lintAjaxOptions(ajaxOptions);
  return new Promise(function (resolve, reject) {
    fetch(url, ajaxOptions).then(parseResponse).then(function (response) {
      return response.ok ? resolve(response.json.data) : reject(response.json);
    })["catch"](function (error) {
      return reject(new Error(error.message));
    });
  });
}