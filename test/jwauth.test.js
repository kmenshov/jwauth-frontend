const receivers = require('<rootDir>/src/jwauth/receivers').default;

test('from HTML Meta tags', () => {
  document.head.innerHTML =
    '<meta name="csrf-token" content="this is CSRF token" />' +
    '<meta name="token" content="this is JWT token" />' +
    '<meta name="unknown" content="this is some unknown token" />';

  expect(receivers.html('token')).toEqual(['this is JWT token']);
  expect(receivers.html('token', 'csrf-token')).toEqual(['this is JWT token', 'this is CSRF token']);
  expect(receivers.html('token', 'csrf-token', 'nonexistent-token')).toEqual(
    ['this is JWT token', 'this is CSRF token'],
  );
  expect(receivers.html('token', 'csrf-token', 'nonexistent-token', 'unknown')).toEqual(
    ['this is JWT token', 'this is CSRF token', undefined, 'this is some unknown token'],
  );
});
