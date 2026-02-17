<script setup>
import { ref, onMounted } from 'vue';
import { Plus, AlertTriangle, X, ShieldCheck, Users } from 'lucide-vue-next';
import ToggleMenu from '../components/ToggleMenu.vue';
import api from '../api/axios';
import NewRoleModal from '../components/NewRoleModal.vue';
import RolEmpleadoModal from '../components/RolEmpleadoModal.vue';
import ModalDelete from '../components/ModalDelete.vue';

const roles = ref([]);
const rolesEmpleados = ref([]);
const loading = ref(false);
const loadingRolesEmpleados = ref(false);
const showNewRoleModal = ref(false);
const showNewRolEmpleadoModal = ref(false);
const showDeleteModal = ref(false);
const showDeleteRolEmpleadoModal = ref(false);
const roleToDelete = ref(null);
const rolEmpleadoToDelete = ref(null);
const roleToEdit = ref(null);
const rolEmpleadoToEdit = ref(null);
const isEditing = ref(false);
const isEditingRolEmpleado = ref(false);
const activeTab = ref('roles'); // 'roles' o 'roles-empleados'

const fetchRoles = async () => {
  loading.value = true;
  try {
    const rest = await api.get('roles');
    if (rest.data.status) {
      roles.value = rest.data.roles;
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert(`error: ${error}`);
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchRolesEmpleados = async () => {
  loadingRolesEmpleados.value = true;
  try {
    const rest = await api.get('rol');
    if (rest.data.status) {
      rolesEmpleados.value = rest.data.roles;
    }
  } catch (error) {
    console.error('Error fetching roles empleados:', error);
  } finally {
    loadingRolesEmpleados.value = false;
  }
};

onMounted(() => {
  fetchRoles();
  fetchRolesEmpleados();
});

async function handleSaveRole(roleData) {
  try {
    let rest;
    if (isEditing.value && roleToEdit.value) {
      roleData.id = roleToEdit.value.id;
      rest = await api.put(`roles`, roleData);
    } else {
      rest = await api.post('roles', roleData);
    }

    if (rest.data.status) {
      alert(isEditing.value ? 'Rol actualizado correctamente' : 'Rol guardado correctamente');
      fetchRoles();
      closeRoleModal();
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
  roleToEdit.value = null;
  showNewRoleModal.value = true;
};

const openEditModal = (role) => {
  isEditing.value = true;
  roleToEdit.value = role;
  showNewRoleModal.value = true;
};

const closeRoleModal = () => {
  showNewRoleModal.value = false;
  isEditing.value = false;
  roleToEdit.value = null;
};

const confirmDelete = (role) => {
  roleToDelete.value = role;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!roleToDelete.value) return;
  
  try {
    const rest = await api.delete(`roles/${roleToDelete.value.id}`);
    if (rest.data.status) {
      alert('Rol eliminado correctamente');
      fetchRoles();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al eliminar el rol');
  } finally {
    showDeleteModal.value = false;
    roleToDelete.value = null;
  }
};

// Funciones para Roles de Empleados
async function handleSaveRolEmpleado(rolData) {
  try {
    let rest;
    if (isEditingRolEmpleado.value && rolEmpleadoToEdit.value) {
      rolData.id = rolEmpleadoToEdit.value.id;
      rest = await api.put(`rol`, rolData);
    } else {
      rest = await api.post('rol', rolData);
    }

    if (rest.data.status) {
      alert(isEditingRolEmpleado.value ? 'Rol de empleado actualizado correctamente' : 'Rol de empleado guardado correctamente');
      fetchRolesEmpleados();
      closeRolEmpleadoModal();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al procesar la solicitud');
    console.error(error);
  }
}

const openAddRolEmpleadoModal = () => {
  isEditingRolEmpleado.value = false;
  rolEmpleadoToEdit.value = null;
  showNewRolEmpleadoModal.value = true;
};

const openEditRolEmpleadoModal = (rol) => {
  isEditingRolEmpleado.value = true;
  rolEmpleadoToEdit.value = rol;
  showNewRolEmpleadoModal.value = true;
};

const closeRolEmpleadoModal = () => {
  showNewRolEmpleadoModal.value = false;
  isEditingRolEmpleado.value = false;
  rolEmpleadoToEdit.value = null;
};

const confirmDeleteRolEmpleado = (rol) => {
  rolEmpleadoToDelete.value = rol;
  showDeleteRolEmpleadoModal.value = true;
};

const handleDeleteRolEmpleado = async () => {
  if (!rolEmpleadoToDelete.value) return;
  
  try {
    const rest = await api.delete(`rol/${rolEmpleadoToDelete.value.id}`);
    if (rest.data.status) {
      alert('Rol de empleado eliminado correctamente');
      fetchRolesEmpleados();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al eliminar el rol de empleado');
  } finally {
    showDeleteRolEmpleadoModal.value = false;
    rolEmpleadoToDelete.value = null;
  }
};
</script>

<template>
  <div>
    <NewRoleModal 
      v-if="showNewRoleModal" 
      :role="roleToEdit"
      :is-editing="isEditing"
      @close="closeRoleModal" 
      @save="handleSaveRole" 
    />

    <RolEmpleadoModal 
      v-if="showNewRolEmpleadoModal" 
      :rol="rolEmpleadoToEdit"
      :is-editing="isEditingRolEmpleado"
      @close="closeRolEmpleadoModal" 
      @save="handleSaveRolEmpleado" 
    />

    <!-- Modal de confirmación de eliminación -->
    <ModalDelete 
      v-if="showDeleteModal"
      :modelToDelete="roleToDelete"
      :title="'¿Eliminar rol?'"
      :messages="'¿Estás seguro de que quieres eliminar el rol '"
      :messages2="'Esta acción no se puede deshacer.'"
      @close="showDeleteModal = false"
      @delete="handleDelete"
    />

    <!-- Modal de confirmación de eliminación de rol de empleado -->
    <ModalDelete 
      v-if="showDeleteRolEmpleadoModal"
      :modelToDelete="rolEmpleadoToDelete"
      :title="'¿Eliminar rol de empleado?'"
      :messages="'¿Estás seguro de que quieres eliminar el rol de empleado '"
      :messages2="'Esta acción no se puede deshacer.'"
      @close="showDeleteRolEmpleadoModal = false"
      @delete="handleDeleteRolEmpleado"
    />

    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Gestión de Roles</h1>
          <p class="text-slate-500 text-sm">Visualiza y edita los roles de tu equipo.</p>
        </div>
      </div>

      <!-- Pestañas -->
      <div class="mb-6">
        <div class="border-b border-slate-200">
          <nav class="-mb-px flex gap-6">
            <button 
              @click="activeTab = 'roles'"
              :class="[
                'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'roles' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              ]"
            >
              <div class="flex items-center gap-2">
                <ShieldCheck class="w-4 h-4" />
                Roles de Usuario
              </div>
            </button>
            <button 
              @click="activeTab = 'roles-empleados'"
              :class="[
                'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'roles-empleados' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              ]"
            >
              <div class="flex items-center gap-2">
                <Users class="w-4 h-4" />
                Roles de Empleado
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- Contenido de Roles de Usuario -->
      <div v-if="activeTab === 'roles'">
        <div class="flex justify-end mb-6">
          <button @click="openAddModal" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus class="w-5 h-5" />
            <span>Añadir Rol</span>
          </button>
        </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nombre del Rol</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <template v-if="!loading">
              <tr v-for="r in roles" :key="r.id" class="hover:bg-slate-50/50">
                <td class="px-6 py-4 text-sm font-medium text-slate-600">
                  #{{r.id}}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                      {{ r.name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-semibold text-slate-700">{{ r.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Activo
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <ToggleMenu :user="r" 
                  @open-edit-modal="openEditModal" 
                  @confirm-delete="confirmDelete" />
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="4" class="text-center p-8 text-slate-500">
                  <div class="flex flex-col items-center gap-2">
                    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p>Cargando roles...</p>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="!loading && roles.length === 0">
              <td colspan="4" class="text-center p-8 text-slate-500">
                No se encontraron roles.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
      </div>

      <!-- Contenido de Roles de Empleados -->
      <div v-if="activeTab === 'roles-empleados'">
        <div class="flex justify-end mb-6">
          <button @click="openAddRolEmpleadoModal" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus class="w-5 h-5" />
            <span>Añadir Rol de Empleado</span>
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-100">
                  <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nombre del Rol</th>
                  <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <template v-if="!loadingRolesEmpleados">
                  <tr v-for="rol in rolesEmpleados" :key="rol.id" class="hover:bg-slate-50/50">
                    <td class="px-6 py-4 text-sm font-medium text-slate-600">
                      #{{rol.id}}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                          {{ rol.nombre.charAt(0).toUpperCase() }}
                        </div>
                        <span class="font-semibold text-slate-700">{{ rol.nombre }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Activo
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <ToggleMenu :user="rol" 
                      @open-edit-modal="openEditRolEmpleadoModal" 
                      @confirm-delete="confirmDeleteRolEmpleado(rol)" />
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="4" class="text-center p-8 text-slate-500">
                      <div class="flex flex-col items-center gap-2">
                        <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p>Cargando roles de empleados...</p>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-if="!loadingRolesEmpleados && rolesEmpleados.length === 0">
                  <td colspan="4" class="text-center p-8 text-slate-500">
                    No se encontraron roles de empleados.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
