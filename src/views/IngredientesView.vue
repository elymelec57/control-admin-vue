<script setup>
import { ref, onMounted, computed } from 'vue';
import { Plus, Settings, Pencil, Trash2, AlertTriangle, Filter, Tag } from 'lucide-vue-next';
import api from '../api/axios';
import IngredienteModal from '../components/IngredienteModal.vue';
import CategoriaIngredienteModal from '../components/CategoriaIngredienteModal.vue';

const ingredientes = ref([]);
const categorias = ref([]);
const loading = ref(false);
const loadingCategorias = ref(false);
const showNewIngredienteModal = ref(false);
const showNewCategoriaModal = ref(false);
const activeMenuId = ref(null);
const activeMenuCategoriaId = ref(null);
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

const toggleMenu = (id) => {
  if (activeMenuId.value === id) {
    activeMenuId.value = null;
  } else {
    activeMenuId.value = id;
  }
};

const openAddModal = () => {
  isEditing.value = false;
  ingredienteToEdit.value = null;
  showNewIngredienteModal.value = true;
};

const openEditModal = (ingrediente) => {
  isEditing.value = true;
  ingredienteToEdit.value = ingrediente;
  activeMenuId.value = null;
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
  activeMenuId.value = null;
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

const toggleMenuCategoria = (id) => {
  if (activeMenuCategoriaId.value === id) {
    activeMenuCategoriaId.value = null;
  } else {
    activeMenuCategoriaId.value = id;
  }
};

const openAddCategoriaModal = () => {
  isEditingCategoria.value = false;
  categoriaToEdit.value = null;
  showNewCategoriaModal.value = true;
};

const openEditCategoriaModal = (categoria) => {
  isEditingCategoria.value = true;
  categoriaToEdit.value = categoria;
  activeMenuCategoriaId.value = null;
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
  activeMenuCategoriaId.value = null;
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

const handleWindowClick = (event) => {
  if (!event.target.closest('.menu-container')) {
    activeMenuId.value = null;
    activeMenuCategoriaId.value = null;
  }
};

onMounted(() => {
  window.addEventListener('click', handleWindowClick);
});

import { onUnmounted } from 'vue';
onUnmounted(() => {
  window.removeEventListener('click', handleWindowClick);
});
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
    <div v-if="showDeleteModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl scale-in-center">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">¿Eliminar ingrediente?</h3>
            <p class="text-sm text-slate-500">Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <p class="text-slate-600 mb-6">
          ¿Estás seguro de que quieres eliminar el ingrediente <span class="font-semibold text-slate-900">{{ ingredienteToDelete?.nombre }}</span>?
        </p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button @click="handleDelete" class="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación de categoría -->
    <div v-if="showDeleteCategoriaModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl scale-in-center">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">¿Eliminar categoría?</h3>
            <p class="text-sm text-slate-500">Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <p class="text-slate-600 mb-6">
          ¿Estás seguro de que quieres eliminar la categoría <span class="font-semibold text-slate-900">{{ categoriaToDelete?.nombre }}</span>?
        </p>
        <div class="flex gap-3">
          <button @click="showDeleteCategoriaModal = false" class="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button @click="handleDeleteCategoria" class="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </div>

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
                    <div class="relative inline-block text-left menu-container">
                      <button 
                        @click.stop="toggleMenu(ing.id)"
                        class="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none"
                      >
                        <Settings class="w-5 h-5" />
                      </button>
                      
                      <div 
                        v-if="activeMenuId === ing.id"
                        class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 overflow-hidden scale-in-center"
                      >
                        <button 
                          @click="openEditModal(ing)"
                          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                        >
                          <Pencil class="w-4 h-4" />
                          Editar
                        </button>
                        <button 
                          @click="confirmDelete(ing)"
                          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                        >
                          <Trash2 class="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
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
                      <div class="relative inline-block text-left menu-container">
                        <button 
                          @click.stop="toggleMenuCategoria(cat.id)"
                          class="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none"
                        >
                          <Settings class="w-5 h-5" />
                        </button>
                        
                        <div 
                          v-if="activeMenuCategoriaId === cat.id"
                          class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 overflow-hidden scale-in-center"
                        >
                          <button 
                            @click="openEditCategoriaModal(cat)"
                            class="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                          >
                            <Pencil class="w-4 h-4" />
                            Editar
                          </button>
                          <button 
                            @click="confirmDeleteCategoria(cat)"
                            class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                          >
                            <Trash2 class="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
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
