import { createRouter,createWebHistory} from 'vue-router';// main.js
import Login from '@/views/login.vue'
import index from '@/views/index.vue'
import account from '@/views/account.vue'
import video from '@/views/video.vue'

const routes = [
  { path: '/login', component: Login }
  , { path: '/', component: index },
  {path: '/account/:id',component:account,props: true},
  {path:'/video/:id',component:video,props: true}
]

const router = new createRouter({
  history: createWebHistory(), 
  routes
})

export default router
