<script setup>
import { ref, onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import api from '../api/axios';
import NewRestaurantCategoryModal from '../components/NewRestaurantCategoryModal.vue';
import ToggleMenu from '../components/ToggleMenu.vue';
import ModalDelete from '../components/ModalDelete.vue';

const categories = ref([]);
const loading = ref(false);
const showNewCategoryModal = ref(false);
const showDeleteModal = ref(false);
const categoryToDelete = ref(null);
const categoryToEdit = ref(null);
const isEditing = ref(false);

const fetchCategories = async () => {
  loading.value = true;
  try {
    const rest = await api.get('categoria-restaurant');
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
      rest = await api.put(`categoria-restaurant`, categoryData);
    } else {
      rest = await api.post('categoria-restaurant', categoryData);
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

const openAddModal = () => {
  isEditing.value = false;
  categoryToEdit.value = null;
  showNewCategoryModal.value = true;
};

const openEditModal = (category) => {
  isEditing.value = true;
  categoryToEdit.value = category;
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

</script>

<template>
  <div>
    <NewRestaurantCategoryModal 
      v-if="showNewCategoryModal" 
      :category="categoryToEdit"
      :is-editing="isEditing"
      @close="closeCategoryModal" 
      @save="handleSaveCategory" 
    />

    <!-- Modal de confirmación de eliminación -->
    <ModalDelete
      v-if="showDeleteModal"
      :modelToDelete="categoryToDelete"
      :title="'¿Eliminar categoría?'"
      :messages="'¿Estás seguro de que quieres eliminar la categoría '"
      :messages2="'Esta acción no se puede deshacer.'"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

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
                  <ToggleMenu :item="c"
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
