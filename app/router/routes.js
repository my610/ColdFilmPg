import * as guards from './guards'

export default [
  {
    path: '/auth',
    component: require('../components/views/auth.vue').default,
    name: 'auth',
    children: [
      {
        path: 'logout',
        alias: '/logout',
        name: 'logout',
        component: require('../components/views/auth/logout.vue').default
      },
      {
        path: 'login',
        alias: '/login',
        name: 'login',
        component: require('../components/views/auth/login.vue').default,
        beforeEnter: guards.restrictToUnauthenticated
      },
      {
        path: '/register',
        name: 'register',
        component: require('../components/views/auth/register.vue').default,
        beforeEnter: guards.restrictToUnauthenticated
      }
    ]
  },
  {
    path: '/films',
    name: 'films',
    alias: '/',
    component: require('../components/views/films.vue').default,
    beforeEnter: guards.restrictToAuthenticated
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: require('../components/views/tasks.vue').default,
    beforeEnter: guards.restrictToAuthenticated
  },
  {
    path: '/run',
    name: 'run',
    component: require('../components/views/run.vue').default,
    beforeEnter: guards.restrictToAuthenticated
  },
  {
    path: '*',
    name: 'not-found',
    component: require('../components/views/404.vue').default
  }
]
