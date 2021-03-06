import Cookie from 'js-cookie'

export function getCookie(key) {
  return Cookie.get(key)
}

export function setCookie(key, value) {
  Cookie.set(key, value)
}

export function removeCookie(key) {
  Cookie.remove(key)
}
