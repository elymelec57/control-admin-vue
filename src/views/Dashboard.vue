<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  LayoutDashboard, Users, Settings, ShieldCheck, 
  LogOut, Search, Bell, UserPlus, Menu, X, ChevronLeft 
} from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();

// Estados de la interfaz
const isSidebarOpen = ref(true);
const isMobile = ref(false);
const activeTab = ref('usuarios');

// Datos de ejemplo
const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'usuarios', name: 'Usuarios', icon: Users },
  { id: 'roles', name: 'Roles', icon: ShieldCheck },
  { id: 'config', name: 'Ajustes', icon: Settings },
];

// Control de responsividad
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024;
  if (isMobile.value) isSidebarOpen.ref = false;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value;
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-900">
    
    <div 
      v-if="isMobile && isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
    ></div>

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
          <span class="font-bold text-xl tracking-tight whitespace-nowrap">{{ auth.user.name }}</span>
        </div>
        <button @click="toggleSidebar" class="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
          <ChevronLeft :class="['w-5 h-5 transition-transform', !isSidebarOpen && 'rotate-180']" />
        </button>
      </div>

      <nav class="flex-1 px-3 mt-4 space-y-1">
        <button 
          v-for="item in menuItems" :key="item.id"
          @click="activeTab = item.id"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative',
            activeTab === item.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'
          ]"
        >
          <component :is="item.icon" class="w-6 h-6 shrink-0" />
          <span :class="['font-medium transition-opacity', isSidebarOpen ? 'opacity-100' : 'lg:hidden opacity-0']">
            {{ item.name }}
          </span>
          <div v-if="!isSidebarOpen" class="hidden lg:group-hover:block absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
            {{ item.name }}
          </div>
        </button>
      </nav>

      <div class="p-3 border-t border-slate-100">
        <button class="flex items-center gap-3 px-3 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut class="w-6 h-6 shrink-0" />
          <span v-if="isSidebarOpen" class="font-medium">Salir</span>
        </button>
      </div>
    </aside>

    <div 
      :class="[
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      ]"
    >
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

      <main class="p-4 lg:p-8 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
              <p class="text-slate-500 text-sm">Visualiza y edita los privilegios de tu equipo.</p>
            </div>
            <button class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
              <UserPlus class="w-5 h-5" />
              <span>Añadir Usuario</span>
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/50 border-b border-slate-100">
                    <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                    <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="i in 5" :key="i" class="hover:bg-slate-50/50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                          U{{i}}
                        </div>
                        <div class="min-w-0">
                          <p class="font-semibold text-slate-700 truncate">Usuario Ejemplo {{i}}</p>
                          <p class="text-xs text-slate-400 truncate text-ellipsis">usuario{{i}}@sistema.com</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Activo
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                        <Settings class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>