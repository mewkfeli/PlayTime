import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import EventsPage from '@/pages/EventsPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import GamesManagement from '@/components/sections/admin/GamesManagement.vue'
import UsersManagement from '@/components/sections/admin/UsersManagement.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  },
  {
    path: '/events',
    name: 'Events',
    component: EventsPage,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/games',
    name: 'GamesManagement',
    component: GamesManagement,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: UsersManagement,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
