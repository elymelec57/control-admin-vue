<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  LayoutDashboard, Users, Settings, ShieldCheck, 
  LogOut, Search, Bell, Menu, ChevronLeft, Utensils, Apple, Store,
  Package, Wallet, ClipboardCheck
} from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

// Estados de la interfaz
const isSidebarOpen = ref(true);
const isMobile = ref(false);

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'usuarios', name: 'Usuarios', icon: Users, path: '/usuarios' },
  { id: 'roles', name: 'Roles', icon: ShieldCheck, path: '/roles' },
  { id: 'restaurantes', name: 'Restaurantes', icon: Store, path: '/restaurantes' },
  { id: 'categorias', name: 'Categorías restaurante', icon: Utensils, path: '/categorias-restaurant' },
  { id: 'categorias-platos', name: 'Categorías platos', icon: Utensils, path: '/categorias-platos' },
  { id: 'ingredientes', name: 'Ingredientes', icon: Apple, path: '/ingredientes' },
  { id: 'planes', name: 'Planes', icon: Package, path: '/planes' },
  { id: 'metodos-pago', name: 'Métodos de Pago', icon: Wallet, path: '/metodos-pago' },
  { id: 'revision-pagos', name: 'Revisión Pagos', icon: ClipboardCheck, path: '/revision-pagos' },
  { id: 'config', name: 'Ajustes', icon: Settings, path: '/configuracion' },
];

// Control de responsividad
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024;
  if (isMobile.value) isSidebarOpen.value = false;
  else isSidebarOpen.value = true;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value;

const logout = async () => {
  await auth.logout();
  router.push('/login');
};

const navigateTo = (path) => {
  router.push(path);
  if (isMobile.value) isSidebarOpen.value = false;
};

const isActive = (path) => {
  return route.path === path;
};
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-900">
    
    <!-- Overlay para móvil -->
    <div 
      v-if="isMobile && isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col',
        isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="h-16 flex items-center px-6 justify-between">
        <div class="flex items-center gap-3 transition-opacity duration-300" :class="!isSidebarOpen && 'lg:opacity-0'">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck class="text-white w-5 h-5" />
          </div>
          <span class="font-bold text-xl tracking-tight whitespace-nowrap">{{ auth.user?.name || 'Admin' }}</span>
        </div>
        <button @click="toggleSidebar" class="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
          <ChevronLeft :class="['w-5 h-5 transition-transform', !isSidebarOpen && 'rotate-180']" />
        </button>
      </div>

      <nav class="flex-1 px-3 mt-4 space-y-1 overflow-y-auto custom-scrollbar">
        <button 
          v-for="item in menuItems" :key="item.id"
          @click="navigateTo(item.path)"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative',
            isActive(item.path) ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'
          ]"
        >
          <component :is="item.icon" class="w-6 h-6 shrink-0" />
          <span :class="['font-medium transition-opacity', isSidebarOpen ? 'opacity-100' : 'lg:hidden opacity-0']">
            {{ item.name }}
          </span>
          <!-- Tooltip para sidebar colapsado -->
          <div v-if="!isSidebarOpen" class="hidden lg:group-hover:block absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
            {{ item.name }}
          </div>
        </button>
      </nav>

      <div class="p-3 border-t border-slate-100">
        <button @click="logout" class="flex items-center gap-3 px-3 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut class="w-6 h-6 shrink-0" />
          <span v-if="isSidebarOpen" class="font-medium">Salir</span>
        </button>
      </div>
    </aside>

    <!-- Contenedor Principal -->
    <div 
      :class="[
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      ]"
    >
      <!-- Header -->
      <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
        <div class="flex items-center gap-4">
          <button @click="isSidebarOpen = true" v-if="!isSidebarOpen || isMobile" class="p-2 hover:bg-slate-100 rounded-lg lg:hidden">
            <Menu class="w-6 h-6" />
          </button>
          <div class="hidden sm:flex relative w-64 lg:w-96 text-slate-400 focus-within:text-indigo-600">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <input type="text" placeholder="Buscar..." class="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" />
          </div>
        </div>

        <div class="flex items-center gap-2 lg:gap-4">
          <button class="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative">
            <Bell class="w-5 h-5" />
            <span class="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <div class="flex items-center gap-3 pl-2 border-l border-slate-200">
            <img src="https://ui-avatars.com/api/?name=User" class="w-8 h-8 rounded-full ring-2 ring-indigo-50" />
            <span class="hidden md:block text-sm font-semibold text-slate-700">Mi Perfil</span>
          </div>
        </div>
      </header>

      <!-- Contenido de las Vistas -->
      <main class="p-4 lg:p-8 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Para Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
</style>
