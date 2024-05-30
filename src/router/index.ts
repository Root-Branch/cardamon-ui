import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'MainDashboard',
      component: () => import('../views/MainDashboard.vue')
    },
    {
      path: '/runs/:runId',
      name: 'RunDetail',
      component: () => import('../views/RunDetail.vue')
    },
    {
      path: '/scenarios/:scenarioId',
      name: 'ScenarioDetail',
      component: () => import('../views/ScenarioDetail.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

router.onError((error) => {
  console.error('Router error:', error)
})

export default router
