import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/login/Login.vue'
import Home from '../components/home/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: 'welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      }, {
        path: '/rights',
        component: Rights
      }, {
        path: '/roles',
        component: Roles
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从那个路径来
  //next是一个函数，表示放行
  //如果访问的是登录页直接放行
  if (to.path === '/login') return next()
  //如果直接访问其他页面就进行拦截
  const sessionStr = window.sessionStorage.getItem('token')
  if (!sessionStr) return next('/login')
  next()
})
export default router
