import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'HomeDashboard',
      component: () => import('../views/HomeDashboard.vue')
    },
    {
      path: '/scenarios/:scenarioName',
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
