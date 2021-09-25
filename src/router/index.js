import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: () => import('@/views/Login') },
    {
      path: '/home',
      // name: 'home',
      component: () => import('@/views/Home'),
      redirect: '/welcome',
      children: [
        { path: '/welcome', name: 'welcome', component: () => import('@/views/Welcome') },
        { path: '/users', name: 'users', component: () => import('@/views/user/User') },
        { path: '/rights', name: 'rights', component: () => import('@/views/power/Rights') },
        { path: '/roles', name: 'roles', component: () => import('@/views/power/Roles') },
        { path: '/categories', name: 'categories', component: () => import('@/views/goods/Cate') },
        { path: '/params', name: 'params', component: () => import('@/views/goods/Params') },
        { path: '/goods', name: 'goods', component: () => import('@/views/goods/List') },
        { path: '/goods/add', name: 'add', component: () => import('@/views/goods/Add') },
        { path: '/goods/edit', name: 'edit', component: () => import('@/views/goods/Edit') },
        { path: '/orders', name: 'orders', component: () => import('@/views/order/Order') },
        { path: '/reports', name: 'reports', component: () => import('@/views/report/Report') },
        { path: '/test', name: 'test', component: () => import('@/views/goods/Test') }
      ]
    },
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login')
    return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) {
    return next('/login');
  } else {
    next();
  }
})

export default router
