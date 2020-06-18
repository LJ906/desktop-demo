import axios from 'axios'
// import router from '@/router'
// import store from '@/store'
console.log('VUE_APP_BASE_URL', process.env.VUE_APP_BASE_URL)
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  withCredentials: true,
  timeout: 20000
})

let downloadContentType = {
  'application/octet-stream;charset=utf-8': true,
  'application/octet-stream;charset=UTF-8': true,
  'application/vnd.ms-word;charset=UTF-8': true,
  'text/plain;charset=UTF-8': true,
  'application/msword;charset=UTF-8': true,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true
}

// request interceptor
service.interceptors.request.use(
  config => {
    if (config.url === '/a/login') {
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    } else if (config.url.indexOf('/import') >= 0 || config.url.indexOf('/upload') >= 0) {
      config.headers = {
      }
    } else {
      if (!config.headers['Content-Type']) {
        config.data = JSON.stringify(config.data)
        config.headers = {
          'Content-Type': 'application/json'
        }
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const headers = response.headers
    let conType = headers && headers['content-type'] ? headers['content-type'].toLowerCase() : ''
    if (headers && conType && downloadContentType[conType]) {
      return response
    }
    const data = response.data
    // 登录认证失败返回登录页面
    if (data.state === 2) {
      // store.dispatch('user/resetToken').then(() => {
      //   location.reload()
      //   router.push({
      //     path: '/login'
      //   })
      // })
      return data
    } else {
      return data
    }
  }, error => {
    return Promise.reject(error)
  }
)

// 导出service
export default service

// post请求
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    service({
      url,
      data,
      method: 'POST'
    }).then(response => {
      response ? resolve(response) : resolve()
    }, err => {
      reject(err)
    })
  })
}

// get请求
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    service({
      url,
      params,
      method: 'GET'
    }).then(response => {
      response ? resolve(response) : resolve()
    }, err => {
      reject(err)
    })
  })
}

export function download(url, params) {
  service({
    url: url,
    method: 'post',
    data: params,
    responseType: 'arraybuffer'
  }).then(res => {
    if (res.status !== 200) {
      return this.$message.error('下载失败')
    }
    const blob = new Blob([res.data])
    let fileNameUrl = res.headers['content-disposition'] ? res.headers['content-disposition'] : ''
    fileNameUrl = fileNameUrl.replace(/\+/g, '%20')
    fileNameUrl = decodeURIComponent(fileNameUrl)
    let fileName = fileNameUrl !== '' ? fileNameUrl.split(';')[1].split('filename=')[1] : ''
    if (fileName === '') {
      this.$message({ message: '下载失败：无法获取文件名！', type: 'error' })
    } else {
      fileName = fileName.startsWith('"') ? fileName.substring(1) : fileName
      fileName = fileName.endsWith('"') ? fileName.substring(0, fileName.length - 1) : fileName
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    }
  }).catch(e => {
    this.$message.error('下载失败')
  })
}

export function downloadById(url, id) {
  let fullUrl = process.env.API_BASEURL + url + '?id=' + id
  window.open(fullUrl)
}
