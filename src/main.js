import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { userService } from './api/userService'
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)

// добавляем сервис в глобальные свойства
app.config.globalProperties.$userService = userService
// добавляем в window для доступа из компонентов (опционально)
window.$userService = userService

app.use(router)
app.mount('#app')
