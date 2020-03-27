import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../views/Auth.vue'
import Inbox from '../views/Inbox.vue'

import Box from '../components/Box.vue'
import Mail from '../components/Mail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/inbox',
    //name: 'Inbox',
    component: Inbox,
    children: [
      {
        path: '',
        name: 'Box',
        component: Box,
      },
      {
        path: 'mail',
        name: 'Mail',
        component: Mail,
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
