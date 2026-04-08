<script setup>
import { ref, onMounted, computed } from 'vue';
import { Search, Eye, Filter, CheckCircle2, XCircle, Clock } from 'lucide-vue-next';
import api from '../api/axios';
import RevisionPagoModal from '../components/RevisionPagoModal.vue';

const pagos = ref([]);
const loading = ref(false);
const showRevisionModal = ref(false);
const selectedPago = ref(null);
const searchQuery = ref('');
const statusFilter = ref('PENDING');

const fetchPagos = async () => {
  loading.value = true;
  try {
    const rest = await api.get('subscription');
    if (rest.data.status) {
      pagos.value = rest.data.subscriptions;
      console.log(pagos.value);
    } else {
      alert(`error ${rest.data.message}`);
    }
  } catch (error) {
    alert(`error al buscar reportes de pago: ${error}`);
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPagos();
});

const filteredPagos = computed(() => {
  return pagos.value.filter(pago => {
    const matchesSearch = 
      (pago.transactionId || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (pago.restaurant?.user?.name || '').toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesStatus = !statusFilter.value || pago.status === statusFilter.value;
    
    return matchesSearch && matchesStatus;
  });
});

const openRevision = (pago) => {
  selectedPago.value = pago;
  showRevisionModal.value = true;
};

const handleApprove = async (pago) => {
  if (!confirm('¿Seguro de aprobar este pago?')) return;
  try {
    const rest = await api.post(`subscription/${pago.id}`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: "CONFIRMED" })
    });
    if (rest.data.status) {
      alert('Pago aprobado correctamente');
      fetchPagos();
      showRevisionModal.value = false;
    }
  } catch (error) {
    alert('Error al probar el pago');
  }
};

const handleReject = async (pago) => {
  const motivo = prompt('Motivo del rechazo:');
  if (motivo === null) return;
  try {
    const rest = await api.post(`subscription/${pago.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: "REJECTED" })
    });
    if (rest.data.status) {
      alert('Pago rechazado correctamente');
      fetchPagos();
      showRevisionModal.value = false;
    }
  } catch (error) {
    alert('Error al rechazar el pago');
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'CONFIRMED':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'REJECTED':
      return 'bg-rose-50 text-rose-600 border-rose-100';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING': return Clock;
    case 'CONFIRMED': return CheckCircle2;
    case 'REJECTED': return XCircle;
    default: return Clock;
  }
};

</script>

<template>
  <div>
    <RevisionPagoModal 
      v-if="showRevisionModal" 
      :pago="selectedPago"
      @close="showRevisionModal = false" 
      @approve="handleApprove" 
      @reject="handleReject" 
    />

    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900">Revisión de Pagos</h1>
        <p class="text-slate-500 text-sm">Validación de comprobantes y activación de suscripciones.</p>
      </div>

      <!-- Filtros -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar por referencia o cliente..." 
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm transition-all"
          />
        </div>
        <div class="relative min-w-[200px]">
          <select 
            v-model="statusFilter"
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm appearance-none transition-all"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="CONFIRMED">Aprobados</option>
            <option value="REJECTED">Rechazados</option>
          </select>
          <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ref / Fecha</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monto</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <template v-if="!loading">
                <tr v-for="p in filteredPagos" :key="p.id" class="hover:bg-slate-50/50 group transition-colors">
                  <td class="px-6 py-4">
                    <span class="font-mono text-sm font-bold text-slate-700 block">{{ p.transactionId }}</span>
                    <span class="text-[10px] text-slate-400 font-medium">{{ new Date(p.createdAt).toLocaleDateString() }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="min-w-0">
                      <p class="font-semibold text-slate-700 truncate leading-tight">{{ p.restaurant?.user?.name }}</p>
                      <p class="text-xs text-slate-400 truncate">{{ p.restaurant?.user?.email }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-indigo-600">
                    ${{ p.amount }}
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize shadow-sm transition-all', getStatusBadge(p.status)]">
                      <component :is="getStatusIcon(p.status)" class="w-3.5 h-3.5" />
                      {{ p.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button 
                      @click="openRevision(p)" 
                      class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-100"
                    >
                      <Eye class="w-4 h-4" />
                      Revisar
                    </button>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="5" class="text-center p-12">
                    <div class="flex flex-col items-center gap-2">
                      <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p class="text-slate-500 font-medium">Buscando reportes...</p>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="!loading && filteredPagos.length === 0">
                <td colspan="5" class="text-center p-20">
                  <div class="flex flex-col items-center gap-4 text-slate-300">
                    <Clock class="w-16 h-16 opacity-20" />
                    <p class="text-slate-500 font-medium">No se encontraron reportes de pago disponibles.</p>
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
