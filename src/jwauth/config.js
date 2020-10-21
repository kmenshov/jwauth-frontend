/* eslint-disable quote-props, no-multi-spaces */

let config = {
  defaultContentType: 'application/json',
};

config.tokens = {
  'jwt': {                                     // Token name as it is saved in the store.
    sources: {
      html: 'token',                           // The "name" attribute value of the HTML "meta" tag.
      api: '/regenerate_token',                // URL to retrieve this token from.
    },
    headerName: 'Authorization',               // In which header to put this token when requesting API.
    headerModifier: (token) => `JWT ${token}`, // If it's a function, it will be used to format the header.
    refetchAtInit: true,                       // Whether a new token has to be fetched from the API
                                               // when initializing Ajax.
                                               // If the value is a function, it's getting called,
                                               // and the return value is used to decide.
  },
};

config.useLocalStorage = (() => {
  try {
    return !!localStorage;
  } catch (any) {
    return false;
  }
})();

export function getConfig() {
  return config; // can't easily clone it because of the function attributes,
                 // but can be changed to cloning later if needed
}

export function setConfig(newConfig) {
  if (newConfig) config = newConfig; // or merge instead
  return getConfig();
}
