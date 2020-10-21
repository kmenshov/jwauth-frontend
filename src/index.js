import initialize from './jwauth/initializer';
import { getConfig, setConfig } from './jwauth/config';
import ajaxCall from './jwauth/ajax';

let initialized = null;

// eslint-disable-next-line no-return-assign
const init = (newOptions) => initialized = initialize(newOptions);

const checkInit = () => {
  if (!initialized) init();
  return initialized;
};

const ajax = (...params) => checkInit().then(() => ajaxCall(...params));

ajax.init = init;
ajax.getConfig = getConfig;
ajax.setConfig = setConfig;

export default ajax;
