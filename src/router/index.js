//import { createRouter, createWebHistory } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Importa tus componentes de vista
import DashboardHome from '../views/Dashboard.vue';
import Login from '../views/LoginView.vue';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardHome,
        meta: { requiresAuth: true }
    },
    // {
    //     path: '/configuracion',
    //     name: 'settings',
    //     component: () => import('../views/Settings.vue') // Carga perezosa (Lazy Loading)
    // }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:6001',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        },
    })
}

export default router;