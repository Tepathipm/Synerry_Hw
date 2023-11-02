import { createRouter, createWebHistory } from 'vue-router'
import contentVue from '../components/content.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/shortUrl'
    },
    {
      path: '/shortUrl',
      name: 'content',
      component: contentVue
    }
  ]
})

export default router