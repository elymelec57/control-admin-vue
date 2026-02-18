<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Store } from 'lucide-vue-next';
import api from '../api/axios';
import RestaurantModal from '../components/RestaurantModal.vue';
import ToggleMenu from '../components/ToggleMenu.vue';
import ModalDelete from '../components/ModalDelete.vue';

const restaurants = ref([]);
const loading = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);

const restaurantToDelete = ref(null);
const restaurantToEdit = ref(null);
const isEditing = ref(false);

const fetchRestaurants = async () => {
  loading.value = true;
  try {
    const rest = await api.get('restaurante');
    if (rest.data.status) {
      restaurants.value = rest.data.restaurantes || rest.data.data || []; 
    } else {
       if (Array.isArray(rest.data)) {
           restaurants.value = rest.data;
       } else {
           console.error("Unexpected API response structure", rest.data);
           restaurants.value = [];
       }
    }
  } catch (error) {
    console.error(error);
    alert('Error al cargar restaurantes');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRestaurants();
});

async function handleSaveRestaurant(data) {
  try {
    let rest;
    if (isEditing.value && restaurantToEdit.value) {
      data.id = restaurantToEdit.value.id;
      rest = await api.put(`restaurante`, data);
    } else {
      rest = await api.post('restaurante', data);
    }

    if (rest.data.status) {
      alert(isEditing.value ? 'Restaurante actualizado correctamente' : 'Restaurante guardado correctamente');
      fetchRestaurants();
      closeModal();
    } else {
       alert(`Error: ${rest.data.message || 'Operación fallida'}`);
    }
  } catch (error) {
    alert('Error al procesar la solicitud');
    console.error(error);
  }
}

const openAddModal = () => {
  isEditing.value = false;
  restaurantToEdit.value = null;
  showModal.value = true;
};

const openEditModal = (restaurant) => {
  isEditing.value = true;
  restaurantToEdit.value = restaurant;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  restaurantToEdit.value = null;
};

const confirmDelete = (restaurant) => {
  restaurantToDelete.value = restaurant;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!restaurantToDelete.value) return;
  
  try {
    const rest = await api.delete(`restaurante/${restaurantToDelete.value.id}`);
    if (rest.data.status) {
      alert('Restaurante eliminado correctamente');
      fetchRestaurants();
    } else {
      alert(`Error: ${rest.data.message || 'No se pudo eliminar'}`);
    }
  } catch (error) {
    alert('Error al eliminar el restaurante');
    console.error(error);
  } finally {
    showDeleteModal.value = false;
    restaurantToDelete.value = null;
  }
};

</script>

<template>
  <div>
    <RestaurantModal 
      v-if="showModal" 
      :restaurant="restaurantToEdit"
      :is-editing="isEditing"
      @close="closeModal" 
      @save="handleSaveRestaurant" 
    />

    <!-- Modal de confirmación de eliminación -->
    <ModalDelete
      v-if="showDeleteModal"
      :modelToDelete="restaurantToDelete"
      :title="'¿Eliminar restaurante?'"
      :messages="'¿Estás seguro de que quieres eliminar '"
      :messages2="'Esta acción no se puede deshacer.'"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Gestión de Restaurantes</h1>
          <p class="text-slate-500 text-sm">Administra los restaurantes registrados.</p>
        </div>
        <button @click="openAddModal" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
          <Plus class="w-5 h-5" />
          <span>Añadir Restaurante</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Slogan</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Celular</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dirección</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <template v-if="!loading">
                <tr v-for="restaurant in restaurants" :key="restaurant.id" class="hover:bg-slate-50/50">
                  <td class="px-6 py-4 text-sm font-medium text-slate-600">
                    #{{ restaurant.id }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                        <Store class="w-5 h-5" />
                      </div>
                      <span class="font-semibold text-slate-700">{{ restaurant.name }}</span>
                    </div>
                  </td>
                   <td class="px-6 py-4 text-sm text-slate-600">
                    {{ restaurant.slogan || '-' }}
                  </td>
                   <td class="px-6 py-4 text-sm text-slate-600">
                    {{ restaurant.phone || '-' }}
                  </td>
                   <td class="px-6 py-4 text-sm text-slate-600">
                    {{ restaurant.direcction }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <ToggleMenu :item="restaurant"
                      @open-edit-modal="openEditModal"
                      @confirm-delete="confirmDelete" />
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="6" class="text-center p-8 text-slate-500">
                    <div class="flex flex-col items-center gap-2">
                      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p>Cargando restaurantes...</p>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="!loading && restaurants.length === 0">
                <td colspan="6" class="text-center p-8 text-slate-500">
                  No se encontraron restaurantes.
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
