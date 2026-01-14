import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout.vue';

// Views
import Login from '../views/LoginView.vue';
import DashboardHome from '../views/Dashboard.vue';
import UsersView from '../views/UsersView.vue';
import RolesView from '../views/RolesView.vue';
import SettingsView from '../views/SettingsView.vue';
import CategoriaRestaurantView from '../views/CategoriaRestaurantView.vue';
import CategoriaPlatosView from '../views/CategoriaPlatosView.vue';
import IngredientesView from '../views/IngredientesView.vue';
import RestaurantsView from '../views/RestaurantsView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: DashboardLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardHome,
            },
            {
                path: 'usuarios',
                name: 'usuarios',
                component: UsersView,
            },
            {
                path: 'roles',
                name: 'roles',
                component: RolesView,
            },
            {
                path: 'categorias-restaurant',
                name: 'categorias-restaurant',
                component: CategoriaRestaurantView,
            },
            {
                path: 'categorias-platos',
                name: 'categorias-platos',
                component: CategoriaPlatosView,
            },
            {
                path: 'ingredientes',
                name: 'ingredientes',
                component: IngredientesView,
            },
            {
                path: 'configuracion',
                name: 'config',
                component: SettingsView,
            },
            {
                path: 'restaurantes',
                name: 'restaurantes',
                component: RestaurantsView,
            }
        ]
    }
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

export default router;