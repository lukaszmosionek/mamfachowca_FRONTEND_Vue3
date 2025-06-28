import { createRouter, createWebHistory } from 'vue-router'

// import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
// import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
      // { path: '/', name: 'Home', component: HomeView },
      { path: '/login', name: 'Login', component: LoginView },
      // { path: '/register', name: 'Register', component: RegisterView },
  ],
})

export default router
