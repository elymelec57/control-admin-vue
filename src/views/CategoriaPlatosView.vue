<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Settings, Pencil, Trash2, AlertTriangle, X } from 'lucide-vue-next';
import api from '../api/axios';
import CategoriaPlatosModal from '../components/CategoriaPlatosModal.vue';

const categories = ref([]);
const loading = ref(false);
const showNewCategoryModal = ref(false);
const activeMenuId = ref(null);
const showDeleteModal = ref(false);
const categoryToDelete = ref(null);
const categoryToEdit = ref(null);
const isEditing = ref(false);

const fetchCategories = async () => {
  loading.value = true;
  try {
    const rest = await api.get('categoria');
    if (rest.data.status) {
      categories.value = rest.data.categorias;
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert(`error al buscar categorías: ${error}`);
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});

async function handleSaveCategory(categoryData) {
  try {
    let rest;
    if (isEditing.value && categoryToEdit.value) {
      categoryData.id = categoryToEdit.value.id;
      rest = await api.put(`categoria`, categoryData);
    } else {
      rest = await api.post('categoria', categoryData);
    }

    if (rest.data.status) {
      alert(isEditing.value ? 'Categoría actualizada correctamente' : 'Categoría guardada correctamente');
      fetchCategories();
      closeCategoryModal();
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
  categoryToEdit.value = null;
  showNewCategoryModal.value = true;
};

const openEditModal = (category) => {
  isEditing.value = true;
  categoryToEdit.value = category;
  activeMenuId.value = null;
  showNewCategoryModal.value = true;
};

const closeCategoryModal = () => {
  showNewCategoryModal.value = false;
  isEditing.value = false;
  categoryToEdit.value = null;
};

const confirmDelete = (category) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
  activeMenuId.value = null;
};

const handleDelete = async () => {
  if (!categoryToDelete.value) return;
  
  try {
    const rest = await api.delete(`categoria-restaurant/${categoryToDelete.value.id}`);
    if (rest.data.status) {
      alert('Categoría eliminada correctamente');
      fetchCategories();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al eliminar la categoría');
  } finally {
    showDeleteModal.value = false;
    categoryToDelete.value = null;
  }
};

const handleWindowClick = (event) => {
  if (!event.target.closest('.menu-container')) {
    activeMenuId.value = null;
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
    <CategoriaPlatosModal 
      v-if="showNewCategoryModal" 
      :category="categoryToEdit"
      :is-editing="isEditing"
      @close="closeCategoryModal" 
      @save="handleSaveCategory" 
    />

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
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
          ¿Estás seguro de que quieres eliminar la categoría <span class="font-semibold text-slate-900">{{ categoryToDelete?.name }}</span>?
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

    <div class="max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Categorías de Restaurante</h1>
        <p class="text-slate-500 text-sm">Gestiona las diferentes categorías para tus establecimientos.</p>
      </div>
      <button @click="openAddModal" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
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
            <template v-if="!loading">
              <tr v-for="c in categories" :key="c.id" class="hover:bg-slate-50/50">
                <td class="px-6 py-4 text-sm font-medium text-slate-600">
                  #{{c.id}}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                      {{ c.nombre.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-semibold text-slate-700">{{ c.nombre }}</span>
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
                      @click.stop="toggleMenu(c.id)"
                      class="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none"
                    >
                      <Settings class="w-5 h-5" />
                    </button>
                    
                    <div 
                      v-if="activeMenuId === c.id"
                      class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 overflow-hidden scale-in-center"
                    >
                      <button 
                        @click="openEditModal(c)"
                        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                      >
                        <Pencil class="w-4 h-4" />
                        Editar
                      </button>
                      <button 
                        @click="confirmDelete(c)"
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
            <tr v-if="!loading && categories.length === 0">
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
