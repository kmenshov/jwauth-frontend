import ajaxCall from './ajax';

const receivers = {};

receivers.html = (...metaTagNames) => {
  const values = [];

  const metas = document.getElementsByTagName('meta');
  const mCount = metas.length;

  let mtnIndex;
  for (let i = 0; i < mCount; i += 1) {
    mtnIndex = metaTagNames.indexOf(metas[i].getAttribute('name'));
    if (mtnIndex >= 0) { values[mtnIndex] = metas[i].getAttribute('content'); }
  }

  return values;
};

receivers.api = (url) => ajaxCall(
  url,
  {
    headers: new Headers({ 'Content-Type': 'text/plain' }),
    method: 'POST',
  },
);

export default receivers;
