<template>
  <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] transition-opacity flex justify-center items-center p-4">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md w-full scale-in-center">
      <h2 class="text-xl font-bold text-slate-900 mb-4">{{ isEditing ? 'Editar Restaurante' : 'Añadir Nuevo Restaurante' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
          <input type="text" id="name" v-model="form.name" class="w-full pl-4 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" required>
        </div>
        <div class="mb-4">
          <label for="slogan" class="block text-sm font-medium text-slate-700 mb-1">Slogan</label>
          <input type="text" id="slogan" v-model="form.slogan" class="w-full pl-4 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm">
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-slate-700 mb-1">Celular</label>
          <input type="text" id="phone" v-model="form.phone" class="w-full pl-4 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm">
        </div>
        <div class="mb-6">
          <label for="direcction" class="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
          <input type="text" id="direcction" v-model="form.direcction" class="w-full pl-4 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" required>
        </div>

        <div class="flex justify-end gap-4">
          <button type="button" @click="$emit('close')" class="px-5 py-2.5 rounded-xl font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95">
            Cancelar
          </button>
          <button type="submit" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  restaurant: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: '',
  slogan: '',
  phone: '',
  direcction: ''
});

onMounted(() => {
  if (props.isEditing && props.restaurant) {
    form.value.name = props.restaurant.name;
    form.value.slogan = props.restaurant.slogan;
    form.value.phone = props.restaurant.phone;
    form.value.direcction = props.restaurant.direcction;
  }
});

const submitForm = () => {
  emit('save', { ...form.value });
};
</script>

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
