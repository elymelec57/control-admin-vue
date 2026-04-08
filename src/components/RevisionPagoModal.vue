<script setup>
import { ref, onMounted } from 'vue';
import { X, CheckCircle2, XCircle, Eye, Calendar, User, CreditCard } from 'lucide-vue-next';

const props = defineProps({
  pago: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'approve', 'reject']);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl scale-in-center transform transition-all border border-slate-100 overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h3 class="text-xl font-bold text-slate-800">Detalles del Pago #{{ pago.id }}</h3>
          <p class="text-xs text-slate-500 mt-0.5">Revisa la información y el comprobante adjunto.</p>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Information -->
          <div class="space-y-6">
            <div class="space-y-4">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <User class="w-4 h-4" />
                    </div>
                    <div>
                        <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Cliente</p>
                        <p class="text-sm font-semibold text-slate-700">{{ pago.restaurant?.user?.name || 'N/A' }}</p>
                        <p class="text-xs text-slate-500">{{ pago.restaurant?.user?.email || '' }}</p>
                    </div>
                </div>

                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <Calendar class="w-4 h-4" />
                    </div>
                    <div>
                        <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Fecha de Reporte</p>
                        <p class="text-sm font-semibold text-slate-700">{{ formatDate(pago.createdAt) }}</p>
                    </div>
                </div>

                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                        <CreditCard class="w-4 h-4" />
                    </div>
                    <div>
                        <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Monto y Referencia</p>
                        <p class="text-sm font-bold text-slate-900">${{ pago.amount }}</p>
                        <p class="text-xs font-mono text-slate-500">Ref: {{ pago.transactionId }}</p>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Plan Solicitado</p>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-slate-700">{{ pago.plan?.name || 'Plan Estándar' }}</span>
                    <span class="text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 capitalize">Mensual</span>
                </div>
            </div>
            
            <div v-if="pago.observaciones" class="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-xs">
                <p class="font-bold mb-1">Nota del cliente:</p>
                {{ pago.observaciones }}
            </div>
          </div>

          <!-- Proof / Receipt -->
          <div class="relative group">
            <p class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Comprobante de Pago</p>
            <div class="aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center relative shadow-inner">
                <img v-if="pago.comprobante_url" :src="pago.comprobante_url" class="w-full h-full object-cover" />
                <div v-else class="flex flex-col items-center gap-2 text-slate-400">
                    <Eye class="w-12 h-12 opacity-20" />
                    <p class="text-xs">Sin imagen adjunta</p>
                </div>
                
                <a v-if="pago.comprobante_url" :href="pago.comprobante_url" target="_blank" class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-sm">
                    <Eye class="w-5 h-5" />
                    Ampliar Imagen
                </a>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 mt-8 pt-6 border-t border-slate-100">
          <button 
            @click="$emit('reject', pago)" 
            class="flex-1 px-4 py-3 bg-white border-2 border-rose-100 text-rose-600 rounded-xl font-bold hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
          >
            <XCircle class="w-5 h-5" />
            Rechazar Pago
          </button>
          <button 
            @click="$emit('approve', pago)" 
            class="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 class="w-5 h-5" />
            Aprobar y Activar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scale-in-center {
  animation: scale-in-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes scale-in-center {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
