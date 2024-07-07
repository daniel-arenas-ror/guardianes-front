import { 
  createRouter,
  createWebHashHistory
} from 'vue-router'

import Availability from "../views/Availability/Index.vue"
import Turns from "../views/Turns/Index.vue"

const routes = [
  {
    path: '/',
    component: Turns
  },
  {
    path: '/availability',
    name: 'availability',
    component: Availability
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;
