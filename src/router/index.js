import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import EventsPage from '@/pages/EventsPage.vue'
import EventDetailPage from '@/pages/EventDetailPage.vue'
import AdminPage from '@/pages/AdminPage.vue'

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
    path: '/event/:id',
    name: 'EventDetail',
    component: EventDetailPage,
    props: true,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
