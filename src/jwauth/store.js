import { getConfig } from './config';

const storage = {};

export function store(name, value) {
  if (getConfig().useLocalStorage) {
    localStorage.setItem(name, value);
  } else {
    storage[name] = value;
  }
}

export function retrieve(name) {
  if (getConfig().useLocalStorage) {
    return localStorage.getItem(name);
  }
  return storage[name];
}
