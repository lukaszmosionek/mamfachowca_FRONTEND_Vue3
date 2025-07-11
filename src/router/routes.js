import HomeView from '@/views/HomeView.vue'
import LoginView from '/src/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import MyServicesView from '@/views/MyServicesView.vue'
import AppointmentView from '@/views/AppointmentView.vue'
import AccountEditView from '@/views/AccountEditView.vue'

export default [
      { path: '/', name: 'Home', component: HomeView },
      { path: '/login', name: 'Login', component: LoginView },
      { path: '/register', name: 'Register', component: RegisterView },
      { path: '/my-services', name: 'MyServices', component: MyServicesView, meta: { requiresAuth: true, role: 'provider' } },
      { path: '/appointments', name: 'Appointments', component: AppointmentView, meta: { requiresAuth: true, role: 'client' } },
      { path: '/account', name: 'Account', component: AccountEditView, meta: { requiresAuth: true } },
]
