import ajaxCall from './ajax';
var receivers = {};

receivers.html = function () {
  var values = [];
  var metas = document.getElementsByTagName('meta');
  var mCount = metas.length;
  var mtnIndex;

  for (var _len = arguments.length, metaTagNames = new Array(_len), _key = 0; _key < _len; _key++) {
    metaTagNames[_key] = arguments[_key];
  }

  for (var i = 0; i < mCount; i += 1) {
    mtnIndex = metaTagNames.indexOf(metas[i].getAttribute('name'));

    if (mtnIndex >= 0) {
      values[mtnIndex] = metas[i].getAttribute('content');
    }
  }

  return values;
};

receivers.api = function (url) {
  return ajaxCall(url, {
    headers: new Headers({
      'Content-Type': 'text/plain'
    }),
    method: 'POST'
  });
};

export default receivers;