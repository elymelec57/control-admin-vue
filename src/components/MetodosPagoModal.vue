<script setup>
import { ref, watch, computed } from 'vue';
import { X, Save } from 'lucide-vue-next';

const props = defineProps({
  metodo: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  paymentTypes: {
    type: Object
  }
});

const emit = defineEmits(['close', 'save']);

const formData = ref({
  ownerName: '',
  bankName: '',
  accountNumber: '',
  type: '',
  phoneNumber: '',
  ownerId: '',
  email: '',
  label: 'Metodo de Pago',
});

const isSimpleMethod = computed(() => {
  if (!formData.value.type) return false;
  const method = formData.value.type.toLowerCase();
  return ['zinli', 'paypal', 'zelle'].includes(method);
});

watch(() => props.metodo, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal };
  } else {
    formData.value = {
      ownerName: '',
      bankName: '',
      accountNumber: '',
      type: '',
      phoneNumber: '',
      ownerId: '',
      email: '',
      label: 'Metodo de Pago',
    };
  }
}, { immediate: true });

const submitForm = () => {
  emit('save', { ...formData.value });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col scale-in-center transform transition-all border border-slate-100 overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h3 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Editar Método de Pago' : 'Nuevo Método de Pago' }}</h3>
          <p class="text-xs text-slate-500 mt-0.5">Información bancaria para recibir pagos.</p>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content Area (Scrollable) -->
      <div class="p-6 overflow-y-auto custom-scrollbar">
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nombre del Método</label>
              <select 
                v-model="formData.type" 
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
              >
                <option v-for="metodo in paymentTypes" :key="metodo.id" :value="metodo">{{ metodo }}</option>
              </select>
            </div>
            <div v-if="!isSimpleMethod" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Banco</label>
                <input 
                  v-model="formData.bankName" 
                  type="text" 
                  placeholder="Banco..."
                  :required="!isSimpleMethod" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de Cuenta</label>
                <select 
                  v-model="formData.tipo_cuenta" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
                >
                  <option value="corriente">Corriente</option>
                  <option value="ahorro">Ahorro</option>
                  <option value="pago_movil">Pago Móvil</option>
                </select>
              </div>
            </div>

            <div v-if="!isSimpleMethod">
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Número de Cuenta</label>
              <input 
                v-model="formData.accountNumber" 
                type="text" 
                placeholder="Número de cuenta o teléfono..." 
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
              />
            </div>

            <div v-if="!isSimpleMethod">
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Celular</label>
              <input 
                v-model="formData.phoneNumber" 
                type="text" 
                placeholder="Número de celular..."
                :required="!isSimpleMethod" 
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
              />
            </div>

            <div v-if="!isSimpleMethod">
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Identificación (Ruta/Cédula/RIF)</label>
              <input 
                v-model="formData.ownerId" 
                type="text" 
                placeholder="V-12345678"
                :required="!isSimpleMethod" 
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
              />
            </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Titular</label>
            <input 
              v-model="formData.ownerName" 
              type="text" 
              placeholder="Nombre del beneficiario"
              required 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
            />
          </div>

          <div v-if="isSimpleMethod">
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input 
              v-model="formData.email" 
              type="email" 
              placeholder="correo@ejemplo.com"
              required 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
            />
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              <Save class="w-4 h-4" />
              {{ isEditing ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Para Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
</style>
