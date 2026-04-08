<script setup>
import { ref, onMounted, watch } from 'vue';
import { X, Save } from 'lucide-vue-next';

const props = defineProps({
  plan: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const formData = ref({
  nombre: '',
  precio: '',
  productLimit: 1,
  periodo: 'mensual',
  descripcion: ''
});

watch(() => props.plan, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal };
  } else {
    formData.value = {
      name: '',
      price: '',
      productLimit: 1,
      period: 'mensual',
      description: ''
    };
  }
}, { immediate: true });

const submitForm = () => {
  emit('save', { ...formData.value });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md scale-in-center transform transition-all border border-slate-100 overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h3 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Editar Plan' : 'Nuevo Plan' }}</h3>
          <p class="text-xs text-slate-500 mt-0.5">Completa la información del plan.</p>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="submitForm" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nombre del Plan</label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="Ej: Plan Premium"
              required 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Precio</label>
            <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
                <input 
                v-model="formData.price" 
                type="number" 
                step="0.01"
                placeholder="0.00"
                required 
                class="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
                />
            </div>
          </div>

          <!-- <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Periodo</label>
            <select 
              v-model="formData.periodo" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
            >
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
              <option value="trimestral">Trimestral</option>
            </select>
          </div> -->

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Limite de Producto</label>
            <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium"></span>
                <input 
                v-model="formData.productLimit" 
                type="number" 
                step="1"
                placeholder="0"
                required 
                class="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none"
                />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Descripción</label>
            <textarea 
              v-model="formData.description" 
              rows="3"
              placeholder="Describe las ventajas del plan..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all outline-none resize-none"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-2">
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
              {{ isEditing ? 'Actualizar' : 'Guardar Plan' }}
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
</style>
