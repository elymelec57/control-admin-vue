<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Package } from 'lucide-vue-next';
import api from '../api/axios';
import PlanesModal from '../components/PlanesModal.vue';
import ToggleMenu from '../components/ToggleMenu.vue';
import ModalDelete from '../components/ModalDelete.vue';

const planes = ref({});
const loading = ref(false);
const showNewPlanModal = ref(false);
const showDeleteModal = ref(false);
const planToDelete = ref(null);
const planToEdit = ref(null);
const isEditing = ref(false);

const fetchPlanes = async () => {
  loading.value = true;
  try {
    const rest = await api.get('plans');
    if (rest.data) {
      planes.value = rest.data;
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert(`error al buscar planes: ${error}`);
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPlanes();
});

async function handleSavePlan(planData) {
  try {
    let rest;
    if (isEditing.value && planToEdit.value) {
      planData.id = planToEdit.value.id;
      rest = await api.put(`plans/${planData.id}`, planData);
    } else {
      rest = await api.post('plans', planData);
    }

    if (rest.data.status) {
      alert(isEditing.value ? 'Plan actualizado correctamente' : 'Plan guardado correctamente');
      fetchPlanes();
      closePlanModal();
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
  planToEdit.value = null;
  showNewPlanModal.value = true;
};

const openEditModal = (plan) => {
  isEditing.value = true;
  planToEdit.value = plan;
  showNewPlanModal.value = true;
};

const closePlanModal = () => {
  showNewPlanModal.value = false;
  isEditing.value = false;
  planToEdit.value = null;
};

const confirmDelete = (plan) => {
  planToDelete.value = plan;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!planToDelete.value) return;
  
  try {
    const rest = await api.delete(`plans/${planToDelete.value.id}`);
    if (rest.data.status) {
      alert('Plan eliminado correctamente');
      fetchPlanes();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al eliminar el plan');
  } finally {
    showDeleteModal.value = false;
    planToDelete.value = null;
  }
};

</script>

<template>
  <div>
    <PlanesModal 
      v-if="showNewPlanModal" 
      :plan="planToEdit"
      :is-editing="isEditing"
      @close="closePlanModal" 
      @save="handleSavePlan" 
    />

    <!-- Modal de confirmación de eliminación -->
    <ModalDelete
      v-if="showDeleteModal"
      :modelToDelete="planToDelete"
      :title="'¿Eliminar plan?'"
      :messages="'¿Estás seguro de que quieres eliminar el plan '"
      :messages2="'Esta acción no se puede deshacer.'"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Gestión de Planes</h1>
          <p class="text-slate-500 text-sm">Configura los planes de suscripción para los usuarios.</p>
        </div>
        <button @click="openAddModal" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
          <Plus class="w-5 h-5" />
          <span>Añadir Plan</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Precio</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Periodo</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <template v-if="!loading">
                <tr v-for="p in planes" :key="p.id" class="hover:bg-slate-50/50">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Package class="w-5 h-5" />
                      </div>
                      <div class="min-w-0">
                        <span class="font-semibold text-slate-700 block truncate">{{ p.name }}</span>
                        <p class="text-xs text-slate-400 truncate">{{ p.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-slate-600">
                    ${{ p.price }}
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500 capitalize">
                    Mensual
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Activo
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <ToggleMenu :item="p"
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
                      <p>Cargando planes...</p>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="!loading && planes.length === 0">
                <td colspan="5" class="text-center p-8 text-slate-500">
                  No se encontraron planes registrados.
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
