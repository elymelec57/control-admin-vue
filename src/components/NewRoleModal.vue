<template>
  <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity flex justify-center items-center">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md w-full">
      <h2 class="text-xl font-bold text-slate-900 mb-4">Añadir Nuevo Rol</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-6">
          <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nombre del Rol</label>
          <input type="text" id="name" v-model="form.name" class="w-full pl-4 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" required>
        </div>
        <div class="flex justify-end gap-4">
          <button type="button" @click="$emit('close')" class="px-5 py-2.5 rounded-xl font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95">
            Cancelar
          </button>
          <button type="submit" class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: ''
});

const submitForm = () => {
  emit('save', { ...form.value });
};
</script>
