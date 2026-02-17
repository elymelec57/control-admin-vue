<script setup>
import { ref, onMounted, computed } from 'vue';
import { UserPlus, Settings, X, Search } from 'lucide-vue-next';
import api from '../api/axios';
import ToggleMenu from '../components/ToggleMenu.vue';
import NewUserModal from '../components/NewUserModal.vue';
import ModalDelete from '../components/ModalDelete.vue';

const users = ref([]);
const roles = ref([]);
const loading = ref(false);
const showNewUserModal = ref(false);
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const userToEdit = ref(null);
const isEditing = ref(false);

const searchQuery = ref('');
const roleFilter = ref('');

const fetchUsers = async () => {
  loading.value = true;
  try {
    const rest = await api.get('users');
    if (rest.data.status) {
      users.value = rest.data.users;
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al buscar los usuarios');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchRoles = async () => {
  try {
    const rest = await api.get('roles');
    if (rest.data.status) {
      roles.value = rest.data.roles;
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

onMounted(() => {
  fetchUsers();
  fetchRoles();
});

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Asumiendo que el usuario tiene una propiedad role_id o similar
    // Si el filtro está vacío, mostramos todos
    const matchesRole = !roleFilter.value || user.role_id == roleFilter.value;
    
    return matchesSearch && matchesRole;
  });
});

async function handleSaveUser(userData) {
  try {
    let rest;
    if (isEditing.value && userToEdit.value) {
      userData.id = userToEdit.value.id;
      rest = await api.put(`users`, userData);
    } else {
      rest = await api.post('users', userData);
    }

    if (rest.data.status) {
      alert(isEditing.value ? 'Usuario actualizado correctamente' : 'Usuario guardado correctamente');
      fetchUsers();
      closeUserModal();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al procesar la solicitud');
    console.error(error);
  }
}

const openAddModal = () => {
  isEditing.value = false;
  userToEdit.value = null;
  showNewUserModal.value = true;
};

const openEditModal = (user) => {
  isEditing.value = true;
  userToEdit.value = user;
  showNewUserModal.value = true;
};

const closeUserModal = () => {
  showNewUserModal.value = false;
  isEditing.value = false;
  userToEdit.value = null;
};

const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!userToDelete.value) return;
  
  try {
    const rest = await api.delete(`users/${userToDelete.value.id}`);
    if (rest.data.status) {
      alert('Usuario eliminado correctamente');
      fetchUsers();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al eliminar el usuario');
  } finally {
    showDeleteModal.value = false;
    userToDelete.value = null;
  }
};

</script>

<template>
  <div>
    <NewUserModal 
      v-if="showNewUserModal" 
      :user="userToEdit"
      :is-editing="isEditing"
      @close="closeUserModal" 
      @save="handleSaveUser" 
    />

    <!-- Modal de confirmación de eliminación -->
    <ModalDelete 
      v-if="showDeleteModal"
      :modelToDelete="userToDelete"
      :title="'¿Eliminar usuario?'"
      :messages="'¿Estás seguro de que quieres eliminar a '"
      :messages2="'Esta acción no se puede deshacer.'"
      @close="showDeleteModal = false" 
      @confirm="handleDelete" 
    />

    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p class="text-slate-500 text-sm">Visualiza y edita los privilegios de tu equipo.</p>
        </div>
        <button @click="openAddModal" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
        <UserPlus class="w-5 h-5" />
        <span>Añadir Usuario</span>
      </button>
    </div>

    <!-- Filtros de búsqueda y rol -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nombre o correo..." 
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm transition-all"
        />
      </div>
      <div class="relative">
        <select 
          v-model="roleFilter"
          class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm appearance-none transition-all"
        >
          <option value="">Todos los roles</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <Settings class="w-4 h-4" />
        </div>
      </div>
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
            <template v-if="!loading">
              <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                      U{{u.id}}
                    </div>
                    <div class="min-w-0">
                      <p class="font-semibold text-slate-700 truncate">{{ u.name }}</p>
                      <p class="text-xs text-slate-400 truncate text-ellipsis">{{ u.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Activo
                  </span>
                </td>
                <td class="px-6 py-4 text-right static">
                  <ToggleMenu :user="u" 
                  @open-edit-modal="openEditModal" 
                  @confirm-delete="confirmDelete" />
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="3" class="text-center p-8 text-slate-500">
                  <div class="flex flex-col items-center gap-2">
                    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p>Cargando usuarios...</p>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="!loading && filteredUsers.length === 0">
              <td colspan="3" class="text-center p-12 text-slate-500">
                <div class="flex flex-col items-center gap-3">
                  <Search class="w-8 h-8 text-slate-200" />
                  <p>No se encontraron usuarios con los filtros aplicados.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.scale-in-center {
	animation: scale-in-center 0.15s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes scale-in-center {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
