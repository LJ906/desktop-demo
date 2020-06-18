import { login, logOut, getPermission, getMenuList } from '@/api/user'
// import { setCookie, removeCookie } from '@/utils/cookie'
import { setLocalStorageItem, removeLocalStorageItem } from '@/utils/localStorage'

const state = {
  name: '',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif', // 'http://www.17qq.com/img_qqtouxiang/13818163.jpeg',
  perms: {},
  menuList: []
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  },
  SET_MENU: (state, menuList) => {
    state.menuList = menuList
  }
}

const actions = {
  // user login
  login({ dispatch, commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(res => {
        if (res.state === 0) {
          commit('SET_NAME', username)
          setLocalStorageItem('loginFlag', true)
          dispatch('getPerms')
          dispatch('getNavTree')
          // dispatch('checkIsRootOrLeafMba')
        } else {
          reject(res)
        }
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getPerms({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPermission().then(res => {
        commit('SET_PERMS', res)
        setLocalStorageItem('USER_PERMS', res)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // NavTree
  getNavTree({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenuList().then(res => {
        if (res) {
          let nodeTree = res.nodeTree || []
          commit('SET_MENU', nodeTree)
          setLocalStorageItem('MENULIST', JSON.stringify(nodeTree))
        }
        resolve()
      }).catch(error => {
        console.log('e', error)
        reject(error)
      })
    })
  },
  checkIsRootOrLeafMba() {
    // return new Promise((resolve, reject) => {
    //   isRootOrLeafMba().then(res => {
    //     setLocalStorageItem('userId', res.msg)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },
  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logOut().then((res) => {
        commit('SET_PERMS', {})
        removeLocalStorageItem('loginFlag')
        removeLocalStorageItem('USER_PERMS')
        removeLocalStorageItem('MENULIST')
        removeLocalStorageItem('userId')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetToken() {

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
