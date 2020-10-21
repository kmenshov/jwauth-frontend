import initialize from './jwauth/initializer';
import { getConfig, setConfig } from './jwauth/config';
import ajaxCall from './jwauth/ajax';
var initialized = null; // eslint-disable-next-line no-return-assign

var init = function init(newOptions) {
  return initialized = initialize(newOptions);
};

var checkInit = function checkInit() {
  if (!initialized) init();
  return initialized;
};

var ajax = function ajax() {
  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return checkInit().then(function () {
    return ajaxCall.apply(void 0, params);
  });
};

ajax.init = init;
ajax.getConfig = getConfig;
ajax.setConfig = setConfig;
export default ajax;