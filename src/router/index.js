import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/cover-generator',
      name: 'cover-generator',
      component: () => import('../views/CoverGeneratorView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'under-development',
      component: () => import('../views/UnderDevelopmentView.vue'),
    },
  ],
})

export default router
