<script setup>
import { ref, onMounted, computed } from 'vue';
import { Plus, Filter, Tag } from 'lucide-vue-next';
import api from '../api/axios';
import IngredienteModal from '../components/IngredienteModal.vue';
import CategoriaIngredienteModal from '../components/CategoriaIngredienteModal.vue';
import ToggleMenu from '../components/ToggleMenu.vue';
import ModalDelete from '../components/ModalDelete.vue';

const ingredientes = ref([]);
const categorias = ref([]);
const loading = ref(false);
const loadingCategorias = ref(false);
const showNewIngredienteModal = ref(false);
const showNewCategoriaModal = ref(false);
const showDeleteModal = ref(false);
const showDeleteCategoriaModal = ref(false);
const ingredienteToDelete = ref(null);
const categoriaToDelete = ref(null);
const ingredienteToEdit = ref(null);
const categoriaToEdit = ref(null);
const isEditing = ref(false);
const isEditingCategoria = ref(false);
const categoriaFilter = ref('');
const activeTab = ref('ingredientes'); // 'ingredientes' o 'categorias'

const fetchIngredientes = async () => {
  loading.value = true;
  try {
    const rest = await api.get('ingrediente');
    if (rest.data.status) {
      ingredientes.value = rest.data.ingredientes;
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert(`error al buscar ingredientes: ${error}`);
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchCategorias = async () => {
  loadingCategorias.value = true;
  try {
    const rest = await api.get('categoria-ingrediente');
    if (rest.data.status) {
      categorias.value = rest.data.categorias;
    }
  } catch (error) {
    console.error('Error fetching categorías:', error);
  } finally {
    loadingCategorias.value = false;
  }
};

onMounted(() => {
  fetchIngredientes();
  fetchCategorias();
});

const filteredIngredientes = computed(() => {
  if (!categoriaFilter.value) return ingredientes.value;
  return ingredientes.value.filter(ing => ing.categoriaIngredienteId == categoriaFilter.value);
});

// Funciones para Ingredientes
async function handleSaveIngrediente(ingredienteData) {
  try {
    let rest;
    if (isEditing.value && ingredienteToEdit.value) {
      ingredienteData.id = ingredienteToEdit.value.id;
      rest = await api.put(`ingrediente`, ingredienteData);
    } else {
      rest = await api.post('ingrediente', ingredienteData);
    }

    if (rest.data.status) {
      alert(isEditing.value ? 'Ingrediente actualizado correctamente' : 'Ingrediente guardado correctamente');
      fetchIngredientes();
      closeIngredienteModal();
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
  ingredienteToEdit.value = null;
  showNewIngredienteModal.value = true;
};

const openEditModal = (ingrediente) => {
  isEditing.value = true;
  ingredienteToEdit.value = ingrediente;
  showNewIngredienteModal.value = true;
};

const closeIngredienteModal = () => {
  showNewIngredienteModal.value = false;
  isEditing.value = false;
  ingredienteToEdit.value = null;
};

const confirmDelete = (ingrediente) => {
  ingredienteToDelete.value = ingrediente;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!ingredienteToDelete.value) return;
  
  try {
    const rest = await api.delete(`ingrediente/${ingredienteToDelete.value.id}`);
    if (rest.data.status) {
      alert('Ingrediente eliminado correctamente');
      fetchIngredientes();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al eliminar el ingrediente');
  } finally {
    showDeleteModal.value = false;
    ingredienteToDelete.value = null;
  }
};

// Funciones para Categorías
async function handleSaveCategoria(categoriaData) {
  try {
    let rest;
    if (isEditingCategoria.value && categoriaToEdit.value) {
      categoriaData.id = categoriaToEdit.value.id;
      rest = await api.put(`categoria-ingrediente`, categoriaData);
    } else {
      rest = await api.post('categoria-ingrediente', categoriaData);
    }

    if (rest.data.status) {
      alert(isEditingCategoria.value ? 'Categoría actualizada correctamente' : 'Categoría guardada correctamente');
      fetchCategorias();
      closeCategoriaModal();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al procesar la solicitud');
    console.error(error);
  }
}

const openAddCategoriaModal = () => {
  isEditingCategoria.value = false;
  categoriaToEdit.value = null;
  showNewCategoriaModal.value = true;
};

const openEditCategoriaModal = (categoria) => {
  isEditingCategoria.value = true;
  categoriaToEdit.value = categoria;
  showNewCategoriaModal.value = true;
};

const closeCategoriaModal = () => {
  showNewCategoriaModal.value = false;
  isEditingCategoria.value = false;
  categoriaToEdit.value = null;
};

const confirmDeleteCategoria = (categoria) => {
  categoriaToDelete.value = categoria;
  showDeleteCategoriaModal.value = true;
};

const handleDeleteCategoria = async () => {
  if (!categoriaToDelete.value) return;
  
  try {
    const rest = await api.delete(`categoria-ingrediente/${categoriaToDelete.value.id}`);
    if (rest.data.status) {
      alert('Categoría eliminada correctamente');
      fetchCategorias();
      fetchIngredientes(); // Refrescar ingredientes por si acaso
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al eliminar la categoría');
  } finally {
    showDeleteCategoriaModal.value = false;
    categoriaToDelete.value = null;
  }
};

</script>

<template>
  <div>
    <IngredienteModal 
      v-if="showNewIngredienteModal" 
      :ingrediente="ingredienteToEdit"
      :categorias="categorias"
      :is-editing="isEditing"
      @close="closeIngredienteModal" 
      @save="handleSaveIngrediente" 
    />

    <CategoriaIngredienteModal 
      v-if="showNewCategoriaModal" 
      :categoria="categoriaToEdit"
      :is-editing="isEditingCategoria"
      @close="closeCategoriaModal" 
      @save="handleSaveCategoria" 
    />

    <!-- Modal de confirmación de eliminación de ingrediente -->
    <ModalDelete
      v-if="showDeleteModal"
      :modelToDelete="ingredienteToDelete"
      :title="'¿Eliminar ingrediente?'"
      :messages="'¿Estás seguro de que quieres eliminar el ingrediente '"
      :messages2="'Esta acción no se puede deshacer.'"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

    <!-- Modal de confirmación de eliminación de categoría -->
    <ModalDelete
      v-if="showDeleteCategoriaModal"
      :modelToDelete="categoriaToDelete"
      :title="'¿Eliminar categoría?'"
      :messages="'¿Estás seguro de que quieres eliminar la categoría '"
      :messages2="'Esta acción no se puede deshacer.'"
      @close="showDeleteCategoriaModal = false"
      @confirm="handleDeleteCategoria"
    />

    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Gestión de Ingredientes</h1>
          <p class="text-slate-500 text-sm">Administra los ingredientes y sus categorías.</p>
        </div>
      </div>

      <!-- Pestañas -->
      <div class="mb-6">
        <div class="border-b border-slate-200">
          <nav class="-mb-px flex gap-6">
            <button 
              @click="activeTab = 'ingredientes'"
              :class="[
                'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'ingredientes' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              ]"
            >
              <div class="flex items-center gap-2">
                <Filter class="w-4 h-4" />
                Ingredientes
              </div>
            </button>
            <button 
              @click="activeTab = 'categorias'"
              :class="[
                'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'categorias' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              ]"
            >
              <div class="flex items-center gap-2">
                <Tag class="w-4 h-4" />
                Categorías
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- Contenido de Ingredientes -->
      <div v-if="activeTab === 'ingredientes'">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div class="relative max-w-xs flex-1">
            <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              v-model="categoriaFilter"
              class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm appearance-none transition-all"
            >
              <option value="">Todas las categorías</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
          </div>
          <button @click="openAddModal" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus class="w-5 h-5" />
            <span>Añadir Ingrediente</span>
          </button>
        </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <template v-if="!loading">
                <tr v-for="ing in filteredIngredientes" :key="ing.id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4 text-sm font-medium text-slate-600">
                    #{{ing.id}}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-bold">
                        {{ ing.nombre.charAt(0).toUpperCase() }}
                      </div>
                      <span class="font-semibold text-slate-700">{{ ing.nombre }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                      {{ ing.categoriaIngrediente.nombre }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Activo
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <ToggleMenu :item="ing"
                      @open-edit-modal="openEditModal"
                      @confirm-delete="confirmDelete" />
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="5" class="text-center p-8 text-slate-500">
                    <div class="flex flex-col items-center gap-2">
                      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p>Cargando ingredientes...</p>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="!loading && filteredIngredientes.length === 0">
                <td colspan="5" class="text-center p-8 text-slate-500">
                  No se encontraron ingredientes.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

      <!-- Contenido de Categorías -->
      <div v-if="activeTab === 'categorias'">
        <div class="flex justify-end mb-6">
          <button @click="openAddCategoriaModal" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus class="w-5 h-5" />
            <span>Añadir Categoría</span>
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-100">
                  <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                  <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <template v-if="!loadingCategorias">
                  <tr v-for="cat in categorias" :key="cat.id" class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-slate-600">
                      #{{cat.id}}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                          {{ cat.nombre.charAt(0).toUpperCase() }}
                        </div>
                        <span class="font-semibold text-slate-700">{{ cat.nombre }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Activo
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <ToggleMenu :item="cat"
                        @open-edit-modal="openEditCategoriaModal"
                        @confirm-delete="confirmDeleteCategoria" />
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="4" class="text-center p-8 text-slate-500">
                      <div class="flex flex-col items-center gap-2">
                        <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p>Cargando categorías...</p>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-if="!loadingCategorias && categorias.length === 0">
                  <td colspan="4" class="text-center p-8 text-slate-500">
                    No se encontraron categorías.
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
