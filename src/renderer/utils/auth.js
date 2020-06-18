import Cookies from 'js-cookie'

// const TokenKey = 'HCL504.session.id'
const TokenKey = '_guid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
