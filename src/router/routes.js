import HomeView from '@/views/HomeView.vue'
import LoginView from '/src/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import MyServicesView from '@/views/MyServicesView.vue'
import AppointmentView from '@/views/AppointmentView.vue'
import AccountEditView from '@/views/AccountEditView.vue'
import MessagesView from '@/views/MessagesView.vue'
import ResetPasswordView from '@/views/ResetPassword.vue'
import ForgotPasswordView from '@/views/ForgotPassword.vue'
import BookServiceView from '@/views/BookServiceView.vue'

export default [
      { path: '/', name: 'Home', component: HomeView },
      { path: '/login', name: 'Login', component: LoginView },
      { path: '/register', name: 'Register', component: RegisterView },
      { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
      { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView },
      { path: '/my-services', name: 'MyServices', component: MyServicesView, meta: { requiresAuth: true, role: 'provider' } },
      { path: '/appointments', name: 'Appointments', component: AppointmentView, meta: { requiresAuth: true, role: 'client' } },
      { path: '/account', name: 'Account', component: AccountEditView, meta: { requiresAuth: true } },
      { path: '/users/:userId/messages/', name: 'Messages', component: MessagesView, meta: { requiresAuth: true } },
      { path: '/services/:serviceId', name: 'BookServiceView', component: BookServiceView, meta: { requiresAuth: true }  },
]
