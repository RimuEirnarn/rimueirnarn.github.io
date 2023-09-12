export default [
  {
    path: '/',
    component: () => import('./pages/Main.vue'),
    name: 'home',
  },
  {
    path: '/project',
    component: () => import('./pages/Projects.vue'),
    name: "projects"
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: () => import('./pages/404.vue'),
  },
]

