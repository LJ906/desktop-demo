import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'normalize.css/normalize.css' // CSS resets
import './styles/element-variables.scss'
import '@/styles/index.scss'
import './icons'
import _ from 'lodash'
import db from './datastore'

import FormValidate from './utils/formValidate'
import { get, post, download, downloadById } from './utils/request'

Vue.use(Element)
Vue.use(FormValidate)

Vue.prototype.$_ = _
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$db = db

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

Vue.mixin({
  methods: {
    notice(msg, type = 'info', callback) {
      this.$alert(msg, '提示', {
        confirmButtonText: '确定',
        type: type,
        callback: action => {
          callback && callback()
        }
      })
    }
  }
})
