
export function getLocalStorageItem(key) {
  return localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : ''
}

export function setLocalStorageItem(key, value) {
  return localStorage.setItem(key, value)
}

export function removeLocalStorageItem(key) {
  return localStorage.removeItem(key)
}
