import Vue from 'vue'
import Router from 'vue-router'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
import Layout from '@/views/layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      // hidden: true,
      // redirect: '/advice-report',
      children: [
        {
          path: 'home',
          component: () => import('@/views/home'),
          name: 'Home',
          meta: { title: '首页', icon: 'home', affix: true }
        }
      ]
    },
    {
      path: '/advice-report',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import('@/views/advice-report'),
          name: 'projectAdvice',
          meta: { title: '项目建议书', noCache: true, icon: 'documentation-color' }
        }
      ]
    },
    {
      path: '/estimate',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import('@/views/estimate/index'),
          name: 'estimate',
          meta: { title: '项目经费概算书', noCache: true, icon: 'money-color' }
        }
      ]
    },
    {
      path: '/questation-manage',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import('@/views/questation-manage'),
          name: 'questationmManage',
          meta: { title: '开题管理', noCache: true, icon: 'user-color' }
        }
      ]
    },
    {
      path: '/login',
      // component: () => import('@/views/login/index'),
      component: require('@/views/login/index').default,
      hidden: true
    },
    {
      path: '/404',
      component: () => import('@/views/error-page/404'),
      hidden: true
    },
    {
      path: '/401',
      component: () => import('@/views/error-page/401'),
      hidden: true
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
