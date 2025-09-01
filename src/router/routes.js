import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import MyServicesView from '@/views/MyServicesView.vue'
import MyServiceView from '@/views/MyServiceView.vue'
import AppointmentView from '@/views/AppointmentView.vue'
import AccountEditView from '@/views/AccountEditView.vue'
import MessagesView from '@/views/MessagesView.vue'
import ResetPasswordView from '@/views/ResetPassword.vue'
import ForgotPasswordView from '@/views/ForgotPassword.vue'
import BookServiceView from '@/views/BookServiceView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Dashboard from '@/components/admin/Dashboard.vue'
import Users from '@/components/admin/Users.vue'
import Settings from '@/components/admin/Settings.vue'
import Services from '@/components/admin/Services.vue'

import NotFound from '@/views/NotFound.vue'

import { Enums } from '@/enums.js'

export default [
      {
        path: '/',
        component: MainLayout,
        children: [
          { path: '/', name: 'Home', component: HomeView },
          { path: '/login', name: 'Login', component: LoginView },
          { path: '/register', name: 'Register', component: RegisterView },
          { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
          { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView },
          { path: '/about', name: 'About', component: AboutView },
          { path: '/contact', name: 'Contact', component: ContactView },
          { path: '/my-services/:serviceId', name: 'MyServiceView', component: MyServiceView, meta: { requiresAuth: true }  },
          { path: '/my-services', name: 'MyServices', component: MyServicesView, meta: { requiresAuth: true, role: Enums.Role.Provider } },
          { path: '/appointments', name: 'Appointments', component: AppointmentView, meta: { requiresAuth: true } },
          { path: '/account', name: 'Account', component: AccountEditView, meta: { requiresAuth: true } },
          { path: '/users/:userId/messages/', name: 'Messages', component: MessagesView, meta: { requiresAuth: true } },
          { path: '/services/:serviceId', name: 'BookServiceView', component: BookServiceView, meta: { requiresAuth: true }  },
          { path: '/favorites', name: 'Favorites', component: FavoritesView, meta: { requiresAuth: true }  },
          { path: '/profiles/:userId', name: 'Profile', component: ProfileView, meta: { requiresAuth: false }  },

        ]
      },

      { // Admin routes
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, role: Enums.Role.Admin },
        children: [
          { path: 'dashboard', component: Dashboard, name: 'AdminDashboard' },
          { path: 'users', component: Users, name: 'AdminUsers' },
          { path: 'settings', component: Settings, name: 'AdminSettings' },
          { path: 'services', component: Services, name: 'AdminServices' },

          { path: 'my-services/:serviceId', name: 'AdminMyServiceView', component: MyServiceView },

          { path: '', redirect: '/admin/dashboard' },

        ]
      },

      // Catch-all route (must be last)
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
      }
]
