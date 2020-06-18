import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  data = qs.stringify(data)
  return request({
    url: '/a/login',
    method: 'POST',
    data: data
  })
}

export function getPermission(data) {
  return request({
    url: '/a/getPermissions',
    method: 'get',
    data
  })
}

export function getMenuList(params) {
  return request({
    url: '/a/sys/menu/asyInitial',
    method: 'get',
    params
  })
}

export function isRootOrLeafMba() {
  return request({
    url: '/a/entity/mba/checkIsRootOrLeafMba',
    method: 'get'
  })
}

export function logOut() {
  return request({
    url: '/a/logout',
    method: 'get'
  })
}
