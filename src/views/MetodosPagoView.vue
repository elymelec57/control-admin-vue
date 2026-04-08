<script setup>
import { ref, onMounted } from 'vue';
import { Plus, CreditCard } from 'lucide-vue-next';
import api from '../api/axios';
import MetodosPagoModal from '../components/MetodosPagoModal.vue';
import ToggleMenu from '../components/ToggleMenu.vue';
import ModalDelete from '../components/ModalDelete.vue';

const metodos = ref([]);
const paymentType = ref([]);
const loading = ref(false);
const showNewMetodoModal = ref(false);
const showDeleteModal = ref(false);
const metodoToDelete = ref(null);
const metodoToEdit = ref(null);
const isEditing = ref(false);

const fetchMetodos = async () => {
  loading.value = true;
  try {
    const rest = await api.get('system-payment-methods');
    if (rest.data.status) {
      metodos.value = rest.data.data;
      paymentType.value = rest.data.paymentTypes;
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert(`error al buscar métodos de pago: ${error}`);
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMetodos();
});

async function handleSaveMetodo(metodoData) {
  try {
    let rest;
    if (isEditing.value && metodoToEdit.value) {
      rest = await api.put(`system-payment-methods/${metodoToEdit.value.id}`, metodoData);
    } else {
      rest = await api.post('system-payment-methods', metodoData);
    }

    if (rest.data.status) {
      alert(isEditing.value ? 'Método de pago actualizado correctamente' : 'Método de pago guardado correctamente');
      fetchMetodos();
      closeMetodoModal();
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
  metodoToEdit.value = null;
  showNewMetodoModal.value = true;
};

const openEditModal = (metodo) => {
  isEditing.value = true;
  metodoToEdit.value = metodo;
  showNewMetodoModal.value = true;
};

const closeMetodoModal = () => {
  showNewMetodoModal.value = false;
  isEditing.value = false;
  metodoToEdit.value = null;
};

const confirmDelete = (metodo) => {
  metodoToDelete.value = metodo;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!metodoToDelete.value) return;
  
  try {
    const rest = await api.delete(`system-payment-methods/${metodoToDelete.value.id}`);
    if (rest.data.status) {
      alert('Método de pago eliminado correctamente');
      fetchMetodos();
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert('error al eliminar el método de pago');
  } finally {
    showDeleteModal.value = false;
    metodoToDelete.value = null;
  }
};

</script>

<template>
  <div>
    <MetodosPagoModal 
      v-if="showNewMetodoModal"
      :paymentTypes="paymentType"
      :metodo="metodoToEdit"
      :is-editing="isEditing"
      @close="closeMetodoModal" 
      @save="handleSaveMetodo" 
    />

    <!-- Modal de confirmación de eliminación -->
    <ModalDelete
      v-if="showDeleteModal"
      :modelToDelete="metodoToDelete"
      :title="'¿Eliminar método de pago?'"
      :messages="'¿Estás seguro de que quieres eliminar el método de pago '"
      :messages2="'Esta acción no se puede deshacer.'"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Métodos de Pago</h1>
          <p class="text-slate-500 text-sm">Gestiona los métodos donde recibirás los pagos del sistema.</p>
        </div>
        <button @click="openAddModal" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
          <Plus class="w-5 h-5" />
          <span>Añadir Método</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Método / Banco</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cuenta</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Titular</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <template v-if="!loading">
                <tr v-for="m in metodos" :key="m.id" class="hover:bg-slate-50/50">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <CreditCard class="w-5 h-5" />
                      </div>
                      <div class="min-w-0">
                        <span class="font-semibold text-slate-700 block truncate">{{ m.type }}</span>
                        <p class="text-xs text-slate-400 truncate">{{ m.bankName}}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600">
                    <p class="font-medium">{{ m.accountNumber }}</p>
                    <p class="text-xs text-slate-400 capitalize">{{ m.accountNumber }}</p>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">
                    <p class="font-medium text-slate-700">{{ m.ownerName }}</p>
                    <p class="text-xs">{{ m.ownerId }}</p>
                    <p class="text-xs">{{ m.phoneNumber }}</p>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">
                    <p class="font-medium text-slate-700">{{ m.email }}</p>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span :class="m.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ m.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <ToggleMenu :item="m"
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
                      <p>Cargando métodos...</p>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="!loading && metodos.length === 0">
                <td colspan="5" class="text-center p-8 text-slate-500">
                  No se encontraron métodos de pago registrados.
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
