<template>
  <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] transition-opacity flex justify-center items-center p-4">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md w-full scale-in-center">
      <h2 class="text-xl font-bold text-slate-900 mb-4">{{ isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
          <input type="text" id="name" v-model="form.name" class="w-full pl-4 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" required>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
          <input type="email" id="email" v-model="form.email" class="w-full pl-4 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" required>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1">
            Contraseña {{ isEditing ? '(dejar en blanco para no cambiar)' : '' }}
          </label>
          <input type="password" id="password" v-model="form.password" class="w-full pl-4 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" :required="!isEditing">
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
  user: {
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
  email: '',
  password: null
});

onMounted(() => {
  if (props.isEditing && props.user) {
    form.value.name = props.user.name;
    form.value.email = props.user.email;
    form.value.password = ''; // No cargar la contraseña por seguridad
  }
});

const submitForm = () => {
  const data = { ...form.value };
  if (props.isEditing && !data.password) {
    delete data.password;
  }
  emit('save', data);
};
</script>
